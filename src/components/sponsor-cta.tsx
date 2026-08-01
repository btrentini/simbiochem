"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Download, Handshake, X } from "lucide-react";

import { SponsorForm } from "@/components/sponsor-form";
import { sponsorTiers } from "@/content/sponsors";

export function SponsorCta() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"info" | "contact">("info");

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
        onClick={() => {
          // Always open on the overview rather than mid-conversation.
          setView("info");
          setOpen(true);
        }}
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
                  {view === "info" ? "Support the community" : "Talk to the organisers"}
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

            {view === "info" ? (
              <>
                <div className="flex-1 space-y-5 p-6">
                  <p className="text-sm leading-6 text-slate-1">
                    SIMBIOCHEM is a community-driven workshop, organised by researchers who
                    volunteer their time. Sponsoring it puts your organisation in front of a
                    small, focused group doing some of the strongest work in machine learning
                    for biology and chemistry — a chance to build your brand, meet
                    collaborators and recruit, while supporting the science itself.
                  </p>
                  <p className="text-sm leading-6 text-slate-1">
                    There is no single right way to help. Below is how partners usually take part,
                    but if something else fits you better we would genuinely like to hear it.
                  </p>

                  <div className="space-y-3">
                    {sponsorTiers.map((tier) => (
                      <div
                        key={tier.name}
                        className={`rounded-xl border p-4 ${
                          tier.featured ? "border-teal-400 bg-teal-50/60" : "border-mist bg-white"
                        }`}
                      >
                        <p className="font-semibold text-brand">{tier.name}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-2">{tier.blurb}</p>

                        <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-wide text-teal-700">
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

                        <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-wide text-teal-700">
                          Includes
                        </p>
                        <ul className="mt-1.5 space-y-1">
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

                  <a
                    href="/simbiochem-ii-sponsorship.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-mist bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-paper"
                  >
                    <Download className="size-4" />
                    Download the sponsorship letter
                  </a>
                  <p className="text-center text-xs text-slate-2">
                    Full details, including levels of support, are in the letter.
                  </p>
                </div>

                <div className="border-t border-mist p-6">
                  <button
                    type="button"
                    onClick={() => setView("contact")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-brand-950 transition hover:bg-accent-400"
                  >
                    <Handshake className="size-4" />
                    Talk to the organisers
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 space-y-5 p-6">
                <button
                  type="button"
                  onClick={() => setView("info")}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-2 transition hover:text-ink"
                >
                  <ArrowLeft className="size-4" />
                  Back to sponsorship
                </button>
                <p className="text-sm leading-6 text-slate-1">
                  Tell us a little about you and we will come back to you. No commitment at this
                  stage — early conversations are genuinely useful to us.
                </p>
                <SponsorForm compact />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
