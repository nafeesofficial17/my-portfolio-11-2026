"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const spring = { stiffness: 140, damping: 22, mass: 0.5 };

/**
 * Layered hero backdrop: drifting aurora glows, a faint grid, and a cursor spotlight
 * that lights up the grid beneath the pointer. Purely decorative.
 */
export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  const glow = useMotionTemplate`radial-gradient(560px circle at ${springX}px ${springY}px, rgb(139 124 255 / 0.13), transparent 70%)`;
  const gridMask = useMotionTemplate`radial-gradient(280px circle at ${springX}px ${springY}px, black, transparent)`;

  useEffect(() => {
    if (reduce) return;
    let first = true;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      // Start the spotlight under the cursor instead of sweeping in from off-screen.
      if (first) {
        springX.jump(px);
        springY.jump(py);
        first = false;
      }
      x.set(px);
      y.set(py);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y, springX, springY]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="animate-aurora absolute top-[-15%] left-[5%] size-[min(55vw,640px)] rounded-full bg-accent/25 blur-[120px]" />
      <div className="animate-aurora absolute top-[10%] right-[0%] size-[min(45vw,520px)] rounded-full bg-accent-2/15 blur-[120px] [animation-delay:-9s]" />

      <div className="bg-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
      <motion.div
        className="bg-grid absolute inset-0 [--grid-color:rgb(139_124_255/0.45)]"
        style={{ maskImage: gridMask, WebkitMaskImage: gridMask }}
      />
      <motion.div className="absolute inset-0" style={{ background: glow }} />

      <div className="bg-noise absolute inset-0 opacity-[0.04] mix-blend-overlay" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
    </div>
  );
}
