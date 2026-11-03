import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { navItems } from "@/data/navigation";
import { profile } from "@/data/profile";
import { CurrentYear, LocalTime } from "./LocalTime";

const connect = [
  ...profile.socials,
  { platform: "whatsapp" as const, label: "WhatsApp", href: profile.whatsapp },
  { platform: "phone" as const, label: "Call", href: `tel:${profile.phone.replace(/\s/g, "")}` },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <Container className="grid grid-cols-2 gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Link href="/#home" className="inline-flex items-center gap-2.5">
            <span aria-hidden className="grid size-9 place-items-center rounded-lg bg-linear-to-br from-accent to-accent-2 text-sm font-semibold text-background">
              {profile.initials}
            </span>
            <span className="font-medium tracking-tight">{profile.name}</span>
          </Link>
          <p className="mt-5 max-w-xs leading-relaxed text-muted">
            {profile.role}. Building AI-powered products and the full-stack systems behind them.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-block text-lg font-medium tracking-tight underline decoration-line-strong underline-offset-8 transition-colors hover:decoration-accent"
          >
            {profile.email}
          </a>
        </div>

        <nav aria-label="Footer">
          <p className="font-mono text-[11px] tracking-[0.2em] text-subtle uppercase">Sitemap</p>
          <ul className="mt-4 space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1 text-muted transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-subtle uppercase">Connect</p>
          <ul className="mt-4 space-y-1">
            {connect.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 py-1 text-muted transition-colors hover:text-foreground"
                >
                  <SocialIcon platform={social.platform} className="size-4" />
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container>
        <div className="flex flex-col gap-4 border-t border-line py-6 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {profile.name}. All rights reserved.
          </p>
          <p>
            Local time in Ahmedabad: <LocalTime />
          </p>
          <Link
            href="/#home"
            className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
          >
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-line transition-colors group-hover:border-line-strong">
              <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </div>
      </Container>

      {/* Oversized wordmark that sinks below the fold. */}
      <div aria-hidden className="pointer-events-none -mb-[4vw] overflow-hidden select-none">
        <p className="bg-linear-to-b from-white/[0.09] to-transparent bg-clip-text text-center text-[17vw] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent">
          {profile.name}
        </p>
      </div>
    </footer>
  );
}
