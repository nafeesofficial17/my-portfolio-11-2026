import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { CountUp } from "@/components/animations/CountUp";
import { Magnetic } from "@/components/animations/Magnetic";
import { TextReveal } from "@/components/animations/TextReveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { profile } from "@/data/profile";
import { HeroBackground } from "./HeroBackground";

export function Hero() {
  return (
    <section id="home" className="relative isolate flex min-h-svh items-center overflow-hidden pt-24 pb-24 sm:pt-32">
      <HeroBackground />

      <Container>
        <div className="animate-fade-up flex flex-wrap items-center gap-x-4 gap-y-3" style={{ animationDelay: "0.1s" }}>
          {profile.availability.open && <StatusBadge>{profile.availability.label}</StatusBadge>}
          {profile.highlight && (
            <Link
              href={profile.highlight.href}
              className="inline-flex items-center gap-2 rounded-full border border-accent-2/30 bg-accent-2/[0.07] py-1.5 pr-4 pl-3 text-sm text-foreground backdrop-blur transition-colors duration-300 hover:border-accent-2/60 hover:bg-accent-2/[0.12]"
            >
              <BadgeCheck className="size-4 text-accent-2" aria-hidden />
              {profile.highlight.label}
            </Link>
          )}
          <span className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">{profile.role}</span>
        </div>

        <TextReveal
          as="h1"
          segments={profile.headline}
          delay={0.25}
          className="mt-6 max-w-5xl text-[clamp(2.6rem,7vw,6rem)] leading-[1] font-semibold tracking-[-0.04em] text-balance sm:mt-8"
          accentClassName="text-gradient pr-[0.06em] font-serif text-[1.08em] font-normal tracking-[-0.02em] italic"
        />

        <div className="animate-fade-up" style={{ animationDelay: "0.85s" }}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted sm:mt-8 sm:text-lg">{profile.intro}</p>
        </div>

        <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-4 sm:mt-10" style={{ animationDelay: "1s" }}>
          <Magnetic>
            <ButtonLink href="/#contact">
              Start a project
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </ButtonLink>
          </Magnetic>
          <ButtonLink href="/#work" variant="secondary">
            View my work
          </ButtonLink>
        </div>

        <div
          className="animate-fade-up mt-16 flex flex-col gap-8 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between"
          style={{ animationDelay: "1.15s" }}
        >
          <dl className="grid grid-cols-3 gap-6 sm:gap-14">
            {profile.stats.map((stat, i) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1">
                <dt className="text-xs text-subtle sm:text-sm">{stat.label}</dt>
                <dd className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix} delay={1.2 + i * 0.1} />
                </dd>
              </div>
            ))}
          </dl>

          <ul className="flex gap-2">
            {profile.socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target={social.platform === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-line-strong hover:text-foreground"
                >
                  <SocialIcon platform={social.platform} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <a
        href="#work"
        aria-label="Scroll to selected work"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-subtle transition-colors hover:text-muted sm:flex [@media(max-height:960px)]:hidden"
      >
        <span className="font-mono text-[11px] tracking-[0.3em] uppercase">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="animate-scroll-line absolute inset-0 bg-foreground" />
        </span>
      </a>
    </section>
  );
}
