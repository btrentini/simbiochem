"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      if (response.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const result = (await response.json()) as { error?: string };
      setStatus("error");
      setMessage(result.error ?? "Sign-in failed.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-mist bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-medium text-slate-1">
        Username
        <input className={inputClass} name="username" autoComplete="username" required />
      </label>
      <label className="block text-sm font-medium text-slate-1">
        Password
        <input
          className={inputClass}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Signing in…
          </>
        ) : (
          <>
            <Lock className="size-4" /> Sign in
          </>
        )}
      </button>
      {message ? (
        <p className="text-center text-sm text-emphasis-600" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
