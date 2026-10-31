import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/process";
import { ProcessSteps } from "./ProcessSteps";

export function Process() {
  return (
    <section id="process" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="04"
          eyebrow="Process"
          title={[{ text: "How we'll" }, { text: "work together.", accent: true }]}
          description="A simple, transparent process, so you always know what's happening, what's next and what it costs."
        />
        <div className="mt-20">
          <ProcessSteps steps={processSteps} />
        </div>
      </Container>
    </section>
  );
}
