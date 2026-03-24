import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { categories } from "@/data/categories";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://ai-navigator.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const activeTools = tools.filter((t) => t.status !== "dead");

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/explore`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/compare`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/categories`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/contact`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE}/legal/disclosure`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE}/legal/privacy`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE}/legal/terms`, priority: 0.3, changeFrequency: "yearly" },
  ];

  const toolPages: MetadataRoute.Sitemap = activeTools.map((t) => ({
    url: `${BASE}/tools/${t.slug}`,
    lastModified: t.updatedAt,
    priority: t.featured ? 0.9 : 0.7,
    changeFrequency: "monthly",
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/categories/${c.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${BASE}/compare/${c.slug}`,
    lastModified: c.updatedAt,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  return [...staticPages, ...toolPages, ...categoryPages, ...comparisonPages];
}
