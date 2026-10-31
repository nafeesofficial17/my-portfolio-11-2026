import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/types";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="group relative isolate overflow-hidden rounded-[2rem] border border-line bg-surface"
      style={{ "--project-accent": project.accent } as React.CSSProperties}
    >
      {/* Brand-tinted glow behind the screenshot. */}
      <div
        aria-hidden
        className="absolute -right-24 -bottom-32 -z-10 size-[520px] rounded-full bg-[var(--project-accent)] opacity-20 blur-[120px] transition-opacity duration-700 group-hover:opacity-35"
      />
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />

      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-12 lg:p-10">
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.15em] text-subtle uppercase">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className="h-px w-6 bg-line-strong" />
            <span>{project.category}</span>
          </div>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{project.title}</h3>
          <p className="mt-4 line-clamp-3 leading-relaxed text-pretty text-muted sm:line-clamp-none">{project.summary}</p>
          <ul className="mt-6 hidden flex-wrap gap-2 sm:flex">
            {project.stack.slice(0, 5).map((tech) => (
              <li key={tech}>
                <Tag>{tech}</Tag>
              </li>
            ))}
          </ul>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium sm:mt-8">
            Read case study
            <span className="grid size-8 place-items-center rounded-full border border-line-strong transition-[background-color,color,border-color] duration-300 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </span>
        </div>

        <div className="order-1 lg:order-2">
          <BrowserFrame
            src={project.image}
            alt={`${project.title} screenshot`}
            address={project.domain}
            sizes="(min-width: 1024px) 640px, 100vw"
            className="transition-transform duration-700 ease-out-expo group-hover:-translate-y-1.5 group-hover:scale-[1.015]"
          />
        </div>
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10 rounded-[inherit]"
        aria-label={`Read the ${project.title} case study`}
        data-cursor="View"
      />
    </article>
  );
}
