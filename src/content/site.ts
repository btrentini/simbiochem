/**
 * Site-wide constants for SIMBIOCHEM II (NeurIPS 2026, Sydney).
 * Plain data — safe to import in both server and client components.
 */

export const site = {
  name: "SIMBIOCHEM",
  edition: "II",
  editionLong: "The 2nd SIMBIOCHEM Workshop",
  tagline: "Machine Learning for Simulations in Biology and Chemistry",
  venueShort: "NeurIPS 2026 · Sydney, Australia",
  host: "NeurIPS 2026 Workshop",
  city: "Sydney, Australia",
  // NeurIPS 2026 workshops run Dec 11–13; our day is one of Dec 11 / Dec 12.
  dateDisplay: "December 11 or 12, 2026",
  dateNote: "Exact day (Dec 11 or Dec 12) to be confirmed by NeurIPS.",
  expectedAttendance: "100–150 researchers",
  website: "https://simbiochem.com",
  contactEmail: "workshop@simbiochem.com",
  guidingQuestion:
    "How can simulation, generative models, and agentic AI be fused into physics-aligned systems that learn from reality and accelerate biological and chemical discovery?",
  openReviewUrl:
    "https://openreview.net/group?id=NeurIPS.cc/2026/Workshop/Simbiochem&referrer=%5BHomepage%5D(%2F)",
  openReviewShort: "NeurIPS.cc/2026/Workshop/Simbiochem",
  neuripsCoiGuide: "https://neurips.cc/public/guides/ConflictsOfInterest",
  neuripsWorkshopGuide: "https://neurips.cc/Conferences/2026/WorkshopsGuidance",
} as const;

export type ImportantDate = {
  label: string;
  value: string;
  note?: string;
  tone?: "default" | "accent" | "emphasis";
};

export const importantDates: ImportantDate[] = [
  {
    label: "Submissions open",
    value: "Now on OpenReview",
    tone: "accent",
  },
  {
    label: "Submission deadline",
    value: "August 29, 2026",
    note: "11:59 PM UTC (UTC-0)",
    tone: "emphasis",
  },
  {
    label: "Author notification",
    value: "September 29, 2026",
    note: "AoE",
  },
  {
    label: "Workshop day",
    value: "Dec 11 or 12, 2026",
    note: "Exact day TBC by NeurIPS",
  },
];

export const themes: string[] = [
  "Learned potentials & force fields",
  "Differentiable & enhanced molecular dynamics",
  "Conformational ensembles, kinetics & rare events",
  "Molecular foundation models & scientific post-training",
  "Physical alignment: calibrated uncertainty & free energies",
  "Agentic ML: tool-calling MD/QM, active learning, closed-loop discovery",
];

export const navLinks: { label: string; href: string }[] = [
  { label: "About", href: "/#about" },
  { label: "Speakers", href: "/#speakers" },
  { label: "Agenda", href: "/#agenda" },
  { label: "Call for Papers", href: "/call-for-papers" },
  { label: "Programme Committee", href: "/volunteer" },
  { label: "Organisers", href: "/#organisers" },
  { label: "Sponsors", href: "/#sponsors" },
  { label: "Venue", href: "/#venue" },
  { label: "Previous Editions", href: "/previous-editions/copenhagen" },
];

/**
 * What the workshop welcomes, and what reviews weigh. Shared verbatim by the
 * call for papers and the reviewer sign-up so the two cannot drift apart —
 * authors and reviewers should be reading the same standard.
 */
export const submissionEthos = {
  heading: "What we welcome",
  paragraphs: [
    "SIMBIOCHEM is a place for scientific discussion, not only for finished results. We actively welcome early-stage work: methods that look promising but are not yet validated in the lab, partial or negative results others can learn from, and early ideas that could steer where the community goes next.",
    "Experienced and early-career researchers are equally welcome, from academia and from industry. Work being early is not a mark against it here — we only ask that you are clear about what has been shown and what has not.",
  ],
  criteriaIntro:
    "Academic rigour still applies. Every submission is reviewed on four things:",
  criteria: [
    { name: "Novelty", detail: "A new idea, or a genuinely new angle on a known one." },
    { name: "Impact", detail: "If it holds up, does it matter to the field?" },
    { name: "Correctness", detail: "Are the claims supported by what is actually shown?" },
    { name: "Clarity", detail: "Can a reader follow the method and the reasoning?" },
  ],
} as const;
