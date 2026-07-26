import { type Agenda, KIND_LABELS } from "@/content/agenda";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

const KIND_CHIP: Record<string, string> = {
  keynote: "bg-brand text-white",
  panel: "bg-brand-700 text-white",
  invited: "bg-teal-500/15 text-teal-700 ring-1 ring-inset ring-teal-500/25",
  spotlight: "bg-accent-500/15 text-accent-700 ring-1 ring-inset ring-accent-500/30",
  ceremony: "bg-slate-200 text-slate-1",
  poster: "bg-teal-500/10 text-teal-700 ring-1 ring-inset ring-teal-500/20",
  break: "bg-slate-100 text-slate-2",
  social: "bg-emphasis-600/10 text-emphasis-600 ring-1 ring-inset ring-emphasis-600/20",
};

const LOGISTICS = new Set(["break", "poster", "social"]);

export function AgendaView({ agenda }: { agenda: Agenda }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist bg-white">
      <ul>
        {agenda.items.map((item, i) => (
          <li
            key={item.id}
            className={cn(
              "flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-5",
              i !== 0 && "border-t border-mist",
              LOGISTICS.has(item.kind) && "bg-paper/60",
            )}
          >
            <div className="w-32 shrink-0 font-mono text-sm text-slate-2">
              {item.start}
              {item.end ? <span className="text-slate-3"> – {item.end}</span> : null}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wide",
                    KIND_CHIP[item.kind] ?? KIND_CHIP.invited,
                  )}
                >
                  {KIND_LABELS[item.kind]}
                </span>
                <p className="font-semibold text-ink">{item.title}</p>
              </div>
              {item.detail ? (
                <p className="mt-1 text-sm text-slate-2">{item.detail}</p>
              ) : null}
            </div>
            <div className="shrink-0">
              {!LOGISTICS.has(item.kind) ? <StatusBadge status={item.status} /> : null}
            </div>
          </li>
        ))}
      </ul>
      {agenda.updatedAt ? (
        <p className="border-t border-mist px-5 py-3 text-xs text-slate-2">
          Programme last updated{" "}
          {new Date(agenda.updatedAt).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          . Times provisional pending NeurIPS scheduling.
        </p>
      ) : null}
    </div>
  );
}
