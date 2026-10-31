"use client";

import { motion, type Variants } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { HeadlineSegment } from "@/types";

type TextRevealProps = {
  segments: HeadlineSegment[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  accentClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate when scrolled into view instead of on mount. */
  whenInView?: boolean;
};

/**
 * Reveals text word by word, each word sliding up out of its own mask.
 * On mount it runs as a pure CSS animation, so above-the-fold headlines appear at first paint
 * instead of waiting for JavaScript; `whenInView` uses Motion to trigger on scroll.
 */
export function TextReveal({
  segments,
  as: Tag = "h1",
  className,
  accentClassName,
  delay = 0,
  stagger = 0.06,
  whenInView = false,
}: TextRevealProps) {
  const words = segments.flatMap((segment) =>
    segment.text.split(/\s+/).filter(Boolean).map((word) => ({ word, accent: segment.accent })),
  );

  const variants: Variants = {
    hidden: { y: "110%" },
    shown: (i: number) => ({ y: "0%", transition: { duration: 1, ease: easeOutExpo, delay: delay + i * stagger } }),
  };

  const content = words.map(({ word, accent }, i) => (
    <span key={i}>
      <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
        {whenInView ? (
          <motion.span className={cn("inline-block", accent && accentClassName)} variants={variants} custom={i}>
            {word}
          </motion.span>
        ) : (
          <span
            className={cn("animate-word-up inline-block", accent && accentClassName)}
            style={{ animationDelay: `${delay + i * stagger}s` }}
          >
            {word}
          </span>
        )}
      </span>
      {i < words.length - 1 && " "}
    </span>
  ));

  return (
    <Tag className={className}>
      <span className="sr-only">{segments.map((s) => s.text).join(" ")}</span>
      {whenInView ? (
        <motion.span aria-hidden initial="hidden" whileInView="shown" viewport={{ once: true, margin: "-60px" }}>
          {content}
        </motion.span>
      ) : (
        <span aria-hidden>{content}</span>
      )}
    </Tag>
  );
}
