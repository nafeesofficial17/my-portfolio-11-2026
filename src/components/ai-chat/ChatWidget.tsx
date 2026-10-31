"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { profile } from "@/data/profile";
import { CHAT_LIMITS } from "@/lib/assistant-limits";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ChatMarkdown } from "./ChatMarkdown";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const suggestions = [
  "What AI products has Mohd built?",
  "Can he build a chatbot for my business?",
  "What's his tech stack?",
  "How does working with him work?",
];

/** Open the chat from anywhere, optionally with a question to ask straight away. */
export function openChat(question?: string) {
  window.dispatchEvent(new CustomEvent("open-ai-chat", { detail: question }));
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const ask = useCallback(
    async (question: string) => {
      const text = question.trim().slice(0, CHAT_LIMITS.maxMessageLength);
      if (!text || streaming) return;

      // Send only real exchanges (no error notices), trimmed to the server's limit, starting with the visitor.
      const history = messages.filter((m) => !m.error);
      let outgoing = [...history, { role: "user" as const, content: text }].slice(-CHAT_LIMITS.maxMessages);
      if (outgoing[0]?.role === "assistant") outgoing = outgoing.slice(1);

      setMessages([...messages, { role: "user", content: text }, { role: "assistant", content: "" }]);
      setInput("");
      setStreaming(true);

      const update = (change: (last: ChatMessage) => ChatMessage) =>
        setMessages((current) => [...current.slice(0, -1), change(current[current.length - 1])]);

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: outgoing.map(({ role, content }) => ({ role, content })) }),
          signal: controller.signal,
        });
        if (!response.ok || !response.body) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error ?? "");
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += value;
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line) continue;
            const event = JSON.parse(line) as { type: string; text?: string; message?: string };
            if (event.type === "text") update((last) => ({ ...last, content: last.content + event.text }));
            else if (event.type === "reset") update((last) => ({ ...last, content: "" }));
            else if (event.type === "error")
              update(() => ({ role: "assistant", content: event.message ?? "", error: true }));
          }
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error && error.message
            ? error.message
            : `Something went wrong. Please email ${profile.email}.`;
        update(() => ({ role: "assistant", content: message, error: true }));
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
          setStreaming(false);
        }
      }
    },
    [messages, streaming],
  );

  // Other parts of the page can open the chat (and pre-ask a question) via openChat().
  useEffect(() => {
    const onOpen = (event: Event) => {
      setOpen(true);
      const question = (event as CustomEvent<string | undefined>).detail;
      if (question) void ask(question);
    };
    window.addEventListener("open-ai-chat", onOpen);
    return () => window.removeEventListener("open-ai-chat", onOpen);
  }, [ask]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest text in view while an answer streams in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const waiting = streaming && messages.at(-1)?.content === "";

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.1 }}
            className="group fixed right-4 bottom-4 z-30 flex items-center gap-2.5 rounded-full border border-white/15 bg-surface-raised/90 py-2 pr-5 pl-2 text-sm font-medium shadow-[0_20px_50px_-12px_rgb(0_0_0/0.8),0_0_40px_-10px_rgb(139_124_255/0.6)] backdrop-blur-xl transition-colors hover:border-white/30 sm:right-6 sm:bottom-6"
          >
            <span className="relative grid size-9 place-items-center rounded-full bg-linear-to-br from-accent to-accent-2 text-background">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/40 [animation-duration:2.5s]" />
              <Sparkles className="relative size-4" />
            </span>
            Ask my AI
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`Chat with ${profile.name}'s AI assistant`}
            data-lenis-prevent
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-3 bottom-3 z-[60] flex h-[min(78svh,640px)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-background/95 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9),0_0_80px_-30px_rgb(139_124_255/0.5)] backdrop-blur-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]"
          >
            <header className="flex items-center gap-3 border-b border-line px-5 py-4">
              <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-accent to-accent-2 text-background">
                <Sparkles className="size-[18px]" />
              </span>
              <div className="flex-1 leading-tight">
                <p className="font-medium">Ask about {profile.name.split(" ")[0]}</p>
                <p className="flex items-center gap-1.5 text-xs text-subtle">
                  <span className="size-1.5 rounded-full bg-success" /> AI assistant · answers from this site
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <X className="size-[18px]" />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 text-[14px] leading-relaxed"
            >
              {messages.length === 0 ? (
                <div>
                  <p className="text-muted">
                    Hi! I&apos;m {profile.name.split(" ")[0]}&apos;s AI assistant. Ask me anything about his work,
                    skills or how to hire him.
                  </p>
                  <div className="mt-5 flex flex-col items-start gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => ask(suggestion)}
                        className="rounded-full border border-line px-3.5 py-2 text-left text-[13px] text-muted transition-colors hover:border-accent/60 hover:text-foreground"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div aria-live="polite" className="space-y-4">
                  {messages.map((message, i) =>
                    message.role === "user" ? (
                      <p
                        key={i}
                        className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-background"
                      >
                        {message.content}
                      </p>
                    ) : (
                      <div
                        key={i}
                        className={cn(
                          "max-w-[92%] rounded-2xl rounded-bl-md px-4 py-3",
                          message.error
                            ? "border border-red-400/25 bg-red-400/[0.06] text-red-200"
                            : "bg-white/[0.05] text-foreground/90",
                        )}
                      >
                        {message.content ? (
                          <ChatMarkdown text={message.content} onNavigate={() => setOpen(false)} />
                        ) : (
                          waiting &&
                          i === messages.length - 1 && (
                            <span className="flex gap-1 py-1" aria-label="Thinking">
                              {[0, 1, 2].map((dot) => (
                                <motion.span
                                  key={dot}
                                  className="size-1.5 rounded-full bg-muted"
                                  animate={{ y: [0, -3, 0] }}
                                  transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
                                />
                              ))}
                            </span>
                          )
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void ask(input);
              }}
              className="border-t border-line p-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-white/[0.03] p-1.5 pl-4 transition-colors focus-within:border-accent/60">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void ask(input);
                    }
                  }}
                  rows={1}
                  maxLength={CHAT_LIMITS.maxMessageLength}
                  placeholder="Ask a question…"
                  aria-label="Your question"
                  className="max-h-28 flex-1 resize-none bg-transparent py-2 text-[14px] outline-none placeholder:text-subtle"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  aria-label="Send"
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-foreground text-background transition-opacity disabled:opacity-30"
                >
                  <ArrowUp className="size-4" />
                </button>
              </div>
              <p className="mt-2 px-1 text-center text-[11px] text-subtle">
                AI can make mistakes. For anything important, use the contact form.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
