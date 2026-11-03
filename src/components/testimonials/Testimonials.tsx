import { Quote } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ testimonial, featured }: { testimonial: Testimonial; featured: boolean }) {
  return (
    <SpotlightCard className={cn("flex h-full flex-col justify-between gap-10 p-7 sm:p-9", featured && "lg:p-12")}>
      <div>
        <Quote className={cn("text-accent", featured ? "size-10" : "size-7")} aria-hidden />
        <blockquote
          className={cn(
            "mt-6 text-pretty",
            featured ? "text-xl leading-relaxed font-medium tracking-tight sm:text-2xl" : "leading-relaxed text-muted",
          )}
        >
          “{testimonial.quote}”
        </blockquote>
      </div>
      <figcaption className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-linear-to-br from-accent to-accent-2 text-sm font-semibold text-background">
          {initials(testimonial.name)}
        </span>
        <span>
          <span className="block font-medium">{testimonial.name}</span>
          <span className="block text-sm text-subtle">Client · {testimonial.location}</span>
        </span>
      </figcaption>
    </SpotlightCard>
  );
}

export function Testimonials() {
  const [featured, ...rest] = testimonials;
  // Testimonials are editable in the admin panel; with none left, the section is simply left out.
  if (!featured) return null;

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 -z-10 h-[500px] w-[min(70vw,700px)] -translate-y-1/2 rounded-full bg-accent-2/[0.06] blur-[140px]"
      />
      <Container>
        <SectionHeading
          index="05"
          eyebrow="Testimonials"
          title={[{ text: "What clients" }, { text: "say.", accent: true }]}
          description="Real words from people I've built for."
        />
        <div className="mt-16 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <FadeIn whenInView className="lg:col-span-2 lg:row-span-2">
            <figure className="h-full">
              <TestimonialCard testimonial={featured} featured />
            </figure>
          </FadeIn>
          {rest.map((testimonial, i) => (
            <FadeIn key={testimonial.quote} whenInView delay={0.1 + i * 0.1}>
              <figure className="h-full">
                <TestimonialCard testimonial={testimonial} featured={false} />
              </figure>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
