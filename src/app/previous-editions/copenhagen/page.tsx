import type { Metadata } from "next";
import { Award, MapPin, Sparkles } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { firstEdition } from "@/content/previous-edition";

export const metadata: Metadata = {
  // `absolute` so the root template does not append "· SIMBIOCHEM II @
  // NeurIPS 2026" to a title that is already about the previous edition.
  title: { absolute: "SIMBIOCHEM I · EurIPS 2025 Workshop, Copenhagen" },
  description:
    "SIMBIOCHEM I at EurIPS 2025, Copenhagen: 100+ attendees, 29 posters, 8 spotlights, a DGX Spark best-paper award and 5 Nature-invited extended papers.",
  alternates: { canonical: "/previous-editions/copenhagen" },
};

export default function CopenhagenEditionPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-brand-950 text-white">
          <div className="absolute inset-0 opacity-30 grid-faint" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 20% 0%, rgba(14,165,160,0.28), transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-5xl px-5 py-16 lg:px-8">
            <span className="eyebrow text-teal-300">Previous editions</span>
            <h1 className="display mt-4 text-4xl font-semibold sm:text-5xl">
              {firstEdition.title}
            </h1>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-teal-200/90">
              {firstEdition.subtitle}
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <Sparkles className="size-4 text-teal-300" /> {firstEdition.host} ·{" "}
                {firstEdition.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-teal-300" /> {firstEdition.location}
              </span>
            </p>
            <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300">
              Original 1st-edition site — link coming soon
            </span>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-mist bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-mist bg-mist lg:grid-cols-4">
              {firstEdition.stats.map((s) => (
                <div key={s.label} className="bg-white p-6 text-center">
                  <p className="display text-3xl font-semibold text-brand sm:text-4xl">{s.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-2">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
          <Reveal>
            <p className="text-lg leading-8 text-slate-1">{firstEdition.summary}</p>
          </Reveal>
        </section>

        {/* Awards */}
        <section className="border-y border-mist bg-paper">
          <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
            <p className="eyebrow">Awards</p>
            <h2 className="display mt-3 text-2xl font-semibold text-brand sm:text-3xl">
              Prize winners
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {firstEdition.awards.map((a) => (
                <div key={a.name} className="rounded-2xl border border-mist bg-white p-6">
                  <div className="flex items-center gap-2 text-emphasis-600">
                    <Award className="size-5" />
                    <p className="text-sm font-semibold">{a.name}</p>
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-teal-700">
                    {a.prize}
                  </p>
                  <p className="mt-2 text-base font-semibold text-ink">{a.paper}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-2">{a.authors}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nature spotlights */}
        <section className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
          <p className="eyebrow">Nature spotlights</p>
          <h2 className="display mt-3 text-2xl font-semibold text-brand sm:text-3xl">
            Invited for extended versions
          </h2>
          <div className="mt-8 space-y-3">
            {firstEdition.natureSpotlights.map((p, i) => (
              <div
                key={p.title}
                className="flex gap-4 rounded-xl border border-mist bg-white p-5"
              >
                <span className="display text-lg font-semibold text-teal-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-semibold text-ink">{p.title}</p>
                  <p className="mt-1 text-sm text-slate-2">{p.authors}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sponsors */}
        <section className="border-t border-mist bg-paper">
          <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
            <p className="eyebrow">1st-edition sponsors</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {firstEdition.sponsors.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-mist bg-white px-4 py-2 text-sm font-medium text-brand"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
