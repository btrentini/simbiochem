import { z } from "zod";

export const VOLUNTEER_LEVELS = [
  "Undergrad",
  "Master's",
  "PhD",
  "Postdoc",
  "Faculty",
  "Industry Researcher",
  "Academic Researcher",
] as const;

export const VOLUNTEER_TRACKS = ["Biology", "Chemistry"] as const;

/**
 * People paste "scholar.google.com/citations?user=x" far more often than they
 * type the scheme. z.url() rejects that outright, and because the form sets
 * noValidate the browser never flags it either — the result was a valid-looking
 * form rejected with a generic message. Add the scheme rather than refuse.
 */
const urlish = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}, z.url("Please give a full web address, e.g. scholar.google.com/citations?user=…").max(300));

const trimmed = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (typeof v === "string" ? v.trim() : v), schema);

export const volunteerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "That is longer than we can store — please shorten it."),
  affiliation: z
    .string()
    .trim()
    .min(2, "Please tell us your institution, department and role.")
    .max(400, "Please shorten this a little."),
  email: trimmed(
    z.email("That does not look like an email address.").max(254, "That address is too long."),
  ),
  level: z.enum(VOLUNTEER_LEVELS, "Please choose your current level."),
  tracks: z
    .array(z.enum(VOLUNTEER_TRACKS))
    .min(1, "Please choose at least one track.")
    .max(2)
    // Collapse any duplicate selections so stored track data stays clean.
    .transform((arr) => [...new Set(arr)]),
  expertise: z
    .string()
    .trim()
    .min(2, "Please list a few keywords so we can match you to papers.")
    .max(400, "Please shorten this a little."),
  profileUrl: urlish,
  agreement: z.literal(true, "Please tick the acknowledgement to continue."),
  // Honeypot: must stay empty.
  website: z.string().max(0).default(""),
});

export type Volunteer = z.infer<typeof volunteerSchema>;
