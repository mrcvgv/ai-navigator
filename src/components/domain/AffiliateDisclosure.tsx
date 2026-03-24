import { cn } from "@/lib/utils";

interface AffiliateDisclosureProps {
  variant?: "inline" | "page";
  className?: string;
}

export function AffiliateDisclosure({ variant = "inline", className }: AffiliateDisclosureProps) {
  if (variant === "page") {
    return (
      <p className={cn("text-xs text-muted-foreground border-t border-border pt-4 mt-6", className)}>
        <strong>Affiliate disclosure:</strong> Some links on this page are affiliate links.
        If you sign up through them, we may earn a commission at no extra cost to you.
        This does not influence our editorial recommendations.
      </p>
    );
  }

  return (
    <p className={cn("text-[11px] text-muted-foreground/70", className)}>
      Some links are affiliate links. We may earn a commission.
    </p>
  );
}
