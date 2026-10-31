import type { Education, ExperienceItem } from "@/types";
import portrait from "../../public/images/profile/mohd-nafees.webp";

export const about = {
  portrait,
  statement:
    "I'm a full-stack and AI/ML engineer from Ahmedabad, India. For close to five years I've helped startups and teams ship products end to end: Python backends that scale, fast Next.js interfaces, and AI that's actually useful, from RAG assistants to voice agents that pick up the phone.",
  paragraphs: [
    "I've built for clients in India, the UK and the US, across legal tech, e-commerce, SaaS tools, mentorship platforms and data science. I like owning the whole problem, from the first conversation and the data model to the deploy and what happens after it.",
    "Clients tend to mention the same things: clear communication, clean code and on-time delivery. That's the bar I hold myself to on every project.",
  ],
  facts: [
    { label: "Based in", value: "Ahmedabad, India" },
    { label: "Time zone", value: "IST (UTC+5:30)" },
    { label: "Experience", value: "4.8+ years · 4 companies" },
    { label: "Focus", value: "AI products & full-stack platforms" },
  ],
};

export const experience: ExperienceItem[] = [
  {
    role: "Full-Stack & AI/ML Engineer",
    company: "Freelance",
    period: "Jun 2026 – Present",
    summary:
      "Launched ConvertNicely, an online file converter with 100+ tools, and building Gamer Stats, a legal-tech platform for verifying gaming playtime. I own the full client cycle: requirements, architecture, development and deployment.",
    tags: ["Next.js", "FastAPI", "Django"],
  },
  {
    role: "Software Engineer",
    company: "Primesource Consulting",
    period: "Sep 2025 – May 2026",
    summary:
      "Built agentic AI systems, including LLM workflows, RAG pipelines and AI voice bots with Twilio, and delivered full-stack apps in Django, FastAPI and Next.js with payments and e-signatures. Managed databases, deployments and client communication end to end.",
    tags: ["Agentic AI", "RAG", "Next.js"],
  },
  {
    role: "Software Engineer",
    company: "NeoSOFT Technologies",
    period: "Jul 2024 – Sep 2025",
    summary:
      "Built ML models for sales forecasting and real-time object detection, served them through Django, FastAPI and Flask APIs with React dashboards, and automated the pipelines for data ingestion, feature engineering and retraining.",
    tags: ["TensorFlow", "FastAPI", "React"],
  },
  {
    role: "Software Engineer",
    company: "Savitriya Technologies",
    period: "Sep 2023 – Jul 2024",
    summary:
      "Built FastAPI + React applications, API integrations and Python automation, managed cloud servers from deployment to security, and led the team through task planning, code reviews, mentoring and weekly client reports.",
    tags: ["FastAPI", "React", "Team lead"],
  },
  {
    role: "Software Engineer (Full Stack)",
    company: "Hyperlink Infosystem",
    period: "Jan 2022 – Aug 2023",
    summary:
      "Built scalable web apps and REST APIs with Django and Django REST Framework, handled database design, cloud deployment and server maintenance, and worked with clients on requirements and progress updates.",
    tags: ["Django", "REST APIs", "Deployment"],
  },
];

export const education: Education = {
  degree: "Integrated Master of Computer Applications (IMCA)",
  school: "Indus University, Ahmedabad",
  period: "2017 – 2022",
  note: "CGPA 8.2/10",
};
