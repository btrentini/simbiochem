import { NextRequest, NextResponse } from "next/server";

import { appendSponsorEnquiry } from "@/lib/google-sheets";
import { mailConfigured, sendSponsorEnquiry } from "@/lib/mailer";
import { hasAllowedOrigin } from "@/lib/origin";
import { RateLimiter, clientKey } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/server-env";
import { sponsorEnquirySchema } from "@/lib/sponsor";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 16 * 1024;
const limiter = new RateLimiter(WINDOW_MS, 5);

export const runtime = "nodejs";

function json(body: object, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

async function readJsonBody(request: NextRequest): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new RangeError("Request body is too large.");
  }

  const reader = request.body?.getReader();
  if (!reader) return null;

  const chunks: Uint8Array[] = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RangeError("Request body is too large.");
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
}

export async function POST(request: NextRequest) {
  if (!serverEnv.SPONSOR_ENABLED) {
    return json({ error: "Sponsorship enquiries are not currently open." }, 503);
  }

  if (!hasAllowedOrigin(request)) {
    return json({ error: "Request origin is not allowed." }, 403);
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "Content-Type must be application/json." }, 415);
  }

  if (limiter.limited(clientKey(request))) {
    return json({ error: "Too many attempts. Please try again later." }, 429, {
      "Retry-After": String(Math.ceil(WINDOW_MS / 1000)),
    });
  }

  let payload: unknown;
  try {
    payload = await readJsonBody(request);
  } catch (error) {
    if (error instanceof RangeError) {
      return json({ error: "The request is too large." }, 413);
    }
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  const parsed = sponsorEnquirySchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      { error: "Please check the form details.", issues: parsed.error.issues },
      400,
    );
  }

  // Two independent sinks: the spreadsheet the organisers curate, and the
  // shared inbox they watch. Both are attempted, and the enquiry counts as
  // delivered if either lands — losing a sponsor's message because one of
  // them is misconfigured would be the worst outcome here.
  const [sheet, mail] = await Promise.allSettled([
    appendSponsorEnquiry(parsed.data),
    mailConfigured()
      ? sendSponsorEnquiry(parsed.data)
      : Promise.reject(new Error("SMTP is not configured.")),
  ]);

  if (sheet.status === "rejected") {
    console.error("Sponsor enquiry: sheet write failed", sheet.reason);
  }
  if (mail.status === "rejected") {
    console.error("Sponsor enquiry: email failed", mail.reason);
  }

  if (sheet.status === "fulfilled" || mail.status === "fulfilled") {
    return json({ ok: true }, 201);
  }

  return json(
    {
      error:
        "Your message could not be sent. Please email workshop@simbiochem.com instead.",
    },
    503,
  );
}
