import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

type BrowserFrameProps = {
  src: StaticImageData;
  alt: string;
  address: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** A screenshot dressed in minimal browser chrome, cropped to a consistent 16:10. */
export function BrowserFrame({ src, alt, address, sizes, priority, className }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-surface-raised shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </div>
        <div className="mx-auto w-full max-w-60 truncate rounded-md bg-white/[0.05] px-3 py-1 text-center font-mono text-[11px] text-muted">
          {address}
        </div>
        <div className="w-[42px]" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className="object-cover object-left-top"
        />
      </div>
    </div>
  );
}
