"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";

/** Counts from 0 to `value` the first time it scrolls into view. */
export function CountUp({
  value,
  suffix = "",
  duration = 1.8,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = `${value}${suffix}`;
      return;
    }
    const decimals = Number.isInteger(value) ? 0 : 1;
    const controls = animate(0, value, {
      duration,
      delay,
      ease: easeOutExpo,
      onUpdate: (latest) => {
        el.textContent = `${latest.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix, duration, delay]);

  return (
    <>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span ref={ref} aria-hidden className="tabular-nums">
        0{suffix}
      </span>
    </>
  );
}
