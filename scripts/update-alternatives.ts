/**
 * Update Alternatives — AI Navigator
 *
 * Auto-links tools into each other's alternatives[] based on
 * category + tag + subcategory similarity.
 *
 * Rules:
 *   - Never removes existing alternatives (only adds)
 *   - Requires same category to qualify (min score 4)
 *   - Caps at MAX_ALTERNATIVES per tool
 *   - Writes back to tools.ts in-place
 *
 * Run: npx tsx scripts/update-alternatives.ts
 */

import * as fs from "fs";
import * as path from "path";
import { tools } from "../src/data/tools";

const TOOLS_PATH = path.join(__dirname, "../src/data/tools.ts");
const MAX_ALTERNATIVES = 6;

type Tool = (typeof tools)[0];

/** Similarity score between two tools (0–10). Same category required (score 4). */
function similarity(a: Tool, b: Tool): number {
  if (a.category !== b.category) return 0;
  let score = 4;
  const sharedSubs = a.subcategories.filter((s) => b.subcategories.includes(s));
  score += Math.min(sharedSubs.length * 2, 4);
  const sharedTags = a.tags.filter((t) => b.tags.includes(t));
  score += Math.min(sharedTags.length, 2);
  return score;
}

/**
 * Patch the alternatives[] for a given slug in the tools.ts source text.
 * Finds slug occurrence → next "alternatives:" → replaces bracket content.
 */
function patchAlternatives(src: string, slug: string, alts: string[]): string {
  const slugIdx = src.indexOf(`slug: "${slug}"`);
  if (slugIdx === -1) return src;
  const altIdx = src.indexOf("alternatives:", slugIdx);
  if (altIdx === -1) return src;
  const openBracket = src.indexOf("[", altIdx);
  const closeBracket = src.indexOf("]", openBracket);
  if (openBracket === -1 || closeBracket === -1) return src;
  const newContent = alts.map((s) => `"${s}"`).join(", ");
  return src.slice(0, openBracket + 1) + newContent + src.slice(closeBracket);
}

async function main() {
  const activeTools = tools.filter((t) => t.status !== "dead");
  let src = fs.readFileSync(TOOLS_PATH, "utf-8");

  let updated = 0;

  for (const tool of activeTools) {
    // Score all peers
    const candidates = activeTools
      .filter((t) => t.slug !== tool.slug)
      .map((t) => ({ slug: t.slug, score: similarity(tool, t) }))
      .filter((t) => t.score >= 4)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ALTERNATIVES)
      .map((t) => t.slug);

    // Merge: keep existing, append new candidates, cap at MAX
    const existing = tool.alternatives;
    const existingSet = new Set(existing);
    const merged = [
      ...existing,
      ...candidates.filter((s) => !existingSet.has(s)),
    ].slice(0, MAX_ALTERNATIVES);

    // Skip if nothing changed
    if (merged.length === existing.length && merged.every((s, i) => s === existing[i])) {
      continue;
    }

    src = patchAlternatives(src, tool.slug, merged);
    updated++;
  }

  if (updated > 0) {
    fs.writeFileSync(TOOLS_PATH, src, "utf-8");
  }

  console.log(`\n=== Update Alternatives ===`);
  console.log(`Updated alternatives for ${updated} / ${activeTools.length} tools.`);
}

main().catch(console.error);
