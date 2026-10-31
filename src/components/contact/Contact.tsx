import { CalendarDays } from "lucide-react";
import { AskAiButton } from "@/components/ai-chat/AskAiButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { profile } from "@/data/profile";
import type { SocialLink } from "@/types";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";

const channels: SocialLink[] = [
  { platform: "phone", label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { platform: "whatsapp", label: "WhatsApp", href: profile.whatsapp },
  ...profile.socials.filter((social) => social.platform === "linkedin" || social.platform === "github"),
];

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-[600px] w-[min(100vw,1100px)] -translate-x-1/2 rounded-full bg-accent/15 blur-[160px]"
      />
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,black,transparent)]" />

      <Container>
        <SectionHeading
          index="06"
          eyebrow="Contact"
          title={[{ text: "Let's build" }, { text: "something great.", accent: true }]}
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <FadeIn whenInView className="space-y-10">
            {profile.availability.open && <StatusBadge>{profile.availability.label}</StatusBadge>}
            <p className="max-w-md text-lg leading-relaxed text-pretty text-muted">
              Tell me about your idea, product or problem. The more detail you share, the more useful my first reply will
              be.
            </p>

            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-subtle uppercase">Email me directly</p>
              <CopyEmail email={profile.email} />
            </div>

            {profile.bookingUrl && (
              <ButtonLink href={profile.bookingUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                <CalendarDays className="size-4" />
                Book a call
              </ButtonLink>
            )}

            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-subtle uppercase">Or reach me on</p>
              <ul className="flex flex-wrap gap-2">
                {channels.map((channel) => (
                  <li key={channel.platform}>
                    <a
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-foreground"
                    >
                      <SocialIcon platform={channel.platform} className="size-4" />
                      {channel.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <AskAiButton />

            <p className="text-sm text-subtle">
              Based in {profile.location} · IST (UTC+5:30) · Working with clients worldwide
            </p>
          </FadeIn>

          <FadeIn whenInView delay={0.15}>
            <div className="rounded-[2rem] border border-line bg-surface/80 p-6 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)] backdrop-blur sm:p-10">
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
