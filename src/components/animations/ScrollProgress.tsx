"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin gradient bar along the top edge that fills as the page is read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-linear-to-r from-accent to-accent-2"
      style={{ scaleX }}
    />
  );
}
