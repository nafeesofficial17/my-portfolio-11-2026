"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { GraduationCap } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Tag } from "@/components/ui/Tag";
import type { Education, ExperienceItem } from "@/types";

/** Career timeline whose rail fills in as you scroll past it. */
export function ExperienceTimeline({ items, education }: { items: ExperienceItem[]; education: Education }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });

  return (
    <div ref={ref} className="relative pl-10">
      <div aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line">
        <motion.div
          className="h-full w-full origin-top bg-linear-to-b from-accent to-accent-2"
          style={{ scaleY: scrollYProgress }}
        />
      </div>

      <ol className="space-y-12">
        {items.map((item) => (
          <li key={item.company} className="relative">
            <span
              aria-hidden
              className="absolute top-1.5 -left-10 grid size-[15px] place-items-center rounded-full border border-line-strong bg-background"
            >
              <span className="size-[5px] rounded-full bg-accent" />
            </span>
            <FadeIn whenInView y={20}>
              <p className="font-mono text-xs tracking-wide text-subtle">{item.period}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.role}</h3>
              <p className="text-muted">{item.company}</p>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">{item.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </li>
        ))}

        <li className="relative">
          <span
            aria-hidden
            className="absolute top-0.5 -left-10 grid size-[15px] place-items-center rounded-full border border-line-strong bg-background text-accent"
          >
            <GraduationCap className="size-2.5" />
          </span>
          <FadeIn whenInView y={20}>
            <p className="font-mono text-xs tracking-wide text-subtle">{education.period}</p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">{education.degree}</h3>
            <p className="text-muted">
              {education.school} · {education.note}
            </p>
          </FadeIn>
        </li>
      </ol>
    </div>
  );
}
