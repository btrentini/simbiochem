import "server-only";

import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

import {
  CSRF_COOKIE,
  CSRF_HEADER,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/lib/auth-constants";

/**
 * Minimal, dependency-free admin authentication.
 *
 *  - Password stored only as an scrypt hash in ADMIN_PASSWORD_HASH.
 *  - Session is a stateless HMAC-signed token in an HttpOnly cookie.
 *  - CSRF uses a double-submit token (readable cookie echoed in a header).
 *
 * Everything runs in the Node.js runtime; no external services or DB.
 */

export { CSRF_COOKIE, CSRF_HEADER, SESSION_COOKIE, SESSION_TTL_SECONDS };

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlToBuffer(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function safeEqual(a: string | Buffer, b: string | Buffer): boolean {
  const bufA = Buffer.isBuffer(a) ? a : Buffer.from(a);
  const bufB = Buffer.isBuffer(b) ? b : Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function sessionSecret(): string | undefined {
  return process.env.SESSION_SECRET?.trim() || undefined;
}

export function adminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_USERNAME?.trim() &&
      process.env.ADMIN_PASSWORD_HASH?.trim() &&
      sessionSecret(),
  );
}

/**
 * Verify a username/password pair.
 * ADMIN_PASSWORD_HASH format: scrypt:N:r:p:saltB64url:hashB64url
 * (":" delimiter — "$" would be expanded by dotenv in .env files.)
 */
export function verifyCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME?.trim();
  const stored = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!expectedUser || !stored) return false;

  // Compare username in constant time regardless of length.
  const userOk = safeEqual(
    createHmac("sha256", "u").update(username).digest(),
    createHmac("sha256", "u").update(expectedUser).digest(),
  );

  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = b64urlToBuffer(parts[4]);
  const expectedHash = b64urlToBuffer(parts[5]);
  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) {
    return false;
  }

  let derived: Buffer;
  try {
    derived = scryptSync(password, salt, expectedHash.length, {
      N,
      r,
      p,
      maxmem: 256 * 1024 * 1024,
    });
  } catch {
    return false;
  }

  const passOk = safeEqual(derived, expectedHash);
  // Evaluate both before returning to reduce timing signal.
  return userOk && passOk;
}

export function createSessionToken(username: string, now = Date.now()): string {
  const secret = sessionSecret();
  if (!secret) throw new Error("SESSION_SECRET is not configured.");
  const payload = {
    sub: username,
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS,
  };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(createHmac("sha256", secret).update(body).digest());
  return `${body}.${sig}`;
}

export function verifySessionToken(
  token: string | undefined,
  now = Date.now(),
): { sub: string } | null {
  const secret = sessionSecret();
  if (!secret || !token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = b64url(createHmac("sha256", secret).update(body).digest());
  if (!safeEqual(sig, expected)) return null;

  try {
    const payload = JSON.parse(b64urlToBuffer(body).toString("utf8")) as {
      sub?: string;
      exp?: number;
    };
    if (!payload.sub || !payload.exp) return null;
    if (payload.exp * 1000 < now) return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

export function createCsrfToken(): string {
  return b64url(randomBytes(24));
}

export function csrfOk(cookieToken: string | undefined, headerToken: string | undefined): boolean {
  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length < 16) return false;
  return safeEqual(cookieToken, headerToken);
}
