import { FadeIn } from "@/components/animations/FadeIn";
import type { ArchiveProject } from "@/types";

export function ProjectArchive({ projects }: { projects: ArchiveProject[] }) {
  return (
    <FadeIn whenInView className="mt-8">
      <div className="flex items-baseline justify-between border-b border-line pb-4">
        <h3 className="text-lg font-medium">More projects</h3>
        <span className="font-mono text-xs text-subtle">{projects.length} more</span>
      </div>
      <ul>
        {projects.map((project) => (
          <li
            key={project.title}
            className="group grid gap-1 border-b border-line py-5 transition-colors duration-300 hover:border-line-strong sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 md:grid-cols-[1.2fr_1fr_1.2fr]"
          >
            <span className="text-lg font-medium tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2 sm:text-xl">
              {project.title}
            </span>
            <span className="text-sm text-muted sm:text-right md:text-left">{project.category}</span>
            <span className="hidden font-mono text-xs text-subtle md:block md:text-right">{project.stack.join(" · ")}</span>
          </li>
        ))}
      </ul>
    </FadeIn>
  );
}
