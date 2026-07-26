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
    date: "Open now",
    tag: "Call for papers",
    title: "Submissions are open — deadline 29 August 2026, 11:59 PM UTC.",
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
