"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
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

export function ProjectArchive({ projects }: { projects: ArchiveProject[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);

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
          <li
            key={project.title}
            className="group animate-fade-up grid gap-1 border-b border-line py-5 transition-colors duration-300 hover:border-line-strong sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 md:grid-cols-[1.2fr_1fr_1.2fr]"
            style={{ animationDelay: `${Math.min(i, COLLAPSED_COUNT) * 40}ms` }}
          >
            <span className="text-lg font-medium tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2 sm:text-xl">
              {project.title}
            </span>
            <span className="text-sm text-muted sm:text-right md:text-left">{project.category}</span>
            <span className="hidden font-mono text-xs text-subtle md:block md:text-right">{project.stack.join(" · ")}</span>
          </li>
        ))}
      </ul>

      {collapsible && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="group mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors duration-300 hover:text-foreground"
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
