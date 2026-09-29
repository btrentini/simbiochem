import { deadlines, site } from "@/content/site";

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
    tag: "Decisions available",
    title: "Decisions are now available in OpenReview. Thank you to our authors and reviewers.",
    href: site.openReviewUrl,
    tone: "accent",
  },
  {
    date: "Closed",
    tag: "Call for papers",
    title: `The call for papers closed on ${deadlines.submission} (AoE).`,
    href: "/call-for-papers",
  },
  {
    date: "Closed",
    tag: "Programme Committee",
    title: "The call for Programme Committee members is now closed.",
    href: "/volunteer",
  },
];
