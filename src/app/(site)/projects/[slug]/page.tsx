import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Magnetic } from "@/components/animations/Magnetic";
import { TextReveal } from "@/components/animations/TextReveal";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Tag } from "@/components/ui/Tag";
import { getProject, projects } from "@/data/projects";

// Every case study is prerendered in full from its slug, so there is no param-free shell to show first.
export const instant = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title} case study`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { type: "article", url: `/projects/${project.slug}`, title, description: project.summary },
    twitter: { card: "summary_large_image", title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const facts = [
    { label: "Role", value: project.role },
    project.timeline && { label: "Timeline", value: project.timeline },
    project.team && { label: "Team", value: `${project.team} people` },
    { label: "Category", value: project.category },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main id="main" style={{ "--project-accent": project.accent } as React.CSSProperties}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-32 pb-14 sm:pt-40">
        <div
          aria-hidden
          className="absolute top-[-20%] left-1/2 -z-10 size-[min(90vw,900px)] -translate-x-1/2 rounded-full bg-[var(--project-accent)] opacity-20 blur-[140px]"
        />
        <div
          aria-hidden
          className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
        />

        <Container>
          <div className="animate-fade-up" style={{ animationDelay: "0s" }}>
            <Link
              href="/#work"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              All work
            </Link>
          </div>

          <TextReveal
            as="h1"
            segments={[{ text: project.title }]}
            delay={0.1}
            className="mt-10 text-[clamp(3rem,10vw,8rem)] leading-[0.95] font-semibold tracking-[-0.045em]"
          />
          <div className="animate-fade-up" style={{ animationDelay: "0.35s" }}>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-pretty text-muted sm:text-2xl">
              {project.tagline}
            </p>
          </div>

          <div
            className="animate-fade-up mt-12 flex flex-col gap-8 border-t border-line pt-8 lg:flex-row lg:items-end lg:justify-between"
            style={{ animationDelay: "0.5s" }}
          >
            <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[11px] tracking-[0.2em] text-subtle uppercase">{fact.label}</dt>
                  <dd className="mt-2 text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {project.liveUrl && (
              <ButtonLink
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="sm"
                className="shrink-0 self-start whitespace-nowrap lg:self-auto"
              >
                Visit live site
                <ArrowUpRight className="size-4" />
              </ButtonLink>
            )}
          </div>
        </Container>
      </section>

      <Container>
        <div className="animate-fade-up" style={{ animationDelay: "0.45s" }}>
          <BrowserFrame
            src={project.image}
            alt={`${project.title} screenshot`}
            address={project.domain}
            sizes="(min-width: 1152px) 1088px, 100vw"
            priority
            className="rounded-2xl"
          />
        </div>
      </Container>

      {/* Overview */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <FadeIn whenInView className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">
            <span className="text-accent">01</span> — Overview
          </FadeIn>
          <div>
            <FadeIn whenInView>
              <p className="text-2xl leading-snug font-medium tracking-tight text-pretty sm:text-3xl">
                {project.summary}
              </p>
            </FadeIn>
            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              <FadeIn whenInView>
                <h2 className="text-sm font-medium text-subtle">The challenge</h2>
                <p className="mt-3 leading-relaxed text-pretty text-muted">{project.challenge}</p>
              </FadeIn>
              <FadeIn whenInView delay={0.1}>
                <h2 className="text-sm font-medium text-subtle">What we built</h2>
                <p className="mt-3 leading-relaxed text-pretty text-muted">{project.solution}</p>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <FadeIn whenInView className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">
            <span className="text-accent">02</span> — Key features
          </FadeIn>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.highlights.map((highlight, i) => (
              <FadeIn key={highlight.title} whenInView delay={(i % 3) * 0.08}>
                <SpotlightCard className="h-full p-7">
                  <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">{highlight.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">{highlight.description}</p>
                </SpotlightCard>
              </FadeIn>
            ))}
          </div>

          <FadeIn whenInView className="mt-20">
            <div className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">
              <span className="text-accent">03</span> — Tech stack
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <Tag className="px-4 py-1.5 text-sm">{tech}</Tag>
                </li>
              ))}
            </ul>
          </FadeIn>
        </Container>
      </section>

      {/* CTA + next project */}
      <section className="pb-24">
        <Container className="space-y-4">
          <FadeIn whenInView>
            <div className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-surface px-6 py-16 text-center sm:px-12">
              <div
                aria-hidden
                className="absolute -bottom-40 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
              />
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                Building something like{" "}
                <span className="text-gradient pr-[0.06em] font-serif font-normal italic">{project.title}?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted">
                Tell me what you have in mind and I&apos;ll show you how we can build it.
              </p>
              <Magnetic className="mt-8">
                <ButtonLink href="/#contact">
                  Start a project
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
              </Magnetic>
            </div>
          </FadeIn>

          <FadeIn whenInView>
            <Link
              href={`/projects/${next.slug}`}
              data-cursor="Next"
              className="group flex items-center justify-between gap-6 rounded-[2rem] border border-line px-6 py-10 transition-colors duration-500 hover:bg-surface sm:px-12"
            >
              <div>
                <div className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Next project</div>
                <div className="mt-3 text-4xl font-semibold tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2 sm:text-6xl">
                  {next.title}
                </div>
              </div>
              <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line-strong transition-[background-color,color] duration-300 group-hover:bg-foreground group-hover:text-background">
                <ArrowRight className="size-5" />
              </span>
            </Link>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
