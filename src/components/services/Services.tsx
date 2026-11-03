import { FadeIn } from "@/components/animations/FadeIn";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Tag } from "@/components/ui/Tag";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";
import { ServiceVisualFor } from "./ServiceVisuals";

// Bento placement, in the same order as `services`. Wide tiles lay text and visual side by side.
// Services are editable in the admin panel, so any beyond these six get a regular tile.
const layout = [
  { span: "md:col-span-2 lg:col-span-4", wide: true, visual: "h-72 lg:h-auto lg:min-h-80" },
  { span: "lg:col-span-2", wide: false, visual: "h-64" },
  { span: "lg:col-span-2", wide: false, visual: "h-64" },
  { span: "lg:col-span-2", wide: false, visual: "h-64" },
  { span: "lg:col-span-2", wide: false, visual: "h-64" },
  { span: "md:col-span-2 lg:col-span-6", wide: true, visual: "h-40 lg:h-auto" },
];
const regularTile = { span: "lg:col-span-2", wide: false, visual: "h-64" };

function ServiceCard({ service, tile }: { service: Service; tile: typeof regularTile }) {
  const { wide, visual: visualClass } = tile;
  return (
    <SpotlightCard
      className={cn("flex h-full flex-col", wide && "lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]")}
    >
      <div className={cn("relative min-w-0 p-5", visualClass, wide && "lg:order-2 lg:p-6")}>
        <ServiceVisualFor visual={service.visual} />
      </div>
      <div className={cn("relative mt-auto p-6 pt-2 sm:p-7 sm:pt-2", wide && "lg:order-1 lg:flex lg:flex-col lg:justify-end lg:pt-7")}>
        <h3 className="text-xl font-semibold tracking-tight">{service.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">{service.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </SpotlightCard>
  );
}

export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[600px] w-[min(90vw,1000px)] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />
      <Container>
        <SectionHeading
          index="02"
          eyebrow="Services"
          title={[{ text: "What I can" }, { text: "build", accent: true }, { text: "for you." }]}
          description="One engineer from idea to production: the AI, the backend, the interface and the deployment."
        />

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {services.map((service, i) => (
            <FadeIn key={service.title} whenInView delay={(i % 3) * 0.08} className={(layout[i] ?? regularTile).span}>
              <ServiceCard service={service} tile={layout[i] ?? regularTile} />
            </FadeIn>
          ))}
        </div>

        <FadeIn whenInView className="mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <p className="text-muted">Have something else in mind?</p>
          <ButtonLink href="/#contact" variant="secondary" size="sm">
            Tell me about it
          </ButtonLink>
        </FadeIn>
      </Container>
    </section>
  );
}
