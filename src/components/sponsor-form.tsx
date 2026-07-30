"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";

import { SPONSOR_PREFILL } from "@/lib/sponsor";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-mist bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";
const labelClass = "block text-sm font-medium text-slate-1";

export function SponsorForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  // This form renders twice on the home page — inline and inside the sponsor
  // drawer — so ids must be per-instance or the duplicates break every
  // <label for> association.
  const uid = useId();

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Captured synchronously: React nulls currentTarget after the first await.
    const formEl = event.currentTarget;
    const form = new FormData(formEl);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          company: String(form.get("company") ?? ""),
          contact: String(form.get("contact") ?? ""),
          message: String(form.get("message") ?? ""),
          website: String(form.get("website") ?? ""),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(result.error ?? "Your message could not be sent.");
        return;
      }
      formEl.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-teal-200 bg-teal-50 p-7 text-center outline-none"
      >
        <p className="display text-lg font-semibold text-teal-800">
          Thank you for your interest
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-teal-900/80">
          A member of SIMBIOCHEM&rsquo;s organiser team will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={compact ? "grid gap-4" : "grid gap-4"}>
      <div>
        <label className={labelClass} htmlFor={`sp-name-${uid}`}>
          Name <span className="text-emphasis-600">*</span>
        </label>
        <input id={`sp-name-${uid}`} name="name" className={inputClass} required minLength={2} maxLength={120} />
      </div>

      <div>
        <label className={labelClass} htmlFor={`sp-company-${uid}`}>
          Company <span className="text-emphasis-600">*</span>
        </label>
        <input id={`sp-company-${uid}`} name="company" className={inputClass} required maxLength={200} />
      </div>

      <div>
        <label className={labelClass} htmlFor={`sp-contact-${uid}`}>
          Contact <span className="text-emphasis-600">*</span>
        </label>
        <input
          id={`sp-contact-${uid}`}
          name="contact"
          className={inputClass}
          required
          minLength={3}
          maxLength={200}
          aria-describedby={`sp-contact-hint-${uid}`}
        />
        <span id={`sp-contact-hint-${uid}`} className="mt-1 block text-xs text-slate-2">
          Email, phone or a profile link — whatever suits you.
        </span>
      </div>

      <div>
        <label className={labelClass} htmlFor={`sp-message-${uid}`}>
          Message <span className="text-emphasis-600">*</span>
        </label>
        <textarea
          id={`sp-message-${uid}`}
          name="message"
          rows={compact ? 3 : 4}
          className={inputClass}
          required
          minLength={2}
          maxLength={2000}
          defaultValue={SPONSOR_PREFILL}
        />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`sp-website-${uid}`}>Website</label>
        <input id={`sp-website-${uid}`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" ? (
        <p role="alert" className="text-sm leading-6 text-emphasis-600">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-brand-950 transition hover:bg-accent-400 disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send <Send className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
