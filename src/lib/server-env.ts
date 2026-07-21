import "server-only";

import { z } from "zod";

const optionalString = z.string().trim().min(1).optional();

const serverEnvSchema = z.object({
  OPENREVIEW_API_URL: z
    .url()
    .default("https://api2.openreview.net"),
  OPENREVIEW_VENUE_ID: optionalString,
  OPENREVIEW_SUBMISSION_INVITATION: optionalString,
  GOOGLE_SHEETS_SPREADSHEET_ID: optionalString,
  GOOGLE_SHEETS_RANGE: z.string().trim().min(1).default("Registrations!A:J"),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: optionalString,
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: optionalString,
  GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE: optionalString,
});

export const serverEnv = serverEnvSchema.parse({
  OPENREVIEW_API_URL: process.env.OPENREVIEW_API_URL,
  OPENREVIEW_VENUE_ID: process.env.OPENREVIEW_VENUE_ID,
  OPENREVIEW_SUBMISSION_INVITATION:
    process.env.OPENREVIEW_SUBMISSION_INVITATION,
  GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  GOOGLE_SHEETS_RANGE: process.env.GOOGLE_SHEETS_RANGE,
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE:
    process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE,
});
