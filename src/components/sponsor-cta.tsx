"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Handshake, X } from "lucide-react";

import { sponsorTiers } from "@/content/sponsors";
import { site } from "@/content/site";

export function SponsorCta() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Floating tab */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-950/25 transition hover:bg-brand-700"
      >
        <Handshake className="size-4 text-accent-400" />
        Interested in sponsoring us?
      </button>

      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Sponsorship">
          <div
            className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-mist p-6">
              <div>
                <p className="eyebrow">Sponsor SIMBIOCHEM II</p>
                <h2 className="display mt-2 text-xl font-semibold text-brand">
                  Support the community
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-slate-2 hover:bg-paper hover:text-ink"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 p-6">
              <p className="text-sm leading-6 text-slate-1">
                Sponsorship keeps the workshop community-driven and independent — funding travel
                awards, catering, best-paper prizes and the Sydney social event, while scientific
                review stays independent of sponsor interests.
              </p>
              {sponsorTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-xl border p-4 ${
                    tier.featured ? "border-teal-400 bg-teal-50/60" : "border-mist bg-white"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-brand">{tier.name}</p>
                    <p className="text-sm font-semibold text-teal-700">{tier.range}</p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-2">{tier.blurb}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-mist p-6">
              <a
                href={`mailto:${site.contactEmail}?subject=SIMBIOCHEM%20II%20sponsorship`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-brand-950 transition hover:bg-accent-400"
              >
                Talk to the organisers <ArrowUpRight className="size-4" />
              </a>
              <p className="mt-3 text-center text-xs text-slate-2">{site.contactEmail}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
