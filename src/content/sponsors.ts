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
    body: "Host or co-host the evening that closes the workshop day. Shared support targets USD $16,000; an exclusive social host covers the full USD $18,000.",
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
