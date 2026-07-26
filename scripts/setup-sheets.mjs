#!/usr/bin/env node
/*
 * Validate the Google service-account connection and initialise the spreadsheet.
 *
 *   node --env-file=.env.local scripts/setup-sheets.mjs
 *   # or:  npm run setup:sheets
 *
 * It will:
 *   1. Authenticate with the configured service account.
 *   2. Print the service-account email you must share the sheet with.
 *   3. Create the Registrations and Volunteers tabs if missing.
 *   4. Write header rows if row 1 is empty.
 *
 * No data is deleted. Safe to re-run.
 */

import { readFileSync } from "node:fs";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const REG_RANGE = process.env.GOOGLE_SHEETS_RANGE || "Registrations!A:J";
const VOL_RANGE = process.env.GOOGLE_SHEETS_VOLUNTEERS_RANGE || "Volunteers!A:I";
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

const HEADERS = {
  [tabOf(REG_RANGE)]: [
    "Timestamp",
    "Full name",
    "Email",
    "Institution",
    "Country",
    "Role",
    "Attendance",
    "Dietary/accessibility requirements",
    "Consent",
    "OpenReview submission ID",
  ],
  [tabOf(VOL_RANGE)]: [
    "Timestamp",
    "Full name",
    "Affiliation",
    "Email",
    "Level",
    "Tracks",
    "Expertise",
    "Profile",
    "Agreement",
  ],
};

function tabOf(range) {
  return range.split("!")[0].replace(/^'/, "").replace(/'$/, "");
}

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

function buildAuth() {
  const file = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE;
  if (file) {
    const json = JSON.parse(readFileSync(file, "utf8"));
    const auth = new google.auth.GoogleAuth({ credentials: json, scopes: SCOPES });
    return { auth, email: json.client_email };
  }
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !key) {
    fail(
      "No credentials. Set GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE, or GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in .env.local.",
    );
  }
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: key.replace(/\\n/g, "\n") },
    scopes: SCOPES,
  });
  return { auth, email };
}

async function main() {
  if (!SPREADSHEET_ID) fail("GOOGLE_SHEETS_SPREADSHEET_ID is not set in .env.local.");

  const { auth, email } = buildAuth();
  console.log(`\n▶ Service account: ${email}`);
  console.log(`▶ Spreadsheet:    ${SPREADSHEET_ID}`);
  console.log(
    `\n  Make sure the spreadsheet is shared with the service account above as an Editor.\n`,
  );

  const sheets = google.sheets({ version: "v4", auth });

  let meta;
  try {
    meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  } catch (err) {
    const code = err?.code || err?.response?.status;
    if (code === 403) {
      fail(
        `Access denied (403). Share the spreadsheet with ${email} as an Editor, then re-run.`,
      );
    }
    if (code === 404) fail("Spreadsheet not found (404). Check GOOGLE_SHEETS_SPREADSHEET_ID.");
    fail(`Could not read the spreadsheet: ${err?.message || err}`);
  }

  const existing = new Set(meta.data.sheets.map((s) => s.properties.title));
  console.log(`✓ Connected. Existing tabs: ${[...existing].join(", ")}\n`);

  for (const [tab, headers] of Object.entries(HEADERS)) {
    if (!existing.has(tab)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests: [{ addSheet: { properties: { title: tab } } }] },
      });
      console.log(`  + created tab "${tab}"`);
    }

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tab}!A1:1`,
    });
    const firstRow = res.data.values?.[0] ?? [];
    if (firstRow.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${tab}!A1`,
        valueInputOption: "RAW",
        requestBody: { values: [headers] },
      });
      console.log(`  ✓ wrote header row to "${tab}"`);
    } else {
      console.log(`  · "${tab}" already has a header row (left unchanged)`);
    }
  }

  console.log(
    `\n✓ Done. Registrations save to "${tabOf(REG_RANGE)}", volunteers to "${tabOf(VOL_RANGE)}".\n`,
  );
}

main().catch((err) => fail(err?.message || String(err)));
