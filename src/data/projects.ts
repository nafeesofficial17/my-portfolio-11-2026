import type { ArchiveProject, Project } from "@/types";
import archiveData from "@/content/archive.json";
import projectData from "@/content/projects.json";

export const projects = projectData as Project[];

export const archiveProjects = archiveData as ArchiveProject[];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
