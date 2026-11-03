/**
 * Best-effort, in-memory rate limiting. Each server instance keeps its own window, so on
 * serverless hosts this slows down spam rather than guaranteeing a hard limit.
 */
const hits = new Map<string, number[]>();

/** The visitor's IP as reported by the host's proxy (the first x-forwarded-for entry). */
export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function isRateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  // Forget visitors whose hits have all expired, so the map can't grow without bound.
  if (hits.size > 1000) {
    for (const [other, times] of hits) {
      if (times.every((time) => now - time >= windowMs)) hits.delete(other);
    }
  }
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}
