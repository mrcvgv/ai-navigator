/**
 * Refresh Stale Comparisons — AI Navigator
 *
 * Finds comparisons not updated in STALE_DAYS and regenerates
 * summary + recommendedFor using Claude Haiku.
 * Patches comparisons.ts in-place.
 *
 * Run: npx tsx scripts/refresh-comparisons.ts
 * Env: ANTHROPIC_API_KEY must be set
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { comparisons } from "../src/data/comparisons";
import { tools } from "../src/data/tools";

const client = new Anthropic();
const COMPARISONS_PATH = path.join(__dirname, "../src/data/comparisons.ts");
const STALE_DAYS = 90;
const MAX_PER_RUN = 15;
const DELAY_MS = 800;
const TODAY = new Date().toISOString().split("T")[0];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 999;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

type Tool = (typeof tools)[0];
type Comparison = (typeof comparisons)[0];

interface RefreshedData {
  summary: string;
  recommendedFor: { toolSlug: string; reason: string }[];
}

async function regenerate(comp: Comparison, toolA: Tool, toolB: Tool): Promise<RefreshedData | null> {
  const prompt = `Update this comparison entry for "${toolA.name} vs ${toolB.name}" on an AI tool directory.

${toolA.name}: ${toolA.shortDescription}
  Best for: ${toolA.bestFor.join(", ")}
  Pricing: ${toolA.pricingModel}${toolA.startingPrice ? `, ${toolA.startingPrice}` : ""}

${toolB.name}: ${toolB.shortDescription}
  Best for: ${toolB.bestFor.join(", ")}
  Pricing: ${toolB.pricingModel}${toolB.startingPrice ? `, ${toolB.startingPrice}` : ""}

Return ONLY valid JSON (no markdown):
{
  "summary": "2 sentences max. Factual, specific difference. No fluff.",
  "recommendedForA": "Finish the sentence: Best if you need...",
  "recommendedForB": "Finish the sentence: Best if you need..."
}`;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = msg.content[0].type === "text" ? msg.content[0].text.trim() : "{}";
    const parsed = JSON.parse(raw);
    return {
      summary: parsed.summary ?? comp.summary,
      recommendedFor: [
        {
          toolSlug: toolA.slug,
          reason: parsed.recommendedForA ?? comp.recommendedFor.find((r) => r.toolSlug === toolA.slug)?.reason ?? "",
        },
        {
          toolSlug: toolB.slug,
          reason: parsed.recommendedForB ?? comp.recommendedFor.find((r) => r.toolSlug === toolB.slug)?.reason ?? "",
        },
      ],
    };
  } catch {
    return null;
  }
}

/** Patch summary field for a comparison slug */
function patchSummary(src: string, compSlug: string, summary: string): string {
  const slugIdx = src.indexOf(`slug: "${compSlug}"`);
  if (slugIdx === -1) return src;
  const summaryIdx = src.indexOf("summary:", slugIdx);
  if (summaryIdx === -1) return src;
  const after = src.slice(summaryIdx);
  const match = after.match(/^summary:\s*"((?:[^"\\]|\\.)*)"/);
  if (!match) return src;
  return src.slice(0, summaryIdx) + `summary: ${JSON.stringify(summary)}` + src.slice(summaryIdx + match[0].length);
}

/** Patch updatedAt field for a comparison slug */
function patchUpdatedAt(src: string, compSlug: string, date: string): string {
  const slugIdx = src.indexOf(`slug: "${compSlug}"`);
  if (slugIdx === -1) return src;
  const updatedIdx = src.indexOf("updatedAt:", slugIdx);
  if (updatedIdx === -1) return src;
  const after = src.slice(updatedIdx);
  const match = after.match(/^updatedAt:\s*"([^"]*)"/);
  if (!match) return src;
  return src.slice(0, updatedIdx) + `updatedAt: "${date}"` + src.slice(updatedIdx + match[0].length);
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  const toolMap = new Map(tools.filter((t) => t.status !== "dead").map((t) => [t.slug, t]));

  const stale = comparisons
    .filter((c) => {
      if (daysSince(c.updatedAt) < STALE_DAYS) return false;
      return c.toolSlugs.every((s) => toolMap.has(s));
    })
    .sort((a, b) => daysSince(b.updatedAt) - daysSince(a.updatedAt)) // oldest first
    .slice(0, MAX_PER_RUN);

  console.log(`\n=== Refresh Comparisons ===`);
  console.log(`${stale.length} stale comparisons (>${STALE_DAYS} days), refreshing up to ${MAX_PER_RUN}\n`);

  if (stale.length === 0) {
    console.log("All comparisons are fresh. 🎉");
    return;
  }

  let src = fs.readFileSync(COMPARISONS_PATH, "utf-8");
  let refreshed = 0;

  for (const comp of stale) {
    const [slugA, slugB] = comp.toolSlugs;
    const toolA = toolMap.get(slugA)!;
    const toolB = toolMap.get(slugB)!;

    process.stdout.write(`  ${comp.title} (${daysSince(comp.updatedAt)}d ago)... `);

    const result = await regenerate(comp, toolA, toolB);
    if (!result) {
      console.log("failed");
      continue;
    }

    src = patchSummary(src, comp.slug, result.summary);
    src = patchUpdatedAt(src, comp.slug, TODAY);
    refreshed++;
    console.log("refreshed");
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(COMPARISONS_PATH, src, "utf-8");
  console.log(`\nDone. Refreshed ${refreshed} comparisons.`);

  const totalStale = comparisons.filter((c) => daysSince(c.updatedAt) >= STALE_DAYS).length;
  if (totalStale > MAX_PER_RUN) {
    console.log(`${totalStale - refreshed} comparisons still stale — will continue next run.`);
  }
}

main().catch(console.error);
