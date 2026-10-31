import { profile } from "@/data/profile";
import { parseContact, validateContact, type ContactInput } from "@/lib/contact";
import { isRateLimited } from "@/lib/rate-limit";

function emailBody(input: ContactInput) {
  return [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Company: ${input.company || "—"}`,
    `Project type: ${input.projectType || "—"}`,
    `Budget: ${input.budget || "—"}`,
    "",
    input.message,
  ].join("\n");
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many messages in a short time. Please try again later." }, { status: 429 });
  }

  // The form's longest field is a few thousand characters; refuse anything far bigger before parsing it.
  if (Number(request.headers.get("content-length") ?? 0) > 32_000) {
    return Response.json({ error: "Invalid request." }, { status: 413 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = parseContact(body);
  // A filled honeypot means a bot: report success so it doesn't retry, but send nothing.
  if (input.website) return Response.json({ ok: true });

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) return Response.json({ errors }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[contact] RESEND_API_KEY is not set, so this message was not emailed:\n" + emailBody(input));
      return Response.json({ ok: true });
    }
    return Response.json(
      { error: `The contact form isn't connected yet. Please email me at ${profile.email}.` },
      { status: 503 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || profile.email],
      reply_to: input.email,
      subject: `New project inquiry from ${input.name}`,
      text: emailBody(input),
    }),
  });

  if (!response.ok) {
    console.error("[contact] Resend rejected the message:", response.status, await response.text());
    return Response.json(
      { error: `Something went wrong sending your message. Please email me at ${profile.email}.` },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
