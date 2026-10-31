import type { StaticImageData } from "next/image";

export type SocialPlatform = "github" | "linkedin" | "email" | "whatsapp";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: `/#${string}`;
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

/** A run of words in a headline; `accent` words get the serif-italic gradient style. */
export interface HeadlineSegment {
  text: string;
  accent?: boolean;
}

export interface Profile {
  name: string;
  initials: string;
  role: string;
  location: string;
  email: string;
  whatsapp: string;
  /** Cal.com / Calendly link; the "Book a call" button only shows when this is set. */
  bookingUrl?: string;
  /** Downloadable CV in public/; the "Download CV" button only shows when this is set. */
  resumeUrl?: string;
  availability: { open: boolean; label: string };
  headline: HeadlineSegment[];
  intro: string;
  description: string;
  stats: Stat[];
  socials: SocialLink[];
}

export interface ProjectHighlight {
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  summary: string;
  role: string;
  timeline?: string;
  team?: number;
  liveUrl?: string;
  /** Domain shown in the browser frame's address bar. */
  domain: string;
  image: StaticImageData;
  /** Brand color used for the glow behind the screenshot. */
  accent: string;
  stack: string[];
  challenge: string;
  solution: string;
  highlights: ProjectHighlight[];
}

export interface ArchiveProject {
  title: string;
  category: string;
  kind: "web" | "ai" | "automation";
  stack: string[];
}

export type ServiceVisual = "chat" | "voice" | "web" | "api" | "data" | "integrations";

export interface Service {
  title: string;
  description: string;
  tags: string[];
  visual: ServiceVisual;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  summary: string;
  tags: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  note: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  year: string;
  image: StaticImageData;
  verifyUrl?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  deliverables: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
}
