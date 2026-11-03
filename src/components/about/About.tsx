import { Download } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollRevealText } from "@/components/animations/ScrollRevealText";
import { Certificates } from "@/components/certificates/Certificates";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about, education, experience } from "@/data/about";
import { certificates } from "@/data/certificates";
import { profile } from "@/data/profile";
import { Portrait } from "./Portrait";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="About"
          title={[{ text: "The engineer" }, { text: "behind the work.", accent: true }]}
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
          {/* Full width on phones; on tablets a full-width square would fill the whole screen. */}
          <div className="sm:max-w-sm lg:sticky lg:top-28 lg:max-w-none lg:self-start">
            <FadeIn whenInView y={40}>
              <Portrait src={about.portrait} alt={`Portrait of ${profile.name}`} location={profile.location} />
            </FadeIn>
          </div>

          <div>
            <ScrollRevealText
              text={about.statement}
              className="text-2xl leading-snug font-medium tracking-tight text-pretty sm:text-3xl"
            />
            <div className="mt-10 space-y-5">
              {about.paragraphs.map((paragraph) => (
                <FadeIn key={paragraph} whenInView>
                  <p className="leading-relaxed text-pretty text-muted">{paragraph}</p>
                </FadeIn>
              ))}
            </div>

            <FadeIn whenInView>
              <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {about.facts.map((fact) => (
                  <div key={fact.label} className="bg-background p-5">
                    <dt className="font-mono text-[11px] tracking-[0.2em] text-subtle uppercase">{fact.label}</dt>
                    <dd className="mt-2 text-sm">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              {profile.resumeUrl && (
                <ButtonLink href={profile.resumeUrl} download variant="secondary" size="sm" className="mt-6">
                  <Download className="size-3.5" /> Download CV
                </ButtonLink>
              )}
            </FadeIn>

            <div id="experience" className="mt-20">
              <FadeIn whenInView className="mb-10 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-subtle uppercase">
                <span className="h-px w-8 bg-line-strong" />
                Experience
              </FadeIn>
              <ExperienceTimeline items={experience} education={education} />
            </div>

            <div id="certifications" className="mt-20 scroll-mt-[88px]">
              <FadeIn whenInView className="mb-8 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-subtle uppercase">
                <span className="h-px w-8 bg-line-strong" />
                Certifications
              </FadeIn>
              <Certificates items={certificates} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
