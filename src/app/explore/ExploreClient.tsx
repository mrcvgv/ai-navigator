"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/domain/SearchBar";
import { FilterPanel } from "@/components/domain/FilterPanel";
import { ToolCard } from "@/components/domain/ToolCard";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tool, Category, FilterState } from "@/types";

interface Props {
  initialTools: Tool[];
  categories: Category[];
  initialCategory: string;
  initialFreePlan: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  category: "",
  freePlan: false,
  apiAvailable: false,
  openSource: false,
  pricingModel: "",
  platform: "",
  sortBy: "rating",
};

export function ExploreClient({ initialTools, categories, initialCategory, initialFreePlan }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: initialCategory,
    freePlan: initialFreePlan,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...initialTools];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (filters.category) result = result.filter((t) => t.category === filters.category);
    if (filters.freePlan) result = result.filter((t) => t.freePlan);
    if (filters.apiAvailable) result = result.filter((t) => t.apiAvailable);
    if (filters.openSource) result = result.filter((t) => t.openSource);
    if (filters.pricingModel) result = result.filter((t) => t.pricingModel === filters.pricingModel);
    if (filters.platform) result = result.filter((t) => t.platforms.includes(filters.platform as any));

    if (filters.sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === "rating") {
      result.sort((a, b) => {
        const sa = Object.values(a.scores).reduce((s, v) => s + v, 0);
        const sb = Object.values(b.scores).reduce((s, v) => s + v, 0);
        return sb - sa;
      });
    }

    return result;
  }, [initialTools, filters]);

  const update = (partial: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...partial }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 pb-24">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Explore AI Tools</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} tools found
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside
          className={`w-56 shrink-0 ${sidebarOpen ? "block" : "hidden"} lg:block`}
        >
          <FilterPanel
            filters={filters}
            categories={categories}
            onChange={update}
          />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <SearchBar
            value={filters.search}
            onChange={(v) => update({ search: v })}
            className="mb-6"
          />
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              No tools match your filters.{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear all
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
