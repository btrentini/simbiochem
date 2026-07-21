import "server-only";

import { google } from "googleapis";

import type { Registration } from "@/lib/registration";
import { serverEnv } from "@/lib/server-env";

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
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          timestamp.toISOString(),
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
