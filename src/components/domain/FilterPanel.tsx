"use client";

import { SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Category, FilterState } from "@/types";

interface FilterPanelProps {
  filters: FilterState;
  categories: Category[];
  onChange: (filters: Partial<FilterState>) => void;
}

const PRICING_OPTIONS = [
  { value: "", label: "All" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "open-source", label: "Open Source" },
] as const;

const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "A-Z" },
  { value: "newest", label: "Newest" },
] as const;

export function FilterPanel({ filters, categories, onChange }: FilterPanelProps) {
  const toggleBool = (key: keyof FilterState) =>
    onChange({ [key]: !filters[key] });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </div>

      <Separator />

      {/* Category */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</p>
        <div className="flex flex-col gap-1">
          <button
            className={`text-left text-sm py-1 px-2 rounded transition-colors ${
              !filters.category ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            }`}
            onClick={() => onChange({ category: "" })}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              className={`text-left text-sm py-1 px-2 rounded transition-colors flex justify-between ${
                filters.category === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
              onClick={() => onChange({ category: cat.slug })}
            >
              <span>{cat.name}</span>
              {cat.toolCount !== undefined && (
                <span className="opacity-60">{cat.toolCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Pricing */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Pricing</p>
        <div className="flex flex-wrap gap-1.5">
          {PRICING_OPTIONS.map((opt) => (
            <Badge
              key={opt.value}
              variant={filters.pricingModel === opt.value ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => onChange({ pricingModel: opt.value as FilterState["pricingModel"] })}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Features</p>
        <div className="space-y-1.5">
          {(
            [
              { key: "freePlan", label: "Free plan available" },
              { key: "apiAvailable", label: "API available" },
              { key: "openSource", label: "Open source" },
            ] as const
          ).map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!filters[key]}
                onChange={() => toggleBool(key)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sort by</p>
        <div className="flex flex-wrap gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <Badge
              key={opt.value}
              variant={filters.sortBy === opt.value ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => onChange({ sortBy: opt.value })}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
