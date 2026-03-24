/**
 * Health Check — AI Navigator
 *
 * Validates data integrity across tools.ts, comparisons.ts, categories.ts.
 * Writes src/data/health-report.json.
 * Exits 1 if any critical issues are found.
 *
 * Run: npx tsx scripts/health-check.ts
 */

import { tools } from "../src/data/tools";
import { comparisons } from "../src/data/comparisons";
import { categories } from "../src/data/categories";
import * as fs from "fs";
import * as path from "path";

const REPORT_PATH = path.join(__dirname, "../src/data/health-report.json");
const STALE_DAYS = 180;

interface HealthIssue {
  severity: "critical" | "warning" | "info";
  type: string;
  slug?: string;
  detail: string;
}

function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

async function main() {
  const issues: HealthIssue[] = [];
  const slugSet = new Set(tools.map((t) => t.slug));
  const catSlugs = new Set(categories.map((c) => c.slug));
  const activeTools = tools.filter((t) => t.status !== "dead");
  const activeSet = new Set(activeTools.map((t) => t.slug));

  // ── Duplicate slugs ──────────────────────────────────────────────────────
  const seen = new Set<string>();
  for (const t of tools) {
    if (seen.has(t.slug)) {
      issues.push({ severity: "critical", type: "duplicate_slug", slug: t.slug, detail: `Duplicate slug: ${t.slug}` });
    }
    seen.add(t.slug);
  }

  // ── Per-tool checks ──────────────────────────────────────────────────────
  for (const t of activeTools) {
    if (!t.officialUrl) {
      issues.push({ severity: "critical", type: "missing_url", slug: t.slug, detail: "Missing officialUrl" });
    }
    if (!t.shortDescription?.trim()) {
      issues.push({ severity: "critical", type: "missing_field", slug: t.slug, detail: "Missing shortDescription" });
    }
    if (!t.category) {
      issues.push({ severity: "critical", type: "missing_field", slug: t.slug, detail: "Missing category" });
    } else if (!catSlugs.has(t.category)) {
      issues.push({ severity: "warning", type: "unknown_category", slug: t.slug, detail: `Unknown category: "${t.category}"` });
    }
    if (t.bestFor.length === 0) {
      issues.push({ severity: "warning", type: "thin_content", slug: t.slug, detail: "Empty bestFor[]" });
    }
    if (t.notIdealFor.length === 0) {
      issues.push({ severity: "warning", type: "thin_content", slug: t.slug, detail: "Empty notIdealFor[]" });
    }
    if (t.shortDescription === t.fullDescription) {
      issues.push({ severity: "info", type: "thin_content", slug: t.slug, detail: "fullDescription identical to shortDescription (needs enrichment)" });
    }
    if (t.alternatives.length === 0) {
      issues.push({ severity: "info", type: "isolated_tool", slug: t.slug, detail: "No alternatives — isolated from graph" });
    }
    const days = daysSince(t.updatedAt);
    if (days > STALE_DAYS) {
      issues.push({ severity: "info", type: "stale_tool", slug: t.slug, detail: `Not updated in ${days} days` });
    }
  }

  // ── Comparison integrity ─────────────────────────────────────────────────
  const compSeen = new Set<string>();
  for (const c of comparisons) {
    if (compSeen.has(c.slug)) {
      issues.push({ severity: "critical", type: "duplicate_comparison", slug: c.slug, detail: `Duplicate comparison slug: ${c.slug}` });
    }
    compSeen.add(c.slug);

    for (const slug of c.toolSlugs) {
      if (!slugSet.has(slug)) {
        issues.push({ severity: "critical", type: "broken_comparison", slug: c.slug, detail: `References unknown tool slug: "${slug}"` });
      } else if (!activeSet.has(slug)) {
        issues.push({ severity: "warning", type: "dead_tool_in_comparison", slug: c.slug, detail: `References dead tool: "${slug}"` });
      }
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  const critical = issues.filter((i) => i.severity === "critical");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  const thinCount = activeTools.filter(
    (t) => t.shortDescription === t.fullDescription || t.notIdealFor.length === 0 || t.bestFor.length < 2
  ).length;

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalTools: tools.length,
      activeTools: activeSet.size,
      deadTools: tools.filter((t) => t.status === "dead").length,
      autoAddedTools: tools.filter((t) => t.autoAdded).length,
      totalComparisons: comparisons.length,
      thinContentTools: thinCount,
      critical: critical.length,
      warnings: warnings.length,
      infos: infos.length,
    },
    issues,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(`\n=== AI Navigator Health Check ===`);
  console.log(`Tools:       ${activeSet.size} active | ${report.summary.deadTools} dead | ${report.summary.autoAddedTools} auto-added`);
  console.log(`Comparisons: ${comparisons.length}`);
  console.log(`Thin content: ${thinCount} tools need enrichment`);
  console.log(`\nIssues:  🔴 ${critical.length} critical  |  🟡 ${warnings.length} warnings  |  ℹ️  ${infos.length} info`);

  if (critical.length > 0) {
    console.error("\n🔴 CRITICAL:");
    critical.forEach((i) => console.error(`  [${i.slug ?? "–"}] ${i.detail}`));
  }
  if (warnings.length > 0) {
    console.warn("\n🟡 Warnings (first 10):");
    warnings.slice(0, 10).forEach((i) => console.warn(`  [${i.slug ?? "–"}] ${i.detail}`));
    if (warnings.length > 10) console.warn(`  …and ${warnings.length - 10} more`);
  }

  console.log(`\nReport → src/data/health-report.json`);

  if (critical.length > 0) process.exit(1);
}

main().catch(console.error);
