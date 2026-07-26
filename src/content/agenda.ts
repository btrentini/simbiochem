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
});

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
    { id: "opening", start: "08:50", end: "09:00", title: "Opening", detail: "Organizers", status: "confirmed", kind: "ceremony" },
    { id: "keynote-1", start: "09:00", end: "09:30", title: "Keynote — Frank Noé", detail: "MSR AI for Science · FU Berlin", status: "confirmed", kind: "keynote" },
    { id: "spotlight-1", start: "09:30", end: "10:00", title: "Spotlight Talks I", detail: "From submissions · 3 × 10 min", status: "confirmed", kind: "spotlight" },
    { id: "invited-1", start: "10:00", end: "10:15", title: "Invited Talk I — Yu-Shan Lin", detail: "Tufts University", status: "confirmed", kind: "invited" },
    { id: "invited-2", start: "10:15", end: "10:30", title: "Invited Talk II — Heather J. Kulik", detail: "MIT", status: "confirmed", kind: "invited" },
    { id: "break-1", start: "10:30", end: "10:45", title: "Coffee Break + Poster Setup", detail: "Catering provided by sponsors", status: "confirmed", kind: "break" },
    { id: "poster-1", start: "10:45", end: "12:45", title: "Poster Session I + Lunch", detail: "Catering provided by sponsors", status: "confirmed", kind: "poster" },
    { id: "invited-3", start: "12:45", end: "13:00", title: "Invited Talk III — Ai Niitsu", detail: "RIKEN IMS", status: "confirmed", kind: "invited" },
    { id: "invited-4", start: "13:00", end: "13:15", title: "Invited Talk IV — John Chodera", detail: "Sloan Kettering Institute · MSKCC", status: "confirmed", kind: "invited" },
    { id: "spotlight-2", start: "13:15", end: "13:45", title: "Spotlight Talks II", detail: "From submissions · 3 × 10 min", status: "confirmed", kind: "spotlight" },
    { id: "break-2", start: "13:45", end: "14:00", title: "Coffee Break + Poster Setup", detail: "Catering provided by sponsors", status: "confirmed", kind: "break" },
    { id: "poster-2", start: "14:00", end: "16:00", title: "Poster Session II", detail: "Catering provided by sponsors", status: "confirmed", kind: "poster" },
    { id: "panel", start: "16:00", end: "16:45", title: "Panel — Agents & Simulations", detail: "Frank Noé · Anthony Costa (NVIDIA) · Kristine Deibler (Novo Nordisk) · Konstantin Hemker (OpenAI)", status: "confirmed", kind: "panel" },
    { id: "keynote-2", start: "16:45", end: "17:10", title: "Keynote — Max Welling", detail: "CuspAI · AMLab", status: "confirmed", kind: "keynote" },
    { id: "closing", start: "17:10", end: "17:30", title: "Best Paper Awards + Closing", detail: "Organizers", status: "confirmed", kind: "ceremony" },
    { id: "social", start: "18:30", end: "21:00", title: "Optional Social Event", detail: "Further networking, supported by sponsors", status: "tentative", kind: "social" },
  ],
};
