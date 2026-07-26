import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/** Returns the admin subject when a valid session cookie is present, else null. */
export async function getAdminSession(): Promise<{ sub: string } | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
