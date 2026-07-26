#!/usr/bin/env node
/*
 * Interactive configuration wizard for SIMBIOCHEM.
 *
 *   node scripts/setup.mjs        # or:  npm run setup
 *
 * Writes .env.local (git-ignored, chmod 600). Hashes the admin password,
 * generates a session secret, and preserves any existing values as defaults.
 * The password is read without echo; secrets are never printed back.
 *
 * Uses a self-contained stdin reader (works in a terminal and with piped input).
 */

import { chmodSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes, scryptSync } from "node:crypto";

const ENV_PATH = new URL("../.env.local", import.meta.url).pathname;
const isTTY = Boolean(process.stdin.isTTY);

const CTRL_C = String.fromCharCode(3);
const DEL = String.fromCharCode(127);

const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function hashPassword(password) {
  const N = 16384, r = 8, p = 1;
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32, { N, r, p, maxmem: 256 * 1024 * 1024 });
  return `scrypt:${N}:${r}:${p}:${b64url(salt)}:${b64url(hash)}`;
}

function loadExisting() {
  const env = {};
  if (existsSync(ENV_PATH)) {
    for (const line of readFileSync(ENV_PATH, "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2];
    }
  }
  return env;
}

/* --- minimal stdin line reader (works in a TTY and with piped input) --- */
const lines = [];
let current = "";
let waiter = null;

function deliver(line) {
  if (waiter) {
    const w = waiter;
    waiter = null;
    w.resolve(line);
  } else {
    lines.push(line);
  }
}

function onData(chunk) {
  for (const ch of chunk.toString("utf8")) {
    if (ch === "\n" || ch === "\r") {
      if (isTTY) process.stdout.write("\n");
      const line = current;
      current = "";
      deliver(line);
    } else if (ch === CTRL_C) {
      cleanup();
      process.exit(130);
    } else if (ch === DEL || ch === "\b") {
      if (current.length) {
        current = current.slice(0, -1);
        if (isTTY && waiter && !waiter.hidden) process.stdout.write("\b \b");
      }
    } else {
      current += ch;
      if (isTTY && waiter && !waiter.hidden) process.stdout.write(ch);
    }
  }
}

function cleanup() {
  process.stdin.removeListener("data", onData);
  if (isTTY && process.stdin.setRawMode) process.stdin.setRawMode(false);
  process.stdin.pause();
}

function ask(query, { def = "", hidden = false } = {}) {
  const shown = def && !hidden ? `${query} [${def}]: ` : `${query}: `;
  process.stdout.write(shown);
  return new Promise((resolve) => {
    const done = (line) => resolve((line || "").trim() || def);
    if (lines.length) done(lines.shift());
    else waiter = { resolve: done, hidden };
  });
}

async function main() {
  process.stdin.setEncoding("utf8");
  if (isTTY && process.stdin.setRawMode) process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", onData);

  console.log("\n  SIMBIOCHEM · configuration wizard");
  console.log("  Press Enter to keep the shown default.\n");
  const cur = loadExisting();
  const out = { ...cur };

  out.SITE_URL = await ask("Site URL", { def: cur.SITE_URL || "http://localhost:3000" });
  out.NEXT_PUBLIC_GA_ID = await ask("Google Analytics ID", {
    def: cur.NEXT_PUBLIC_GA_ID || "G-VWS9V4TY11",
  });

  console.log("\n  — Admin console —");
  out.ADMIN_USERNAME = await ask("Admin username", { def: cur.ADMIN_USERNAME || "admin" });
  const pw = await ask(
    cur.ADMIN_PASSWORD_HASH
      ? "New admin password (blank = keep current)"
      : "Admin password (min 10 chars)",
    { hidden: true },
  );
  if (isTTY) process.stdout.write("\n");
  if (pw) {
    if (pw.length < 10) {
      console.error("  ✗ Password must be at least 10 characters. Aborting; nothing written.");
      cleanup();
      process.exit(1);
    }
    out.ADMIN_PASSWORD_HASH = hashPassword(pw);
    console.log("  ✓ password hashed");
  }
  out.SESSION_SECRET = cur.SESSION_SECRET || b64url(randomBytes(48));

  console.log("\n  — Google Sheets —");
  out.GOOGLE_SHEETS_SPREADSHEET_ID = await ask("Spreadsheet ID", {
    def: cur.GOOGLE_SHEETS_SPREADSHEET_ID || "1pxCkRSf6BPh4D7zduboVPfbkvm9hiKIbBzZMIWny3S8",
  });
  out.GOOGLE_SHEETS_RANGE = cur.GOOGLE_SHEETS_RANGE || "Registrations!A:J";
  out.GOOGLE_SHEETS_VOLUNTEERS_RANGE = cur.GOOGLE_SHEETS_VOLUNTEERS_RANGE || "Volunteers!A:I";
  out.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE = await ask("Service-account JSON path", {
    def: cur.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE || ".secrets/service-account.json",
  });

  console.log("\n  — Feature flags —");
  out.VOLUNTEER_ENABLED = await ask("Enable volunteer form? (true/false)", {
    def: cur.VOLUNTEER_ENABLED || "true",
  });
  out.REGISTRATION_ENABLED = await ask("Enable registration? (true/false)", {
    def: cur.REGISTRATION_ENABLED || "false",
  });

  out.OPENREVIEW_API_URL = cur.OPENREVIEW_API_URL || "https://api2.openreview.net";
  out.OPENREVIEW_VENUE_ID = cur.OPENREVIEW_VENUE_ID || "NeurIPS.cc/2026/Workshop/Simbiochem";
  out.OPENREVIEW_SUBMISSION_INVITATION =
    cur.OPENREVIEW_SUBMISSION_INVITATION || "NeurIPS.cc/2026/Workshop/Simbiochem/-/Submission";

  cleanup();

  const order = [
    "SITE_URL", "NEXT_PUBLIC_GA_ID", "ADMIN_USERNAME", "ADMIN_PASSWORD_HASH", "SESSION_SECRET",
    "REGISTRATION_ENABLED", "VOLUNTEER_ENABLED", "OPENREVIEW_API_URL", "OPENREVIEW_VENUE_ID",
    "OPENREVIEW_SUBMISSION_INVITATION", "GOOGLE_SHEETS_SPREADSHEET_ID", "GOOGLE_SHEETS_RANGE",
    "GOOGLE_SHEETS_VOLUNTEERS_RANGE", "GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE",
    "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  ];
  const keys = [...new Set([...order, ...Object.keys(out)])].filter((k) => out[k] !== undefined);
  const bodyText = `# Generated by scripts/setup.mjs — git-ignored. Never commit real secrets.\n${keys
    .map((k) => `${k}=${out[k] ?? ""}`)
    .join("\n")}\n`;

  writeFileSync(ENV_PATH, bodyText, { mode: 0o600 });
  chmodSync(ENV_PATH, 0o600);
  console.log(`\n✓ Wrote ${ENV_PATH} (permissions 600).`);
  console.log("  Next: node --env-file=.env.local scripts/setup-sheets.mjs\n");
}

main().catch((err) => {
  cleanup();
  console.error(err);
  process.exit(1);
});
