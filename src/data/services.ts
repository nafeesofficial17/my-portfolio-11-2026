import type { Service } from "@/types";

export const services: Service[] = [
  {
    title: "AI agents & RAG chatbots",
    description:
      "Assistants that answer from your own documents and data, not the open internet, embedded in your site, app or support desk.",
    tags: ["OpenAI", "RAG", "FAISS", "Agentic AI"],
    visual: "chat",
  },
  {
    title: "Voice AI & call automation",
    description: "Human-sounding agents that make and take calls, follow up and log every transcript.",
    tags: ["Twilio", "ElevenLabs"],
    visual: "voice",
  },
  {
    title: "Full-stack web apps",
    description: "SaaS products, dashboards and portals with fast Next.js frontends, built to scale.",
    tags: ["Next.js", "React", "JavaScript"],
    visual: "web",
  },
  {
    title: "APIs & backend systems",
    description: "Secure REST and real-time APIs, multi-tenant architecture and clean data models.",
    tags: ["Django", "FastAPI", "PostgreSQL"],
    visual: "api",
  },
  {
    title: "Data & machine learning",
    description: "Forecasting, classification and analytics that turn your data into decisions.",
    tags: ["TensorFlow", "scikit-learn", "Pandas"],
    visual: "data",
  },
  {
    title: "Payments, integrations & deployment",
    description:
      "Stripe, Razorpay, PayPal, Zoom and more, connected cleanly, then shipped with Docker, Nginx and CI/CD so it stays up.",
    tags: ["Stripe", "Docker", "CI/CD"],
    visual: "integrations",
  },
];
