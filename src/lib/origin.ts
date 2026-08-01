import "server-only";

import type { NextRequest } from "next/server";

import { serverEnv } from "@/lib/server-env";

/**
 * Same-origin check for form posts.
 *
 * SITE_URL is a single canonical origin (https://simbiochem.com), but the site
 * is reachable on both the apex and www — nginx serves both and the TLS
 * certificate covers both. Comparing against SITE_URL alone therefore rejected
 * every submission made from www with "Request origin is not allowed".
 *
 * So the allowed set is the configured origin plus its www/apex counterpart.
 * Nothing else is accepted: an unknown host, a different scheme or a missing
 * Origin header all still fail.
 */
function allowedOrigins(request: NextRequest): Set<string> {
  const base = serverEnv.SITE_URL ?? request.nextUrl.origin;
  const set = new Set<string>();
  try {
    const url = new URL(base);
    set.add(url.origin);
    const host = url.host;
    const counterpart = host.startsWith("www.")
      ? host.slice(4)
      : `www.${host}`;
    set.add(`${url.protocol}//${counterpart}`);
  } catch {
    // Malformed SITE_URL: fall back to the request's own origin only.
    set.add(request.nextUrl.origin);
  }
  return set;
}

export function hasAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return allowedOrigins(request).has(new URL(origin).origin);
  } catch {
    return false;
  }
}
