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
    date: "September 2026",
    tag: "79 submissions",
    title: "We received 79 submissions this year. We are delighted by the response and excited to see the community grow.",
    tone: "accent",
  },
  {
    date: "Closed",
    tag: "Call for papers",
    title: `The call for papers closed on ${deadlines.submission} (AoE). Acceptance decisions will be announced on ${deadlines.decisions} (AoE).`,
    href: "/call-for-papers",
  },
  {
    date: "Closed",
    tag: "Programme Committee",
    title: "The call for Programme Committee members is now closed.",
    href: "/volunteer",
  },
];
