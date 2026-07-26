import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarCog, ExternalLink } from "lucide-react";

import { AgendaEditor } from "@/components/admin/agenda-editor";
import { LogoutButton } from "@/components/admin/logout-button";
import { readAgenda } from "@/lib/agenda-store";
import { getAdminSession } from "@/lib/admin-guard";

export const metadata: Metadata = {
  title: "Agenda admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  const agenda = await readAgenda();

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-mist bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="display text-lg font-semibold text-brand">
            SIMBIOCHEM <span className="text-teal-600">II</span>
            <span className="ml-2 align-middle text-xs font-normal text-slate-3">admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-2 sm:inline">
              Signed in as {session.sub}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CalendarCog className="size-6 text-teal-600" />
            <div>
              <h1 className="display text-2xl font-semibold text-ink">Edit the agenda</h1>
              <p className="text-sm text-slate-2">
                Drag to reorder, edit times and speakers, then save.
              </p>
            </div>
          </div>
          <Link
            href="/#agenda"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            View public agenda <ExternalLink className="size-4" />
          </Link>
        </div>

        <div className="mt-8">
          <AgendaEditor initial={agenda} />
        </div>
      </div>
    </main>
  );
}
