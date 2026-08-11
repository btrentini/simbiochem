import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Download,
  EyeOff,
  FileText,
  Presentation,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { organizers } from "@/content/people";
import { importantDates, site, submissionEthos } from "@/content/site";

export const metadata: Metadata = {
  title: "Call for Papers",
  description:
    "Submit to SIMBIOCHEM II at NeurIPS 2026: non-archival 5–8 page papers on ML for molecular simulation. Anonymised PDFs on OpenReview by 29 August 2026.",
  alternates: { canonical: "/call-for-papers" },
};

const steps = [
  { href: "#about", label: "About" },
  { href: "#what", label: "What to submit" },
  { href: "#templates", label: "Templates & rules" },
  { href: "#coi", label: "Conflicts" },
  { href: "#submit", label: "Submit" },
];

function OpenReviewButton({ light = false }: { light?: boolean }) {
  return (
    <a
      href={site.openReviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={
        light
          ? "inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-brand-950 shadow-lg shadow-accent-500/20 transition hover:bg-accent-400"
          : "inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      }
    >
      Submit on OpenReview <ArrowUpRight className="size-4" />
    </a>
  );
}

function StepHeading({
  n,
  title,
  onDark = false,
}: {
  n: number;
  title: string;
  onDark?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          onDark ? "bg-accent-500 text-brand-950" : "bg-brand text-white"
        }`}
      >
        {n}
      </span>
      <h2
        className={`display text-2xl font-semibold sm:text-3xl ${
          onDark ? "text-white" : "text-brand"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

export default function CallForPapersPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-950 text-white">
          <div className="absolute inset-0 opacity-30 grid-faint" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 60% at 85% 0%, rgba(14,165,160,0.3), transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-4xl px-5 py-20 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-500/15 px-3 py-1 text-xs font-semibold text-accent-300 ring-1 ring-inset ring-accent-500/30">
              <span className="size-2 rounded-full bg-accent-400" /> Call for papers · Open
            </span>
            <h1 className="display mt-6 text-4xl font-bold sm:text-6xl">Call for Papers</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              SIMBIOCHEM is currently accepting submissions — <strong className="text-white">non-archival</strong>{" "}
              short papers (5–8 pages) and abstracts on machine learning for simulation in biology
              and chemistry. Read this page top to bottom; the anonymisation and COI rules matter.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <OpenReviewButton light />
              <p className="text-sm text-slate-300">
                Deadline <strong className="text-white">29 August 2026, 11:59 PM UTC</strong>
              </p>
            </div>
            <nav className="mt-8 flex flex-wrap gap-2" aria-label="Sections">
              {steps.map((sstep) => (
                <a
                  key={sstep.href}
                  href={sstep.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  {sstep.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* Key dates */}
        <section className="border-b border-mist bg-paper">
          <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-mist bg-mist sm:grid-cols-2 lg:grid-cols-4">
              {importantDates.map((d) => (
                <div key={d.label} className="bg-white p-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-2">
                    {d.label}
                  </p>
                  <p
                    className={`mt-2 text-lg font-semibold ${
                      d.tone === "emphasis" ? "text-emphasis-600" : "text-brand"
                    }`}
                  >
                    {d.value}
                  </p>
                  {d.note ? <p className="mt-1 text-xs text-slate-2">{d.note}</p> : null}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-2">
              Camera-ready (accepted papers only): after notification — the exact date is announced
              with decisions. All deadlines are on OpenReview.
            </p>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-20">
          <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
            <Reveal>
              <p className="eyebrow">About the workshop</p>
              <h2 className="display mt-3 text-2xl font-semibold text-brand sm:text-3xl">
                What the workshop is about
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-1">
                Machine learning has transformed biology and chemistry, yet many models miss
                essential dynamics. First-principles methods like molecular dynamics offer physical
                grounding but remain costly. SIMBIOCHEM bridges that divide — integrating scalable ML
                with rigorous physical simulation to make methods faster, and more accurate,
                reliable and grounded in science.
              </p>
              <figure className="mt-6 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-teal-50 p-6">
                <blockquote className="text-lg font-medium leading-snug text-brand">
                  &ldquo;{site.guidingQuestion}&rdquo;
                </blockquote>
                <figcaption className="mt-2 text-xs font-medium uppercase tracking-wide text-teal-700">
                  The guiding question
                </figcaption>
              </figure>
            </Reveal>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-mist bg-white p-6">
                <h3 className="text-base font-semibold text-ink">Who can submit</h3>
                <p className="mt-2 text-sm leading-6 text-slate-1">
                  A broad range of contributions across ML, computational chemistry, biophysics and
                  materials science. We especially welcome work on how ML can accelerate physical
                  simulation, and how simulation can inform and strengthen ML — from datasets and
                  benchmarks to new models and algorithms.
                </p>
              </div>
              <div className="rounded-2xl border border-mist bg-white p-6">
                <h3 className="text-base font-semibold text-ink">Topics of interest</h3>
                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-1">
                  <li>• Physically-grounded architectures (symmetries, conservation laws).</li>
                  <li>• Differentiable simulation &amp; inverse design.</li>
                  <li>• Next-generation learned potentials.</li>
                  <li>• Data efficiency &amp; scalability, foundation models, agentic ML.</li>
                  <li>• Standardisation &amp; reproducibility: benchmarks, datasets, metrics.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Step 1 — What to submit */}
        <section id="what" className="scroll-mt-20 border-y border-mist bg-paper">
          <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
            <Reveal>
              <StepHeading n={1} title="What to submit" />
              <p className="mt-5 text-base leading-7 text-slate-1">
                Submission is entirely electronic, via the SIMBIOCHEM venue on OpenReview.
              </p>

              <div className="mt-7 rounded-2xl border border-teal-200 bg-teal-50/60 p-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-teal-700" />
                  <p className="text-base font-semibold text-teal-800">
                    {submissionEthos.heading}
                  </p>
                </div>
                {submissionEthos.paragraphs.map((para) => (
                  <p key={para.slice(0, 24)} className="mt-3 text-sm leading-6 text-slate-1">
                    {para}
                  </p>
                ))}
                <p className="mt-4 text-sm leading-6 text-slate-1">
                  {submissionEthos.criteriaIntro}
                </p>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  {submissionEthos.criteria.map((c) => (
                    <div key={c.name} className="rounded-xl bg-white/70 px-4 py-3">
                      <dt className="text-sm font-semibold text-brand">{c.name}</dt>
                      <dd className="mt-0.5 text-xs leading-5 text-slate-2">{c.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-brand-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-teal-600" />
                  <h3 className="text-lg font-semibold text-ink">Papers (5–8 pages)</h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-1">
                  <li>• 5–8 pages, excluding references, appendices and data-availability statements (which may take unlimited space).</li>
                  <li>• Reviewers reserve the right to stop reading beyond 8 pages; extra content is at the author&rsquo;s risk.</li>
                  <li>• Six spotlight papers are selected from accepted submissions.</li>
                  <li>• Must be fully anonymised using the provided template (see step 2).</li>
                </ul>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-mist bg-white p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-teal-600" />
                    <h3 className="text-base font-semibold text-ink">Camera-ready (if accepted)</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-1">
                    Accepted papers will be invited to submit a camera-ready version. Although the
                    workshop is non-archival, camera-ready submissions are collated into a proceedings
                    page on this website for download — with an opt-out at submission.
                  </p>
                </div>
                <div className="rounded-2xl border border-mist bg-white p-6">
                  <div className="flex items-center gap-2">
                    <Award className="size-5 text-teal-600" />
                    <h3 className="text-base font-semibold text-ink">Posters (if accepted)</h3>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-1">
                    <li>• All accepted papers may present a poster in person.</li>
                    <li>
                      • <strong>24&Prime; (W) × 36&Prime; (H), portrait</strong>, on lightweight paper
                      (NeurIPS workshop size).
                    </li>
                    <li>
                      • Mount with <strong>provided command strips only</strong> (command strips and
                      painters tape are provided in the room). No adhesive-backed self-sticking
                      posters or anything that could damage walls or boards.
                    </li>
                    <li>• Please take your poster down after your session.</li>
                    <li>• NeurIPS will suggest preferred poster-printing options nearer the conference.</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-mist bg-white p-6">
                  <div className="flex items-center gap-2">
                    <Presentation className="size-5 text-teal-600" />
                    <h3 className="text-base font-semibold text-ink">Slides (if spotlighted)</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-1">
                    Six spotlight papers are chosen by the organisers with the committees. Each gets a
                    10-minute talk; presenters submit slides at least two days before the workshop.
                  </p>
                </div>
                <div className="rounded-2xl border border-mist bg-white p-6">
                  <div className="flex items-center gap-2">
                    <Award className="size-5 text-teal-600" />
                    <h3 className="text-base font-semibold text-ink">Journal fast-track &amp; awards</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-1">
                    The organising committee is reaching out to journals about fast-track publication
                    opportunities and a best-paper award for top accepted submissions. Any such
                    pathway remains at the journal&rsquo;s discretion and independent of the workshop
                    review.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-5">
                <p className="text-sm leading-6 text-teal-900">
                  <strong>Non-archival.</strong> There are no proceedings and no rebuttal phase. We
                  welcome work previously presented at other workshops or conferences, or currently
                  under review elsewhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2 — Templates & anonymisation rules */}
        <section id="templates" className="scroll-mt-20">
          <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
            <Reveal>
              <StepHeading n={2} title="Get the template & prepare an anonymised PDF" />
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-1">
                Use the official NeurIPS 2026 LaTeX style and submit anonymised — omit the{" "}
                <code className="rounded bg-mist px-1">final</code> and{" "}
                <code className="rounded bg-mist px-1">preprint</code> options. For Overleaf, download
                the zip and upload it as a new project.
              </p>
            </Reveal>

            {/* Anonymisation — strong */}
            <div className="mt-8 rounded-2xl border-2 border-emphasis-600/25 bg-emphasis-600/[0.04] p-6">
              <div className="flex items-center gap-2 text-emphasis-600">
                <EyeOff className="size-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Anonymise carefully — desk-reject otherwise
                </p>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink">
                <li>
                  • Submissions <strong>must be fully anonymised as per the template instructions</strong>.
                  Do not include author names, affiliations or acknowledgements.
                </li>
                <li>
                  • Remove <strong>any identifying links</strong> — GitHub repositories, personal
                  websites, and images/figures (or their metadata) that could reveal your identity.
                </li>
                <li>
                  • <strong>Failing to submit an anonymised paper will cause desk rejection.</strong>{" "}
                  Acknowledgements may be added only in the camera-ready version after acceptance.
                </li>
                <li>
                  • Because the workshop is <strong>non-archival</strong>, reviewers are explicitly
                  instructed to evaluate <strong>only the submitted PDF</strong> and not to search for
                  external sources — please help preserve double-blind review by removing anything
                  that could deanonymise you.
                </li>
              </ul>
            </div>

            {/* Research integrity */}
            <div className="mt-6 rounded-2xl border-2 border-emphasis-600/25 bg-white p-6">
              <div className="flex items-center gap-2 text-emphasis-600">
                <AlertTriangle className="size-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Research integrity — no duplicate submissions
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink">
                Authors must comply with research-integrity guidelines. Submitting the same paper
                more than once — tweaked duplicates, or multiple versions of the same work — is
                misconduct. <strong>We run mechanisms to detect this</strong>, and any such attempt
                (or any other attempt to outsmart the review process) will be reported to the
                organisers, <strong>OpenReview and NeurIPS as misconduct</strong>, and will be
                desk-rejected.
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-brand-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-ink">SIMBIOCHEM · NeurIPS 2026 template</h3>
                <p className="mt-2 text-sm leading-6 text-slate-1">
                  Includes <code className="rounded bg-paper px-1">neurips_2026.tex</code>,{" "}
                  <code className="rounded bg-paper px-1">neurips_2026.sty</code> and the required{" "}
                  <code className="rounded bg-paper px-1">checklist.tex</code>.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="/templates/simbiochem-neurips-2026-template.zip"
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                    download
                  >
                    <Download className="size-4" /> Download .zip
                  </a>
                  <a
                    href="/templates/simbiochem-neurips-2026-template.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-paper"
                  >
                    <FileText className="size-4" /> Example PDF
                  </a>
                  {[
                    ["/templates/neurips_2026.tex", ".tex"],
                    ["/templates/neurips_2026.sty", ".sty"],
                    ["/templates/checklist.tex", "checklist"],
                  ].map(([href, label]) => (
                    <a
                      key={href}
                      href={href}
                      className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-paper"
                      download
                    >
                      <FileText className="size-4" /> {label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-mist bg-white p-6">
                <h3 className="text-lg font-semibold text-ink">Checklist before you submit</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-1">
                  <li>• 5–8 pages (references &amp; appendices excluded).</li>
                  <li>• Fully anonymised, no identifying links or images.</li>
                  <li>• US-Letter page size; embed Type 1 / TrueType fonts.</li>
                  <li>• COI declaration completed on OpenReview (step 3).</li>
                  <li>
                    • The paper checklist is <strong>encouraged but not enforced</strong> — please
                    complete the AI/LLM disclosure item.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3 — Conflicts of interest */}
        <section id="coi" className="scroll-mt-20 border-y border-mist bg-paper">
          <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
            <Reveal>
              <StepHeading n={3} title="Declare your conflicts of interest" />
              <div className="mt-4 flex items-center gap-2">
                <ShieldAlert className="size-5 text-emphasis-600" />
                <p className="eyebrow text-emphasis-600">Required this year — taken seriously</p>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-1">
                NeurIPS 2026 distinguishes <strong>domain conflicts</strong>, which come from the
                past three years of Education &amp; Career History, from{" "}
                <strong>personal conflicts</strong> with individuals. Keep every author&rsquo;s
                OpenReview profile current so these declarations can support conflict-safe review
                assignment.
              </p>
            </Reveal>

            <div className="mt-8 rounded-2xl border-2 border-emphasis-600/25 bg-white p-6">
              <div className="flex items-center gap-2 text-emphasis-600">
                <AlertTriangle className="size-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Submission eligibility
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink">
                Under the NeurIPS 2026 workshop guidance, <strong>organisers and anyone with a
                personal conflict of interest with an organiser may not submit</strong>. NeurIPS
                gives an organiser&rsquo;s PhD student or postdoc as examples. A shared current or
                recent institutional affiliation is a domain conflict; it does not by itself make an
                author ineligible, but the conflicted organiser will not assess that submission.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-base font-semibold text-ink">
                How NeurIPS 2026 defines the two types of conflict
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-1">
                {[
                  ["Domain conflict", "Affiliations in the past three years, entered in OpenReview Education & Career History. Include all affiliations, such as consulting and sabbaticals."],
                  ["Family or close personal relationship", "This is a personal conflict."],
                  ["PhD advisor / advisee", "A PhD advisor–advisee relationship in either direction is a personal conflict."],
                  ["Recent original-research co-authorship", "Co-authorship on an original research article within the past three years is a personal conflict. Perspective pieces do not count."],
                  ["Other exceptional conflicts", "If another relationship would significantly compromise review fairness, declare it through OpenReview or contact the workshop organisers for guidance."],
                ].map(([title, body]) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emphasis-600" />
                    <span>
                      <strong className="text-ink">{title}.</strong> {body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={site.neuripsCoiGuide}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-paper"
              >
                NeurIPS COI guidelines <ArrowUpRight className="size-4" />
              </a>
              <a
                href={site.neuripsWorkshopGuide}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-paper"
              >
                NeurIPS 2026 workshops guidance <ArrowUpRight className="size-4" />
              </a>
            </div>

            <div className="mt-10 rounded-2xl border border-mist bg-white p-6">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-teal-600" />
                <h3 className="text-base font-semibold text-ink">
                  Organisers covered by the submission restriction
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-1">
                The restriction on submitting because of a personal conflict applies to the
                organisers listed below, not to members of the advisory committee.
              </p>
              <div className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {organizers.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-baseline justify-between gap-3 border-b border-mist/70 py-1.5"
                  >
                    <span className="text-sm font-medium text-ink">{m.name}</span>
                    <span className="text-right text-xs text-slate-2">{m.affiliation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Review, prizes, programme committee */}
        <section className="scroll-mt-20">
          <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
            <p className="eyebrow">Review, prizes &amp; reviewing</p>
            <h2 className="display mt-3 text-2xl font-semibold text-brand sm:text-3xl">
              How review works
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-mist bg-white p-6">
                <h3 className="text-base font-semibold text-ink">Review process</h3>
                <p className="mt-2 text-sm leading-6 text-slate-1">
                  Up to three double-blind reviews per submission, with reviewer loads capped at
                  three. Approve/reject recommendations are required; detailed comments are
                  encouraged. <strong>There is no rebuttal phase.</strong>
                </p>
              </div>
              <div className="rounded-2xl border border-mist bg-white p-6">
                <h3 className="text-base font-semibold text-ink">Recognition &amp; prizes</h3>
                <p className="mt-2 text-sm leading-6 text-slate-1">
                  Best papers are selected by the organisers and advisors on{" "}
                  <strong>novelty, impact and presentation</strong>. The committee is reaching out to
                  sponsors and journals about additional prizes and fast-track opportunities.
                </p>
              </div>
              <div className="rounded-2xl border border-mist bg-white p-6">
                <h3 className="text-base font-semibold text-ink">Reviewers wanted</h3>
                <p className="mt-2 text-sm leading-6 text-slate-1">
                  We welcome reviewers of all levels of seniority; reviewers are listed on the website.
                </p>
                <Link
                  href="/volunteer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
                >
                  Join the Programme Committee <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            {/* Use of AI in reviewing */}
            <div className="mt-8 rounded-2xl border border-mist bg-white p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-teal-600" />
                <h3 className="text-base font-semibold text-ink">Use of AI in reviewing</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-1">
                Reviewers may use AI to assist their reviews in accordance with NeurIPS guidelines,
                under these guiding principles:
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-1">
                <li>
                  • <strong>Human judgement is augmented, not replaced.</strong> The tool assists
                  reviewers and does not replace any human in the review process.
                </li>
                <li>
                  • <strong>Informed author consent.</strong> A paper is included in any AI-assistance
                  experiment only if its authors opt in.
                </li>
                <li>
                  • <strong>Confidentiality &amp; privacy</strong> are upheld to the highest
                  standards.
                </li>
                <li>
                  • <strong>Disclosure is encouraged.</strong> If you used AI to help write a
                  review, we would rather you said so.
                </li>
              </ul>
              <p className="mt-3 text-sm leading-6 text-slate-1">
                Reviewers are expected to be fair, to <strong>stick to the paper</strong> under
                review, and <strong>not to search for information that could identify authors</strong>.
                We encourage using AI wisely per NeurIPS guidelines. Papers that are clearly
                AI-generated and of poor quality may be desk-rejected. If authors believe a reviewer
                used AI unwisely, they may report the review to the organisers.
              </p>
            </div>
          </div>
        </section>

        {/* Step 4 — Submit */}
        <section id="submit" className="scroll-mt-20 border-t border-mist bg-brand-950 text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
            <StepHeading n={4} title="Submit on OpenReview" onDark />
            <p className="mt-5 max-w-2xl text-slate-200">
              Once you have prepared an anonymised PDF with the template and completed the COI
              declaration, submit through the SIMBIOCHEM OpenReview portal before the deadline.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
              {["Anonymised PDF, no identifying links", "NeurIPS 2026 template", "COI declaration complete"].map(
                (c) => (
                  <span key={c} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-accent-400" /> {c}
                  </span>
                ),
              )}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <OpenReviewButton light />
              <p className="text-sm text-slate-400">
                Deadline 29 August 2026, 11:59 PM UTC · questions to{" "}
                <a href={`mailto:${site.contactEmail}`} className="text-teal-300">
                  {site.contactEmail}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
