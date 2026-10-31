"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { easeOutExpo } from "@/lib/motion";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Distance in px the element rises from. */
  y?: number;
  /** Animate when scrolled into view instead of on mount. */
  whenInView?: boolean;
};

export function FadeIn({ delay = 0, y = 24, whenInView = false, transition, ...props }: FadeInProps) {
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      {...(whenInView ? { whileInView: shown, viewport: { once: true, margin: "-80px" } } : { animate: shown })}
      transition={{ duration: 0.9, ease: easeOutExpo, delay, ...transition }}
      {...props}
    />
  );
}
