"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold text-slate-1 transition hover:bg-paper"
    >
      <LogOut className="size-4" /> Sign out
    </button>
  );
}
