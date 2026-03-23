"use client";

import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTAButton } from "@/components/domain/CTAButton";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";
import { useCompare } from "@/lib/compare-store";

interface ToolCardProps {
  tool: Tool;
  showCompare?: boolean;
}

const PRICING_LABEL: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "Open Source",
  contact: "Contact",
};

const PRICING_COLOR: Record<string, string> = {
  free: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  freemium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  paid: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "open-source": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  contact: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export function ToolCard({ tool, showCompare = true }: ToolCardProps) {
  const { tools: compareTools, add, remove, canAdd } = useCompare();
  const isInCompare = compareTools.includes(tool.slug);

  const avgScore = Math.round(
    (Object.values(tool.scores).reduce((s, v) => s + v, 0) / 6) * 10
  ) / 10;

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {tool.sponsored && (
        <span className="absolute right-3 top-3 text-[10px] text-muted-foreground">
          Sponsored
        </span>
      )}

      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg font-bold">
            {tool.name[0]}
          </div>
          <div>
            <Link
              href={`/tools/${tool.slug}`}
              className="font-semibold leading-tight hover:text-primary"
            >
              {tool.name}
            </Link>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[11px] font-medium",
                  PRICING_COLOR[tool.pricingModel]
                )}
              >
                {PRICING_LABEL[tool.pricingModel]}
              </span>
              {tool.freePlan && (
                <span className="text-[11px] text-muted-foreground">Free plan</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm font-medium">
          <span className="text-muted-foreground text-xs">avg</span>
          <span>{avgScore}</span>
        </div>
      </div>

      <p className="mb-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {tool.shortDescription}
      </p>

      <div className="mb-4 flex flex-wrap gap-1">
        {tool.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2">
        <CTAButton
          href={tool.affiliateUrl ?? tool.officialUrl}
          label={tool.freePlan ? "Try free" : "View site"}
          isAffiliate={!!tool.affiliateUrl}
        />

        {showCompare && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1.5 text-xs",
              isInCompare && "text-primary"
            )}
            onClick={() => (isInCompare ? remove(tool.slug) : add(tool.slug))}
            disabled={!isInCompare && !canAdd}
          >
            {isInCompare ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Compare
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
