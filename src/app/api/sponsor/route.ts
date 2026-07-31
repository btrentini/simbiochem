import { NextRequest, NextResponse } from "next/server";

import { appendSponsorEnquiry } from "@/lib/google-sheets";
import { mailConfigured, sendSponsorEnquiry } from "@/lib/mailer";
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

function hasAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const expectedOrigin = serverEnv.SITE_URL
      ? new URL(serverEnv.SITE_URL).origin
      : request.nextUrl.origin;
    return new URL(origin).origin === expectedOrigin;
  } catch {
    return false;
  }
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
  if (!serverEnv.SPONSOR_ENABLED || !mailConfigured()) {
    return json(
      {
        error:
          "The enquiry form is not available right now. Please email workshop@simbiochem.com instead.",
      },
      503,
    );
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

  try {
    // Email is the delivery mechanism the organisers actually watch. The
    // spreadsheet, if credentials happen to be configured, is a best-effort
    // second copy — never let it fail the request.
    await sendSponsorEnquiry(parsed.data);
    void appendSponsorEnquiry(parsed.data).catch((err) =>
      console.warn("Sponsor enquiry emailed but not logged to Sheets", err),
    );
    return json({ ok: true }, 201);
  } catch (error) {
    console.error("Unable to send sponsorship enquiry", error);
    return json(
      {
        error:
          "Your message could not be sent. Please email workshop@simbiochem.com instead.",
      },
      503,
    );
  }
}
