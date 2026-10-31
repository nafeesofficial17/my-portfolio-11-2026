import type { Profile } from "@/types";

export const profile: Profile = {
  name: "Mohd Nafees",
  initials: "MN",
  role: "Sr. Full Stack & AI/ML Engineer",
  location: "Ahmedabad, India",
  email: "nafeesofficial@gmail.com",
  whatsapp: "https://wa.me/917490078839",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || undefined,
  availability: { open: true, label: "Available for new projects" },
  headline: [
    { text: "I build" },
    { text: "AI-powered products", accent: true },
    { text: "and the full-stack systems behind them." },
  ],
  intro:
    "4+ years shipping Django, FastAPI and Next.js platforms, from RAG voice agents for law firms to e-signature and payment systems. I help startups and teams turn ideas into products people use.",
  description:
    "Full stack and AI/ML engineer building scalable web platforms with Python (Django, FastAPI) and Next.js, plus Generative AI, RAG and agentic systems.",
  stats: [
    { value: 4, suffix: "+", label: "Years building" },
    { value: 21, suffix: "+", label: "Projects shipped" },
    { value: 24, label: "Technologies" },
  ],
  socials: [
    { platform: "github", label: "GitHub", href: "https://github.com/nafeesofficial17" },
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/786-92-nafees" },
    { platform: "email", label: "Email", href: "mailto:nafeesofficial@gmail.com" },
  ],
};
