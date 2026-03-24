/**
 * Comparison Auto-Generator
 *
 * Finds tool pairs that mention each other in alternatives[],
 * skips pairs already in comparisons.ts,
 * uses Claude Haiku to write summary + recommendedFor,
 * and appends new Comparison entries to comparisons.ts.
 *
 * Run: npx tsx scripts/gen-comparisons.ts
 * Env: ANTHROPIC_API_KEY must be set
 */

import Anthropic from "@anthropic-ai/sdk";
import { tools } from "../src/data/tools";
import { comparisons } from "../src/data/comparisons";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic();
const TODAY = new Date().toISOString().split("T")[0];
const COMPARISONS_PATH = path.join(__dirname, "../src/data/comparisons.ts");
const DELAY_MS = 1000;
const MAX_NEW_PER_RUN = 30; // cap to avoid giant single-run cost

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface GeneratedComparison {
  slug: string;
  title: string;
  summary: string;
  recommendedFor: { toolSlug: string; reason: string }[];
}

async function generateComparison(
  slugA: string,
  slugB: string,
  nameA: string,
  nameB: string,
  descA: string,
  descB: string,
  bestForA: string[],
  bestForB: string[]
): Promise<GeneratedComparison | null> {
  const prompt = `You are writing a concise comparison page entry for "${nameA} vs ${nameB}" on an AI tool directory.

${nameA}: ${descA}
  Best for: ${bestForA.join(", ")}

${nameB}: ${descB}
  Best for: ${bestForB.join(", ")}

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
    const slug = `${slugA}-vs-${slugB}`;
    return {
      slug,
      title: `${nameA} vs ${nameB}`,
      summary: parsed.summary ?? `${nameA} and ${nameB} compared.`,
      recommendedFor: [
        { toolSlug: slugA, reason: parsed.recommendedForA ?? `${nameA} users` },
        { toolSlug: slugB, reason: parsed.recommendedForB ?? `${nameB} users` },
      ],
    };
  } catch {
    return null;
  }
}

function serializeComparison(c: GeneratedComparison): string {
  const recs = c.recommendedFor
    .map((r) => `      { toolSlug: "${r.toolSlug}", reason: ${JSON.stringify(r.reason)} }`)
    .join(",\n");
  return `  {
    id: "${c.slug}",
    slug: "${c.slug}",
    title: ${JSON.stringify(c.title)},
    toolSlugs: [${c.recommendedFor.map((r) => `"${r.toolSlug}"`).join(", ")}],
    summary: ${JSON.stringify(c.summary)},
    recommendedFor: [
${recs}
    ],
    updatedAt: "${TODAY}",
  },`;
}

function appendToComparisonsFile(entry: string): boolean {
  let src = fs.readFileSync(COMPARISONS_PATH, "utf-8");
  const closeIdx = src.lastIndexOf("];");
  if (closeIdx === -1) return false;
  src = src.slice(0, closeIdx) + entry + "\n" + src.slice(closeIdx);
  fs.writeFileSync(COMPARISONS_PATH, src, "utf-8");
  return true;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  const activeTools = tools.filter((t) => t.status !== "dead");
  const toolMap = new Map(activeTools.map((t) => [t.slug, t]));

  // Existing comparison slugs (both directions)
  const existing = new Set<string>();
  for (const c of comparisons) {
    const [a, b] = c.toolSlugs;
    existing.add(`${a}-vs-${b}`);
    existing.add(`${b}-vs-${a}`);
  }

  // Find candidate pairs from alternatives[]
  const pairs: [string, string][] = [];
  const seen = new Set<string>();

  for (const tool of activeTools) {
    for (const altSlug of tool.alternatives) {
      if (!toolMap.has(altSlug)) continue;
      const key = [tool.slug, altSlug].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      const fwd = `${tool.slug}-vs-${altSlug}`;
      const rev = `${altSlug}-vs-${tool.slug}`;
      if (!existing.has(fwd) && !existing.has(rev)) {
        pairs.push([tool.slug, altSlug]);
      }
    }
  }

  console.log(`\n=== Comparison generator ===`);
  console.log(`Found ${pairs.length} new pairs, generating up to ${MAX_NEW_PER_RUN}\n`);

  let added = 0;
  for (const [slugA, slugB] of pairs.slice(0, MAX_NEW_PER_RUN)) {
    const toolA = toolMap.get(slugA)!;
    const toolB = toolMap.get(slugB)!;
    process.stdout.write(`  ${toolA.name} vs ${toolB.name}... `);

    const gen = await generateComparison(
      slugA, slugB,
      toolA.name, toolB.name,
      toolA.shortDescription, toolB.shortDescription,
      toolA.bestFor, toolB.bestFor
    );

    if (!gen) { console.log("failed"); continue; }

    const ts = serializeComparison(gen);
    const ok = appendToComparisonsFile(ts);
    if (ok) { added++; console.log("added"); }
    else { console.log("append failed"); }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone. ${added} comparisons added.`);
  if (pairs.length > MAX_NEW_PER_RUN) {
    console.log(`${pairs.length - MAX_NEW_PER_RUN} pairs remain — run again next week.`);
  }
}

main().catch(console.error);
