import { NextRequest, NextResponse } from "next/server";

import {
  CSRF_COOKIE,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  adminConfigured,
  createCsrfToken,
  createSessionToken,
  verifyCredentials,
} from "@/lib/auth";
import { RateLimiter, clientKey } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/server-env";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
// Per-IP cap, plus a global cap so IP spoofing still can't allow unlimited guesses.
const ipLimiter = new RateLimiter(WINDOW_MS, 8);
const globalLimiter = new RateLimiter(WINDOW_MS, 60);

function hasAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const expected = serverEnv.SITE_URL
      ? new URL(serverEnv.SITE_URL).origin
      : request.nextUrl.origin;
    return new URL(origin).origin === expected;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "The admin console is not configured on this deployment." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!hasAllowedOrigin(request)) {
    return NextResponse.json(
      { error: "Request origin is not allowed." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (ipLimiter.limited(clientKey(request)) || globalLimiter.limited("global")) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait and try again." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!verifyCredentials(username, password)) {
    return NextResponse.json(
      { error: "Incorrect username or password." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const secure = process.env.NODE_ENV === "production";
  const response = NextResponse.json(
    { ok: true },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );

  response.cookies.set(SESSION_COOKIE, createSessionToken(username), {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  response.cookies.set(CSRF_COOKIE, createCsrfToken(), {
    httpOnly: false,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return response;
}
