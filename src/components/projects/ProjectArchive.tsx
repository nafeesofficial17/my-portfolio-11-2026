"use client";

import { useId, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import type { ArchiveProject } from "@/types";

const filters = [
  { value: "all", label: "All" },
  { value: "web", label: "Web apps" },
  { value: "ai", label: "AI & ML" },
  { value: "automation", label: "Automation" },
] as const;

type Filter = (typeof filters)[number]["value"];

/** Rows shown under "All" before the list is expanded. */
const COLLAPSED_COUNT = 7;

/** One project: a compact row that opens to show its summary, key points and full stack. */
function ArchiveRow({
  project,
  open,
  onToggle,
  delay,
}: {
  project: ArchiveProject;
  open: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const panelId = useId();

  return (
    <li
      className="animate-fade-up border-b border-line transition-colors duration-300 hover:border-line-strong"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* `group` sits on the button, so only the clickable row reacts to hover, not the opened details. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="group flex w-full items-center gap-4 py-5 text-left"
      >
        <span className="grid flex-1 gap-1 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 md:grid-cols-[1.2fr_1fr_1.2fr]">
          <span className="text-lg font-medium tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2 sm:text-xl">
            {project.title}
          </span>
          <span className="text-sm text-muted sm:text-right md:text-left">{project.category}</span>
          <span className="hidden font-mono text-xs text-subtle md:block md:text-right">{project.stack.join(" · ")}</span>
        </span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors duration-300 group-hover:border-line-strong group-hover:text-foreground">
          <Plus className={cn("size-4 transition-transform duration-300", open && "rotate-45")} aria-hidden />
        </span>
      </button>

      {/* Animates open by growing the grid row from 0fr to 1fr. Closed content is inert, so it stays out of reach. */}
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-out-expo",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="max-w-2xl pb-6">
            <p className="leading-relaxed text-pretty text-muted">{project.summary}</p>
            {project.highlights && project.highlights.length > 0 && (
              <ul className="mt-4 space-y-2">
                {project.highlights.map((highlight, i) => (
                  // Points are free text from the admin panel and may repeat, so they're keyed by position.
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

export function ProjectArchive({ projects }: { projects: ArchiveProject[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  // Rows opened to show their details, by title.
  const [open, setOpen] = useState<Set<string>>(new Set());

  const matching = filter === "all" ? projects : projects.filter((project) => project.kind === filter);
  const collapsible = filter === "all" && matching.length > COLLAPSED_COUNT;
  const visible = collapsible && !expanded ? matching.slice(0, COLLAPSED_COUNT) : matching;

  return (
    <FadeIn whenInView className="mt-8">
      <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">
          More projects <span className="ml-1 font-mono text-xs text-subtle">{projects.length}</span>
        </h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {filters.map((option) => {
            const count =
              option.value === "all" ? projects.length : projects.filter((p) => p.kind === option.value).length;
            const active = filter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option.value)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors duration-300",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-line text-muted hover:border-line-strong hover:text-foreground",
                )}
              >
                {option.label}
                <span className={cn("font-mono", active ? "text-background/60" : "text-subtle")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ul key={filter}>
        {visible.map((project, i) => (
          <ArchiveRow
            key={project.title}
            project={project}
            open={open.has(project.title)}
            onToggle={() =>
              setOpen((current) => {
                const next = new Set(current);
                if (!next.delete(project.title)) next.add(project.title);
                return next;
              })
            }
            delay={Math.min(i, COLLAPSED_COUNT) * 40}
          />
        ))}
      </ul>

      {collapsible && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="group mt-4 inline-flex items-center gap-2 py-2 text-sm text-muted transition-colors duration-300 hover:text-foreground"
        >
          {expanded ? "Show fewer" : `Show all ${matching.length} projects`}
          <ChevronDown
            className={cn("size-4 transition-transform duration-300", expanded && "rotate-180")}
            aria-hidden
          />
        </button>
      )}
    </FadeIn>
  );
}
