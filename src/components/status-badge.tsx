import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  confirmed: "bg-accent-500/15 text-accent-700 ring-accent-500/30",
  tentative: "bg-amber-400/15 text-amber-700 ring-amber-500/30",
  prospective: "bg-slate-400/15 text-slate-600 ring-slate-400/30",
};

const LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  tentative: "Tentative",
  prospective: "Prospective",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium ring-1 ring-inset",
        STYLES[status] ?? STYLES.prospective,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {LABELS[status] ?? status}
    </span>
  );
}
