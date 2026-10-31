import type { Education, ExperienceItem } from "@/types";
import portrait from "../../public/images/profile/mohd-nafees.webp";

export const about = {
  portrait,
  statement:
    "I'm a full stack and AI engineer from Ahmedabad, India. For 4+ years I've helped startups and teams ship products end to end: Python backends that scale, fast Next.js interfaces, and AI that's actually useful, from RAG assistants to voice agents that pick up the phone.",
  paragraphs: [
    "I've built for clients in India, the UK and the US, across legal tech, e-commerce, mentorship platforms and data science. I like owning the whole problem, from the first conversation and the data model to the deploy and what happens after it.",
    "Clients tend to mention the same things: clear communication, clean code and on-time delivery. That's the bar I hold myself to on every project.",
  ],
  facts: [
    { label: "Based in", value: "Ahmedabad, India" },
    { label: "Time zone", value: "IST (UTC+5:30)" },
    { label: "Experience", value: "4+ years · 3 companies" },
    { label: "Focus", value: "AI products & full-stack platforms" },
  ],
};

export const experience: ExperienceItem[] = [
  {
    role: "AI/ML Engineer & Sr. Full Stack Engineer",
    company: "NeoSOFT Technologies",
    period: "Jul 2024 – Sep 2025",
    summary:
      "Built end-to-end AI/ML web apps: sales forecasting and real-time object detection models served through Django, FastAPI and Flask, with React dashboards and automated retraining pipelines.",
    tags: ["TensorFlow", "FastAPI", "React"],
  },
  {
    role: "Sr. Full Stack Software Engineer",
    company: "Savitriya Technologies",
    period: "Sep 2023 – Jul 2024",
    summary:
      "Shipped high-performance FastAPI + React apps, ran cloud servers end to end, and led a cross-functional team through planning, code reviews and mentoring.",
    tags: ["FastAPI", "React", "Team lead"],
  },
  {
    role: "Full Stack Software Engineer",
    company: "Hyperlink InfoSystem",
    period: "Jan 2022 – Aug 2023",
    summary:
      "Built scalable Django and Django REST Framework applications, designed databases, deployed to cloud servers, and worked directly with clients from requirements to delivery.",
    tags: ["Django", "REST APIs", "Deployment"],
  },
];

export const education: Education = {
  degree: "Integrated MCA (BCA + MCA)",
  school: "Indus University, Ahmedabad",
  period: "2017 – 2022",
  note: "8.14 CGPA",
};
