"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import type { Certificate } from "@/types";

/** Compact list of certificates; each opens full size in a modal lightbox. */
export function Certificates({ items }: { items: Certificate[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Certificate | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !active) return;
    dialog.showModal();
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [active, lenis]);

  return (
    <>
      <FadeIn whenInView y={20}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => setActive(item)}
                className="group flex h-full w-full items-center gap-4 rounded-2xl border border-line bg-surface p-3 text-left transition-colors duration-300 hover:border-line-strong hover:bg-surface-raised"
              >
                <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover object-top transition-transform duration-500 ease-out-expo group-hover:scale-110"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm leading-snug font-medium text-balance">{item.title}</span>
                  <span className="mt-1 block text-xs text-subtle">
                    {item.issuer} · {item.year}
                  </span>
                </span>
                <Maximize2
                  aria-hidden
                  className="size-3.5 shrink-0 text-subtle transition-colors duration-300 group-hover:text-foreground"
                />
              </button>
            </li>
          ))}
        </ul>
      </FadeIn>

      <dialog
        ref={dialogRef}
        data-lenis-prevent
        aria-label={active?.title}
        onClose={() => setActive(null)}
        onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
        className="m-auto max-h-[90svh] w-[min(92vw,960px)] overflow-visible bg-transparent p-0 text-foreground backdrop:bg-black/80 backdrop:backdrop-blur-sm open:animate-fade-up"
      >
        {active && (
          <figure className="overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl">
            <Image
              src={active.image}
              alt={`${active.title} certificate, ${active.issuer}`}
              sizes="(min-width: 1040px) 960px, 92vw"
              className="max-h-[calc(90svh-5rem)] w-full bg-white object-contain"
            />
            <figcaption className="flex items-center justify-between gap-4 p-4">
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{active.title}</span>
                <span className="block truncate text-xs text-subtle">
                  {active.issuer} · {active.year}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {active.verifyUrl && (
                  <a
                    href={active.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-4 text-sm text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    Verify <ArrowUpRight className="size-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-full border border-line-strong text-muted transition-colors duration-300 hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
