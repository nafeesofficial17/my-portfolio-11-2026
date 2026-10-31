import type { Profile } from "@/types";

export const profile: Profile = {
  name: "Mohd Nafees",
  initials: "MN",
  role: "Senior Full Stack & AI/ML Engineer",
  location: "Ahmedabad, India",
  email: "nafeesofficial17@gmail.com",
  whatsapp: "https://wa.me/917490078839",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || undefined,
  resumeUrl: "/resume/mohd-nafees-cv.pdf",
  availability: { open: true, label: "Available for new projects" },
  highlight: { label: "Databricks Certified GenAI Engineer Associate", href: "/#certifications" },
  headline: [
    { text: "I build" },
    { text: "AI-powered products", accent: true },
    { text: "and the full-stack systems behind them." },
  ],
  intro:
    "4.8+ years shipping Django, FastAPI and Next.js products, from RAG voice agents and legal-tech platforms to a 100+ tool file converter. I help startups and teams turn ideas into products people use.",
  description:
    "Freelance full-stack & AI/ML engineer with 4.8+ years building Django, FastAPI and Next.js products, RAG chatbots and AI voice agents. Databricks Certified Generative AI Engineer Associate.",
  stats: [
    { value: 4.8, suffix: "+", label: "Years experience" },
    { value: 9, suffix: "+", label: "Client projects delivered" },
    { value: 100, suffix: "+", label: "Conversion tools built" },
  ],
  socials: [
    { platform: "github", label: "GitHub", href: "https://github.com/nafeesofficial17" },
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/786-92-nafees" },
    { platform: "email", label: "Email", href: "mailto:nafeesofficial17@gmail.com" },
  ],
};
