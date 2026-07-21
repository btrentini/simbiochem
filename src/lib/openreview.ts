import "server-only";

import { z } from "zod";

import { serverEnv } from "@/lib/server-env";

const wrappedValue = <T extends z.ZodType>(schema: T) =>
  z.union([schema, z.object({ value: schema })]).optional();

const noteSchema = z.object({
  id: z.string(),
  forum: z.string().optional(),
  content: z
    .object({
      title: wrappedValue(z.string()),
      authors: wrappedValue(z.array(z.string())),
      abstract: wrappedValue(z.string()),
      keywords: wrappedValue(z.array(z.string())),
      venue: wrappedValue(z.string()),
      venueid: wrappedValue(z.string()),
    })
    .passthrough(),
});

const responseSchema = z.object({
  notes: z.array(noteSchema).default([]),
});

function unwrap<T>(value: T | { value: T } | undefined): T | undefined {
  if (value && typeof value === "object" && "value" in value) {
    return value.value;
  }
  return value;
}

export type PublicSubmission = {
  id: string;
  forumId: string;
  title: string;
  authors: string[];
  abstract?: string;
  keywords: string[];
  decision?: string;
  pdfUrl: string;
  forumUrl: string;
};

export async function getPublicSubmissions(): Promise<PublicSubmission[]> {
  const invitation = serverEnv.OPENREVIEW_SUBMISSION_INVITATION;
  const venue = serverEnv.OPENREVIEW_VENUE_ID;

  if (!invitation && !venue) {
    throw new Error("OpenReview venue configuration is missing.");
  }

  const url = new URL("/notes", serverEnv.OPENREVIEW_API_URL);
  url.searchParams.set(invitation ? "invitation" : "content.venueid", invitation ?? venue!);
  url.searchParams.set("limit", "1000");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`OpenReview returned ${response.status}.`);
  }

  const parsed = responseSchema.parse(await response.json());

  return parsed.notes.map((note) => {
    const forumId = note.forum ?? note.id;
    return {
      id: note.id,
      forumId,
      title: unwrap(note.content.title) ?? "Untitled submission",
      authors: unwrap(note.content.authors) ?? [],
      abstract: unwrap(note.content.abstract),
      keywords: unwrap(note.content.keywords) ?? [],
      decision: unwrap(note.content.venue),
      pdfUrl: `https://openreview.net/pdf?id=${encodeURIComponent(note.id)}`,
      forumUrl: `https://openreview.net/forum?id=${encodeURIComponent(forumId)}`,
    };
  });
}
