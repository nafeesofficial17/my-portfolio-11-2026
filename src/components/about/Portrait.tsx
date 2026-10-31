"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { MapPin } from "lucide-react";

/** Cut-out portrait over a glowing card, drifting gently against the scroll. */
export function Portrait({ src, alt, location }: { src: StaticImageData; alt: string; location: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.9]);

  return (
    <div ref={ref} className="relative isolate aspect-square overflow-hidden rounded-[2rem] lg:aspect-[4/5] border border-line bg-surface">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <motion.div
        aria-hidden
        style={{ scale: glowScale }}
        className="absolute top-[18%] left-1/2 -z-10 size-[80%] -translate-x-1/2 rounded-full bg-linear-to-br from-accent/60 to-accent-2/40 blur-[80px]"
      />
      <motion.div style={{ y }} className="absolute inset-x-0 -bottom-[6%] top-[12%]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 440px, 90vw"
          placeholder="blur"
          className="object-contain object-bottom"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-surface via-surface/60 to-transparent" />

      <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full border border-line bg-background/60 px-3 py-1.5 text-xs text-muted backdrop-blur">
        <MapPin className="size-3.5" />
        {location}
      </div>
    </div>
  );
}
