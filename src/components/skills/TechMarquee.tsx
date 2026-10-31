import { techStack } from "@/data/skills";

/** Endless strip of the tools I build with. Pauses on hover; edges fade out. */
export function TechMarquee() {
  return (
    <section aria-label="Tech stack" className="relative border-y border-line py-10">
      <p className="mb-8 text-center font-mono text-xs tracking-[0.2em] text-subtle uppercase">
        Production-proven stack
      </p>
      <div className="mask-fade-x group overflow-hidden">
        <ul className="animate-marquee flex w-max items-center gap-12 pr-12 [--marquee-duration:55s] group-hover:[animation-play-state:paused]">
          {[...techStack, ...techStack].map((icon, i) => (
            <li
              key={i}
              aria-hidden={i >= techStack.length || undefined}
              className="flex items-center gap-3 text-muted transition-colors duration-300 hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0" aria-hidden>
                <path d={icon.path} />
              </svg>
              <span className="text-lg font-medium tracking-tight whitespace-nowrap">{icon.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
