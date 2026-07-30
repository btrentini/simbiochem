"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Maximize2, X } from "lucide-react";

import { Avatar } from "@/components/avatar";
import { profileByName } from "@/content/media";

type Kind = "keynote" | "invited" | "advisor" | "organiser";

const LABEL: Record<Kind, string> = {
  keynote: "Keynote",
  invited: "Invited talk",
  advisor: "Advisor",
  organiser: "Organiser",
};

export function ProfileCard({
  name,
  affiliation,
  role,
  bio,
  kind,
}: {
  name: string;
  affiliation: string;
  role: string;
  bio?: string;
  kind: Kind;
}) {
  const [open, setOpen] = useState(false);
  const profile = profileByName[name];

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

  const labelClass =
    kind === "keynote" ? "text-accent-700" : kind === "advisor" ? "text-brand" : "text-teal-600";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group flex w-full items-center gap-4 rounded-2xl border border-mist bg-white p-4 text-left transition hover:border-teal-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
      >
        <Avatar name={name} size={52} senior={kind === "keynote"} />
        <span className="min-w-0 flex-1">
          <span className={`text-[0.62rem] font-semibold uppercase tracking-wide ${labelClass}`}>
            {LABEL[kind]}
          </span>
          <span className="block truncate font-semibold text-ink">{name}</span>
          <span className="block truncate text-sm text-slate-2">{affiliation}</span>
        </span>
        <Maximize2 className="size-4 shrink-0 text-slate-3 transition group-hover:text-teal-600" />
      </button>

      {/*
        Rendered into <body> rather than in place. Every ProfileCard sits inside
        a <Reveal>, whose scroll animation leaves a transform on the element —
        even the identity matrix at rest. A transformed ancestor becomes the
        containing block for `position: fixed` AND a stacking context, so an
        in-place modal was being sized and centred against its own card, clipped
        by it, and painted under the neighbouring cards regardless of z-index.
        A portal escapes both.

        `open` is only ever set by a click, so this never runs during SSR and
        the server and first client render agree.
      */}
      {open
        ? createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={name}
        >
          <div
            className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-mist bg-white p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-2 hover:bg-paper hover:text-ink"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <div className="flex items-center gap-4">
              <Avatar name={name} size={72} senior={kind === "keynote"} />
              <div>
                <p className={`text-[0.62rem] font-semibold uppercase tracking-wide ${labelClass}`}>
                  {LABEL[kind]}
                </p>
                <p className="display text-xl font-semibold text-ink">{name}</p>
                <p className="text-sm text-teal-700">{affiliation}</p>
              </div>
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-2">{role}</p>
            {bio ? <p className="mt-3 text-sm leading-6 text-slate-1">{bio}</p> : null}
            {profile ? (
              <a
                href={profile}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold text-brand transition hover:bg-paper"
              >
                View profile <ExternalLink className="size-4" />
              </a>
            ) : null}
          </div>
        </div>,
            document.body,
          )
        : null}
    </>
  );
}
