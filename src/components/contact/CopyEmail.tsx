"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** The email address as a mailto link, with a one-click copy button beside it. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div className="flex items-center gap-3">
      <a
        href={`mailto:${email}`}
        className="text-xl font-medium tracking-tight underline decoration-line-strong underline-offset-8 transition-colors hover:decoration-accent sm:text-2xl"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copied" : "Copy email address"}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground"
      >
        {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </div>
  );
}
