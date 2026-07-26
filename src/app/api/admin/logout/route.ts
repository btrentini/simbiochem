import { NextRequest, NextResponse } from "next/server";

import { CSRF_COOKIE, SESSION_COOKIE } from "@/lib/auth";
import { serverEnv } from "@/lib/server-env";

export const runtime = "nodejs";

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

export async function POST(request: NextRequest) {
  if (!hasAllowedOrigin(request)) {
    return NextResponse.json(
      { error: "Request origin is not allowed." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const response = NextResponse.json(
    { ok: true },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(CSRF_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
