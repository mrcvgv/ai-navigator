import { cn } from "@/lib/utils";

interface SponsoredBadgeProps {
  label?: string | null;
  className?: string;
}

export function SponsoredBadge({ label = "Sponsored", className }: SponsoredBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
        className
      )}
    >
      {label ?? "Sponsored"}
    </span>
  );
}

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary",
        className
      )}
    >
      Featured
    </span>
  );
}
