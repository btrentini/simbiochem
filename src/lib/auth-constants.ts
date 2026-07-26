/**
 * Cookie / header names shared between server auth and client fetches.
 * Kept free of "server-only" and node:crypto so client components can import it.
 */
export const SESSION_COOKIE = "sbc_admin";
export const CSRF_COOKIE = "sbc_csrf";
export const CSRF_HEADER = "x-sbc-csrf";
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours
