import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { archiveProjects, projects } from "@/data/projects";
import { ProjectArchive } from "./ProjectArchive";
import { ProjectCard } from "./ProjectCard";
import { StackedCard, StackedCards } from "./StackedCards";

export function SelectedWork() {
  return (
    <section id="work" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="01"
          eyebrow="Selected work"
          title={[{ text: "Real products," }, { text: "shipped", accent: true }, { text: "for real clients." }]}
          description="From AI voice agents to e-signature SaaS, a few of the platforms I've built and helped take live."
        />

        <StackedCards>
          {projects.map((project, i) => (
            <StackedCard key={project.slug} index={i} total={projects.length}>
              <ProjectCard project={project} index={i} />
            </StackedCard>
          ))}
        </StackedCards>

        <ProjectArchive projects={archiveProjects} />
      </Container>
    </section>
  );
}
