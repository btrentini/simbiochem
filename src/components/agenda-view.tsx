import Image from "next/image";

import {
  type Agenda,
  type AgendaItem,
  KIND_LABELS,
  showsKindChip,
  speakerNames,
} from "@/content/agenda";
import { Avatar } from "@/components/avatar";
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

/**
 * Fixed-width leading slot, so rows stay aligned whether or not they have a
 * face: speakers get a headshot, spotlight rows get the OpenReview mark (that
 * is where the papers come from), logistics rows stay deliberately empty.
 */
function RowMark({ item }: { item: AgendaItem }) {
  if (item.kind === "spotlight") {
    return (
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-mist bg-white">
        <Image
          src="/brand/openreview.png"
          alt="OpenReview"
          width={40}
          height={40}
          className="size-full object-contain"
        />
      </div>
    );
  }

  const names = speakerNames(item.speaker);
  if (names.length === 0) {
    return <div className="hidden size-10 shrink-0 sm:block" aria-hidden="true" />;
  }
  if (names.length === 1) {
    return <Avatar name={names[0]} size={40} className="ring-2 ring-white" />;
  }
  // Panel: overlap the faces so four people still fit the same slot.
  return (
    <div className="flex shrink-0 -space-x-3">
      {names.slice(0, 4).map((name) => (
        <Avatar key={name} name={name} size={32} className="ring-2 ring-white" />
      ))}
    </div>
  );
}

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

            <div className="flex min-w-0 flex-1 items-center gap-3.5">
              <RowMark item={item} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{item.title}</p>
                  {showsKindChip(item) ? (
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wide",
                        KIND_CHIP[item.kind] ?? KIND_CHIP.invited,
                      )}
                    >
                      {KIND_LABELS[item.kind]}
                    </span>
                  ) : null}
                </div>
                {item.detail ? (
                  <p className="mt-1 text-sm text-slate-2">{item.detail}</p>
                ) : null}
              </div>
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
