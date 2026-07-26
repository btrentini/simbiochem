import { NextRequest, NextResponse } from "next/server";

import { readAgenda, writeAgenda } from "@/lib/agenda-store";
import {
  CSRF_COOKIE,
  CSRF_HEADER,
  SESSION_COOKIE,
  csrfOk,
  verifySessionToken,
} from "@/lib/auth";
import { serverEnv } from "@/lib/server-env";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 64 * 1024;

function noStore(body: object, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function requireSession(request: NextRequest) {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}

function hasAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const expected = serverEnv.SITE_URL
      ? new URL(serverEnv.SITE_URL).origin
      : request.nextUrl.origin;
    return new URL(origin).origin === expected;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!requireSession(request)) {
    return noStore({ error: "Not authenticated." }, 401);
  }
  const agenda = await readAgenda();
  return noStore({ agenda }, 200);
}

export async function PUT(request: NextRequest) {
  if (!requireSession(request)) {
    return noStore({ error: "Not authenticated." }, 401);
  }
  if (!hasAllowedOrigin(request)) {
    return noStore({ error: "Request origin is not allowed." }, 403);
  }
  if (
    !csrfOk(
      request.cookies.get(CSRF_COOKIE)?.value,
      request.headers.get(CSRF_HEADER) ?? undefined,
    )
  ) {
    return noStore({ error: "Invalid CSRF token." }, 403);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return noStore({ error: "Payload too large." }, 413);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return noStore({ error: "Invalid JSON." }, 400);
  }

  try {
    const agenda = await writeAgenda(payload);
    return noStore({ ok: true, agenda }, 200);
  } catch (error) {
    console.error("Unable to save agenda", error);
    return noStore(
      { error: "The agenda could not be saved. Check the fields and retry." },
      400,
    );
  }
}
