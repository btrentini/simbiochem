export type Speaker = {
  name: string;
  affiliation: string;
  role: "Keynote" | "Invited Speaker";
  status: "confirmed" | "tentative";
  /** Optional headshot in /public/people (e.g. "/people/frank-noe.jpg"). */
  image?: string;
  /** Optional one-line note shown in the floating profile. */
  blurb?: string;
};

export const speakers: Speaker[] = [
  {
    name: "Frank Noé",
    affiliation: "Microsoft Research AI for Science · FU Berlin",
    role: "Keynote",
    status: "confirmed",
  },
  {
    name: "Max Welling",
    affiliation: "CuspAI · AMLab, University of Amsterdam",
    role: "Keynote",
    status: "confirmed",
  },
  {
    name: "Yu-Shan Lin",
    affiliation: "Tufts University",
    role: "Invited Speaker",
    status: "confirmed",
  },
  {
    name: "Heather J. Kulik",
    affiliation: "MIT",
    role: "Invited Speaker",
    status: "confirmed",
  },
  {
    name: "Ai Niitsu",
    affiliation: "RIKEN IMS",
    role: "Invited Speaker",
    status: "confirmed",
  },
  {
    name: "John Chodera",
    affiliation: "Sloan Kettering Institute · MSKCC",
    role: "Invited Speaker",
    status: "confirmed",
  },
];

export type Panelist = {
  name: string;
  affiliation: string;
  image?: string;
};

export const panel = {
  title: "Agents & Simulations",
  moderator: { name: "TBC", affiliation: "Moderator to be confirmed" },
  panelists: [
    { name: "Frank Noé", affiliation: "MSR AI for Science · FU Berlin" },
    { name: "Anthony Costa", affiliation: "NVIDIA — Digital Biology" },
    { name: "Kristine Deibler", affiliation: "Novo Nordisk" },
    { name: "Konstantin Hemker", affiliation: "OpenAI" },
  ] as Panelist[],
};
