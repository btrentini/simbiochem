import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  institution: z.string().trim().min(2).max(180),
  country: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(100),
  attendanceType: z.enum(["in-person", "online"]),
  dietaryRequirements: z.string().trim().max(500).default(""),
  consent: z.literal(true),
  submissionId: z.string().trim().max(200).default(""),
  website: z.string().max(0).default(""),
});

export type Registration = z.infer<typeof registrationSchema>;
