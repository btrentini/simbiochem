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
 * A visibility ladder, not a price list. Each tier adds recognition on top of
 * the one below, and Diamond is unambiguously the most visible.
 *
 * Two things are genuinely scarce and are described as priority rather than
 * entitlement, because they cannot be promised to everyone: the day carries at
 * most THREE short break-time messages in total across all sponsors, and there
 * are only about three award certificates to name. Anything physical depends on
 * what NeurIPS allows in a workshop room, which is not an exhibit hall.
 */
export const sponsorTiers: SponsorTier[] = [
  {
    name: "Bronze",
    blurb:
      "A straightforward way for smaller groups, startups and long-standing friends of the workshop to put their name behind it.",
    supports: ["Poster materials", "Prizes"],
    perks: [
      "Logo and link on the workshop website, grouped by category — community, pharma, investment or technology partner",
      "Kept on the permanent edition archive, so the recognition outlives the day",
      "Nothing to ship, nobody to staff, no deadlines to meet",
    ],
  },
  {
    name: "Silver",
    blurb:
      "For organisations that want to be visible in the room all day, without taking on anything operational.",
    supports: ["Catering", "Poster sessions"],
    perks: [
      "Everything in Bronze",
      "Logo on the slides shown throughout both coffee breaks and both poster sessions — around four hours of the day",
      "A shoutout from the organisers in the opening and closing acknowledgements",
      "An acknowledgement from the workshop's social accounts",
      "A short description of your organisation on the sponsor page",
    ],
  },
  {
    name: "Gold",
    blurb:
      "For partners who want their name attached to a named part of the programme, and a light presence in the room.",
    supports: ["Best paper & poster awards", "Catering", "A poster session"],
    perks: [
      "Everything in Silver",
      "Your name on an award certificate, worded as “supported by”, and read aloud at the closing awards — the one moment the whole room is seated",
      "Materials on the shared sponsor table: swag, recruiting cards and printed matter, where the venue permits",
      "A careers link on the sponsor page",
      "Priority for shared sponsorship of the Sydney social event",
    ],
  },
  {
    name: "Diamond",
    blurb:
      "For the one or two partners underwriting the day itself — recognised first, everywhere the workshop recognises anyone.",
    supports: [
      "The Sydney social event",
      "Catering",
      "Awards",
      "Student & speaker participation",
    ],
    perks: [
      "Everything in Gold",
      "Featured placement: top of the sponsor page in a larger lockup, and named on the opening and closing slides",
      "Your banner in the workshop room — Diamond only, subject to venue approval",
      "First call on the day's three short break-time messages, three minutes each",
      "First choice among the major support areas, in order of confirmation",
      "The option to host the Sydney social event",
      "Custom arrangements, agreed in writing",
      "A named organiser as your direct contact throughout",
    ],
    featured: true,
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
    title: "Student & speaker participation",
    body: "Bring people into the room who would otherwise not be there — students, early-career researchers and speakers travelling a long way.",
    icon: "PlaneTakeoff",
  },
  {
    title: "Community infrastructure",
    body: "The website, proceedings page and submission support that keep the workshop running from one edition to the next.",
    icon: "Globe",
  },
];

/**
 * Why sponsor. Rendered as separate paragraphs, so keep each one self-contained.
 */
export const sponsorCommunityMessage: string[] = [
  "SIMBIOCHEM is a community-driven workshop, organised by researchers who volunteer their time around their own work. Sponsorship is what makes the day possible — and we think the exchange runs both ways.",
  "The room is small and unusually well selected: people doing some of the strongest work in machine learning for biology and chemistry, who attend and present at NeurIPS, the most respected venue in the field. Sponsoring SIMBIOCHEM puts your organisation in front of exactly that community — a real opportunity to build your brand among researchers who are hard to reach anywhere else, to find collaborators, and to recruit.",
  "It also supports the science itself: the poster that starts a collaboration, the prize that shifts an early-career trajectory, the conversation over lunch that becomes a paper. Our first edition sent five papers on to Nature Portfolio editors. Those are the conversations your support helps make happen — and they are the ones that can genuinely make things better.",
];

export const sponsorPrinciples =
  "Sponsorship does not influence review decisions, speaker selection, awards or publication opportunities. SIMBIOCHEM is community-driven and independent, and is not affiliated with any sponsor.";
