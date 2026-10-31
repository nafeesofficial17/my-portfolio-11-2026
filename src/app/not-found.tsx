import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="relative isolate flex min-h-svh items-center overflow-hidden py-32">
      <div
        aria-hidden
        className="absolute top-[-10%] left-1/2 -z-10 size-[min(90vw,800px)] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]"
      />
      <Container className="text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-subtle uppercase">Error 404</p>
        <h1 className="mt-6 text-[clamp(3rem,10vw,7rem)] leading-none font-semibold tracking-[-0.045em]">
          Lost in the{" "}
          <span className="text-gradient pr-[0.06em] font-serif font-normal tracking-[-0.02em] italic">void.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted">
          This page doesn&apos;t exist, or it moved. Let&apos;s get you back to something real.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">
            <ArrowLeft className="size-4" /> Back home
          </ButtonLink>
          <ButtonLink href="/#work" variant="secondary">
            See my work
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
