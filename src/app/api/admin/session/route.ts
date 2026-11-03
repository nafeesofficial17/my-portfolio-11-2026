import { cookies } from "next/headers";
import {
  adminConfigured,
  checkPassword,
  createSession,
  crossSiteResponse,
  isSameOrigin,
  SESSION_COOKIE,
} from "@/lib/admin/auth";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

/** POST signs in with the admin password; DELETE signs out. */

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return crossSiteResponse();
  if (!adminConfigured()) {
    return Response.json({ error: "The admin panel is off. Set ADMIN_PASSWORD to turn it on." }, { status: 503 });
  }

  if (isRateLimited(`admin-login:${clientIp(request)}`, 10, 15 * 60 * 1000)) {
    return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  if (typeof body?.password !== "string" || !checkPassword(body.password)) {
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }

  const session = createSession();
  (await cookies()).set(session.name, session.value, session.options);
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return crossSiteResponse();
  (await cookies()).delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
