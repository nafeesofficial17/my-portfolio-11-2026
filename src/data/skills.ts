import * as icons from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import slugs from "@/content/skills.json";

const bySlug = new Map(
  Object.values(icons as Record<string, unknown>)
    .filter((icon): icon is SimpleIcon => typeof icon === "object" && icon !== null && "slug" in icon)
    .map((icon) => [icon.slug, icon]),
);

/** Logos for the tech marquee, in display order. Brand marks come from Simple Icons (CC0). */
export const techStack: SimpleIcon[] = slugs.flatMap((slug) => bySlug.get(slug) ?? []);
