/**
 * Enrich Thin Tools — AI Navigator
 *
 * Finds tools with thin content and uses Claude Haiku to generate:
 *   - fullDescription (when identical to shortDescription)
 *   - notIdealFor    (when empty)
 *   - bestFor        (when fewer than 2 items)
 *
 * Prioritises autoAdded tools first.
 * Max MAX_PER_RUN tools per execution to control cost.
 *
 * Run: npx tsx scripts/enrich-tools.ts
 * Env: ANTHROPIC_API_KEY must be set
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { tools } from "../src/data/tools";

const client = new Anthropic();
const TOOLS_PATH = path.join(__dirname, "../src/data/tools.ts");
const MAX_PER_RUN = 20;
const DELAY_MS = 800;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type Tool = (typeof tools)[0];

function needsEnrichment(t: Tool): boolean {
  return (
    t.shortDescription === t.fullDescription ||
    t.notIdealFor.length === 0 ||
    t.bestFor.length < 2
  );
}

interface EnrichedData {
  fullDescription?: string;
  bestFor?: string[];
  notIdealFor?: string[];
}

async function enrichTool(t: Tool): Promise<EnrichedData | null> {
  const prompt = `You are enriching an AI tool directory entry for "${t.name}".

Category: ${t.category}
Short description: ${t.shortDescription}
Current bestFor: ${JSON.stringify(t.bestFor)}
Current notIdealFor: ${JSON.stringify(t.notIdealFor)}
Tags: ${t.tags.join(", ")}
Pricing: ${t.pricingModel}${t.startingPrice ? `, starts at ${t.startingPrice}` : ""}
Free plan: ${t.freePlan}
API available: ${t.apiAvailable}
Open source: ${t.openSource}

Return ONLY valid JSON (no markdown, no explanation):
{
  "fullDescription": "2-3 sentences. Factual, specific. What the tool does, its main differentiator, and key use cases. No marketing fluff.",
  "bestFor": ["3-4 specific use cases as short phrases, e.g. 'Writing long-form content'"],
  "notIdealFor": ["2-3 specific limitations as short phrases, e.g. 'Real-time data needs'"]
}`;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = msg.content[0].type === "text" ? msg.content[0].text.trim() : "{}";
    return JSON.parse(raw) as EnrichedData;
  } catch {
    return null;
  }
}

/** Patch a string field: field: "..." → field: "newValue" */
function patchStringField(src: string, slug: string, field: string, value: string): string {
  const slugIdx = src.indexOf(`slug: "${slug}"`);
  if (slugIdx === -1) return src;
  const fieldIdx = src.indexOf(`${field}:`, slugIdx);
  if (fieldIdx === -1) return src;
  const after = src.slice(fieldIdx);
  // Match field: "..." (handles escaped quotes inside)
  const match = after.match(new RegExp(`^${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  if (!match) return src;
  return (
    src.slice(0, fieldIdx) +
    `${field}: ${JSON.stringify(value)}` +
    src.slice(fieldIdx + match[0].length)
  );
}

/** Patch an array field: field: [...] → field: ["a", "b"] */
function patchArrayField(src: string, slug: string, field: string, values: string[]): string {
  const slugIdx = src.indexOf(`slug: "${slug}"`);
  if (slugIdx === -1) return src;
  const fieldIdx = src.indexOf(`${field}:`, slugIdx);
  if (fieldIdx === -1) return src;
  const openBracket = src.indexOf("[", fieldIdx);
  const closeBracket = src.indexOf("]", openBracket);
  if (openBracket === -1 || closeBracket === -1) return src;
  const newContent = values.map((v) => JSON.stringify(v)).join(", ");
  return src.slice(0, openBracket + 1) + newContent + src.slice(closeBracket);
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  const activeTools = tools.filter((t) => t.status !== "dead");

  // Prioritise autoAdded tools, then others needing enrichment
  const toEnrich = activeTools
    .filter(needsEnrichment)
    .sort((a, b) => (b.autoAdded ? 1 : 0) - (a.autoAdded ? 1 : 0))
    .slice(0, MAX_PER_RUN);

  console.log(`\n=== Enrich Tools ===`);
  console.log(
    `${activeTools.filter(needsEnrichment).length} tools need enrichment. Processing ${toEnrich.length} this run.\n`
  );

  if (toEnrich.length === 0) {
    console.log("Nothing to enrich. 🎉");
    return;
  }

  let src = fs.readFileSync(TOOLS_PATH, "utf-8");
  let enriched = 0;

  for (const tool of toEnrich) {
    process.stdout.write(`  ${tool.name}${tool.autoAdded ? " [auto]" : ""}... `);
    const result = await enrichTool(tool);

    if (!result) {
      console.log("failed");
      continue;
    }

    if (result.fullDescription && result.fullDescription.trim().length > 30) {
      src = patchStringField(src, tool.slug, "fullDescription", result.fullDescription.trim());
    }
    if (result.bestFor && result.bestFor.length >= 2) {
      src = patchArrayField(src, tool.slug, "bestFor", result.bestFor);
    }
    if (result.notIdealFor && result.notIdealFor.length >= 1) {
      src = patchArrayField(src, tool.slug, "notIdealFor", result.notIdealFor);
    }

    enriched++;
    console.log("done");
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(TOOLS_PATH, src, "utf-8");
  console.log(`\nDone. Enriched ${enriched} tools.`);

  const remaining = activeTools.filter(needsEnrichment).length - toEnrich.length;
  if (remaining > 0) {
    console.log(`${remaining} tools still need enrichment — will continue next run.`);
  }
}

main().catch(console.error);
