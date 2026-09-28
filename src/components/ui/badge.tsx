import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "live" | "muted" | "gold";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-accent/10 text-accent",
  live: "bg-red-600 text-white",
  muted: "bg-surface-tint text-ink-muted",
  gold: "bg-gold/15 text-gold",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {variant === "live" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      )}
      {children}
    </span>
  );
}
