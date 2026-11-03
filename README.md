# Mohd Nafees — Portfolio v2

Animated portfolio built with Next.js (App Router), TypeScript and Tailwind CSS.
Replaces the old CRA site in `../my_portfolio`.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Folder structure

```
src/
├── app/                    # Routes (Next.js App Router)
│   ├── layout.tsx          # Root layout: fonts, metadata
│   ├── globals.css         # Tailwind + design tokens
│   ├── (site)/             # The public site, wrapped in navbar, footer and chat (SiteShell)
│   │   ├── page.tsx        # Home page — composes all sections
│   │   └── projects/[slug]/ # Case study detail pages
│   ├── admin/              # Password-protected admin panel
│   └── api/
│       ├── contact/        # Contact form endpoint (sends email)
│       ├── chat/           # "Ask my AI" endpoint
│       └── admin/          # Admin sign-in, uploads and saves
├── components/             # One folder per section, like the old site
│   ├── admin/              # Admin panel forms
│   ├── layout/             # SiteShell: everything around a public page
│   ├── navbar/
│   ├── footer/
│   ├── home/               # Hero section
│   ├── about/
│   ├── services/           # What I do for clients (bento grid)
│   ├── projects/           # Selected work + project cards
│   ├── process/            # How I work (scroll timeline)
│   ├── skills/             # Tech stack marquee
│   ├── experience/         # Career timeline
│   ├── testimonials/
│   ├── certificates/       # Certifications list + lightbox
│   ├── contact/            # Contact form + CTA
│   ├── ai-chat/            # "Ask my AI" chat widget
│   ├── ui/                 # Reusable primitives (button, section heading, badge…)
│   └── animations/         # Reusable motion pieces (text reveal, smooth scroll, cursor…)
├── content/                # All site content as JSON (profile, projects, services…), edited by the admin panel
├── data/                   # Typed accessors for src/content
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and helpers (lib/admin: schema, auth, storage, uploads)
└── types/                  # Shared TypeScript types

public/
├── images/
│   ├── profile/            # Headshot (optimized WebP)
│   ├── projects/           # Project screenshots
│   └── certificates/       # Certificate scans (WebP)
└── resume/                 # Downloadable CV (PDF)
```

Content lives in `src/content/` as JSON, so updating the site never means editing components.

- **Edit content:** use the admin panel at `/admin` (see below), or edit the JSON files by hand.
- **Add a case study:** in the admin panel, open **Case studies → Add case study** and upload a screenshot. Its card on the home page and its page at `/projects/<slug>` are generated automatically.
- **Custom cursor labels:** add `data-cursor="Label"` to any element to show a labelled cursor bubble over it.

## Admin panel

`/admin` edits everything in `src/content/`: profile and contact details, CV, about, experience, case studies, more projects, certificates, testimonials, services, process and the tech-stack logos. Images are converted to WebP on upload.

- **Sign-in:** set `ADMIN_PASSWORD`. Wrap it in single quotes in `.env` files if it contains `#` or `$` (not in the Vercel dashboard, where values are taken literally).
- **Saving in production:** each save is one commit to the GitHub repo (`GITHUB_TOKEN`, `GITHUB_REPO`), and Vercel redeploys the site from it, so changes go live about a minute later. Use a fine-grained token limited to this repository with **Contents: Read and write**.
- **Saving locally:** under `npm run dev` without the GitHub variables, saves write straight to the files on your computer.
- If a section changed elsewhere since you opened it, the save is refused rather than overwriting; reload and redo the edit.

## Contact form setup

Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` (from [resend.com](https://resend.com)) to have the contact form email you. Without it, submissions are only logged to the terminal in development, and in production the form asks visitors to email you directly. Set `NEXT_PUBLIC_BOOKING_URL` to show a "Book a call" button.

## "Ask my AI" assistant

The chat widget (`src/components/ai-chat/`) streams answers via `/api/chat` from any OpenAI-compatible API. By default it uses OpenAI's open-weight `gpt-oss-120b` on Groq's free tier: set `CHAT_API_KEY` (from [console.groq.com/keys](https://console.groq.com/keys)) to turn it on. Without it, visitors get a friendly "please email me" message. Its knowledge is generated from the same content as the site (`src/lib/assistant.ts`), so editing your content updates the assistant too.

Free tiers have small per-minute limits (Groq's allows about one question a minute with this site's prompt), so an optional fallback provider takes over when the main one is rate-limited or down: set `CHAT_FALLBACK_API_KEY`, `CHAT_FALLBACK_BASE_URL` and `CHAT_FALLBACK_MODEL` (for example Cerebras, `https://api.cerebras.ai/v1`, `gpt-oss-120b`). `CHAT_BASE_URL` and `CHAT_MODEL` switch the main provider.

## Deploying (Vercel)

1. Push this folder to a new GitHub repository.
2. On [vercel.com](https://vercel.com), **Add New → Project**, import the repository, keep the detected Next.js settings, and deploy.
3. In **Settings → Environment Variables**, add the variables below, then redeploy.

| Variable | Needed for | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | Admin panel sign-in | Paste as-is, no quotes |
| `GITHUB_TOKEN` | Admin panel saves | Fine-grained token, this repo only, Contents: Read and write |
| `GITHUB_REPO` | Admin panel saves | `owner/repo`; `GITHUB_BRANCH` defaults to `main` |
| `CHAT_API_KEY` | "Ask my AI" chat | From console.groq.com/keys (free) |
| `CHAT_FALLBACK_API_KEY`, `CHAT_FALLBACK_BASE_URL`, `CHAT_FALLBACK_MODEL` | Chat fallback | Optional; e.g. Cerebras' free tier |
| `RESEND_API_KEY` | Contact form email | From resend.com |
| `CONTACT_FROM_EMAIL` | Contact form sender | Address on a domain verified in Resend |
| `CONTACT_TO_EMAIL` | Contact form inbox | Optional; defaults to the email in `profile.ts` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, share images | Set once you add a custom domain (e.g. `https://yourname.dev`); it's read at **build** time, so redeploy after changing it. Without it, Vercel's production URL is used |
| `NEXT_PUBLIC_BOOKING_URL` | "Book a call" button | Optional Cal.com / Calendly link |
| `CHAT_BASE_URL`, `CHAT_MODEL` | Chat provider override | Optional; default Groq, `openai/gpt-oss-120b` |

## Design system

- **Tokens** are CSS variables in `src/app/globals.css` (`--background`, `--accent`, …) exposed to Tailwind as `bg-background`, `text-muted`, `border-line`, etc. Restyle the site by changing tokens, not components.
- **Fonts:** Geist (UI), Geist Mono (labels), Instrument Serif italic (accent words).
- **Motion:** Motion for UI animation, Lenis for smooth scrolling (in-page `#anchor` and `/#anchor` links are smoothed by `SmoothScroll`). Shared easing lives in `src/lib/motion.ts`. Everything respects `prefers-reduced-motion`.

## Roadmap

- [x] **Phase 1:** design system, smooth scrolling, navbar, animated hero
- [x] **Phase 2:** selected work (stacking cards + case study pages), services bento grid, custom cursor
- [x] **Phase 3:** about (portrait + scroll-lit story), experience timeline, process, tech-stack marquee
- [x] **Phase 4:** testimonials, contact form (Resend) + optional booking link, footer
- [x] **Phase 5:** "Ask my AI" chat widget (open-weight model, streaming, grounded in the site's content)
- [x] **Phase 6:** SEO (metadata, sitemap, robots, JSON-LD), generated share images and icons, 404 page, Lighthouse 100 across the board
- [x] **Phase 7:** admin panel that saves to GitHub
- [ ] **Launch:** push to GitHub, deploy on Vercel, redirect the old Netlify site
