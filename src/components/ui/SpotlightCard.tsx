"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/** A card whose fill and border light up under the mouse pointer. */
export function SpotlightCard({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(event: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      className={cn("group/spot relative overflow-hidden rounded-3xl border border-line bg-surface", className)}
    >
      <div
        aria-hidden
        className="spotlight-fill pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
      />
      <div
        aria-hidden
        className="spotlight-border pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
      />
      {children}
    </div>
  );
}
