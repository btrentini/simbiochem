import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { type Agenda, agendaSchema, defaultAgenda } from "@/content/agenda";

/**
 * File-backed agenda store. The admin editor writes to data/agenda.json and the
 * public site reads from it. Designed for a single Node instance (Hostinger).
 * Falls back to the transcribed default when the file is absent or unreadable.
 */

const DATA_DIR = process.env.AGENDA_DATA_DIR
  ? path.resolve(process.env.AGENDA_DATA_DIR)
  : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "agenda.json");

export async function readAgenda(): Promise<Agenda> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return agendaSchema.parse(JSON.parse(raw));
  } catch {
    return defaultAgenda;
  }
}

export async function writeAgenda(input: unknown): Promise<Agenda> {
  const parsed = agendaSchema.parse(input);
  const withStamp: Agenda = { ...parsed, updatedAt: new Date().toISOString() };
  await mkdir(DATA_DIR, { recursive: true });
  // Write to a temp file then atomically rename, so a concurrent/failed write
  // can never leave a truncated agenda.json (which would revert to the default).
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(withStamp, null, 2), "utf8");
  await rename(tmp, DATA_FILE);
  return withStamp;
}
