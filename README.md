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
│   ├── layout.tsx          # Root layout: fonts, metadata, navbar, footer
│   ├── page.tsx            # Home page — composes all sections
│   ├── globals.css         # Tailwind + design tokens
│   ├── projects/[slug]/    # Case study detail pages
│   └── api/
│       ├── contact/        # Contact form endpoint (sends email)
│       └── chat/           # "Ask my AI" endpoint
├── components/             # One folder per section, like the old site
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
│   ├── contact/            # Contact form + CTA
│   ├── ai-chat/            # "Ask my AI" chat widget
│   ├── ui/                 # Reusable primitives (button, section heading, badge…)
│   └── animations/         # Reusable motion pieces (text reveal, smooth scroll, cursor…)
├── data/                   # All site content as typed data (profile, projects, services…)
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and helpers
└── types/                  # Shared TypeScript types

public/
└── images/
    ├── profile/            # Headshot (optimized WebP)
    └── projects/           # Project screenshots
```

Content lives in `src/data/`, so updating the site means editing data files, not components.

- **Add a case study:** add a screenshot to `public/images/projects/` (WebP, ~1600px wide) and an entry to `projects` in `src/data/projects.ts`. Its card on the home page and its page at `/projects/<slug>` are generated automatically.
- **Custom cursor labels:** add `data-cursor="Label"` to any element to show a labelled cursor bubble over it.

## Contact form setup

Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` (from [resend.com](https://resend.com)) to have the contact form email you. Without it, submissions are only logged to the terminal in development, and in production the form asks visitors to email you directly. Set `NEXT_PUBLIC_BOOKING_URL` to show a "Book a call" button.

## "Ask my AI" assistant

The chat widget (`src/components/ai-chat/`) streams answers from Claude via `/api/chat`. Its knowledge is generated from the same `src/data/` files as the site (`src/lib/assistant.ts`), so editing your content updates the assistant too. Set `ANTHROPIC_API_KEY` in `.env.local` to turn it on; without it, visitors get a friendly "please email me" message. `CHAT_MODEL` optionally overrides the default model (`claude-opus-5-5`).

## Deploying (Vercel)

1. Push this folder to a new GitHub repository.
2. On [vercel.com](https://vercel.com), **Add New → Project**, import the repository, keep the detected Next.js settings, and deploy.
3. In **Settings → Environment Variables**, add the variables below, then redeploy.

| Variable | Needed for | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | "Ask my AI" chat | From console.anthropic.com |
| `RESEND_API_KEY` | Contact form email | From resend.com |
| `CONTACT_FROM_EMAIL` | Contact form sender | Address on a domain verified in Resend |
| `CONTACT_TO_EMAIL` | Contact form inbox | Optional; defaults to the email in `profile.ts` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, share images | Set once you add a custom domain (e.g. `https://yourname.dev`); it's read at **build** time, so redeploy after changing it. Without it, Vercel's production URL is used |
| `NEXT_PUBLIC_BOOKING_URL` | "Book a call" button | Optional Cal.com / Calendly link |
| `CHAT_MODEL` | Chat model override | Optional; default `claude-opus-5-5` |

## Design system

- **Tokens** are CSS variables in `src/app/globals.css` (`--background`, `--accent`, …) exposed to Tailwind as `bg-background`, `text-muted`, `border-line`, etc. Restyle the site by changing tokens, not components.
- **Fonts:** Geist (UI), Geist Mono (labels), Instrument Serif italic (accent words).
- **Motion:** Motion for UI animation, Lenis for smooth scrolling (in-page `#anchor` and `/#anchor` links are smoothed by `SmoothScroll`). Shared easing lives in `src/lib/motion.ts`. Everything respects `prefers-reduced-motion`.

## Roadmap

- [x] **Phase 1:** design system, smooth scrolling, navbar, animated hero
- [x] **Phase 2:** selected work (stacking cards + case study pages), services bento grid, custom cursor
- [x] **Phase 3:** about (portrait + scroll-lit story), experience timeline, process, tech-stack marquee
- [x] **Phase 4:** testimonials, contact form (Resend) + optional booking link, footer
- [x] **Phase 5:** "Ask my AI" chat widget (Claude, streaming, grounded in `src/data/`)
- [x] **Phase 6:** SEO (metadata, sitemap, robots, JSON-LD), generated share images and icons, 404 page, Lighthouse 100 across the board
- [ ] **Launch:** push to GitHub, deploy on Vercel, redirect the old Netlify site
