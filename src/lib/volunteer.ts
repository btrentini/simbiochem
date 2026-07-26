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

export const volunteerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  affiliation: z.string().trim().min(2).max(400),
  email: z.email().max(254),
  level: z.enum(VOLUNTEER_LEVELS),
  tracks: z
    .array(z.enum(VOLUNTEER_TRACKS))
    .min(1)
    .max(2)
    // Collapse any duplicate selections so stored track data stays clean.
    .transform((arr) => [...new Set(arr)]),
  expertise: z.string().trim().min(2).max(400),
  profileUrl: z.url().max(300),
  agreement: z.literal(true),
  // Honeypot: must stay empty.
  website: z.string().max(0).default(""),
});

export type Volunteer = z.infer<typeof volunteerSchema>;
