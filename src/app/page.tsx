import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CalendarDays,
  Coffee,
  Download,
  Globe,
  Handshake,
  MapPin,
  Megaphone,
  PartyPopper,
  PlaneTakeoff,
  Presentation,
  ShieldAlert,
  Users,
} from "lucide-react";


import { AgendaView } from "@/components/agenda-view";
import { Avatar } from "@/components/avatar";
import { ParallaxHero } from "@/components/hero/parallax-hero";
import { ProfileCard } from "@/components/profile-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SponsorCta } from "@/components/sponsor-cta";
import { SponsorForm } from "@/components/sponsor-form";
import { SponsorTile } from "@/components/sponsor-tile";
import { announcements } from "@/content/announcements";
import { advisors, organizers } from "@/content/people";
import { panel, speakers } from "@/content/speakers";
import {
  confirmedSponsors,
  pastSponsors,
  sponsorCommunityMessage,
  sponsorPrinciples,
  sponsorTiers,
  sponsorWays,
} from "@/content/sponsors";
import { firstEdition } from "@/content/previous-edition";
import { importantDates, site, themes } from "@/content/site";
import { readAgenda } from "@/lib/agenda-store";

/** Maps the icon name stored in content/sponsors.ts to the component. */
const SPONSOR_ICONS = {
  PartyPopper,
  Coffee,
  PlaneTakeoff,
  Presentation,
  Award,
  Globe,
} as const;


const community = [
  "ML Researchers",
  "Computational Chemistry",
  "Biology",
  "Materials Science",
  "Biophysics",
  "Life Sciences",
];

const keynotes = speakers.filter((s) => s.role === "Keynote");
const invited = speakers.filter((s) => s.role === "Invited Speaker");

// The agenda is the only live input on this page, and it changes rarely. Cache
// the rendered page and let the admin save path call revalidatePath("/"), so
// edits still appear immediately without re-rendering for every visitor.
// The interval is only a safety net if an out-of-band write bypasses the API.
export const revalidate = 300;

export default async function Home() {
  const agenda = await readAgenda();

  return (
    <>
      <SiteHeader />
      <main>
        <ParallaxHero />

        {/* Announcements */}
        <section className="border-b border-mist bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
            <div className="flex items-center gap-2">
              <Megaphone className="size-4 text-teal-600" />
              <p className="eyebrow">Latest updates</p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {announcements.map((a) => {
                const inner = (
                  <>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide ${
                          a.tone === "accent"
                            ? "bg-accent-500/15 text-accent-700"
                            : "bg-teal-500/12 text-teal-700"
                        }`}
                      >
                        {a.tag}
                      </span>
                      <span className="text-xs text-slate-2">{a.date}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium leading-6 text-ink">{a.title}</p>
                  </>
                );
                return a.href ? (
                  <Link
                    key={a.title}
                    href={a.href}
                    className="rounded-2xl border border-mist bg-paper p-5 transition hover:border-teal-300 hover:bg-white"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={a.title} className="rounded-2xl border border-mist bg-paper p-5">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* About / mission */}
        <section id="about" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
            <Reveal>
              <SectionHeading
                eyebrow="The workshop"
                title="Simulation as the substrate for scientific AI"
                description="The next step beyond structure prediction is motion — trajectories, ensembles, kinetics and rare events. SIMBIOCHEM II brings together machine learning, computational chemistry, biophysics and materials science to make molecular AI faster, and grounded in physical rigour."
              />
            </Reveal>

            <Reveal delay={0.05}>
              <figure className="mt-12 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-teal-50 p-8 sm:p-12">
                <blockquote className="display text-2xl font-medium leading-snug text-brand sm:text-3xl">
                  &ldquo;{site.guidingQuestion}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm font-medium uppercase tracking-wide text-teal-700">
                  The guiding question
                </figcaption>
              </figure>
            </Reveal>

            <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="eyebrow">Topics &amp; themes</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {themes.map((t) => (
                    <div
                      key={t}
                      className="flex items-start gap-3 rounded-xl border border-mist bg-paper px-4 py-3.5 text-sm font-medium text-slate-1"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-500" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow">Community</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {community.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-mist bg-white px-3.5 py-2 text-sm font-medium text-brand"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-6 text-slate-1">
                  Expected attendance: {site.expectedAttendance}. Two poster sessions, six
                  community spotlights and a sponsor-supported Sydney social event.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Speakers */}
        <section id="speakers" className="scroll-mt-20 border-t border-mist bg-paper">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <Reveal>
              <SectionHeading
                eyebrow="Speakers"
                title="Keynotes & invited speakers"
                description="Perspectives from AI-for-science labs, computational chemistry, biophysics and industry research. Click a speaker for their profile."
              />
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {keynotes.map((s) => (
                <Reveal key={s.name}>
                  {s.placeholder ? (
                    <div className="flex h-full w-full items-center gap-4 rounded-2xl border border-dashed border-mist bg-paper/60 p-4">
                      <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full border border-dashed border-slate-4 text-slate-3">
                        <Users className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="text-[0.62rem] font-semibold uppercase tracking-wide text-slate-3">
                          Keynote
                        </span>
                        <span className="block font-semibold text-slate-2">{s.name}</span>
                        <span className="block truncate text-sm text-slate-3">
                          {s.affiliation}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <ProfileCard
                      name={s.name}
                      affiliation={s.affiliation}
                      role="Keynote speaker"
                      bio={s.blurb}
                      kind="keynote"
                    />
                  )}
                </Reveal>
              ))}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {invited.map((s) => (
                <Reveal key={s.name}>
                  <ProfileCard
                    name={s.name}
                    affiliation={s.affiliation}
                    role="Invited speaker"
                    bio={s.blurb}
                    kind="invited"
                  />
                </Reveal>
              ))}
            </div>

            {/* Panel */}
            <Reveal delay={0.05}>
              <div className="mt-8 rounded-2xl border border-mist bg-paper p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-teal-600" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                      Panel · {panel.title}
                    </p>
                  </div>
                  <p className="text-xs text-slate-2">
                    Moderator: <span className="font-medium text-ink">{panel.moderator.name}</span>
                  </p>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {panel.panelists.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-3 rounded-xl border border-mist bg-white p-4"
                    >
                      <Avatar name={p.name} image={p.image} size={40} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{p.name}</p>
                        <p className="truncate text-sm text-slate-2">{p.affiliation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Agenda */}
        <section id="agenda" className="scroll-mt-20 border-y border-mist bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-24">
            <Reveal>
              <SectionHeading eyebrow="Agenda" title={agenda.title} description={agenda.note} />
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-10">
                <AgendaView agenda={agenda} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Call for papers band */}
        <section id="call-for-papers" className="scroll-mt-20 bg-brand-950 text-white">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <p className="eyebrow text-teal-300">Call for papers · Open</p>
                <h2 className="display mt-3 text-3xl font-semibold sm:text-4xl">
                  Submit your work on ML for molecular simulation
                </h2>
                <p className="mt-4 max-w-xl text-slate-300">
                  Non-archival short papers (5–8 pages) and abstracts, double-blind. Six spotlight
                  talks and best-paper awards from accepted submissions. Read the call to get the
                  templates and COI requirements before you submit.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/call-for-papers"
                    className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-brand-950 transition hover:bg-accent-400"
                  >
                    Read the call for papers <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/volunteer"
                    className="inline-flex items-center gap-2 rounded-full bg-teal-300 px-6 py-3 text-sm font-semibold text-brand-950 transition hover:bg-teal-200"
                  >
                    Join the Programme Committee
                  </Link>
                </div>
                <div className="mt-6 flex items-start gap-2 rounded-xl border border-emphasis-500/30 bg-emphasis-600/10 p-4 text-sm text-slate-200">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-emphasis-500" />
                  <p>
                    This year NeurIPS requires COI disclosure — including a shared affiliation or
                    even a mild friendship with the organising or advisory committees.{" "}
                    <Link href="/call-for-papers#coi" className="font-semibold text-white underline">
                      Read the COI policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
                {importantDates.map((d) => (
                  <div key={d.label} className="bg-brand-950/80 p-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {d.label}
                    </p>
                    <p
                      className={`mt-2 text-lg font-semibold ${
                        d.tone === "emphasis" ? "text-emphasis-500" : "text-white"
                      }`}
                    >
                      {d.value}
                    </p>
                    {d.note ? <p className="mt-1 text-xs text-slate-400">{d.note}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Organisers */}
        <section id="organisers" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <Reveal>
              <SectionHeading
                eyebrow="Organisers"
                title="The organising team"
                description="Six organisers across academia and industry, with Emine Kucukbenli and Ole Winther as senior organisers. Click a name to see their research interests."
              />
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {organizers.map((p) => (
                <Reveal key={p.name}>
                  <ProfileCard
                    name={p.name}
                    affiliation={p.affiliation}
                    role={p.role}
                    bio={p.research}
                    kind="organiser"
                  />
                </Reveal>
              ))}
            </div>

            <div className="mt-16">
              <Reveal>
                <SectionHeading
                  eyebrow="Advisory committee"
                  title="Senior advisors"
                  description="Senior faculty and industry research leaders supporting the workshop through community steering, scientific advice and endorsement. Click a name for their profile."
                />
              </Reveal>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {advisors.map((p) => (
                  <Reveal key={p.name}>
                    <ProfileCard
                      name={p.name}
                      affiliation={p.affiliation}
                      role={p.role}
                      bio={p.bio}
                      kind="advisor"
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sponsors */}
        <section id="sponsors" className="scroll-mt-20 border-t border-mist bg-paper">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <Reveal>
              <SectionHeading
                eyebrow="Sponsors"
                title="Supported by the community"
                description="Sponsors keep this workshop community-run — funding catering, prizes, poster sessions and the Sydney social event, while scientific review stays entirely independent of them."
              />
            </Reveal>

            <div className="mt-10 flex flex-wrap items-start gap-8">
              {confirmedSponsors.map((s) => (
                <SponsorTile key={s.name} sponsor={s} />
              ))}
            </div>

            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-2">
                1st-edition sponsors
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pastSponsors.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-mist bg-white px-3 py-1.5 text-xs font-medium text-slate-1"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Ways to support */}
            <div className="mt-14">
              <h3 className="display text-2xl font-semibold text-ink">Ways to support</h3>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sponsorWays.map(({ title, body, icon }) => {
                  const Icon = SPONSOR_ICONS[icon];
                  return (
                    <div key={title} className="rounded-2xl border border-mist bg-white p-5">
                      <Icon className="size-5 text-teal-600" />
                      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
                      <p className="mt-1.5 text-sm leading-6 text-slate-2">{body}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Why it matters */}
            <div className="mt-14 rounded-2xl border border-teal-200 bg-teal-50/50 p-7">
              <div className="flex items-center gap-2">
                <Handshake className="size-5 text-teal-700" />
                <p className="text-sm font-semibold text-teal-800">
                  Why sponsorship matters here
                </p>
              </div>
              <div className="mt-3 max-w-4xl space-y-3">
                {sponsorCommunityMessage.map((para) => (
                  <p key={para.slice(0, 32)} className="text-base leading-7 text-slate-1">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Recognition ladder */}
            <div className="mt-8">
              <h3 className="display text-2xl font-semibold text-ink">
                What sponsors receive
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-1">
                Each level adds to the one below it. Levels of support are set out in the
                sponsorship letter.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {sponsorTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`flex flex-col rounded-2xl border p-5 ${
                      tier.featured
                        ? "border-teal-400 bg-teal-50/60 ring-1 ring-teal-300"
                        : "border-mist bg-white"
                    }`}
                  >
                    <p className="display text-lg font-semibold text-brand">{tier.name}</p>
                    <p className="mt-1.5 text-xs leading-5 text-slate-2">{tier.blurb}</p>

                    <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-wide text-teal-700">
                      Supports
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {tier.supports.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-paper px-2.5 py-1 text-[0.7rem] text-slate-1"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-wide text-teal-700">
                      Includes
                    </p>
                    <ul className="mt-1.5 space-y-1.5">
                      {tier.perks.map((p) => (
                        <li key={p} className="flex gap-2 text-xs leading-5 text-slate-1">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-teal-500" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Invitation to get in touch */}
            <div className="mt-8 rounded-2xl border border-mist bg-white p-7">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="flex flex-col justify-center">
                  <p className="display text-lg font-semibold text-ink">
                    Prefer the full detail?
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-1">
                    The sponsorship letter sets out every level, what each one supports and how
                    we handle the parts that are limited.
                  </p>
                  <a
                    href="/simbiochem-ii-sponsorship.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-paper"
                  >
                    <Download className="size-4" />
                    Download the sponsorship letter
                  </a>
                </div>

                <div className="rounded-xl bg-paper p-6">
                  <p className="display text-lg font-semibold text-ink">
                    Talk to the organisers
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-1">
                    Tell us what you would like to support and we will find a shape that works.
                    No commitment at this stage.
                  </p>
                  <div className="mt-5">
                    <SponsorForm />
                  </div>
                </div>
              </div>

              <p className="mt-7 border-t border-mist pt-5 text-xs leading-6 text-slate-2">
                {sponsorPrinciples}
              </p>
            </div>
          </div>
        </section>

        {/* Venue */}
        <section id="venue" className="scroll-mt-20 border-t border-mist bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <SectionHeading
                  eyebrow="Venue"
                  title="Sydney, Australia"
                  description="SIMBIOCHEM II is a NeurIPS 2026 workshop in Sydney, Australia. NeurIPS workshops run December 11–13."
                />
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3 rounded-xl border border-mist bg-white p-5">
                    <CalendarDays className="mt-0.5 size-5 text-teal-600" />
                    <div>
                      <p className="font-semibold text-ink">{site.dateDisplay}</p>
                      <p className="mt-1 text-sm text-slate-2">{site.dateNote}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-mist bg-white p-5">
                    <MapPin className="mt-0.5 size-5 text-teal-600" />
                    <div>
                      <p className="font-semibold text-ink">NeurIPS 2026 · {site.city}</p>
                      <p className="mt-1 text-sm text-slate-2">
                        Exact venue and room assigned by NeurIPS. A sponsor-supported Sydney social
                        event follows the workshop day.
                      </p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Sydney%2C%20Australia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
                      >
                        Open in Google Maps <ArrowUpRight className="size-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-brand-200 lg:h-full lg:min-h-[24rem]">
                <Image
                  src="/venue/sydney.jpg"
                  alt="Sydney, Australia — Opera House and Harbour Bridge"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="display text-xl font-semibold">Join us on Sydney Harbour</p>
                  <p className="mt-1 max-w-md text-sm text-slate-200">
                    A full day of talks, spotlights and posters, capped by a community social event.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Previous edition — at the very bottom */}
        <section className="relative overflow-hidden bg-brand-950 text-white">
          <div className="absolute inset-0 opacity-25 grid-faint" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow text-teal-300">Previous edition</p>
                <h2 className="display mt-3 text-3xl font-semibold sm:text-4xl">
                  SIMBIOCHEM I — EurIPS 2025, Copenhagen
                </h2>
                <p className="mt-4 text-slate-300">
                  Our first edition brought the community together for a day of talks, spotlights
                  and posters — with a DGX Spark best-paper award and five papers invited by Nature
                  Portfolio editors for extended versions.
                </p>
                <Link
                  href="/previous-editions/copenhagen"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/10"
                >
                  Explore the 1st edition <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:min-w-[28rem]">
                {firstEdition.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur"
                  >
                    <p className="display text-2xl font-semibold text-teal-300 sm:text-3xl">
                      {s.value}
                    </p>
                    <p className="mt-1 text-[0.68rem] font-medium uppercase tracking-wide text-slate-300">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SponsorCta />
      <SiteFooter />
    </>
  );
}
