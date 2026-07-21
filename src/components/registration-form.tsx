"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

export function RegistrationForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload: Record<string, FormDataEntryValue | boolean> =
      Object.fromEntries(form.entries());
    payload.consent = form.get("consent") === "on";

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus("error");
      setMessage(result.error ?? "Registration could not be submitted.");
      return;
    }

    event.currentTarget.reset();
    setStatus("sent");
    setMessage("Thank you. Your registration has been recorded.");
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20";

  return (
    <form className="grid gap-5 sm:grid-cols-2" onSubmit={submit}>
      <label className="text-sm font-medium text-slate-800">
        Full name
        <input className={inputClass} name="fullName" required minLength={2} />
      </label>
      <label className="text-sm font-medium text-slate-800">
        Email
        <input className={inputClass} name="email" type="email" required />
      </label>
      <label className="text-sm font-medium text-slate-800">
        Institution
        <input className={inputClass} name="institution" required minLength={2} />
      </label>
      <label className="text-sm font-medium text-slate-800">
        Country
        <input className={inputClass} name="country" required minLength={2} />
      </label>
      <label className="text-sm font-medium text-slate-800">
        Role
        <input className={inputClass} name="role" required minLength={2} />
      </label>
      <label className="text-sm font-medium text-slate-800">
        Attendance
        <select className={inputClass} name="attendanceType" defaultValue="in-person">
          <option value="in-person">In person</option>
          <option value="online">Online</option>
        </select>
      </label>
      <label className="text-sm font-medium text-slate-800 sm:col-span-2">
        Dietary or accessibility requirements
        <textarea className={inputClass} name="dietaryRequirements" rows={3} />
      </label>
      <label className="text-sm font-medium text-slate-800 sm:col-span-2">
        OpenReview submission ID (optional)
        <input className={inputClass} name="submissionId" />
      </label>
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="flex items-start gap-3 text-sm text-slate-700 sm:col-span-2">
        <input className="mt-1" name="consent" type="checkbox" required />
        <span>I consent to the organisers using these details to administer the workshop.</span>
      </label>
      <div className="flex items-center gap-4 sm:col-span-2">
        <Button
          type="submit"
          disabled={status === "sending"}
          className="bg-teal-800 text-white hover:bg-teal-700"
        >
          {status === "sending" ? "Submitting…" : "Register"}
        </Button>
        <p
          className={status === "error" ? "text-sm text-red-700" : "text-sm text-teal-800"}
          role="status"
        >
          {message}
        </p>
      </div>
    </form>
  );
}
