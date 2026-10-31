"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Tag } from "@/components/ui/Tag";
import type { ProcessStep } from "@/types";

function StepMarker({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) {
  const at = index / total;
  const lit = useTransform(progress, [Math.max(at - 0.02, 0), Math.min(at + 0.06, 1)], [0, 1]);
  return (
    <span className="relative grid size-4 place-items-center rounded-full border border-line-strong bg-background">
      <motion.span
        style={{ opacity: lit, scale: lit }}
        className="size-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]"
      />
    </span>
  );
}

/**
 * The four steps, joined by a rail that fills as the section scrolls into view:
 * horizontal on desktop, vertical on smaller screens.
 */
export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });

  return (
    <div ref={ref} className="relative pl-10 lg:pt-12 lg:pl-0">
      {/* Rails: vertical below lg, horizontal from lg up. */}
      <div aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line lg:hidden">
        <motion.div
          className="h-full w-full origin-top bg-linear-to-b from-accent to-accent-2"
          style={{ scaleY: scrollYProgress }}
        />
      </div>
      <div aria-hidden className="absolute top-[7px] right-0 left-2 hidden h-px bg-line lg:block">
        <motion.div
          className="h-full w-full origin-left bg-linear-to-r from-accent to-accent-2"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      <ol className="grid gap-12 lg:grid-cols-4 lg:gap-6">
        {steps.map((step, i) => (
          <li key={step.title} className="relative">
            <span className="absolute top-1 -left-10 lg:-top-12 lg:left-0">
              <StepMarker progress={scrollYProgress} index={i} total={steps.length} />
            </span>
            <FadeIn whenInView delay={i * 0.1} y={24} className="group">
              <span className="block bg-linear-to-b from-foreground/25 to-transparent bg-clip-text font-mono text-5xl font-semibold tracking-tighter lg:text-6xl text-transparent transition-colors duration-500 group-hover:from-accent group-hover:to-accent-2/20">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">{step.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {step.deliverables.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </li>
        ))}
      </ol>
    </div>
  );
}
