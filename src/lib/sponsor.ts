import { z } from "zod";

export const SPONSOR_PREFILL =
  "Hello organisers, we're interested in discussing sponsorship opportunities.";

export const sponsorEnquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(1).max(200),
  // Free text rather than z.email(): sponsors often prefer to leave a phone
  // number, a LinkedIn profile or a shared inbox.
  contact: z.string().trim().min(3).max(200),
  message: z.string().trim().min(2).max(2000),
  // Honeypot: must stay empty.
  website: z.string().max(0).default(""),
});

export type SponsorEnquiry = z.infer<typeof sponsorEnquirySchema>;
