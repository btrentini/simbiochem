import { ArrowRight, CalendarDays, Dna, MapPin } from "lucide-react";

import { RegistrationForm } from "@/components/registration-form";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";

const navigation = [
  ["About", "#about"],
  ["Call for papers", "#call-for-papers"],
  ["Dates", "#dates"],
  ["Speakers", "#speakers"],
  ["Organisers", "#organisers"],
  ["Papers", "#papers"],
  ["Schedule", "#schedule"],
  ["Registration", "#registration"],
  ["Sponsors", "#sponsors"],
  ["Contact", "#contact"],
];

const sections = [
  {
    id: "call-for-papers",
    eyebrow: "Call for papers",
    title: "Research across simulation, biology and chemistry",
    body: "We welcome work on computational methods that connect molecular simulation, machine learning and experimental science. Full submission details and review criteria will be announced here.",
  },
  {
    id: "speakers",
    eyebrow: "Speakers",
    title: "Invited perspectives from across the field",
    body: "The invited speaker programme is in preparation. Confirmed speakers and talk abstracts will appear here.",
  },
  {
    id: "organisers",
    eyebrow: "Organisers",
    title: "A cross-disciplinary organising team",
    body: "Organiser names, affiliations and short biographies will be published once the committee is finalised.",
  },
  {
    id: "papers",
    eyebrow: "Accepted papers",
    title: "Programme selected through OpenReview",
    body: "Accepted submissions will be loaded from OpenReview through a cached server endpoint, exposing only the public fields needed by this site.",
  },
  {
    id: "schedule",
    eyebrow: "Schedule",
    title: "A focused day of talks and discussion",
    body: "The detailed programme, poster sessions and room assignments will be added after decisions are released.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Main navigation">
          <a className="flex items-center gap-2 font-semibold tracking-wide" href="#top">
            <Dna className="size-5 text-teal-300" aria-hidden="true" />
            SIMBIOCHEM
          </a>
          <div className="hidden items-center gap-5 text-xs text-slate-300 lg:flex">
            {navigation.map(([label, href]) => (
              <a className="transition hover:text-white" href={href} key={href}>
                {label}
              </a>
            ))}
          </div>
          <a
            className={buttonVariants({
              size: "sm",
              className: "bg-teal-400 text-slate-950 hover:bg-teal-300",
            })}
            href="#registration"
          >
            Register
          </a>
        </nav>
      </header>

      <section id="top" className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_22%,rgba(45,212,191,.2),transparent_30%),radial-gradient(circle_at_15%_65%,rgba(59,130,246,.16),transparent_35%)]" />
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-16 px-5 py-24 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div>
            <p className="mb-6 font-mono text-sm uppercase tracking-[0.22em] text-teal-300">
              NeurIPS 2026 Workshop
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl">
              Simulation at the boundary of biology and chemistry
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              SIMBIOCHEM brings together researchers developing computational methods for molecular science, biological systems and chemical discovery.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                className={buttonVariants({
                  size: "lg",
                  className: "bg-teal-400 text-slate-950 hover:bg-teal-300",
                })}
                href="#call-for-papers"
              >
                View call for papers <ArrowRight />
              </a>
              <a
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className:
                    "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white",
                })}
                href="#registration"
              >
                Register interest
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <CalendarDays className="mb-6 size-6 text-teal-300" />
              <p className="text-sm text-slate-400">Date</p>
              <p className="mt-1 text-xl font-medium">To be announced</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <MapPin className="mb-6 size-6 text-teal-300" />
              <p className="text-sm text-slate-400">Venue</p>
              <p className="mt-1 text-xl font-medium">NeurIPS 2026</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[.55fr_1fr]">
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-teal-800">About</p>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">A forum for methods that cross disciplinary boundaries.</h2>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600">The workshop will examine how simulation and learning can jointly advance mechanistic understanding and molecular design, with attention to rigorous evaluation, reproducibility and scientific usefulness.</p>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="bg-slate-50">
        {sections.map((section, index) => (
          <section className="mx-auto max-w-7xl border-t border-slate-200 px-5 py-20 lg:px-8" id={section.id} key={section.id}>
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[.55fr_1fr]">
                <p className="font-mono text-sm uppercase tracking-[0.18em] text-teal-800">{String(index + 1).padStart(2, "0")} · {section.eyebrow}</p>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{section.title}</h2>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{section.body}</p>
                </div>
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <section id="dates" className="bg-teal-900 text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <Reveal>
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-teal-200">Important dates</p>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/20 sm:grid-cols-3">
              {["Submissions open", "Submission deadline", "Decision notification"].map((label) => (
                <div className="bg-teal-900 p-7" key={label}>
                  <p className="text-sm text-teal-200">{label}</p>
                  <p className="mt-2 text-xl font-medium">To be announced</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="registration" className="mx-auto max-w-5xl px-5 py-24 lg:px-8 lg:py-32">
        <Reveal>
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-teal-800">Registration</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">Register your interest</h2>
          <p className="mb-10 mt-4 max-w-2xl leading-7 text-slate-600">Registration details are validated on the server and sent directly to an organiser-controlled Google Sheet.</p>
          <RegistrationForm />
        </Reveal>
      </section>

      <section id="sponsors" className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-teal-800">Sponsors</p>
          <p className="mt-5 text-xl text-slate-600">Sponsorship information will be announced here.</p>
        </div>
      </section>

      <footer id="contact" className="bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-14 sm:flex-row lg:px-8">
          <div><p className="font-semibold text-white">SIMBIOCHEM</p><p className="mt-2 text-sm">NeurIPS 2026 Workshop</p></div>
          <div className="text-sm sm:text-right"><p className="text-white">Contact</p><p className="mt-2">Organiser email to be announced</p></div>
        </div>
      </footer>
    </main>
  );
}
