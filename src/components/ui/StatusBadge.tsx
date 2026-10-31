import { cn } from "@/lib/utils";

export function StatusBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] py-1.5 pr-4 pl-3 text-sm text-muted backdrop-blur",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      {children}
    </span>
  );
}
