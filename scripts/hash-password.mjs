#!/usr/bin/env node
// Generate an ADMIN_PASSWORD_HASH for the SIMBIOCHEM admin console.
//
//   node scripts/hash-password.mjs 'your-strong-password'
//
// Copy the printed line into .env.local (local) or Hostinger env vars.
// Also set ADMIN_USERNAME and a long random SESSION_SECRET (see README).

import { randomBytes, scryptSync } from "node:crypto";

const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error("Usage: node scripts/hash-password.mjs '<password>'  (min 10 chars)");
  process.exit(1);
}

const N = 16384;
const r = 8;
const p = 1;
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32, { N, r, p, maxmem: 256 * 1024 * 1024 });

console.log("");
console.log("Add these to your environment:");
console.log("");
// ":" delimiter (not "$") so dotenv in .env files does not expand it.
console.log(`ADMIN_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${b64url(salt)}:${b64url(hash)}`);
console.log(`SESSION_SECRET=${b64url(randomBytes(48))}`);
console.log("");
console.log("(Also set ADMIN_USERNAME to your chosen username.)");
