import type { About, ExperienceItem } from "@/types";
import aboutData from "@/content/about.json";
import experienceData from "@/content/experience.json";

const { education: educationData, ...rest } = aboutData as About;

export const about = rest;
export const education = educationData;
export const experience = experienceData as ExperienceItem[];
