"use client";

import { Sparkles } from "lucide-react";
import { openChat } from "./ChatWidget";

/** Opens the AI chat; handy next to other contact options. */
export function AskAiButton() {
  return (
    <button
      type="button"
      onClick={() => openChat()}
      className="group inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 py-2 pr-4 pl-2 text-sm text-foreground transition-colors hover:border-accent hover:bg-accent/15"
    >
      <span className="grid size-7 place-items-center rounded-full bg-linear-to-br from-accent to-accent-2 text-background">
        <Sparkles className="size-3.5" />
      </span>
      Not ready to write? Ask my AI assistant
    </button>
  );
}
