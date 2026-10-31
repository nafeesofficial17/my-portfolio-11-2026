import type { ProcessStep } from "@/types";

export const processSteps: ProcessStep[] = [
  {
    title: "Discover",
    description: "An intro call to understand your goals, users and constraints. You leave with a clear scope, timeline and estimate.",
    deliverables: ["Scope", "Timeline", "Estimate"],
  },
  {
    title: "Plan & design",
    description: "Architecture, data model, user flows and milestones, agreed together before any code is written.",
    deliverables: ["Architecture", "User flows", "Milestones"],
  },
  {
    title: "Build & iterate",
    description: "Short sprints with regular demos on a live staging link, so you see real progress and can steer early.",
    deliverables: ["Demos", "Staging link"],
  },
  {
    title: "Launch & support",
    description: "Production deployment, monitoring and handover docs, then ongoing support as your product grows.",
    deliverables: ["Deployment", "Docs", "Support"],
  },
];
