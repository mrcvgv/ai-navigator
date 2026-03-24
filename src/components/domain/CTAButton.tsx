"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics";

export type CtaType =
  | "try_free"
  | "visit_site"
  | "compare_now"
  | "featured_tool"
  | "related_tool"
  | "sponsored_tool"
  | "verdict_cta"
  | "sidebar_cta";

export type PageType =
  | "home"
  | "explore"
  | "category"
  | "compare"
  | "tool";

interface CTAButtonProps {
  href: string;
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
  isAffiliate?: boolean;
  isSponsored?: boolean;
  toolSlug?: string;
  toolName?: string;
  comparisonSlug?: string;
  pageType?: PageType;
  ctaType?: CtaType;
  ctaPosition?: "top" | "bottom" | "sidebar" | "card" | "verdict";
}

export function CTAButton({
  href,
  label = "Try for free",
  variant = "primary",
  className,
  isAffiliate = false,
  isSponsored = false,
  toolSlug,
  toolName,
  comparisonSlug,
  pageType,
  ctaType,
  ctaPosition,
}: CTAButtonProps) {
  const handleClick = () => {
    let destinationDomain = "";
    try {
      destinationDomain = new URL(href).hostname;
    } catch {
      destinationDomain = href;
    }

    track("outbound_click", {
      label,
      toolSlug: toolSlug ?? "",
      toolName: toolName ?? "",
      comparisonSlug: comparisonSlug ?? "",
      pageType: pageType ?? "unknown",
      ctaType: ctaType ?? "visit_site",
      ctaPosition: ctaPosition ?? "unknown",
      destinationDomain,
      isAffiliate,
      isSponsoredPlacement: isSponsored,
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel={isAffiliate || isSponsored ? "noopener noreferrer sponsored" : "noopener noreferrer"}
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
