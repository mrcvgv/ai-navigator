export type PricingModel = "free" | "freemium" | "paid" | "open-source" | "contact";

export type ToolStatus = "active" | "beta" | "dead";

export type Platform = "web" | "ios" | "android" | "mac" | "windows" | "linux" | "api";

export interface ToolScores {
  beginner: number;      // 1-5
  professional: number;  // 1-5
  value: number;         // 1-5
  speed: number;         // 1-5
  quality: number;       // 1-5
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
  platforms: Platform[];
  officialUrl: string;
  affiliateUrl: string | null;
  logoUrl: string | null;
  screenshotUrl: string | null;
  status: ToolStatus;
  updatedAt: string;
  scores: ToolScores;
  alternatives: string[];
  relatedComparisons: string[];
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
  pricingModel: PricingModel | "";
  platform: Platform | "";
  sortBy: "name" | "rating" | "newest" | "community";
}

// ─── User Ratings ─────────────────────────────────────────────────────────────

export type RatingReason =
  | "too_expensive"
  | "not_as_advertised"
  | "limited_features"
  | "better_alternatives"
  | "poor_reliability"
  | "other";

export interface StoredRating {
  value: number;       // 1-5
  timestamp: number;
  ipHash: string;
  reason?: RatingReason;
  weight: number;      // 1.0 normal, 0 if flagged
}

export interface RatingStats {
  bayesianScore: number;
  rawAverage: number;
  count: number;
  distribution: [number, number, number, number, number]; // [1★,2★,3★,4★,5★]
}

// ─── User Reviews ─────────────────────────────────────────────────────────────

export interface UserReview {
  id: string;
  slug: string;
  userId: string;          // hashed OAuth sub
  userName: string;
  userAvatar: string | null;
  rating: number;          // 1-5
  title: string;
  body: string;
  createdAt: number;       // ms timestamp
  helpfulCount: number;
  helpfulBy: string[];     // hashed userIds
}

// ─── Tool status (from crawler) ───────────────────────────────────────────────

export interface ToolStatusEntry {
  slug: string;
  lastChecked: string;   // ISO date
  httpStatus: number;
  pricingChanged: boolean;
  detectedPrice?: string;
}
