/**
 * SIMBIOCHEM I — 1st edition, held at EurIPS 2025 in Copenhagen, Denmark.
 * Source: docs/simbiochem-1st-edition-copenhagen/facts.txt
 */

export const firstEdition = {
  title: "SIMBIOCHEM I",
  subtitle: "The 1st Workshop on Machine Learning for Simulations in Biology and Chemistry",
  host: "EurIPS 2025",
  date: "December 6, 2025",
  location: "ITU, Aud. 0, Rued Langgaards Vej 7, 2300 København, Denmark",
  liveSiteUrl: "https://www.simbiochem.com",
  summary:
    "The inaugural edition brought the machine-learning, computational-chemistry and biophysics communities together in Copenhagen for a full day of talks, spotlights and two poster sessions — with community benchmarks, reproducibility and physically-grounded methods at its core.",
  stats: [
    { value: ">100", label: "Attendees" },
    { value: "29", label: "Accepted posters" },
    { value: "8", label: "Spotlight talks" },
    { value: "5", label: "Nature-invited extended versions" },
  ],
  awards: [
    {
      name: "Best Paper Award (NVIDIA)",
      prize: "DGX Spark",
      paper: "Sparse Data Diffusion for Scientific Simulations in Biology and Physics",
      authors:
        "Phil Ostheimer, Mayank Nagda, Andriy Balinskyy, Jean Radig, Carl Herrmann, Stephan Mandt, Marius Kloft, Sophie Fellenz",
    },
    {
      name: "DCAI Best Paper Award",
      prize: "2000 GPU hours on GEFION B300",
      paper: "Shoot from the HIP: Hessian Interatomic Potentials without derivatives",
      authors:
        "Andreas Burger, Luca Thiede, Nikolaj Rønne, Nandita Vijaykumar, Tejs Vegge, Arghya Bhowmik, Alán Aspuru-Guzik",
    },
  ],
  natureSpotlights: [
    {
      title: "Improving protein–ligand complex generation with force field guidance",
      authors:
        "Helen Lai, Tingyu Wang, Hassan Sirelkhatim, S. Joe Eaton, Howard Huang, Brad Rees, Ola Engkvist, Jon Paul Janet, Xiaoyun Wang, Alessandro Tibo",
    },
    {
      title: "DoRIAT: A Bayesian Framework for Interpreting and Annotating TCR-pHLA Docking Runs",
      authors:
        "Christos Maniatis, Zahra Ouaray, Chengkai Xiao, Thomas P.E. Dixon, Charlie Naylor, James R. Snowden, Michelle Teng, Jacob Hurst",
    },
    {
      title: "Learning from the Electronic Structure of Molecules Across the Periodic Table",
      authors:
        "Manasa Kaniselvan, Benjamin Kurt Miller, Meng Gao, Juno Nam, Daniel S. Levine",
    },
    {
      title: "Shoot from the HIP: Hessian Interatomic Potentials without derivatives",
      authors:
        "Andreas Burger, Luca Thiede, Nikolaj Rønne, Nandita Vijaykumar, Tejs Vegge, Arghya Bhowmik, Alán Aspuru-Guzik",
    },
    {
      title:
        "MDAgent: A Modular Multi-Agent Framework for Autonomous Protein–Ligand Molecular Dynamics Simulations",
      authors:
        "Salomé Guilbert, Cassandra Masschelein, Jeremy Goumaz, Bohdan Naida, Philippe Schwaller",
    },
  ],
  sponsors: ["NVIDIA", "Novo Nordisk", "IQC", "Cradle.bio", "DCAI"],
} as const;
