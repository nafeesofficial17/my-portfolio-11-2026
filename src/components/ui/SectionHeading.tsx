import { FadeIn } from "@/components/animations/FadeIn";
import { TextReveal } from "@/components/animations/TextReveal";
import { cn } from "@/lib/utils";
import type { HeadlineSegment } from "@/types";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: HeadlineSegment[];
  description?: string;
  className?: string;
};

/** Numbered eyebrow, word-reveal title and optional intro, shared by every home section. */
export function SectionHeading({ index, eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16", className)}>
      <div>
        <FadeIn whenInView className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-subtle uppercase">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-strong" />
          {eyebrow}
        </FadeIn>
        <TextReveal
          as="h2"
          whenInView
          segments={title}
          className="mt-5 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance"
          accentClassName="text-gradient pr-[0.06em] font-serif text-[1.08em] font-normal tracking-[-0.02em] italic"
        />
      </div>
      {description && (
        <FadeIn whenInView delay={0.2}>
          <p className="max-w-sm leading-relaxed text-pretty text-muted lg:pb-2">{description}</p>
        </FadeIn>
      )}
    </div>
  );
}
