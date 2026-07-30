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
  blurb: string;
  /** What a sponsor at this level typically puts their name to. */
  supports: string[];
  /** What the sponsor receives in return. */
  perks: string[];
  featured?: boolean;
};

/**
 * Levels are described by what they support and what they include — figures
 * live in the sponsorship letter, which interested sponsors can download.
 * Everything here is deliberately value-free so the page stays an invitation
 * rather than a price list.
 */
export const sponsorTiers: SponsorTier[] = [
  {
    name: "Bronze",
    blurb:
      "A friendly first step, and a good fit for startups and community supporters.",
    supports: ["Travel awards", "Prizes", "Poster materials"],
    perks: [
      "Logo on the website and sponsor slide",
      "Acknowledgement in the opening and closing remarks",
      "Named support for the item you choose",
      "Listed under the category that fits you — community, pharma, investment or technology",
    ],
  },
  {
    name: "Silver",
    blurb: "Meaningful visibility with very little operational overhead.",
    supports: ["Catering", "Travel awards", "Poster sessions"],
    perks: [
      "Everything in Bronze",
      "Social-media acknowledgement from the workshop accounts",
      "An optional short blurb about you on the website",
      "Eligibility to join the shared social-event sponsorship",
    ],
  },
  {
    name: "Gold",
    blurb:
      "For partners who want their name attached to a specific part of the day.",
    supports: [
      "Best paper or poster awards",
      "A poster session",
      "Catering",
      "Speaker & student participation",
    ],
    perks: [
      "Everything in Silver",
      "Recognition attached to one workshop element of your choosing",
      "Priority for shared social-event sponsorship",
      "Eligibility for one short break-time message, subject to the day's cap and venue rules",
    ],
    featured: true,
  },
  {
    name: "Diamond",
    blurb: "Strategic partners supporting the workshop and the wider community.",
    supports: [
      "The Sydney social event",
      "Catering",
      "Travel awards",
      "Speaker & student participation",
    ],
    perks: [
      "Everything in Gold",
      "Featured recognition on the website and the opening and closing slides",
      "First choice among the major support areas",
      "The option to host the Sydney social event",
      "A dedicated organiser contact for logistics",
    ],
  },
];

export const sponsorSupports: string[] = [
  "Travel & registration support for students and underrepresented participants",
  "Poster sessions, catering and informal networking",
  "Best paper, best poster and reproducibility awards",
  "A high-quality Sydney social event for the whole community",
];

export type SponsorWay = {
  title: string;
  body: string;
  /** Must be an existing lucide-react export; resolved in page.tsx. */
  icon: "PartyPopper" | "Coffee" | "PlaneTakeoff" | "Presentation" | "Award" | "Globe";
};

/** Concrete things a sponsor can put their name to. From the prospectus. */
export const sponsorWays: SponsorWay[] = [
  {
    title: "The Sydney social event",
    body: "Host or co-host the evening that closes the workshop day — the part everyone remembers. Several sponsors can share it, or one can take it on.",
    icon: "PartyPopper",
  },
  {
    title: "Catering",
    body: "Coffee, lunch and refreshments across the breaks and both poster sessions — the moments where most of the community actually meets.",
    icon: "Coffee",
  },
  {
    title: "Travel & registration support",
    body: "Help students, speakers and underrepresented participants get to Sydney and through the door.",
    icon: "PlaneTakeoff",
  },
  {
    title: "Poster sessions & networking",
    body: "Boards, printing and materials for our two poster sessions and the informal networking around them.",
    icon: "Presentation",
  },
  {
    title: "Awards & prizes",
    body: "Best paper, best poster and reproducibility awards — named after your organisation if you would like.",
    icon: "Award",
  },
  {
    title: "Community infrastructure",
    body: "The website, proceedings page and submission support that keep the workshop running from one edition to the next.",
    icon: "Globe",
  },
];

/** What a sponsor receives. Wording tracks the prospectus, including its caps. */
export const sponsorBenefits: string[] = [
  "Logo on the workshop website and on the sponsor slide shown through the day",
  "Acknowledgement in the opening and closing remarks",
  "Social-media acknowledgement from the workshop accounts",
  "An optional short sponsor blurb on the website",
  "Named support attached to a travel award, a prize, poster materials or catering",
  "Gold and above: eligibility for one short break-time message — at most three across the whole day, with organiser approval and subject to venue rules",
  "Diamond: featured recognition on the website and opening/closing slides, a dedicated organiser contact, and the option to be exclusive social host",
  "Silver and above, opt-in: a “Top 5 Commercial Impact” shortlist drawn from accepted submissions — introductions happen only if the authors choose to be introduced",
];

export const sponsorPrinciples =
  "Sponsorship does not influence review decisions, speaker selection, awards or publication opportunities. SIMBIOCHEM is community-driven and independent, and is not affiliated with any sponsor.";
