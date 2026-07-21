import { NextRequest, NextResponse } from "next/server";

import { appendRegistration } from "@/lib/google-sheets";
import { registrationSchema } from "@/lib/registration";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const requests = new Map<string, { count: number; resetAt: number }>();

export const runtime = "nodejs";

function isRateLimited(key: string) {
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429 },
    );
  }

  const payload: unknown = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the registration details.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    await appendRegistration(parsed.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Unable to save registration", error);
    return NextResponse.json(
      { error: "Registration could not be saved. Please try again." },
      { status: 503 },
    );
  }
}
