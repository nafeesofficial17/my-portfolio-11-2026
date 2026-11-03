import { profile } from "@/data/profile";
import { assistantSystemPrompt } from "@/lib/assistant";
import { CHAT_LIMITS } from "@/lib/assistant-limits";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

/**
 * "Ask my AI" endpoint. Talks to any OpenAI-compatible chat API (Groq, Cerebras, OpenRouter…) and streams
 * newline-delimited JSON events to the widget:
 *   {"type":"text","text":"..."}   a chunk of the answer
 *   {"type":"reset"}               discard what was streamed so far (the next provider starts over)
 *   {"type":"error","message":"..."}
 *   {"type":"done"}
 */

// 12 messages of 1,500 characters each fit well under this; anything bigger isn't from the widget.
const MAX_BODY_BYTES = 64_000;

interface Provider {
  baseUrl: string;
  apiKey: string;
  model: string;
}

/**
 * The main provider, then an optional fallback that takes over when the first is rate-limited or down.
 * Free tiers have small per-minute limits, so a second free provider keeps the chat answering under load.
 */
function providers(): Provider[] {
  const candidates = [
    {
      baseUrl: process.env.CHAT_BASE_URL || "https://api.groq.com/openai/v1",
      apiKey: process.env.CHAT_API_KEY,
      model: process.env.CHAT_MODEL || "openai/gpt-oss-120b",
    },
    {
      baseUrl: process.env.CHAT_FALLBACK_BASE_URL,
      apiKey: process.env.CHAT_FALLBACK_API_KEY,
      model: process.env.CHAT_FALLBACK_MODEL,
    },
  ];
  return candidates.filter((p): p is Provider => Boolean(p.baseUrl && p.apiKey && p.model));
}

type ChatMessage = { role: "user" | "assistant"; content: string };

class ProviderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

const unavailable = `The assistant is unavailable right now. Please use the contact form or email ${profile.email}.`;

function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > CHAT_LIMITS.maxMessages) return null;

  const messages: ChatMessage[] = [];
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

/** Streams the answer's text from one provider's chat completions endpoint (server-sent events). */
async function* streamAnswer(provider: Provider, messages: ChatMessage[], signal: AbortSignal) {
  // Give up on a provider that doesn't start answering within 20 seconds. Once it does, the answer
  // may take as long as it needs, so the timer stops when the response arrives.
  const connect = new AbortController();
  const timer = setTimeout(() => connect.abort(new ProviderError("timed out waiting for a response")), 20_000);
  const response = await fetch(`${provider.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${provider.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: provider.model,
      // The system prompt is identical on every request, so providers with prompt caching reuse it.
      messages: [{ role: "system", content: assistantSystemPrompt }, ...messages],
      stream: true,
      // Answers are short, but reasoning models spend part of this budget thinking first.
      max_tokens: 2048,
      temperature: 0.4,
      // gpt-oss thinks before answering; chat Q&A doesn't need much of it, and less is faster.
      ...(provider.model.includes("gpt-oss") ? { reasoning_effort: "low" } : {}),
    }),
    signal: AbortSignal.any([signal, connect.signal]),
  }).finally(() => clearTimeout(timer));
  if (!response.ok || !response.body) {
    throw new ProviderError(`${response.status} ${(await response.text().catch(() => "")).slice(0, 300)}`, response.status);
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      const event = JSON.parse(data) as {
        choices?: { delta?: { content?: string | null } }[];
        error?: { message?: string };
      };
      if (event.error) throw new ProviderError(event.error.message ?? "stream error");
      // Only the answer itself; reasoning models send their thinking in a separate field.
      const text = event.choices?.[0]?.delta?.content;
      if (text) yield text;
    }
  }
}

export async function POST(request: Request) {
  if (isRateLimited(`chat:${clientIp(request)}`, 20, 10 * 60 * 1000)) {
    return Response.json(
      { error: "You've asked a lot of questions in a short time. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return Response.json({ error: "Invalid request." }, { status: 413 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const messages = parseMessages(body);
  if (!messages) return Response.json({ error: "Invalid conversation." }, { status: 400 });

  const list = providers();
  if (list.length === 0) {
    console.error("[chat] CHAT_API_KEY is not set.");
    return Response.json({ error: unavailable }, { status: 503 });
  }

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
        for (const [i, provider] of list.entries()) {
          let started = false;
          try {
            for await (const text of streamAnswer(provider, messages, request.signal)) {
              started = true;
              send({ type: "text", text });
            }
            // A reasoning model can spend its whole token budget thinking and answer nothing.
            if (!started) throw new ProviderError("empty answer");
            send({ type: "done" });
            return;
          } catch (error) {
            if (request.signal.aborted) return; // The visitor closed the chat; nothing to report.
            console.error(`[chat] ${provider.model} failed:`, error instanceof Error ? error.message : error);
            if (i < list.length - 1) {
              // Hand over to the next provider; it answers from scratch.
              if (started) send({ type: "reset" });
              continue;
            }
            const busy = error instanceof ProviderError && error.status === 429;
            if (started) send({ type: "reset" });
            send({
              type: "error",
              message: busy ? "The assistant is busy right now. Please try again in a minute." : unavailable,
            });
          }
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
