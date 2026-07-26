export type Sponsor = {
  name: string;
  status: "confirmed" | "in-conversation";
  /** Optional square logo in /public/sponsors (e.g. "/sponsors/nvidia.png"). */
  logo?: string;
  url?: string;
};

export const confirmedSponsors: Sponsor[] = [
  { name: "NVIDIA", status: "confirmed", url: "https://www.nvidia.com" },
];

// Sponsors of the 1st edition (SIMBIOCHEM@EurIPS'25), shown for track record.
export const pastSponsors: string[] = [
  "NVIDIA",
  "Novo Nordisk",
  "IQC",
  "Cradle.bio",
  "DCAI",
];

export type SponsorTier = {
  name: string;
  range: string;
  blurb: string;
  perks: string[];
  featured?: boolean;
};

export const sponsorTiers: SponsorTier[] = [
  {
    name: "Bronze",
    range: "USD $1,000–$4,999",
    blurb: "Community supporters, startups and first-time partners.",
    perks: [
      "Logo on the website and sponsor slide",
      "Acknowledgement in opening / closing remarks",
      "Named support for travel awards, prizes or catering",
    ],
  },
  {
    name: "Silver",
    range: "USD $5,000–$9,999",
    blurb: "Meaningful visibility without operational overhead.",
    perks: [
      "All Bronze benefits",
      "Social-media acknowledgement",
      "Optional short sponsor blurb on the website",
      "Eligibility for shared social sponsorship",
    ],
  },
  {
    name: "Gold",
    range: "USD $10,000–$14,999",
    blurb: "Support awards, poster sessions, catering or the social event.",
    perks: [
      "All Silver benefits",
      "Recognition attached to one workshop element",
      "Priority for shared social-event sponsorship",
      "Eligibility for one short break-time message (capped)",
    ],
    featured: true,
  },
  {
    name: "Diamond",
    range: "USD $15,000 and above",
    blurb: "Strategic partners supporting the broader community.",
    perks: [
      "All Gold benefits",
      "Featured recognition on the website & opening/closing slides",
      "Priority choice among major support areas",
      "Opportunity to serve as exclusive social host",
      "Dedicated organiser contact for logistics",
    ],
  },
];

export const sponsorSupports: string[] = [
  "Travel & registration support for students and underrepresented participants",
  "Poster sessions, catering and informal networking",
  "Best paper, best poster and reproducibility awards",
  "A high-quality Sydney social event for the whole community",
];
