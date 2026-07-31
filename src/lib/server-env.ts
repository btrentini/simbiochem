import "server-only";

import { z } from "zod";

const emptyStringToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalString = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().min(1).optional(),
);

const optionalUrl = z.preprocess(
  emptyStringToUndefined,
  z.url().optional(),
);

const serverEnvSchema = z.object({
  SITE_URL: optionalUrl,
  REGISTRATION_ENABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  OPENREVIEW_API_URL: z
    .url()
    .default("https://api2.openreview.net"),
  OPENREVIEW_VENUE_ID: optionalString,
  OPENREVIEW_SUBMISSION_INVITATION: optionalString,
  GOOGLE_SHEETS_SPREADSHEET_ID: optionalString,
  GOOGLE_SHEETS_RANGE: z.string().trim().min(1).default("Registrations!A:J"),
  VOLUNTEER_ENABLED: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  GOOGLE_SHEETS_VOLUNTEERS_RANGE: z
    .string()
    .trim()
    .min(1)
    .default("Volunteers!A:I"),
  SPONSOR_ENABLED: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  GOOGLE_SHEETS_SPONSORS_RANGE: z
    .string()
    .trim()
    .min(1)
    .default("Sponsor enquiries!A:E"),
  // --- SMTP, for form notifications ---
  SMTP_HOST: optionalString,
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(465),
  SMTP_USER: optionalString,
  SMTP_PASSWORD: optionalString,
  /** Where enquiries land. Defaults to the authenticated mailbox. */
  SPONSOR_NOTIFY_TO: optionalString,
  GOOGLE_SERVICE_ACCOUNT_EMAIL: optionalString,
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: optionalString,
  GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE: optionalString,
});

export const serverEnv = serverEnvSchema.parse({
  SITE_URL: process.env.SITE_URL,
  REGISTRATION_ENABLED: process.env.REGISTRATION_ENABLED,
  OPENREVIEW_API_URL: process.env.OPENREVIEW_API_URL,
  OPENREVIEW_VENUE_ID: process.env.OPENREVIEW_VENUE_ID,
  OPENREVIEW_SUBMISSION_INVITATION:
    process.env.OPENREVIEW_SUBMISSION_INVITATION,
  GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  GOOGLE_SHEETS_RANGE: process.env.GOOGLE_SHEETS_RANGE,
  VOLUNTEER_ENABLED: process.env.VOLUNTEER_ENABLED,
  GOOGLE_SHEETS_VOLUNTEERS_RANGE: process.env.GOOGLE_SHEETS_VOLUNTEERS_RANGE,
  SPONSOR_ENABLED: process.env.SPONSOR_ENABLED,
  GOOGLE_SHEETS_SPONSORS_RANGE: process.env.GOOGLE_SHEETS_SPONSORS_RANGE,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SPONSOR_NOTIFY_TO: process.env.SPONSOR_NOTIFY_TO,
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE:
    process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE,
});
