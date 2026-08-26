import { deadlines } from "@/content/site";

export type Announcement = {
  date: string;
  tag: string;
  title: string;
  href?: string;
  tone?: "accent" | "default";
};

/** Latest updates, newest first. */
export const announcements: Announcement[] = [
  {
    date: "July 2026",
    tag: "Accepted",
    title: "SIMBIOCHEM II is confirmed as a NeurIPS 2026 workshop in Sydney.",
    tone: "accent",
  },
  {
    date: "Extended",
    tag: "Call for papers",
    title: `Submission deadline extended to ${deadlines.submission} (AoE).`,
    href: "/call-for-papers",
    tone: "accent",
  },
  {
    date: "Ongoing",
    tag: "Get involved",
    title: "Programme Committee sign-ups are open to reviewers of all levels.",
    href: "/volunteer",
  },
];
