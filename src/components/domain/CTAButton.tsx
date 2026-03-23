import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  href: string;
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
  isAffiliate?: boolean;
}

export function CTAButton({
  href,
  label = "Try for free",
  variant = "primary",
  className,
  isAffiliate = false,
}: CTAButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel={isAffiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
      className={cn("inline-flex", className)}
    >
      <Button
        variant={variant === "primary" ? "default" : "outline"}
        size="sm"
        className="gap-1.5"
      >
        {label}
        <ExternalLink className="h-3.5 w-3.5" />
      </Button>
    </a>
  );
}
