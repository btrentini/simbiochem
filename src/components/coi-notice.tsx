"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ShieldAlert, X } from "lucide-react";

import { site } from "@/content/site";

const CONFLICTS = [
  "You work at the same institution as the author, or did recently.",
  "You have co-authored with them in the last three years.",
  "You were their advisor or their student, at any point.",
  "You are family, or close personal friends.",
  "You have a financial interest in the work.",
];

/**
 * Opened from the reviewing terms on the volunteer form. Rendered into <body>
 * for the same reason the profile dialog is: an ancestor with a transform
 * becomes the containing block for `position: fixed` and would trap it.
 */
export function CoiNotice() {
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="font-medium text-teal-700 underline decoration-teal-700/40 underline-offset-2 transition hover:decoration-teal-700"
      >
        How we handle conflicts of interest
      </button>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Conflicts of interest"
            >
              <div
                className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />
              <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-mist bg-white p-7 shadow-2xl">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 rounded-full p-1.5 text-slate-2 hover:bg-paper hover:text-ink"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>

                <div className="flex items-center gap-2">
                  <ShieldAlert className="size-5 text-emphasis-600" />
                  <p className="eyebrow">Conflicts of interest</p>
                </div>
                <h2 className="display mt-3 text-xl font-semibold text-brand">
                  What counts, and what we do about it
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-1">
                  Reviewing is double-blind, so you will not see who wrote a paper. That
                  only works if conflicts are declared up front. You have a conflict with a
                  paper if any of these are true:
                </p>
                <ul className="mt-3 space-y-2">
                  {CONFLICTS.map((c) => (
                    <li key={c} className="flex gap-2 text-sm leading-6 text-slate-1">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-emphasis-600" />
                      {c}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-sm leading-6 text-slate-1">
                  You declare conflicts on OpenReview, and we never assign you a paper you
                  have flagged. If you spot a conflict after an assignment lands — which
                  happens, since reviewing is blind — tell your designated organiser and we
                  will reassign it, no questions asked.
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-1">
                  We follow the NeurIPS rules rather than inventing our own.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={site.neuripsCoiGuide}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold text-brand transition hover:bg-paper"
                  >
                    NeurIPS COI guidelines <ArrowUpRight className="size-4" />
                  </a>
                  <a
                    href={site.neuripsWorkshopGuide}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold text-brand transition hover:bg-paper"
                  >
                    NeurIPS 2026 workshop guidance <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
