import type { ArchiveProject, Project } from "@/types";
import andleapImage from "../../public/images/projects/andleap.webp";
import anyesignImage from "../../public/images/projects/anyesign.webp";
import callflowImage from "../../public/images/projects/callflow.webp";
import purestoraImage from "../../public/images/projects/purestora.webp";

export const projects: Project[] = [
  {
    slug: "callflow-agent",
    title: "CallFlow Agent",
    category: "AI voice & chat automation",
    tagline: "AI agents that answer calls and chats for law firms, 24/7.",
    summary:
      "A multi-tenant platform where every law firm gets its own AI agent that talks to clients by phone and chat, answering from the firm's own documents.",
    role: "Full Stack & AI Engineer",
    timeline: "Sep 2025 – Apr 2026",
    team: 5,
    domain: "callflow · admin dashboard",
    image: callflowImage,
    accent: "#4f7cff",
    stack: ["Python", "Django", "FastAPI", "Next.js", "OpenAI", "Twilio", "ElevenLabs", "FAISS", "WebSockets", "PostgreSQL", "Docker", "Nginx"],
    challenge:
      "Law firms needed to handle client calls and website chats around the clock, with answers grounded in each firm's own knowledge, and with every firm's data, configuration and agents kept fully separate.",
    solution:
      "I helped build a hybrid Django + FastAPI backend with a RAG pipeline over FAISS vector search, real-time WebSocket channels for chat and voice, Twilio for inbound and outbound calls and ElevenLabs for natural speech, all managed from a Next.js admin dashboard.",
    highlights: [
      {
        title: "RAG knowledge base",
        description: "FAISS vector search over each firm's documents gives accurate, context-aware answers instead of generic ones.",
      },
      {
        title: "Human-like voice calls",
        description: "Twilio handles inbound and outbound calls while ElevenLabs gives the agent a natural, realistic voice.",
      },
      {
        title: "Multi-tenant by design",
        description: "Each firm gets isolated data, configuration and AI agents on one shared platform.",
      },
      {
        title: "Bulk calling campaigns",
        description: "Upload a CSV to run large calling campaigns with automatic retries and detailed reports.",
      },
      {
        title: "Transcripts & analytics",
        description: "Every call log, transcript and conversation is stored for auditing, with performance and engagement metrics.",
      },
      {
        title: "Embeddable chat widget",
        description: "Firms drop the AI chat into their own website with a single embed.",
      },
    ],
  },
  {
    slug: "anyesign",
    title: "anyEsign",
    category: "E-signature & payments SaaS",
    tagline: "Legally compliant document signing with payments built in.",
    summary:
      "A document signing platform for law firms and their clients: upload, send, sign and get paid in one flow, with a complete audit trail for compliance.",
    role: "Full Stack Engineer",
    timeline: "Sep 2025 – Apr 2026",
    team: 5,
    liveUrl: "https://anyesign.com",
    domain: "anyesign.com",
    image: anyesignImage,
    accent: "#3b5bdb",
    stack: ["Python", "Django", "FastAPI", "Next.js", "Stripe", "PostgreSQL", "Firebase", "AWS S3", "Docker", "CI/CD"],
    challenge:
      "Signing a retainer and paying for it were two separate, manual steps. Firms needed one secure workflow that is legally compliant, easy for clients on any device, and fully traceable.",
    solution:
      "We built scalable REST APIs in Django and FastAPI behind a fast Next.js frontend, with standards-compliant e-signatures, role-based workflows, Stripe payments tied to document execution, and an audit log of every action.",
    highlights: [
      {
        title: "Compliant e-signatures",
        description: "Secure, standards-compliant electronic signing that holds up legally.",
      },
      {
        title: "Payments on signing",
        description: "Stripe payments are linked to the document workflow, so signing and paying happen together.",
      },
      {
        title: "Full audit trail",
        description: "Every view, signature and status change is logged for compliance and transparency.",
      },
      {
        title: "Role-based workflows",
        description: "Creators, signers and admins each get exactly the access they need.",
      },
      {
        title: "Real-time notifications",
        description: "Automatic alerts for signing requests, status changes and completed transactions.",
      },
      {
        title: "Secure storage",
        description: "Documents are stored on S3 with strict access control and data protection.",
      },
    ],
  },
  {
    slug: "andleap",
    title: "&Leap",
    category: "Mentorship marketplace",
    tagline: "One-on-one mentorship with global leaders, booked and paid online.",
    summary:
      "A knowledge-sharing platform where mentees book paid one-on-one video sessions with mentors worldwide, with scheduling across time zones and a community blog.",
    role: "Full Stack Developer",
    team: 7,
    domain: "andleap.com",
    image: andleapImage,
    accent: "#f97316",
    stack: ["Python", "Django", "REST API", "MySQL", "Stripe", "Zoom API", "AWS S3", "JavaScript"],
    challenge:
      "Mentors and mentees live in different countries and time zones. The platform had to make availability, booking, video calls and payments feel like one simple flow, for four different kinds of users.",
    solution:
      "I built the Django backend and REST APIs: dynamic slot management from mentor availability, time-zone-aware booking, auto-generated Zoom meetings, Stripe payments released after the session, and separate panels for super admins, community admins, mentors and mentees.",
    highlights: [
      {
        title: "Smart session booking",
        description: "Slots are generated from each mentor's availability and shown in the mentee's own time zone.",
      },
      {
        title: "Built-in video calls",
        description: "Every booking creates its own Zoom meeting automatically.",
      },
      {
        title: "Pay after delivery",
        description: "Stripe payments complete once the session has actually taken place.",
      },
      {
        title: "Four role-based panels",
        description: "Super admin, community admin, mentor and mentee each get a tailored dashboard.",
      },
    ],
  },
  {
    slug: "purestora",
    title: "PureStora",
    category: "E-commerce platform",
    tagline: "An online store for natural, handcrafted products.",
    summary:
      "A complete e-commerce platform with real-time cart, OTP login, location-based taxes, coupons, Razorpay payments and automatic PDF invoices.",
    role: "Full Stack Developer",
    team: 2,
    liveUrl: "https://www.purestora.com",
    domain: "purestora.com",
    image: purestoraImage,
    accent: "#d97706",
    stack: ["Python", "Django", "PostgreSQL", "Razorpay", "JavaScript", "AJAX"],
    challenge:
      "The business needed a store it could run itself: promotions, taxes that change by location, and secure, low-friction checkout for first-time buyers.",
    solution:
      "I built it end to end in Django and PostgreSQL, with an AJAX cart that updates instantly, OTP login, multi-level location handling for tax rules, a coupon engine, Razorpay checkout, editable email templates and PDF invoices.",
    highlights: [
      {
        title: "Instant cart",
        description: "AJAX updates mean the cart changes without page reloads.",
      },
      {
        title: "Login with OTP",
        description: "Customers sign in with a one-time password, with no password to forget.",
      },
      {
        title: "Location-aware taxes",
        description: "Taxes are calculated from country, state and city, plus each order's details.",
      },
      {
        title: "Coupons & invoices",
        description: "Custom discount codes, and PDF invoices generated for every order.",
      },
    ],
  },
];

export const archiveProjects: ArchiveProject[] = [
  { title: "VPOS", category: "POS & card payments", stack: ["FastAPI", "React", "MSSQL", "WebSockets"] },
  { title: "Glovendor", category: "Social platform", stack: ["Django", "PayPal", "AWS S3"] },
  { title: "Raaves", category: "Location-based reviews", stack: ["Django REST", "MySQL", "AWS S3"] },
  { title: "Cancer Warrior Health", category: "Health planning", stack: ["Django REST", "MySQL"] },
  { title: "Demand Forecasting", category: "Machine learning", stack: ["TensorFlow", "scikit-learn", "Pandas"] },
  { title: "Face Mask Detection", category: "Computer vision", stack: ["VGG16", "Keras", "TensorFlow"] },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
