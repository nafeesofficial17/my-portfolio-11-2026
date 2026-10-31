"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { easeOutExpo } from "@/lib/motion";

const spring = { stiffness: 500, damping: 40, mass: 0.5 };

/**
 * A soft cursor follower for mouse users. It grows over links and buttons, and turns into
 * a labelled bubble over anything with `data-cursor="Label"` (e.g. project cards).
 * The native cursor stays visible; touch devices and reduced-motion users get nothing.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [overLink, setOverLink] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element;
      setLabel(target.closest("[data-cursor]")?.getAttribute("data-cursor") ?? null);
      setOverLink(Boolean(target.closest("a, button")));
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 88 : overLink ? 40 : 10;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{ x: springX, y: springY }}
      animate={{ opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
        animate={{
          width: size,
          height: size,
          backgroundColor: label ? "rgb(244 244 246)" : overLink ? "rgb(255 255 255 / 0.06)" : "rgb(244 244 246)",
          borderColor: overLink && !label ? "rgb(255 255 255 / 0.5)" : "rgb(255 255 255 / 0)",
        }}
        transition={{ duration: 0.35, ease: easeOutExpo }}
        style={{ borderWidth: 1, borderStyle: "solid" }}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-semibold text-background"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
