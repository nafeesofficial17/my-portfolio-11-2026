import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-foreground text-background hover:bg-white shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_10px_40px_-10px_rgb(139_124_255/0.7)]",
  secondary:
    "border border-line-strong bg-white/[0.03] text-foreground backdrop-blur hover:border-white/25 hover:bg-white/[0.08]",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
};

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

/** A link styled as a button. Most CTAs on this site navigate, so this is the default "button". */
export function ButtonLink({ variant = "primary", size = "md", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium tracking-tight transition-[background-color,border-color,box-shadow] duration-300 ease-out-expo",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-accent/30 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-[400%]"
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}
