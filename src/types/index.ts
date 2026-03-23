export type PricingModel = "free" | "freemium" | "paid" | "open-source" | "contact";

export type ToolStatus = "active" | "beta" | "dead";

export type Platform = "web" | "ios" | "android" | "mac" | "windows" | "linux" | "api";

export interface ToolScores {
  beginner: number;      // 1-5
  professional: number;  // 1-5
  value: number;         // 1-5
  speed: number;         // 1-5
  quality: number;       // 1-5
  japanese: number;      // 1-5
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  subcategories: string[];
  tags: string[];
  bestFor: string[];
  notIdealFor: string[];
  pricingModel: PricingModel;
  startingPrice: string | null;
  freePlan: boolean;
  apiAvailable: boolean;
  openSource: boolean;
  japaneseSupport: boolean;
  platforms: Platform[];
  officialUrl: string;
  affiliateUrl: string | null;
  logoUrl: string | null;
  screenshotUrl: string | null;
  status: ToolStatus;
  updatedAt: string;
  scores: ToolScores;
  alternatives: string[];        // tool slugs
  relatedComparisons: string[];  // comparison slugs
  featured: boolean;
  sponsored: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  toolCount?: number;
}

export interface Comparison {
  id: string;
  slug: string;
  title: string;
  toolSlugs: string[];
  summary: string;
  recommendedFor: { toolSlug: string; reason: string }[];
  updatedAt: string;
}

export interface FilterState {
  search: string;
  category: string;
  freePlan: boolean;
  apiAvailable: boolean;
  openSource: boolean;
  japaneseSupport: boolean;
  pricingModel: PricingModel | "";
  platform: Platform | "";
  sortBy: "name" | "rating" | "newest";
}
