import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { adminConfigured } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-guard";

export const metadata: Metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) {
    redirect("/admin");
  }
  const configured = adminConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 text-brand">
          <span className="display text-xl font-semibold">
            SIMBIOCHEM <span className="text-teal-600">II</span>
          </span>
        </Link>
        <div className="mt-6 rounded-2xl border border-mist bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 text-teal-700">
            <ShieldCheck className="size-5" />
            <p className="text-sm font-semibold">Admin console</p>
          </div>
          <h1 className="display mt-3 text-xl font-semibold text-ink">Sign in to edit the agenda</h1>

          {configured ? (
            <div className="mt-6">
              <LoginForm />
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              The admin console is not configured on this deployment. Set{" "}
              <code className="rounded bg-amber-100 px-1">ADMIN_USERNAME</code>,{" "}
              <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD_HASH</code> and{" "}
              <code className="rounded bg-amber-100 px-1">SESSION_SECRET</code> (see the README),
              then restart.
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-slate-3">
          Authorised organisers only. This area is not indexed.
        </p>
      </div>
    </main>
  );
}
