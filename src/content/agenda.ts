import { z } from "zod";

export const AGENDA_STATUS = ["confirmed", "tentative", "prospective"] as const;
export const AGENDA_KIND = [
  "ceremony",
  "keynote",
  "invited",
  "spotlight",
  "panel",
  "poster",
  "break",
  "social",
] as const;

export const agendaItemSchema = z.object({
  id: z.string().min(1).max(64),
  start: z.string().trim().max(12).default(""),
  end: z.string().trim().max(12).default(""),
  title: z.string().trim().min(1).max(160),
  detail: z.string().trim().max(400).default(""),
  status: z.enum(AGENDA_STATUS).default("confirmed"),
  kind: z.enum(AGENDA_KIND).default("invited"),
  /**
   * Who is on stage. Names must match the keys in content/media.ts so a
   * headshot resolves; unknown names fall back to initials. Separate multiple
   * people with "·" (the panel) and the row renders a stacked set of faces.
   */
  speaker: z.string().trim().max(200).default(""),
});

/** Split a `speaker` field into individual names. */
export function speakerNames(speaker: string): string[] {
  return speaker
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * The kind chip only earns its place when the title does not already say the
 * same thing — "Invited Talk" next to "Invited Talk — Yu-Shan Lin" was pure
 * duplication, and that repetition across every row is what made the schedule
 * feel busy.
 */
export function showsKindChip(item: { title: string; kind: AgendaItem["kind"] }): boolean {
  return !item.title.toLowerCase().includes(KIND_LABELS[item.kind].toLowerCase());
}

export const agendaSchema = z.object({
  title: z.string().trim().max(160).default("Workshop Schedule"),
  note: z.string().trim().max(400).default(""),
  updatedAt: z.string().optional(),
  items: z.array(agendaItemSchema).max(80),
});

export type AgendaItem = z.infer<typeof agendaItemSchema>;
export type Agenda = z.infer<typeof agendaSchema>;

export const KIND_LABELS: Record<(typeof AGENDA_KIND)[number], string> = {
  ceremony: "Ceremony",
  keynote: "Keynote",
  invited: "Invited Talk",
  spotlight: "Spotlight",
  panel: "Panel",
  poster: "Poster Session",
  break: "Break",
  social: "Social",
};

/** Default programme, transcribed from the accepted proposal schedule. */
export const defaultAgenda: Agenda = {
  title: "Workshop Schedule",
  note: "A full day of keynotes, invited talks, community spotlights and two poster sessions. Times are provisional and will be finalised once NeurIPS confirms the room and day.",
  items: [
    { id: "opening", start: "08:50", end: "09:00", title: "Opening", detail: "Organisers", status: "confirmed", kind: "ceremony", speaker: "" },
    { id: "keynote-1", start: "09:00", end: "09:30", title: "Keynote — Frank Noé", detail: "MSR AI for Science · FU Berlin", status: "confirmed", kind: "keynote", speaker: "Frank Noé" },
    { id: "spotlight-1", start: "09:30", end: "10:00", title: "Spotlight Talks from Accepted Papers", detail: "Three 10-minute talks chosen by the programme committee", status: "confirmed", kind: "spotlight", speaker: "" },
    { id: "invited-1", start: "10:00", end: "10:15", title: "Invited Talk — Yu-Shan Lin", detail: "Tufts University", status: "confirmed", kind: "invited", speaker: "Yu-Shan Lin" },
    { id: "invited-2", start: "10:15", end: "10:30", title: "Invited Talk — Heather J. Kulik", detail: "MIT", status: "confirmed", kind: "invited", speaker: "Heather J. Kulik" },
    { id: "break-1", start: "10:30", end: "10:45", title: "Coffee Break + Poster Setup", detail: "Catering provided by sponsors", status: "confirmed", kind: "break", speaker: "" },
    { id: "poster-1", start: "10:45", end: "12:45", title: "Poster Session I + Lunch", detail: "Catering provided by sponsors", status: "confirmed", kind: "poster", speaker: "" },
    { id: "invited-3", start: "12:45", end: "13:00", title: "Invited Talk — Ai Niitsu", detail: "RIKEN IMS", status: "confirmed", kind: "invited", speaker: "Ai Niitsu" },
    { id: "invited-4", start: "13:00", end: "13:15", title: "Invited Talk — John Chodera", detail: "Sloan Kettering Institute · MSKCC", status: "confirmed", kind: "invited", speaker: "John Chodera" },
    { id: "spotlight-2", start: "13:15", end: "13:45", title: "Spotlight Talks from Accepted Papers", detail: "Three 10-minute talks chosen by the programme committee", status: "confirmed", kind: "spotlight", speaker: "" },
    { id: "break-2", start: "13:45", end: "14:00", title: "Coffee Break + Poster Setup", detail: "Catering provided by sponsors", status: "confirmed", kind: "break", speaker: "" },
    { id: "poster-2", start: "14:00", end: "16:00", title: "Poster Session II", detail: "Catering provided by sponsors", status: "confirmed", kind: "poster", speaker: "" },
    { id: "panel", start: "16:00", end: "16:45", title: "Panel — Agents & Simulations", detail: "Frank Noé · Anthony Costa (NVIDIA) · Kristine Deibler (Novo Nordisk) · Konstantin Hemker (OpenAI)", status: "confirmed", kind: "panel", speaker: "Frank Noé · Anthony Costa · Kristine Deibler · Konstantin Hemker" },
    { id: "keynote-2", start: "16:45", end: "17:10", title: "Keynote — speaker to be confirmed", detail: "", status: "tentative", kind: "keynote", speaker: "" },
    { id: "closing", start: "17:10", end: "17:30", title: "Best Paper Awards + Closing", detail: "Organisers", status: "confirmed", kind: "ceremony", speaker: "" },
    { id: "social", start: "18:30", end: "21:00", title: "Optional Social Event", detail: "Further networking, supported by sponsors", status: "tentative", kind: "social", speaker: "" },
  ],
};
