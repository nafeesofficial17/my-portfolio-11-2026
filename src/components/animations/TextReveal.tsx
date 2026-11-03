"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { HeadlineSegment } from "@/types";

type TextRevealProps = {
  segments: HeadlineSegment[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  accentClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate when scrolled into view instead of on mount. */
  whenInView?: boolean;
};

/** How long each rotating phrase stays before the next one comes in. */
const ROTATE_EVERY = 2800;
/** Full passes through the phrases before settling back on the first one. */
const ROTATE_ROUNDS = 2;

const words = (text: string) => text.split(/\s+/).filter(Boolean);

/** Clips a word so it can slide in from below its own baseline. */
function Mask({ children, clip = true }: { children: ReactNode; clip?: boolean }) {
  return (
    <span className={cn("-mb-[0.14em] inline-block pb-[0.14em] align-bottom", clip && "overflow-hidden")}>{children}</span>
  );
}

/** Joins words with real spaces, so the line can still wrap between them. */
function spaced(items: ReactNode[]) {
  return items.map((item, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      {item}
    </Fragment>
  ));
}

/**
 * A rotating word, split into letters that flip over one after another, like the faces of a turning cube.
 * Each letter paints its own slice of the word's gradient (from offsets measured before paint),
 * so the split word looks exactly like the whole one. Until `split` is set it renders as plain text.
 */
function SplitWord({
  word,
  className,
  split,
  first,
  start,
}: {
  word: string;
  className?: string;
  split: boolean;
  /** Part of the phrase that was already on screen at load: it's split in place, with no entrance. */
  first: boolean;
  /** Index of the word's first letter in the phrase, for the stagger. */
  start: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!split || !element) return;
    const measure = () => {
      const box = element.getBoundingClientRect();
      element.style.setProperty("--word-w", `${box.width}px`);
      for (const letter of element.children) {
        (letter as HTMLElement).style.setProperty("--x", `${letter.getBoundingClientRect().left - box.left}px`);
      }
    };
    measure();
    // Re-measure when the size changes: a resized window, or the font finishing loading.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [split]);

  return (
    // While split, the letters paint the gradient, so the word's own background is switched off.
    // The perspective gives the letters' flip its depth.
    <span ref={ref} className={cn("inline-block [perspective:4em]", className, split && "bg-none!")}>
      {split
        ? [...word].map((letter, i) => (
            <motion.span
              key={i}
              // Turning around a point behind the letter makes the old and new letters two faces of one cube.
              className="text-gradient-letter -mx-[0.1em] inline-block px-[0.1em] [backface-visibility:hidden] [transform-origin:50%_50%_-0.45em]"
              initial={first ? false : { rotateX: -90, opacity: 0 }}
              animate={{
                rotateX: 0,
                opacity: 1,
                transition: { duration: 0.9, ease: easeOutExpo, delay: 0.2 + (start + i) * 0.035 },
              }}
              exit={{
                rotateX: 90,
                opacity: 0,
                // Leaves a little faster than the new letters arrive, so the old phrase is always out of the way.
                transition: { duration: 0.4, ease: [0.55, 0, 0.75, 0.2], delay: (start + i) * 0.02 },
              }}
            >
              {letter}
            </motion.span>
          ))
        : word}
    </span>
  );
}

/**
 * Takes turns between phrases in one spot of the headline: letter by letter, the current phrase
 * flips up and away as the next phrase flips in from below. Every phrase is also laid out
 * invisibly in the same grid cell, so the spot is always as big as the longest phrase and the rest
 * of the headline never reflows. Stops after a couple of rounds on the first phrase, and doesn't
 * rotate at all for reduced motion.
 */
function RotatingPhrase({
  phrases,
  className,
  delay,
  stagger,
}: {
  phrases: string[];
  className?: string;
  delay: number;
  stagger: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const reduceMotion = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(true);
  const [step, setStep] = useState(0);
  // The first phrase starts as whole words, for the CSS entrance; it's split once that has finished.
  const [splitFirst, setSplitFirst] = useState(false);
  const done = step >= phrases.length * ROTATE_ROUNDS;
  const entrance = delay * 1000 + 1000;

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => setSplitFirst(true), entrance);
    return () => clearTimeout(timer);
  }, [reduceMotion, entrance]);

  useEffect(() => {
    if (!inView || !pageVisible || reduceMotion || done) return;
    const timer = setTimeout(() => setStep((current) => current + 1), step === 0 ? entrance + ROTATE_EVERY : ROTATE_EVERY);
    return () => clearTimeout(timer);
  }, [step, inView, pageVisible, reduceMotion, done, entrance]);

  const current = words(phrases[step % phrases.length]);
  const starts = current.map((_, w) => current.slice(0, w).join("").length);

  return (
    <span ref={ref} className="inline-grid">
      {phrases.map((phrase, p) => (
        <span key={p} className="invisible col-start-1 row-start-1">
          {spaced(words(phrase).map((word, i) => <span key={i} className={className}>{word}</span>))}
        </span>
      ))}
      {/* `initial={false}` lets the first phrase use the CSS entrance below, which runs before JavaScript loads. */}
      <AnimatePresence initial={false}>
        <span key={step} className="col-start-1 row-start-1">
          {spaced(
            current.map((word, i) => {
              const content = (
                <SplitWord
                  word={word}
                  className={className}
                  split={step > 0 || splitFirst}
                  first={step === 0}
                  start={starts[i]}
                />
              );
              return (
                // The mask only clips during the entrance; the letters' blur would be cut off at its edges.
                <Mask key={i} clip={step === 0 && !splitFirst}>
                  {step === 0 ? (
                    <span className="animate-word-up inline-block" style={{ animationDelay: `${delay + i * stagger}s` }}>
                      {content}
                    </span>
                  ) : (
                    content
                  )}
                </Mask>
              );
            }),
          )}
        </span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Reveals text word by word, each word sliding up out of its own mask.
 * On mount it runs as a pure CSS animation, so above-the-fold headlines appear at first paint
 * instead of waiting for JavaScript; `whenInView` uses Motion to trigger on scroll.
 * On mount, a segment with `rotate` phrases takes turns with them, and the headline breaks after it.
 */
export function TextReveal({
  segments,
  as: Tag = "h1",
  className,
  accentClassName,
  delay = 0,
  stagger = 0.06,
  whenInView = false,
}: TextRevealProps) {
  const variants: Variants = {
    hidden: { y: "110%" },
    shown: (i: number) => ({ y: "0%", transition: { duration: 1, ease: easeOutExpo, delay: delay + i * stagger } }),
  };

  // Where each segment's words start in the whole headline, which sets their place in the stagger.
  const starts = segments.map((_, s) =>
    segments.slice(0, s).reduce((count, segment) => count + words(segment.text).length, 0),
  );

  const content = segments.map((segment, s) => {
    const style = segment.accent ? accentClassName : undefined;
    const start = starts[s];
    const last = s === segments.length - 1;

    if (!whenInView && segment.rotate?.length) {
      return (
        <Fragment key={s}>
          <RotatingPhrase
            phrases={[segment.text, ...segment.rotate]}
            className={style}
            delay={delay + start * stagger}
            stagger={stagger}
          />
          {!last && <br />}
        </Fragment>
      );
    }

    return (
      <Fragment key={s}>
        {spaced(
          words(segment.text).map((word, w) => {
            const i = start + w;
            return (
              <Mask key={i}>
                {whenInView ? (
                  <motion.span className={cn("inline-block", style)} variants={variants} custom={i}>
                    {word}
                  </motion.span>
                ) : (
                  // The entrance and the accent style sit on separate spans, so an animated accent can't override the entrance.
                  <span className="animate-word-up inline-block" style={{ animationDelay: `${delay + i * stagger}s` }}>
                    <span className={style}>{word}</span>
                  </span>
                )}
              </Mask>
            );
          }),
        )}
        {!last && " "}
      </Fragment>
    );
  });

  return (
    <Tag className={className}>
      <span className="sr-only">{segments.map((s) => s.text).join(" ")}</span>
      {whenInView ? (
        <motion.span aria-hidden initial="hidden" whileInView="shown" viewport={{ once: true, margin: "-60px" }}>
          {content}
        </motion.span>
      ) : (
        <span aria-hidden>{content}</span>
      )}
    </Tag>
  );
}
