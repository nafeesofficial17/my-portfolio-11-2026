import type { ArchiveProject, Project } from "@/types";
import anyesignImage from "../../public/images/projects/anyesign.webp";
import callflowImage from "../../public/images/projects/callflow.webp";
import convertnicelyImage from "../../public/images/projects/convertnicely.webp";
import gamerStatsImage from "../../public/images/projects/gamer-stats.webp";
import purestoraImage from "../../public/images/projects/purestora.webp";

export const projects: Project[] = [
  {
    slug: "gamer-stats",
    title: "Gamer Stats",
    category: "Legal-tech verification platform",
    tagline: "Verified gaming history for law firms, across every major platform.",
    summary:
      "A legal-tech platform that helps law firms verify claimants' gaming history. It collects playtime from Xbox, PlayStation, Steam, Epic, Fortnite and Roblox and shows who qualifies.",
    role: "Full Stack Engineer",
    timeline: "2026 – ongoing",
    liveUrl: "https://gamer-stats.com",
    domain: "gamer-stats.com",
    image: gamerStatsImage,
    accent: "#0ea5e9",
    stack: ["Python", "Django", "DRF", "Celery", "Redis", "PostgreSQL", "Firebase", "Docker", "AWS"],
    challenge:
      "Law firms needed proof of how much time claimants had actually spent gaming. That data is spread across six different platforms, each with its own accounts and formats, and checking it by hand doesn't scale to large numbers of claimants.",
    solution:
      "A Django and Django REST Framework backend collects playtime from each platform, with Celery and Redis running the collection in the background. Firms get one secure workspace with live search, qualification results, reports, activity logs and real-time notifications, deployed with Docker on AWS.",
    highlights: [
      {
        title: "Six platforms, one view",
        description: "Playtime from Xbox, PlayStation, Steam, Epic, Fortnite and Roblox is gathered into a single profile per claimant.",
      },
      {
        title: "Who qualifies",
        description: "Firms see at a glance which claimants meet the criteria, instead of checking each account by hand.",
      },
      {
        title: "Live search & reports",
        description: "Find any claimant instantly and export the reports a case needs.",
      },
      {
        title: "Activity logs",
        description: "Every action is recorded, so firms can trace exactly who did what and when.",
      },
      {
        title: "Real-time notifications",
        description: "Teams are told the moment new results come in.",
      },
      {
        title: "Background processing",
        description: "Celery and Redis handle data collection in the background, so the app stays fast while large batches run.",
      },
    ],
  },
  {
    slug: "convertnicely",
    title: "ConvertNicely",
    category: "SaaS · online file converter",
    tagline: "100+ free file conversions, with no sign-up and nothing kept.",
    summary:
      "A privacy-focused online file converter with 100+ tools for images, PDFs, documents, audio, video and web pages. No sign-up is needed, and files are deleted automatically after conversion.",
    role: "Creator · Full Stack Engineer",
    timeline: "2026",
    liveUrl: "https://convertnicely.com",
    domain: "convertnicely.com",
    image: convertnicelyImage,
    accent: "#2563eb",
    stack: ["Next.js", "TypeScript", "FastAPI", "Celery", "Redis", "PostgreSQL", "FFmpeg", "LibreOffice", "Docker"],
    challenge:
      "Most online converters ask for an account, add watermarks or keep your files. The goal was one fast, free place to convert almost any everyday file, where uploads never stick around.",
    solution:
      "I designed and built it end to end: a Next.js and TypeScript frontend, a FastAPI backend with Celery and Redis queuing every conversion, FFmpeg for audio and video, LibreOffice for documents, and automatic clean-up that deletes files after processing. It all runs in Docker.",
    highlights: [
      {
        title: "100+ tools",
        description: "Converters for images, PDFs, documents, audio, video and web pages, all handled the same simple way.",
      },
      {
        title: "No sign-up",
        description: "Drop a file in and convert it. There's no account and no watermark.",
      },
      {
        title: "Private by default",
        description: "Uploads are deleted after conversion, and results are removed automatically soon after.",
      },
      {
        title: "Queued processing",
        description: "Celery and Redis run conversions in the background, so big files don't slow anyone else down.",
      },
      {
        title: "Media & documents",
        description: "FFmpeg handles audio and video, and LibreOffice handles Word, Excel and PowerPoint files.",
      },
      {
        title: "Smart format picker",
        description: "Drop any file and the site shows which formats it can become.",
      },
    ],
  },
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
    stack: ["Python", "Django", "MySQL", "Celery", "Redis", "Razorpay", "JavaScript", "AJAX"],
    challenge:
      "The business needed a store it could run itself: promotions, taxes that change by location, and secure, low-friction checkout for first-time buyers.",
    solution:
      "I built it end to end in Django and MySQL, with Celery and Redis for background jobs, with an AJAX cart that updates instantly, OTP login, multi-level location handling for tax rules, a coupon engine, Razorpay checkout, editable email templates and PDF invoices.",
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
  { title: "AndLeap", category: "Mentorship platform", stack: ["Django", "Stripe", "Zoom API"] },
  { title: "VPOS", category: "Point of sale & card payments", stack: ["FastAPI", "React", "WebSockets"] },
  { title: "Demand Forecasting", category: "Machine learning", stack: ["TensorFlow", "scikit-learn", "Pandas"] },
  { title: "Object Detection & Counting", category: "Computer vision", stack: ["YOLOv5", "OpenCV", "Django", "React"] },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
