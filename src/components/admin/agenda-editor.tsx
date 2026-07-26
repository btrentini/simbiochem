"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";

import {
  AGENDA_KIND,
  AGENDA_STATUS,
  type Agenda,
  type AgendaItem,
  KIND_LABELS,
  defaultAgenda,
} from "@/content/agenda";
import { CSRF_HEADER } from "@/lib/auth-constants";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function newItem(): AgendaItem {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `slot-${crypto.randomUUID().slice(0, 8)}`
      : `slot-${Math.round(performance.now())}`;
  return {
    id,
    start: "",
    end: "",
    title: "New session",
    detail: "",
    status: "tentative",
    kind: "invited",
  };
}

const fieldClass =
  "w-full rounded-md border border-mist bg-white px-2.5 py-1.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

function EditorRow({
  item,
  index,
  total,
  onChange,
  onDelete,
  onMove,
}: {
  item: AgendaItem;
  index: number;
  total: number;
  onChange: (next: AgendaItem) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="rounded-xl border border-mist bg-white p-3 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex flex-col items-center">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="rounded p-0.5 text-slate-2 hover:text-brand disabled:opacity-30"
            aria-label={`Move "${item.title}" up`}
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            onPointerDown={(e) => controls.start(e)}
            className="cursor-grab touch-none text-slate-2 hover:text-slate-1 active:cursor-grabbing"
            aria-label="Drag to reorder"
            title="Drag to reorder (or use the arrows)"
          >
            <GripVertical className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="rounded p-0.5 text-slate-2 hover:text-brand disabled:opacity-30"
            aria-label={`Move "${item.title}" down`}
          >
            <ChevronDown className="size-4" />
          </button>
        </div>

        <div className="grid flex-1 gap-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-[6rem_6rem_1fr_1fr]">
            <input
              className={fieldClass}
              value={item.start}
              placeholder="09:00"
              onChange={(e) => onChange({ ...item, start: e.target.value })}
              aria-label="Start time"
            />
            <input
              className={fieldClass}
              value={item.end}
              placeholder="09:30"
              onChange={(e) => onChange({ ...item, end: e.target.value })}
              aria-label="End time"
            />
            <select
              className={fieldClass}
              value={item.kind}
              onChange={(e) =>
                onChange({ ...item, kind: e.target.value as AgendaItem["kind"] })
              }
              aria-label="Kind"
            >
              {AGENDA_KIND.map((k) => (
                <option key={k} value={k}>
                  {KIND_LABELS[k]}
                </option>
              ))}
            </select>
            <select
              className={fieldClass}
              value={item.status}
              onChange={(e) =>
                onChange({ ...item, status: e.target.value as AgendaItem["status"] })
              }
              aria-label="Status"
            >
              {AGENDA_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <input
            className={fieldClass}
            value={item.title}
            placeholder="Session title"
            onChange={(e) => onChange({ ...item, title: e.target.value })}
            aria-label="Title"
          />
          <input
            className={fieldClass}
            value={item.detail}
            placeholder="Speaker / notes"
            onChange={(e) => onChange({ ...item, detail: e.target.value })}
            aria-label="Detail"
          />
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="mt-1 rounded-md p-1.5 text-slate-3 transition hover:bg-emphasis-600/10 hover:text-emphasis-600"
          aria-label="Delete slot"
          title="Delete slot"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </Reorder.Item>
  );
}

export function AgendaEditor({ initial }: { initial: Agenda }) {
  const [title, setTitle] = useState(initial.title);
  const [note, setNote] = useState(initial.note);
  const [items, setItems] = useState<AgendaItem[]>(initial.items);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateItem(id: string, next: AgendaItem) {
    setItems((prev) => prev.map((it) => (it.id === id ? next : it)));
    setStatus("idle");
  }
  function deleteItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setStatus("idle");
  }
  function moveItem(id: string, dir: -1 | 1) {
    setItems((prev) => {
      const i = prev.findIndex((it) => it.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    setMessage("");
    try {
      const response = await fetch("/api/admin/agenda", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          [CSRF_HEADER]: getCookie("sbc_csrf"),
        },
        body: JSON.stringify({ title, note, items }),
      });
      const result = (await response.json()) as { error?: string; agenda?: Agenda };
      if (!response.ok) {
        setStatus("error");
        setMessage(result.error ?? "Could not save.");
        return;
      }
      setStatus("saved");
      setMessage("Saved. The public agenda is updated.");
    } catch {
      setStatus("error");
      setMessage("Network error while saving.");
    }
  }

  function resetToDefault() {
    if (!confirm("Replace the current agenda with the built-in default? Unsaved edits are lost.")) {
      return;
    }
    setTitle(defaultAgenda.title);
    setNote(defaultAgenda.note);
    setItems(defaultAgenda.items.map((it) => ({ ...it })));
    setStatus("idle");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-mist bg-white p-6">
        <label className="block text-sm font-medium text-slate-1">
          Schedule title
          <input
            className={`${fieldClass} mt-2`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setStatus("idle");
            }}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-1">
          Note (shown under the title)
          <textarea
            className={`${fieldClass} mt-2`}
            rows={2}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setStatus("idle");
            }}
          />
        </label>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
        {items.map((item, i) => (
          <EditorRow
            key={item.id}
            item={item}
            index={i}
            total={items.length}
            onChange={(next) => updateItem(item.id, next)}
            onDelete={() => deleteItem(item.id)}
            onMove={(dir) => moveItem(item.id, dir)}
          />
        ))}
      </Reorder.Group>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setItems((prev) => [...prev, newItem()]);
            setStatus("idle");
          }}
          className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold text-brand transition hover:bg-paper"
        >
          <Plus className="size-4" /> Add slot
        </button>
        <button
          type="button"
          onClick={resetToDefault}
          className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold text-slate-1 transition hover:bg-paper"
        >
          <RotateCcw className="size-4" /> Reset to default
        </button>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-brand-950 transition hover:bg-accent-400 disabled:opacity-60"
        >
          {status === "saving" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save className="size-4" /> Save agenda
            </>
          )}
        </button>
        {message ? (
          <span
            className={`text-sm ${status === "error" ? "text-emphasis-600" : "text-teal-700"}`}
            role="status"
          >
            {message}
          </span>
        ) : null}
      </div>

      <p className="text-xs text-slate-2">
        Use the arrows or drag the handle to reorder slots. Times are free text (e.g. 09:00).
        Changes are written to the server&rsquo;s agenda file and appear immediately on the public
        site.
      </p>
    </div>
  );
}
