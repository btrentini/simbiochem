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
    blurb:
      "Frank Noé is a Partner Research Manager at Microsoft Research AI for Science in Berlin, and holds an honorary professorship at Freie Universität Berlin. He co-pioneered Markov state modelling for molecular kinetics, and led the work on Boltzmann Generators, which sample equilibrium states with deep learning. With his team at Microsoft Research he developed BioEmu, a generative model of protein equilibrium ensembles published in Science in 2025. His work sits close to our theme of conformational ensembles, kinetics and rare events.",
  },
  {
    name: "Max Welling",
    affiliation: "CuspAI · AMLab, University of Amsterdam",
    role: "Keynote",
    status: "confirmed",
    blurb:
      "Max Welling is professor of machine learning at the University of Amsterdam, where he heads the Amsterdam Machine Learning Lab. He is also a co-founder of CuspAI, which works on AI for materials discovery. With Diederik Kingma he introduced the variational autoencoder, and his graph and equivariant neural networks are building blocks for models of molecules and materials. That work on symmetry and generative modelling speaks to our themes of learned potentials and molecular foundation models.",
  },
  {
    name: "Yu-Shan Lin",
    affiliation: "Tufts University",
    role: "Invited Speaker",
    status: "confirmed",
    blurb:
      "Yu-Shan Lin is a computational chemist at Tufts University, where she is Professor of Chemistry and Dean of Academic Affairs for the School of Arts and Sciences. Her group combines molecular dynamics with machine learning to study cyclic peptides, and how modified amino acids shape protein folding. They developed StrEAMM, which predicts the structural ensembles of cyclic peptides from simulation data. That work fits our themes of conformational ensembles and enhanced molecular dynamics.",
  },
  {
    name: "Heather J. Kulik",
    affiliation: "MIT",
    role: "Invited Speaker",
    status: "confirmed",
    blurb:
      "Heather J. Kulik is the Lammot du Pont Professor of Chemical Engineering and Professor of Chemistry at MIT. Her group combines multi-scale modelling, electronic structure calculations and machine learning to discover new molecules and mechanisms, from metal-organic frameworks to enzymes. The group also builds open-source tools such as molSimplify, and uncertainty metrics that flag when a prediction falls outside a model's training data. That speaks to our themes of calibrated uncertainty and active learning.",
  },
  {
    name: "Ai Niitsu",
    affiliation: "RIKEN IMS",
    role: "Invited Speaker",
    status: "confirmed",
    blurb:
      "Ai Niitsu leads the Laboratory for Dynamic Biomolecule Design at the RIKEN Center for Integrative Medical Sciences in Yokohama. The lab develops methods for designing peptides and membrane proteins with controllable conformational dynamics, pairing protein design with molecular simulation. That work spans de novo α-helical barrels acting as ion channels, and gREST enhanced-sampling simulations that tell ligand binders from non-binders. It connects to our themes of conformational ensembles and physical alignment.",
  },
  {
    name: "John Chodera",
    affiliation: "Sloan Kettering Institute · MSKCC",
    role: "Invited Speaker",
    status: "confirmed",
    blurb:
      "John Chodera leads a lab at the Sloan Kettering Institute, part of Memorial Sloan Kettering Cancer Center in New York. His group builds physical models of how small molecules interact with proteins, pairing simulation with robot-driven laboratory experiments. He is a co-developer of the OpenMM simulation framework and a co-founder of the Open Force Field Initiative and the open-science COVID Moonshot. The lab's machine-learned force fields, such as espaloma, and its alchemical free energy methods map onto our themes of learned potentials and free energies.",
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
