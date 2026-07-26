"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { VOLUNTEER_LEVELS, VOLUNTEER_TRACKS } from "@/lib/volunteer";

const inputClass =
  "mt-2 w-full rounded-lg border border-mist bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";
const hintClass = "mt-1 block text-xs font-normal text-slate-2";
const labelClass = "block text-sm font-medium text-slate-1";

export function VolunteerForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Capture the element synchronously: React nulls event.currentTarget after
    // the first await, so it is unsafe to read once the fetch resolves.
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const tracks = form.getAll("tracks").map(String);

    if (tracks.length === 0) {
      setStatus("error");
      setMessage("Please select at least one preferred track.");
      return;
    }

    setStatus("sending");
    setMessage("");

    const payload = {
      fullName: form.get("fullName"),
      affiliation: form.get("affiliation"),
      email: form.get("email"),
      level: form.get("level"),
      tracks,
      expertise: form.get("expertise"),
      profileUrl: form.get("profileUrl"),
      agreement: form.get("agreement") === "on",
      website: form.get("website") ?? "",
    };

    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(result.error ?? "Your sign-up could not be submitted.");
        return;
      }
      formEl.reset();
      setStatus("sent");
      setMessage(
        "Thank you — your Programme Committee sign-up has been recorded. We'll be in touch about review assignments.",
      );
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
        className="rounded-2xl border border-teal-200 bg-teal-50 p-8 text-center outline-none"
      >
        <p className="display text-xl font-semibold text-teal-800">You&rsquo;re on the list</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-teal-900/80">{message}</p>
      </div>
    );
  }

  return (
    <form className="grid gap-5 sm:grid-cols-2" onSubmit={submit} noValidate>
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="v-fullName">
          Full name <span className="text-emphasis-600">*</span>
        </label>
        <input
          id="v-fullName"
          className={inputClass}
          name="fullName"
          required
          minLength={2}
          maxLength={120}
          aria-describedby="v-fullName-hint"
        />
        <span id="v-fullName-hint" className={hintClass}>
          Please abbreviate middle names or use your preferred first and last names.
        </span>
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="v-affiliation">
          Institution, Department, Role <span className="text-emphasis-600">*</span>
        </label>
        <textarea
          id="v-affiliation"
          className={inputClass}
          name="affiliation"
          required
          rows={2}
          maxLength={400}
          aria-describedby="v-affiliation-hint"
        />
        <span id="v-affiliation-hint" className={hintClass}>
          Comma-separated; separate multiple affiliations with semicolons. Use
          &ldquo;unaffiliated&rdquo; if applicable.
        </span>
      </div>

      <div>
        <label className={labelClass} htmlFor="v-email">
          Institutional email <span className="text-emphasis-600">*</span>
        </label>
        <input
          id="v-email"
          className={inputClass}
          name="email"
          type="email"
          required
          maxLength={254}
          aria-describedby="v-email-hint"
        />
        <span id="v-email-hint" className={hintClass}>
          One email only. Institutional preferred over Gmail/Outlook/QQ/Yahoo.
        </span>
      </div>

      <div>
        <label className={labelClass} htmlFor="v-level">
          Current level <span className="text-emphasis-600">*</span>
        </label>
        <select id="v-level" className={inputClass} name="level" required defaultValue="">
          <option value="" disabled>
            Select…
          </option>
          {VOLUNTEER_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-medium text-slate-1">
          Preferred tracks <span className="text-emphasis-600">*</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {VOLUNTEER_TRACKS.map((track) => (
            <label
              key={track}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-mist bg-white px-4 py-2.5 text-sm font-normal shadow-sm has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50"
            >
              <input type="checkbox" name="tracks" value={track} className="accent-teal-600" />
              {track}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="v-expertise">
          Tags of expertise <span className="text-emphasis-600">*</span>
        </label>
        <input
          id="v-expertise"
          className={inputClass}
          name="expertise"
          required
          maxLength={400}
          placeholder="e.g. Diffusion Models, Protein Folding, QM/MM, DFT, Bayesian Methods, MLIPs"
        />
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="v-profileUrl">
          Link to your professional profile <span className="text-emphasis-600">*</span>
        </label>
        <input
          id="v-profileUrl"
          className={inputClass}
          name="profileUrl"
          type="url"
          required
          maxLength={300}
          placeholder="https://scholar.google.com/…"
          aria-describedby="v-profileUrl-hint"
        />
        <span id="v-profileUrl-hint" className={hintClass}>
          Google Scholar preferred; LinkedIn, GitHub or a personal website also fine.
        </span>
      </div>

      {/* Honeypot */}
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="flex items-start gap-3 text-sm font-normal text-slate-1 sm:col-span-2">
        <input className="mt-1 accent-teal-600" name="agreement" type="checkbox" required />
        <span>
          I understand and agree to review under the workshop&rsquo;s COI handling and
          confidentiality terms, and consent to the organisers using these details to
          coordinate the Programme Committee. <span className="text-emphasis-600">*</span>
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Submitting…
            </>
          ) : (
            "Join the Programme Committee"
          )}
        </button>
        <p
          className={status === "error" ? "text-sm text-emphasis-600" : "text-sm text-teal-700"}
          role={status === "error" ? "alert" : "status"}
          aria-live={status === "error" ? "assertive" : "polite"}
        >
          {message}
        </p>
      </div>
    </form>
  );
}
