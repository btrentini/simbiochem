"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { CoiNotice } from "@/components/coi-notice";
import { VOLUNTEER_LEVELS, VOLUNTEER_TRACKS } from "@/lib/volunteer";

const inputClass =
  "mt-2 w-full rounded-lg border border-mist bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";
const hintClass = "mt-1 block text-xs font-normal text-slate-2";
const labelClass = "block text-sm font-medium text-slate-1";

/** Field name -> the label the person actually sees on screen. */
const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name",
  affiliation: "Institution, Department, Role",
  email: "Institutional email",
  level: "Current level",
  tracks: "Preferred tracks",
  expertise: "Tags of expertise",
  profileUrl: "Link to your professional profile",
  openReviewId: "OpenReview ID",
  agreement: "Acknowledgement",
};

type Issue = { path?: (string | number)[]; message?: string };

/**
 * The API returns Zod's issues, which name the offending field. Throwing them
 * away and showing "Please check the form details" left people re-reading a
 * form that looked completely correct. Turn them into per-field messages.
 */
function describeIssues(issues: Issue[]): string {
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const issue of issues) {
    const field = String(issue.path?.[0] ?? "");
    if (!field || seen.has(field)) continue;
    seen.add(field);
    // Messages already end in punctuation; do not staple another full stop on.
    const text = (issue.message ?? "Please check this field.").replace(/\.$/, "");
    parts.push(`${FIELD_LABELS[field] ?? field} — ${text}`);
  }
  if (!parts.length) return "Please check the form details and try again.";
  return parts.length === 1
    ? `${parts[0]}.`
    : `Please check these fields. ${parts.join(". ")}.`;
}

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

    // The form sets noValidate, so the checkbox's `required` attribute is not
    // enforced by the browser. Without this the request goes out and comes
    // back as a generic 400 — the server does reject it, but the person is
    // never told why. Nobody joins the committee without acknowledging.
    if (form.get("agreement") !== "on") {
      setStatus("error");
      setMessage(
        "Please tick the acknowledgement — we cannot accept a sign-up without it.",
      );
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
      openReviewId: form.get("openReviewId") ?? "",
      agreement: form.get("agreement") === "on",
      website: form.get("website") ?? "",
    };

    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; issues?: Issue[] };
      if (!response.ok) {
        setStatus("error");
        setMessage(
          result.issues?.length
            ? describeIssues(result.issues)
            : (result.error ?? "Your sign-up could not be submitted."),
        );
        return;
      }
      formEl.reset();
      setStatus("sent");
      setMessage(
        "Your details are with the organising team. We read every one, and once submissions are in we will get in touch where someone's expertise lines up well with the papers we receive. Either way, thank you for offering your time — it is what keeps the workshop running.",
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
        <p className="display text-xl font-semibold text-teal-800">Thank you for offering to help</p>
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
          However you would like to be credited on the website. Preferred or
          shortened names are completely fine.
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
          In that order, comma-separated — e.g. &ldquo;Tufts University, Chemistry,
          Postdoc&rdquo;. Separate a second affiliation with a semicolon, and write
          &ldquo;unaffiliated&rdquo; if none applies. We use this to spot conflicts of
          interest before assigning you anything.
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
          Please use the address on your OpenReview account — that is how
          review invitations reach you, and a mismatch is the single most common
          reason someone never gets assigned. An institutional address is also
          less likely to be filtered as spam.
        </span>
      </div>

      <div>
        <label className={labelClass} htmlFor="v-level">
          Current level <span className="text-emphasis-600">*</span>
        </label>
        <select
          id="v-level"
          className={inputClass}
          name="level"
          required
          defaultValue=""
          aria-describedby="v-level-hint"
        >
          <option value="" disabled>
            Select…
          </option>
          {VOLUNTEER_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <span id="v-level-hint" className={hintClass}>
          Reviewers of every level are welcome — this only helps us balance the
          load across the committee.
        </span>
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
              <input
                type="checkbox"
                name="tracks"
                value={track}
                className="accent-teal-600"
                aria-describedby="v-tracks-hint"
              />
              {track}
            </label>
          ))}
        </div>
        <span id="v-tracks-hint" className={hintClass}>
          Pick both if your work spans them. The more you tick, the more we have
          to match you against.
        </span>
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
          aria-describedby="v-expertise-hint"
        />
        <span id="v-expertise-hint" className={hintClass}>
          Comma-separated keywords. This is the field we actually match papers
          against, so specific beats broad — &ldquo;free energy perturbation&rdquo; is
          more useful to us than &ldquo;chemistry&rdquo;.
        </span>
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
          Somewhere we can see your recent work. Google Scholar is ideal;
          LinkedIn, GitHub or a personal page are all fine.
        </span>
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="v-openReviewId">
          OpenReview ID <span className="font-normal text-slate-3">(optional)</span>
        </label>
        <input
          id="v-openReviewId"
          className={inputClass}
          name="openReviewId"
          maxLength={100}
          placeholder="~Firstname_Lastname1"
          aria-describedby="v-openReviewId-hint"
        />
        <span id="v-openReviewId-hint" className={hintClass}>
          If you know it, this saves us matching you by hand. You will find it on
          your OpenReview profile page — it starts with a tilde.
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
          I agree to review under the workshop&rsquo;s conflict-of-interest and
          confidentiality terms, and consent to the organisers using these details to
          coordinate the Programme Committee. <span className="text-emphasis-600">*</span>
          <span className="mt-1 block text-xs font-normal">
            <CoiNotice />
          </span>
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
              <Loader2 className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            "Submit my details"
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
