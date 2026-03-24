/**
 * SponsoredSlot — renders a sponsored tool card in a designated placement.
 *
 * Usage:
 *   <SponsoredSlot placement="homepage" />
 *   <SponsoredSlot placement="category" />
 *
 * Returns null when no active sponsor exists for the placement.
 * This is a server component — no "use client" needed.
 */

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getActiveSponsors } from "@/config/sponsorConfig";
import { getToolBySlug } from "@/lib/repository";
import { SponsoredBadge } from "@/components/domain/SponsoredBadge";
import { CTAButton } from "@/components/domain/CTAButton";
import type { SponsorPlacement } from "@/config/sponsorConfig";
import type { PageType } from "@/components/domain/CTAButton";

interface SponsoredSlotProps {
  placement: SponsorPlacement;
  pageType?: PageType;
  comparisonSlug?: string;
}

export async function SponsoredSlot({ placement, pageType, comparisonSlug }: SponsoredSlotProps) {
  const sponsors = getActiveSponsors(placement);
  if (sponsors.length === 0) return null;

  const sponsor = sponsors[0];
  const tool = await getToolBySlug(sponsor.toolSlug);
  if (!tool) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800/40 dark:bg-amber-900/10">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
            {tool.name[0]}
          </div>
          <Link href={`/tools/${tool.slug}`} className="font-semibold hover:text-primary text-sm">
            {tool.name}
          </Link>
        </div>
        <SponsoredBadge label={sponsor.label} />
      </div>
      <p className="mb-3 text-xs text-muted-foreground leading-relaxed">{tool.shortDescription}</p>
      {tool.bestFor.length > 0 && (
        <p className="mb-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Best for:</strong>{" "}
          {tool.bestFor.slice(0, 2).join(" · ")}
        </p>
      )}
      <CTAButton
        href={tool.affiliateUrl ?? tool.officialUrl}
        label={tool.freePlan ? "Try free" : `From ${tool.startingPrice ?? "paid"}`}
        variant="primary"
        isAffiliate={!!tool.affiliateUrl}
        isSponsored={true}
        toolSlug={tool.slug}
        toolName={tool.name}
        comparisonSlug={comparisonSlug}
        pageType={pageType ?? "home"}
        ctaType="sponsored_tool"
        ctaPosition="card"
        className="w-full"
      />
    </div>
  );
}
