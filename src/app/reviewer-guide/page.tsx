import type { Metadata } from "next";
import { AlertTriangle, Award, Check, ExternalLink, Scale, Sparkles } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "SIMBIOCHEM Review Process",
  description: "Unlisted guidance for SIMBIOCHEM II reviewers.",
  alternates: { canonical: "/reviewer-guide" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noarchive: true },
  },
};

const scores = [
  {
    name: "Novelty",
    question: "Does the paper present a genuinely new idea, direction or perspective?",
    low: "The core idea is familiar and the contribution is not meaningfully distinct.",
    high: "The core idea opens a genuinely new direction, even if the work is early-stage.",
  },
  {
    name: "Impact",
    question: "Could the work meaningfully influence future research or practice?",
    low: "Its potential use or influence is limited or unclear.",
    high: "It has credible potential to influence science or industry if developed further.",
  },
  {
    name: "Clarity",
    question: "Is the paper easy to understand and assess?",
    low: "The argument is hard to follow. Key details are unclear. Figures are poorly labelled.",
    high: "The argument is easy to follow. Claims and limits are clear. Figures are well labelled and self-explanatory. The overall presentation is good, with clean formatting and few typos.",
  },
] as const;

const reviewChecklist = [
  "Summarise the contribution.",
  "List strengths and weaknesses.",
  "Explain each score.",
  "Give actionable suggestions.",
  "Be as comprehensive as possible.",
] as const;

const deskRejectFlags = [
  "Clear evidence of substantially AI-generated writing without meaningful author verification.",
  "Duplicate or near-duplicate submissions.",
  "Plagiarism.",
  "Non-anonymous submission.",
  "10 or more main-text pages.",
  "4 or fewer main-text pages.",
  "Clear signs of prompt injection.",
] as const;

const doNotDeskReject = [
  "A different valid NeurIPS template.",
  "A 9-page paper.",
] as const;

function TickList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-6 text-slate-1">
          <Check className="mt-1 size-4 shrink-0 text-teal-600" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ReviewerGuidePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-paper">
        <section className="border-b border-brand-800 bg-brand-950 text-white">
          <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
            <p className="eyebrow text-teal-300">Instructions for reviewers</p>
            <h1 className="display mt-3 text-4xl font-semibold sm:text-5xl">
              SIMBIOCHEM Review Process
            </h1>
          </div>
        </section>

        <div className="mx-auto max-w-4xl space-y-8 px-5 py-12 lg:px-8">
          <section className="rounded-2xl border-2 border-accent-500/40 bg-accent-500/10 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-accent-500/20 p-2.5">
                <Award className="size-6 text-accent-700" aria-hidden="true" />
              </div>
              <div>
                <p className="eyebrow text-accent-700">Reviewer recognition</p>
                <h2 className="display mt-2 text-xl font-semibold text-brand">
                  Excellent reviews will be recognised
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-1">
                  Organisers and advisors will select the best reviewers based on review quality.
                  They will be recognised at the workshop and highlighted on the second-edition
                  website. <strong>Reviewer prizes: TBC.</strong>
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
            <p className="eyebrow">Step 1</p>
            <h2 className="display mt-2 text-2xl font-semibold text-brand">Plan your time</h2>
            <p className="mt-3 text-sm leading-6 text-slate-1">
              You&rsquo;ll receive at least two and no more than three papers for review.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-1">
              Reserve at least one full day for each paper. More time is better.
            </p>
          </section>

          <section className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
            <p className="eyebrow">Step 2</p>
            <h2 className="display mt-2 text-2xl font-semibold text-brand">Check for conflicts</h2>
            <p className="mt-3 text-sm leading-6 text-slate-1">
              Tell the organisers immediately if you suspect that you know the authors. The
              submission is anonymous, but you may recognise the work from a preprint. Tell us as
              well if you have another conflict. We will reassign the paper.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-1">
              Questions? Email <strong>{site.contactEmail}</strong>. Start the subject with{" "}
              <strong>REVIEWER:</strong>. Without this prefix, our reply may take longer.
            </p>
            <a
              href={`mailto:${site.contactEmail}?subject=REVIEWER%3A%20`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              Email the organisers <ExternalLink className="size-4" />
            </a>
          </section>

          <section className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-emphasis-600" aria-hidden="true" />
              <div>
                <p className="eyebrow">Step 3</p>
                <h2 className="display mt-2 text-2xl font-semibold text-brand">Check the submission</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-emphasis-600">Flag to the organisers</h3>
                <p className="mt-2 text-sm leading-6 text-slate-1">
                  Do not make the desk-rejection decision yourself. Flag the submission in
                  OpenReview. The organisers will review it and decide.
                </p>
                <TickList items={deskRejectFlags} />
              </div>
              <div>
                <h3 className="font-semibold text-teal-700">Do not desk reject for</h3>
                <TickList items={doNotDeskReject} />
                <p className="mt-5 text-sm leading-6 text-slate-1">
                  Focus on the main 5–8 pages. You may stop after page 8. Reading appendices is
                  optional. Read them only when needed to assess a claim.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-mist bg-paper p-4">
              <h3 className="font-semibold text-ink">Quick template check</h3>
              <TickList
                items={[
                  "Use the SIMBIOCHEM template or another valid NeurIPS template.",
                  "The paper must be fully anonymous.",
                  "The main paper should normally be 5–8 pages.",
                  "Do not count references or appendices.",
                ]}
              />
              <a
                href="/call-for-papers#templates"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Check the suggested template <ExternalLink className="size-4" />
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
            <p className="eyebrow">Step 4</p>
            <h2 className="display mt-2 text-2xl font-semibold text-brand">Write the review</h2>
            <p className="mt-3 text-sm leading-6 text-slate-1">
              Read the submitted PDF yourself. Assess it fairly and independently.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-1">
              Write the review before assigning scores. Thinking and writing can clarify your
              assessment.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-1">
              Do not search for the paper title online. It may already be public as a preprint.
              Finding it can reveal the authors and break anonymity. It can also introduce bias
              based on institutional prestige, nationality, affiliation, race, gender or geography.
              This significantly reduces review quality.
            </p>
            <TickList items={reviewChecklist} />
          </section>

          <section className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
            <p className="eyebrow">Step 5</p>
            <h2 className="display mt-2 text-2xl font-semibold text-brand">Score the paper</h2>
            <p className="mt-3 text-sm leading-6 text-slate-1">
              You&rsquo;ll assess three categories. Score each from 1 to 5.
            </p>
            <p className="mt-1 text-sm text-slate-2">1 = poor · 5 = excellent</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {scores.map((score) => (
                <div key={score.name} className="rounded-xl border border-mist bg-paper p-4">
                  <h3 className="font-semibold text-ink">{score.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-1">{score.question}</p>
                  <div className="mt-4 space-y-3 border-t border-mist pt-4 text-sm leading-6">
                    <p className="text-slate-1">
                      <strong className="text-emphasis-600">1 means:</strong> {score.low}
                    </p>
                    <p className="text-slate-1">
                      <strong className="text-teal-700">5 means:</strong> {score.high}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50/60 p-4">
              <h3 className="font-semibold text-teal-800">Keep the workshop context in mind</h3>
              <p className="mt-2 text-sm leading-6 text-slate-1">
                This is a specialist workshop, not the main conference. It is primarily a
                machine-learning workshop. Ideas can score well without extensive benchmarks or
                even lab validation. A well-founded early idea can steer discussion and future work.
                The evidence must still support the stated claims. Methods must be sound.
                Limitations must be clear. Research integrity is essential.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-1">
                Do not lower the Clarity score only because extensive baselines or benchmarks are
                absent. Clarity asks whether the paper is understandable and transparent. Judge the
                strength of the evidence against the scope and maturity of the work.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-teal-200 bg-teal-50/60 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-teal-700" aria-hidden="true" />
              <div>
                <p className="eyebrow">Step 6</p>
                <h2 className="display mt-2 text-2xl font-semibold text-brand">Use AI carefully</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-1">
              AI Assistance is allowed (but not encouraged). You remain responsible for every word
              and score.
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-1">
              <li>• Use AI only for limited support. For example, organise your notes or proofread.</li>
              <li>• Do not upload confidential content to a service that retains data. This includes free versions of popular chatbots.</li>
              <li>• Only use a secure chatbot if the content will not be used for training, stored in its memory or exposed to other users.</li>
              <li>• Do not outsource reading, judgement or review writing.</li>
              <li>• Verify every claim.</li>
            </ul>
          </section>

          <section className="rounded-2xl border-2 border-emphasis-600/25 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 text-emphasis-600">
              <Scale className="size-5" aria-hidden="true" />
              <div>
                <p className="eyebrow">Step 7</p>
                <h2 className="display mt-2 text-2xl font-semibold">Submit on OpenReview</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-1">
              OpenReview will show three required checkboxes before you submit each review. They
              help us maintain review quality and research integrity. Tick all three:
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-ink">
              <li className="flex gap-3">
                <span className="mt-1 size-4 shrink-0 rounded border-2 border-emphasis-600" aria-hidden="true" />
                <span><strong>“I read”</strong> — I read the paper myself.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 size-4 shrink-0 rounded border-2 border-emphasis-600" aria-hidden="true" />
                <span><strong>“I am responsible”</strong> — I own my comments, scores and their impact.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 size-4 shrink-0 rounded border-2 border-emphasis-600" aria-hidden="true" />
                <span><strong>“I am aware of consequences”</strong> — I understand the consequences of misconduct.</span>
              </li>
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-1">
              Serious misconduct may be reported to the NeurIPS Chairs. It may lead to exclusion
              from future workshops. It can harm you, our community and the workshop.
            </p>
          </section>

          <section className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
            <h2 className="display text-xl font-semibold text-brand">After submission</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-1">
              <li>• There is no rebuttal or appeal phase.</li>
              <li>• We will investigate gross misconduct.</li>
              <li>• Clearly AI-authored or offensive reviews may be reported.</li>
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
