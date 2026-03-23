"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics";

interface CTAButtonProps {
  href: string;
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
  isAffiliate?: boolean;
  toolName?: string;
  context?: string;
}

export function CTAButton({
  href,
  label = "Try for free",
  variant = "primary",
  className,
  isAffiliate = false,
  toolName,
  context,
}: CTAButtonProps) {
  const handleClick = () => {
    track("cta_click", {
      label,
      href,
      isAffiliate,
      toolName: toolName ?? "",
      context: context ?? "unknown",
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel={isAffiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
      className={cn("inline-flex", className)}
      onClick={handleClick}
    >
      <Button
        variant={variant === "primary" ? "default" : "outline"}
        size="sm"
        className="gap-1.5 w-full"
      >
        {label}
        <ExternalLink className="h-3.5 w-3.5" />
      </Button>
    </a>
  );
}
