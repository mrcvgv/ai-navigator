/**
 * Data Repository
 *
 * All data access goes through this module.
 * To migrate to Supabase: replace the implementations below
 * with Supabase client queries — the function signatures stay the same.
 */

import { tools as mockTools } from "@/data/tools";
import { categories as mockCategories } from "@/data/categories";
import { comparisons as mockComparisons } from "@/data/comparisons";
import type { Tool, Category, Comparison, FilterState } from "@/types";

// ─── Tools ───────────────────────────────────────────────────────────────────

export async function getAllTools(): Promise<Tool[]> {
  return mockTools;
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  return mockTools.find((t) => t.slug === slug) ?? null;
}

export async function getToolsByCategory(categorySlug: string): Promise<Tool[]> {
  return mockTools.filter((t) => t.category === categorySlug);
}

export async function getFeaturedTools(): Promise<Tool[]> {
  return mockTools.filter((t) => t.featured);
}

export async function getToolsBySlugs(slugs: string[]): Promise<Tool[]> {
  return mockTools.filter((t) => slugs.includes(t.slug));
}

export async function getFilteredTools(filters: Partial<FilterState>): Promise<Tool[]> {
  let result = [...mockTools];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (filters.category) {
    result = result.filter((t) => t.category === filters.category);
  }

  if (filters.freePlan) {
    result = result.filter((t) => t.freePlan);
  }

  if (filters.apiAvailable) {
    result = result.filter((t) => t.apiAvailable);
  }

  if (filters.openSource) {
    result = result.filter((t) => t.openSource);
  }

  if (filters.japaneseSupport) {
    result = result.filter((t) => t.japaneseSupport);
  }

  if (filters.pricingModel) {
    result = result.filter((t) => t.pricingModel === filters.pricingModel);
  }

  if (filters.platform) {
    result = result.filter((t) => t.platforms.includes(filters.platform as any));
  }

  if (filters.sortBy === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sortBy === "rating") {
    result.sort((a, b) => {
      const scoreA = Object.values(a.scores).reduce((s, v) => s + v, 0);
      const scoreB = Object.values(b.scores).reduce((s, v) => s + v, 0);
      return scoreB - scoreA;
    });
  }

  return result;
}

export async function getAlternatives(tool: Tool): Promise<Tool[]> {
  return mockTools.filter((t) => tool.alternatives.includes(t.slug));
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  return mockCategories.map((cat) => ({
    ...cat,
    toolCount: mockTools.filter((t) => t.category === cat.slug).length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cat = mockCategories.find((c) => c.slug === slug);
  if (!cat) return null;
  return {
    ...cat,
    toolCount: mockTools.filter((t) => t.category === slug).length,
  };
}

// ─── Comparisons ──────────────────────────────────────────────────────────────

export async function getAllComparisons(): Promise<Comparison[]> {
  return mockComparisons;
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | null> {
  return mockComparisons.find((c) => c.slug === slug) ?? null;
}

export async function getComparisonsForTool(toolSlug: string): Promise<Comparison[]> {
  return mockComparisons.filter((c) => c.toolSlugs.includes(toolSlug));
}
