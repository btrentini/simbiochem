import "server-only";

import { google } from "googleapis";

import type { Registration } from "@/lib/registration";
import type { Volunteer } from "@/lib/volunteer";
import { serverEnv } from "@/lib/server-env";

/**
 * Google Forms writes its Timestamp column as M/D/YYYY H:MM:SS (no leading
 * zeroes on month/day/hour, 24-hour clock). Match it exactly so rows written by
 * this site and rows written by the form read the same and sort together.
 *
 * Formatted in UTC, which is the VPS clock. Values are sent with
 * valueInputOption RAW, so this lands as text rather than a date cell — that is
 * deliberate, since RAW is what stops user input becoming a formula.
 */
function sheetTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()} ` +
    `${date.getUTCHours()}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
  );
}

/** The exact string the Google Form records for the agreement checkbox. */
const AGREEMENT_VALUE = "I understand and agree to the terms above.";

function getAuth() {
  if (serverEnv.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE) {
    return new google.auth.GoogleAuth({
      keyFile: serverEnv.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  if (
    !serverEnv.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !serverEnv.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  ) {
    throw new Error("Google service-account credentials are missing.");
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: serverEnv.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: serverEnv.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
        /\\n/g,
        "\n",
      ),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendRegistration(
  registration: Registration,
  timestamp = new Date(),
) {
  if (!serverEnv.GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error("Google Sheets spreadsheet ID is missing.");
  }

  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  await sheets.spreadsheets.values.append({
    spreadsheetId: serverEnv.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: serverEnv.GOOGLE_SHEETS_RANGE,
    // User-controlled strings must never be interpreted as spreadsheet formulae.
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    includeValuesInResponse: false,
    requestBody: {
      values: [
        [
          sheetTimestamp(timestamp),
          registration.fullName,
          registration.email,
          registration.institution,
          registration.country,
          registration.role,
          registration.attendanceType,
          registration.dietaryRequirements,
          "Yes",
          registration.submissionId,
        ],
      ],
    },
  });
}

/**
 * Appends a Programme Committee volunteer to the same spreadsheet, on a
 * dedicated tab (GOOGLE_SHEETS_VOLUNTEERS_RANGE). Columns A–I:
 * Timestamp | Full name | Affiliation | Email | Level | Tracks | Expertise | Profile | Agreement
 */
export async function appendVolunteer(
  volunteer: Volunteer,
  timestamp = new Date(),
) {
  if (!serverEnv.GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error("Google Sheets spreadsheet ID is missing.");
  }

  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  await sheets.spreadsheets.values.append({
    spreadsheetId: serverEnv.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: serverEnv.GOOGLE_SHEETS_VOLUNTEERS_RANGE,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    includeValuesInResponse: false,
    requestBody: {
      // Column order mirrors the Google Form's response tab exactly (A-I), so
      // the two sets of rows can be merged without remapping.
      values: [
        [
          sheetTimestamp(timestamp),
          volunteer.fullName,
          volunteer.affiliation,
          volunteer.email,
          volunteer.level,
          volunteer.tracks.join(", "),
          volunteer.expertise,
          volunteer.profileUrl,
          AGREEMENT_VALUE,
        ],
      ],
    },
  });
}
