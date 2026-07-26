import "server-only";

/**
 * Best-effort, process-local rate limiting.
 *
 * The client key is taken from the RIGHT-most X-Forwarded-For entry (the value
 * appended by the trusted proxy), not the left-most one which the client can
 * set freely. The map is bounded and self-sweeping so distinct-key floods can't
 * grow memory without bound. This is a mitigation, not a guarantee — behind
 * multiple proxies or multiple instances, add a CAPTCHA or shared store.
 */

const MAX_ENTRIES = 20_000;

export function clientKey(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export class RateLimiter {
  private hits = new Map<string, { count: number; resetAt: number }>();
  private lastSweep = 0;

  constructor(
    private readonly windowMs: number,
    private readonly max: number,
  ) {}

  private sweep(now: number) {
    if (now - this.lastSweep < this.windowMs && this.hits.size < MAX_ENTRIES) return;
    this.lastSweep = now;
    for (const [key, rec] of this.hits) {
      if (rec.resetAt <= now) this.hits.delete(key);
    }
    // Hard cap: if still oversized, drop oldest-resetting entries.
    if (this.hits.size >= MAX_ENTRIES) {
      const sorted = [...this.hits.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
      for (let i = 0; i < sorted.length - MAX_ENTRIES / 2; i++) {
        this.hits.delete(sorted[i][0]);
      }
    }
  }

  /** Returns true when the key is over the limit for the current window. */
  limited(key: string, now = Date.now()): boolean {
    this.sweep(now);
    const rec = this.hits.get(key);
    if (!rec || rec.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return false;
    }
    rec.count += 1;
    return rec.count > this.max;
  }
}
