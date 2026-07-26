import { NextRequest, NextResponse } from "next/server";

import { appendRegistration } from "@/lib/google-sheets";
import { RateLimiter, clientKey } from "@/lib/rate-limit";
import { registrationSchema } from "@/lib/registration";
import { serverEnv } from "@/lib/server-env";

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
  if (!serverEnv.REGISTRATION_ENABLED) {
    return json({ error: "Registration is not currently open." }, 503);
  }

  if (!hasAllowedOrigin(request)) {
    return json({ error: "Request origin is not allowed." }, 403);
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "Content-Type must be application/json." }, 415);
  }

  if (limiter.limited(clientKey(request))) {
    return json(
      { error: "Too many registration attempts. Please try again later." },
      429,
      { "Retry-After": String(Math.ceil(WINDOW_MS / 1000)) },
    );
  }

  let payload: unknown;
  try {
    payload = await readJsonBody(request);
  } catch (error) {
    if (error instanceof RangeError) {
      return json({ error: "Registration request is too large." }, 413);
    }
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  const parsed = registrationSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      { error: "Please check the registration details.", issues: parsed.error.issues },
      400,
    );
  }

  try {
    await appendRegistration(parsed.data);
    return json({ ok: true }, 201);
  } catch (error) {
    console.error("Unable to save registration", error);
    return json(
      { error: "Registration could not be saved. Please try again." },
      503,
    );
  }
}
