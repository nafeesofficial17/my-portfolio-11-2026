import Anthropic from "@anthropic-ai/sdk";
import { profile } from "@/data/profile";
import { assistantSystemPrompt } from "@/lib/assistant";
import { CHAT_LIMITS } from "@/lib/assistant-limits";
import { isRateLimited } from "@/lib/rate-limit";

/**
 * "Ask my AI" endpoint. Streams newline-delimited JSON events to the widget:
 *   {"type":"text","text":"..."}   a chunk of the answer
 *   {"type":"reset"}               discard what was streamed so far (declined mid-answer)
 *   {"type":"error","message":"..."}
 *   {"type":"done"}
 */

const MODEL = process.env.CHAT_MODEL || "claude-opus-5-5";

let client: Anthropic | undefined;
function getClient() {
  // Created lazily so the build doesn't need credentials. Reads ANTHROPIC_API_KEY.
  client ??= new Anthropic();
  return client;
}

const unavailable = `The assistant is unavailable right now. Please use the contact form or email ${profile.email}.`;

function parseMessages(body: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > CHAT_LIMITS.maxMessages) return null;

  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const [i, item] of raw.entries()) {
    const { role, content } = (item ?? {}) as { role?: unknown; content?: unknown };
    // Turns must alternate user/assistant, starting and ending with the visitor.
    const expected = i % 2 === 0 ? "user" : "assistant";
    if (role !== expected || typeof content !== "string") return null;
    const text = content.trim();
    if (!text || text.length > CHAT_LIMITS.maxMessageLength) return null;
    messages.push({ role: expected, content: text });
  }
  return messages.at(-1)?.role === "user" ? messages : null;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`chat:${ip}`, 20, 10 * 60 * 1000)) {
    return Response.json(
      { error: "You've asked a lot of questions in a short time. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const messages = parseMessages(body);
  if (!messages) return Response.json({ error: "Invalid conversation." }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: object) => {
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        } catch {
          // The visitor disconnected mid-answer.
        }
      };
      try {
        const answer = getClient().beta.messages.stream(
          {
            model: MODEL,
            // Answers are short; this mainly caps the cost of any single request.
            max_tokens: 4096,
            // Chat Q&A doesn't need deep reasoning; low effort keeps replies fast and cheap.
            output_config: { effort: "low" },
            system: [{ type: "text", text: assistantSystemPrompt, cache_control: { type: "ephemeral" } }],
            messages,
            // If a safety classifier declines, the API retries on Anthropic's recommended fallback model.
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
          },
          { signal: request.signal },
        );

        for await (const event of answer) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send({ type: "text", text: event.delta.text });
          }
        }

        const final = await answer.finalMessage();
        if (final.stop_reason === "refusal") {
          // Even the fallback declined. Drop any partial answer and point to a human instead.
          send({ type: "reset" });
          send({
            type: "error",
            message: `I can't help with that one. For anything about working with ${profile.name}, use the contact form or email ${profile.email}.`,
          });
        }
        send({ type: "done" });
      } catch (error) {
        if (request.signal.aborted) return; // The visitor closed the chat; nothing to report.
        if (error instanceof Anthropic.RateLimitError) {
          send({ type: "error", message: "The assistant is busy right now. Please try again in a moment." });
        } else {
          console.error("[chat]", error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error);
          send({ type: "error", message: unavailable });
        }
      } finally {
        try {
          controller.close();
        } catch {
          // Already closed because the client disconnected.
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
