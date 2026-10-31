"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

// From the --subtle token (still readable: 4.7:1 contrast) up to --foreground.
const DIM = "rgb(120, 122, 133)";
const LIT = "rgb(244, 244, 246)";

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const color = useTransform(progress, range, [DIM, LIT]);
  return (
    <>
      <motion.span style={{ color }}>{children}</motion.span>{" "}
    </>
  );
}

/** A paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}
