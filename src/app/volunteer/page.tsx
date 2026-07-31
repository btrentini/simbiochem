import type { Metadata } from "next";
import { ClipboardCheck, Scale, Users } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VolunteerForm } from "@/components/volunteer-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Join the Programme Committee",
  description:
    "Volunteer to review for SIMBIOCHEM II at NeurIPS 2026 in Sydney. Double-blind reviews, capped at three papers, all seniority levels welcome and credited.",
  alternates: { canonical: "/volunteer" },
};

export default function VolunteerPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-brand-950 text-white">
          <div className="absolute inset-0 opacity-30 grid-faint" aria-hidden="true" />
          <div className="relative mx-auto max-w-5xl px-5 py-16 lg:px-8">
            <span className="eyebrow text-teal-300">Get involved</span>
            <h1 className="display mt-4 text-4xl font-semibold sm:text-5xl">
              Join the Programme Committee
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              We are assembling a diverse Programme Committee to provide double-blind reviews across
              the biology and chemistry tracks. Reviewers of all levels of seniority are welcome and
              will be acknowledged on the website.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ClipboardCheck,
                title: "Light reviewer load",
                body: "Reviewer loads are capped at three submissions, each receiving up to three double-blind reviews.",
              },
              {
                icon: Scale,
                title: "Careful COI handling",
                body: "Conflicts are managed through OpenReview disclosure boxes and organiser-managed assignment.",
              },
              {
                icon: Users,
                title: "All levels welcome",
                body: "From PhD students to faculty and industry researchers. Reviewers are credited on the site.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-mist bg-white p-6">
                <Icon className="size-6 text-teal-600" />
                <h2 className="mt-4 text-base font-semibold text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-1">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-mist bg-paper">
          <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
            <Reveal>
              <p className="eyebrow">Sign-up</p>
              <h2 className="display mt-3 text-2xl font-semibold text-brand sm:text-3xl">
                Programme Committee application
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-1">
                Sending your details is an expression of interest, not a commitment either
                way. The organisers read every submission and will reach out if your
                expertise matches what comes in.
              </p>

              <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50/60 p-6">
                <p className="text-sm font-semibold text-teal-800">What we ask, and what we promise</p>
                <ul className="mt-3 space-y-2.5">
                  {[
                    "We aim to allocate no more than three papers per reviewer, and will do our best to hold that line.",
                    "We put real effort into matching papers to your stated tracks and expertise, rather than assigning at random.",
                    "You will have a designated organiser to contact directly with any question or doubt — including if you spot a conflict after an assignment lands.",
                    "Reviewing is double-blind, and reviewers are credited on the website.",
                  ].map((c) => (
                    <li key={c} className="flex gap-2.5 text-sm leading-6 text-slate-1">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-teal-600" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 rounded-2xl border border-mist bg-white p-6 sm:p-8">
                <VolunteerForm />
              </div>
              <p className="mt-6 text-sm text-slate-2">
                Prefer email? Reach the organisers at{" "}
                <a href={`mailto:${site.contactEmail}`} className="font-medium text-teal-700">
                  {site.contactEmail}
                </a>
                .
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
