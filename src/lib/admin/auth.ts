import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

/**
 * Single-password admin sessions. The cookie holds an expiry time signed with a key derived from
 * ADMIN_PASSWORD, so changing the password signs everyone out. Server-only: never import from a client file.
 */

export const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 7;

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function sign(value: string) {
  return createHmac("sha256", `admin-session:${process.env.ADMIN_PASSWORD}`).update(value).digest("base64url");
}

function equal(a: string, b: string) {
  // Hashing first gives equal-length buffers, so the comparison takes the same time whatever the input.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export function checkPassword(password: string) {
  return adminConfigured() && equal(password, process.env.ADMIN_PASSWORD!);
}

export function createSession() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return {
    name: SESSION_COOKIE,
    value: `${expires}.${sign(String(expires))}`,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    },
  };
}

function validSession(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const [expires, signature] = token.split(".");
  return Boolean(signature) && equal(signature, sign(expires)) && Number(expires) > Date.now();
}

export async function isAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // The expiry check reads the clock, which must only happen at request time, never while prerendering.
  await connection();
  return validSession(token);
}

/** For admin pages: sends anyone without a valid session to the login page. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/**
 * True when the request was sent by a page on this site. Checking Origin on writes stops other sites
 * from submitting requests on the admin's behalf. Browsers send "null" from sandboxed pages, which fails.
 */
export function isSameOrigin(request: Request) {
  try {
    return new URL(request.headers.get("origin") ?? "").host === request.headers.get("host");
  } catch {
    return false;
  }
}

export const crossSiteResponse = () => Response.json({ error: "Cross-site request blocked." }, { status: 403 });

/** For admin API routes: returns an error response unless the request comes from a signed-in admin on this site. */
export async function guardAdminRequest(request: Request): Promise<Response | null> {
  if (request.method !== "GET" && !isSameOrigin(request)) return crossSiteResponse();
  if (!(await isAdmin())) return Response.json({ error: "Your session expired. Please sign in again." }, { status: 401 });
  return null;
}
