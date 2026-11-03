import * as icons from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import slugs from "@/content/skills.json";

/** Every Simple Icons logo by slug; the admin panel picks from these. */
export const iconsBySlug = new Map(
  Object.values(icons as Record<string, unknown>)
    .filter((icon): icon is SimpleIcon => typeof icon === "object" && icon !== null && "slug" in icon)
    .map((icon) => [icon.slug, icon]),
);

/** Logos for the tech marquee, in display order. Brand marks come from Simple Icons (CC0). */
export const techStack: SimpleIcon[] = slugs.flatMap((slug) => iconsBySlug.get(slug) ?? []);
