"use client";

import Link from "next/link";
import { Plus, Check, GitCompare } from "lucide-react";
import { CTAButton } from "@/components/domain/CTAButton";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";
import { useCompare } from "@/lib/compare-store";

const PRICING_COLOR: Record<string, string> = {
  free:         "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  freemium:     "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  paid:         "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "open-source":"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  contact:      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};
const PRICING_LABEL: Record<string, string> = {
  free: "Free", freemium: "Freemium", paid: "Paid",
  "open-source": "Open Source", contact: "Contact",
};

export function ToolCard({ tool, showCompare = true }: { tool: Tool; showCompare?: boolean }) {
  const { tools: compareTools, add, remove, canAdd } = useCompare();
  const isInCompare = compareTools.includes(tool.slug);
  const isFull = !canAdd && !isInCompare;

  const avgScore = Math.round(
    (Object.values(tool.scores).reduce((s, v) => s + v, 0) / 5) * 10
  ) / 10;

  return (
    <div className={cn(
      "group relative flex flex-col rounded-xl border bg-card transition-all hover:shadow-md",
      isInCompare
        ? "border-primary/60 shadow-sm shadow-primary/10"
        : "border-border hover:border-primary/20"
    )}>
      {tool.sponsored && (
        <span className="absolute right-3 top-3 text-[10px] text-muted-foreground">Sponsored</span>
      )}

      {/* Card body — clicking navigates to tool detail */}
      <Link href={`/tools/${tool.slug}`} className="flex-1 p-5 block">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg font-bold">
              {tool.name[0]}
            </div>
            <div>
              <span className="font-semibold leading-tight group-hover:text-primary block">
                {tool.name}
              </span>
              <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-medium", PRICING_COLOR[tool.pricingModel])}>
                  {PRICING_LABEL[tool.pricingModel]}
                </span>
                {tool.freePlan && (
                  <span className="text-[11px] text-muted-foreground">Free plan</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-base font-bold">{avgScore}</div>
            <div className="text-[10px] text-muted-foreground">/ 5</div>
          </div>
        </div>

        <p className="mb-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1">
          {tool.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
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
              <><Check className="h-3.5 w-3.5" />Added</>
            ) : (
              <><GitCompare className="h-3.5 w-3.5" />Compare</>
            )}
          </button>
        )}
        <CTAButton
          href={tool.affiliateUrl ?? tool.officialUrl}
          label={tool.freePlan ? "Try free" : "Visit"}
          isAffiliate={!!tool.affiliateUrl}
          className="shrink-0"
        />
      </div>
    </div>
  );
}
