"use client";

import { createContext, useContext, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const ProgressContext = createContext<MotionValue<number> | null>(null);

/** Tracks scroll through the stack so each card can shrink as the next one slides over it. */
export function StackedCards({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="relative">
      <ProgressContext.Provider value={scrollYProgress}>{children}</ProgressContext.Provider>
    </div>
  );
}

/** One sticky card. Earlier cards scale down and dim, leaving a slim peek of each above the next. */
export function StackedCard({ index, total, children }: { index: number; total: number; children: React.ReactNode }) {
  const progress = useContext(ProgressContext);
  if (!progress) throw new Error("StackedCard must be rendered inside StackedCards");

  // Card i pins at progress i/steps; the next card covers it by (i+1)/steps.
  // The last card never shrinks or dims. Its ranges must still stay within 0–1, or Motion's
  // hardware-accelerated animations throw and take the page down.
  const steps = Math.max(total - 1, 1);
  const isLast = index === total - 1;
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, isLast ? [0, 1] : [index / steps, 1], [1, targetScale]);
  const dim = useTransform(progress, isLast ? [0, 1] : [(index + 0.4) / steps, (index + 1) / steps], [0, isLast ? 0 : 0.55]);

  return (
    // Bottom padding grows with the card's downward offset so the last card can't spill into what follows.
    <div className="sticky top-0 flex min-h-svh items-start pt-20 sm:pt-28" style={{ paddingBottom: 32 + index * 22 }}>
      <motion.div
        className="relative w-full origin-top will-change-transform"
        style={{ scale, top: `${index * 22}px` }}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2rem] bg-background"
          style={{ opacity: dim }}
        />
      </motion.div>
    </div>
  );
}
