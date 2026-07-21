import { NextResponse } from "next/server";

import { getPublicSubmissions } from "@/lib/openreview";

export const revalidate = 300;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const submissions = await getPublicSubmissions();
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Unable to load OpenReview submissions", error);
    return NextResponse.json(
      { error: "Submissions are temporarily unavailable." },
      { status: 503 },
    );
  }
}
