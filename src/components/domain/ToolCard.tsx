"use client";

import Link from "next/link";
import { Check, X, Plus, GitCompare } from "lucide-react";
import { CTAButton } from "@/components/domain/CTAButton";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";
import { useCompare } from "@/lib/compare-store";

const PRICING_COLOR: Record<string, string> = {
  free:          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  freemium:      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  paid:          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "open-source": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  contact:       "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};
const PRICING_LABEL: Record<string, string> = {
  free: "Free", freemium: "Freemium", paid: "Paid",
  "open-source": "Open Source", contact: "Contact",
};

interface ToolCardProps {
  tool: Tool;
  showCompare?: boolean;
  pageType?: "home" | "explore" | "category" | "compare" | "tool";
  ctaPosition?: "top" | "bottom" | "sidebar" | "card";
}

export function ToolCard({
  tool,
  showCompare = true,
  pageType = "explore",
  ctaPosition = "card",
}: ToolCardProps) {
  const { tools: compareTools, add, remove, canAdd } = useCompare();
  const isInCompare = compareTools.includes(tool.slug);
  const isFull = !canAdd && !isInCompare;

  return (
    <div className={cn(
      "group relative flex flex-col rounded-xl border bg-card transition-all hover:shadow-md",
      tool.sponsored
        ? "border-amber-200 dark:border-amber-800/40"
        : isInCompare
          ? "border-primary/60 shadow-sm shadow-primary/10"
          : "border-border hover:border-primary/20"
    )}>
      {/* Sponsored label */}
      {tool.sponsored && (
        <span className="absolute right-3 top-3 rounded-sm bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
          Sponsored
        </span>
      )}

      {/* Card body */}
      <Link href={`/tools/${tool.slug}`} className="flex-1 p-5 block">
        {/* Name + pricing */}
        <div className="mb-3 flex items-center gap-3 pr-14">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-base font-bold">
            {tool.name[0]}
          </div>
          <div className="min-w-0">
            <span className="block truncate font-semibold leading-tight group-hover:text-primary">
              {tool.name}
            </span>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-medium", PRICING_COLOR[tool.pricingModel])}>
                {PRICING_LABEL[tool.pricingModel]}
              </span>
              {tool.startingPrice && (
                <span className="text-[11px] text-muted-foreground">{tool.startingPrice}</span>
              )}
            </div>
          </div>
        </div>

        {/* Best for (primary signal) */}
        {tool.bestFor.length > 0 && (
          <ul className="mb-2 space-y-0.5">
            {tool.bestFor.slice(0, 2).map((item) => (
              <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Not ideal for */}
        {tool.notIdealFor.length > 0 && (
          <ul className="mb-3 space-y-0.5">
            {tool.notIdealFor.slice(0, 1).map((item) => (
              <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground/70">
                <X className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Often compared with */}
        {tool.alternatives.length > 0 && (
          <p className="text-[11px] text-muted-foreground/60">
            vs. {tool.alternatives.slice(0, 2).join(", ")}
          </p>
        )}
      </Link>

      {/* Action bar */}
      <div className="border-t border-border p-3 flex gap-2">
        {showCompare && (
          <button
            onClick={() => isInCompare ? remove(tool.slug) : add(tool.slug)}
            disabled={isFull}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isInCompare
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : isFull
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            {isInCompare ? (
              <><GitCompare className="h-3.5 w-3.5" />In tray</>
            ) : (
              <><Plus className="h-3.5 w-3.5" />Compare</>
            )}
          </button>
        )}
        <CTAButton
          href={tool.affiliateUrl ?? tool.officialUrl}
          label={tool.freePlan ? "Try free" : "Visit"}
          isAffiliate={!!tool.affiliateUrl}
          isSponsored={tool.sponsored}
          toolSlug={tool.slug}
          toolName={tool.name}
          pageType={pageType}
          ctaType={tool.sponsored ? "sponsored_tool" : "try_free"}
          ctaPosition={ctaPosition}
          className="shrink-0"
        />
      </div>
    </div>
  );
}
