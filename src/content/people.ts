export type Person = {
  name: string;
  affiliation: string;
  role: string;
  bio: string;
  /** Web-summarised research interests, shown in the profile dialog. */
  research?: string;
  tags: string[];
  senior?: boolean;
  /** Optional headshot in /public/people (e.g. "/people/bruno-trentini.jpg"). */
  image?: string;
  /** Optional public profile links (priority: Twitter/X, LinkedIn, Scholar). */
  links?: { label: string; url: string }[];
};

export const organizers: Person[] = [
  {
    name: "Bruno Trentini",
    affiliation: "University of Oxford · NVIDIA",
    role: "PhD Student · Applied Research Scientist",
    bio: "Generative ML for simulation-free methods and geometric deep learning for protein engineering & dynamics. Applied ML Research Scientist at NVIDIA — Digital Biology and PhD student at Oxford under Michael Bronstein. Organised ML4LMS@ICML'24, AI4NA@ICLR'25 and SIMBIOCHEM@EurIPS'25.",
    research:
      "Foundational machine learning for dynamical systems in biology and chemistry — combining generative modelling, geometric deep learning and information theory grounded in physical simulation. Works on protein dynamics and ensemble prediction across the order–disorder continuum, and inverse folding for peptide design, alongside multimodal generative AI for scientific and pharmaceutical discovery.",
    tags: ["Experienced Organizer", "PhD Candidate"],
  },
  {
    name: "Emine Kucukbenli",
    affiliation: "NVIDIA",
    role: "Senior Research Scientist",
    bio: "Atomistic modelling, machine-learned interatomic potentials and generative models for scientific discovery at NVIDIA. Long record organising workshops, lecture series and outreach around reproducible science and underrepresented communities.",
    research:
      "Bridges first-principles atomistic modelling and machine learning — developing ML interatomic potentials and equivariant neural networks that make molecular dynamics and quantum-chemistry simulations faster and more scalable (PANNA, and NVIDIA's BioNeMo / cuEquivariance tooling). Applies these to materials science and drug discovery, from crystal energy landscapes to NMR and phonon prediction.",
    tags: ["Senior Organizer", "Industry"],
    senior: true,
  },
  {
    name: "Jigyasa Nigam",
    affiliation: "MIT",
    role: "Postdoc",
    bio: "Physics-based machine learning for atomistic simulation and AI-assisted discovery — learned potentials, physical simulation, protein conformational ensembles and data-efficient modelling for chemistry and materials.",
    research:
      "Machine-learning methods for atomic-scale simulation of molecules and materials that respect physical constraints such as symmetry, equivariance and conservation laws. Contributions include atom-centred equivariant representations and surrogate models for potential energy surfaces, dipoles and electronic structure — accelerating molecular dynamics, quantum chemistry and computational catalysis.",
    tags: ["Organizer", "Postdoc"],
  },
  {
    name: "Max Secor",
    affiliation: "Novo Nordisk",
    role: "ML Scientist (Molecular AI)",
    bio: "Generative models for peptide drug discovery at Novo Nordisk — partial-latent flow matching for cyclic peptides, chemistry language models for non-canonical amino acids, and binding-affinity prediction for antibodies.",
    research:
      "Works at the interface of machine learning and computational/quantum chemistry — drug design, molecular dynamics and quantum dynamics. His Yale PhD (Hammes-Schiffer group) developed methods for proton-coupled electron transfer and neural networks as propagators in quantum dynamics; he now applies ML to drug discovery, combining physics-based simulation with data-driven models.",
    tags: ["Organizer", "Industry"],
  },
  {
    name: "Ole Winther",
    affiliation: "U. of Copenhagen · DTU · Raffle.ai",
    role: "Professor, ML for Life Sciences",
    bio: "Professor in computational and RNA biology with research in deep learning, representation learning and uncertainty for life-science data. Leads major Danish life-science ML initiatives.",
    research:
      "Develops probabilistic and deep generative machine learning — variational autoencoders, diffusion models and Gaussian processes — for the life sciences. Core work spans protein bioinformatics (SignalP, DeepLoc, DeepTMHMM) and single-cell/RNA modelling, as well as AI-for-science surrogates for physical simulations such as density functional theory.",
    tags: ["Senior Organizer", "Faculty"],
    senior: true,
  },
  {
    name: "Runzhong Wang",
    affiliation: "MIT (Coley Lab)",
    role: "Postdoctoral Associate",
    bio: "Neural graph-matching methods for mass-spectrometry simulation and molecular structure elucidation (ICEBERG, MARASON, DiffMS). ACS/Wiley Computers in Chemistry Outstanding Postdoc Award (2025). Co-organised SIMBIOCHEM@EurIPS'25.",
    research:
      "Works at the intersection of machine learning and combinatorial optimisation — neural graph matching, diffusion- and RL-based solvers and Bayesian optimisation. Applies these to computational metabolomics and mass-spectrometry structure elucidation (ICEBERG, SCARF, MARASON) and synthesis planning, and maintains open-source tools such as pygmtools.",
    tags: ["Experienced Organizer", "Postdoc"],
  },
];

export const advisors: Person[] = [
  {
    name: "Michael Bronstein",
    affiliation: "U. of Oxford · AITHYRA · Proxima Bio",
    role: "DeepMind Professor of AI · Scientific Director",
    bio: "Pioneer of geometric deep learning with applications to molecular simulation and generative AI — equivariant networks, graph architectures for biomolecular structure, and learned force fields. Five ERC grants; Royal Society Wolfson Merit Award.",
    tags: ["Advisor", "Faculty"],
  },
  {
    name: "Kristine Deibler",
    affiliation: "Novo Nordisk",
    role: "Head of Molecular AI",
    bio: "Leads industrial AI/ML for molecular simulation and structure-based drug design at Novo Nordisk — diffusion-based generative models and equivariant methods for de novo molecular design and physics-informed optimisation.",
    tags: ["Advisor", "Industry"],
  },
  {
    name: "Marwin Segler",
    affiliation: "Microsoft Research AI for Science",
    role: "Senior Director",
    bio: "Machine learning, reinforcement learning, chemistry and drug discovery — molecular generation, retrosynthesis, computer-aided synthesis planning and scientific reasoning for chemistry. Co-organised many NeurIPS/EurIPS/ELLIS workshops over a decade.",
    tags: ["Advisor", "Industry"],
  },
  {
    name: "Pranam Chatterjee",
    affiliation: "University of Pennsylvania",
    role: "Assistant Professor, Bioengineering & Computer Science",
    bio: "Discrete generative models for therapeutic design integrated with physics simulation (MemDLM, PepTune, PepMLM, EntangledSBM). Co-founder of four biotech companies translating ML-driven protein design into therapeutics.",
    tags: ["Advisor", "Faculty"],
  },
  {
    name: "Tejs Vegge",
    affiliation: "Technical University of Denmark",
    role: "Professor, Autonomous Materials Discovery",
    bio: "Head of the Autonomous Materials Discovery section at DTU — accelerated computational, experimental and AI-based discovery of materials, machine-learned potentials and integrated simulation–experiment workflows.",
    tags: ["Advisor", "Faculty"],
  },
];
