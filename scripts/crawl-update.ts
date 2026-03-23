/**
 * AI Tool Pricing & Status Updater
 *
 * For each tool:
 *  1. Fetches the pricing page (officialUrl/pricing, fallback to officialUrl)
 *  2. Uses Claude Haiku to extract pricingModel / startingPrice / freePlan
 *  3. Compares with current data and writes deltas to src/data/pricing-updates.json
 *
 * Also runs a lightweight new-tool discovery pass against curated sources,
 * writing candidates to src/data/new-tools-candidates.json.
 *
 * Run: npx tsx scripts/crawl-update.ts
 * Env: ANTHROPIC_API_KEY must be set
 */

import Anthropic from "@anthropic-ai/sdk";
import { tools } from "../src/data/tools";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic();
const TODAY = new Date().toISOString().split("T")[0];
const DELAY_MS = 1200; // ~50 req/min, well under rate limits

// ── helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Strip HTML tags and collapse whitespace, return first ~3000 chars */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AI-Navigator-Updater/1.0; +https://ai-navigator.dev)",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html")) return null;
    return htmlToText(await res.text());
  } catch {
    return null;
  }
}

interface PricingExtract {
  pricingModel: string | null; // "free" | "freemium" | "subscription" | "usage-based" | "one-time" | "open-source" | "enterprise"
  startingPrice: string | null; // e.g. "$20/month", "Free", null if unknown
  freePlan: boolean | null;
  confidence: "high" | "medium" | "low";
  notes: string;
}

async function extractPricing(
  toolName: string,
  pageText: string
): Promise<PricingExtract> {
  const prompt = `You are analyzing a pricing page for "${toolName}".

Page content (truncated):
---
${pageText}
---

Extract pricing information and return ONLY valid JSON (no markdown fences):
{
  "pricingModel": "free|freemium|subscription|usage-based|one-time|open-source|enterprise|null",
  "startingPrice": "e.g. $20/month or null",
  "freePlan": true|false|null,
  "confidence": "high|medium|low",
  "notes": "brief summary of what you found"
}

Rules:
- pricingModel null if you cannot determine it
- startingPrice null if page doesn't mention a specific price
- confidence=high means clear pricing table found, low means inferred from vague text
- Return ONLY the JSON object, nothing else`;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    });
    const text =
      msg.content[0].type === "text" ? msg.content[0].text.trim() : "{}";
    return JSON.parse(text) as PricingExtract;
  } catch {
    return {
      pricingModel: null,
      startingPrice: null,
      freePlan: null,
      confidence: "low",
      notes: "parse error",
    };
  }
}

// ── pricing update pass ───────────────────────────────────────────────────────

interface PricingDelta {
  slug: string;
  name: string;
  checkedAt: string;
  source: string;
  extracted: PricingExtract;
  changes: {
    field: string;
    oldValue: string | boolean | null;
    newValue: string | boolean | null;
  }[];
}

async function runPricingPass(): Promise<PricingDelta[]> {
  const deltas: PricingDelta[] = [];

  console.log(`\n=== Pricing update pass (${tools.length} tools) ===\n`);

  for (const tool of tools) {
    process.stdout.write(`  [${tool.slug}] fetching... `);

    // Try /pricing path first, fallback to homepage
    const pricingUrl = tool.officialUrl.replace(/\/$/, "") + "/pricing";
    let text = await fetchText(pricingUrl);
    let source = pricingUrl;
    if (!text) {
      text = await fetchText(tool.officialUrl);
      source = tool.officialUrl;
    }

    if (!text) {
      console.log("unreachable");
      await sleep(DELAY_MS);
      continue;
    }

    const extracted = await extractPricing(tool.name, text);
    console.log(
      `${extracted.confidence} confidence — ${extracted.notes.slice(0, 60)}`
    );

    const changes: PricingDelta["changes"] = [];

    if (
      extracted.pricingModel &&
      extracted.pricingModel !== "null" &&
      extracted.pricingModel !== tool.pricingModel &&
      extracted.confidence !== "low"
    ) {
      changes.push({
        field: "pricingModel",
        oldValue: tool.pricingModel,
        newValue: extracted.pricingModel,
      });
    }

    if (
      extracted.freePlan !== null &&
      extracted.freePlan !== tool.freePlan &&
      extracted.confidence !== "low"
    ) {
      changes.push({
        field: "freePlan",
        oldValue: tool.freePlan,
        newValue: extracted.freePlan,
      });
    }

    if (
      extracted.startingPrice !== null &&
      extracted.startingPrice !== tool.startingPrice &&
      extracted.confidence === "high"
    ) {
      changes.push({
        field: "startingPrice",
        oldValue: tool.startingPrice,
        newValue: extracted.startingPrice,
      });
    }

    if (changes.length > 0 || extracted.confidence === "high") {
      deltas.push({
        slug: tool.slug,
        name: tool.name,
        checkedAt: TODAY,
        source,
        extracted,
        changes,
      });
    }

    await sleep(DELAY_MS);
  }

  return deltas;
}

// ── new tool discovery pass ───────────────────────────────────────────────────

interface ToolCandidate {
  name: string;
  url: string;
  category: string;
  shortDescription: string;
  source: string;
  discoveredAt: string;
}

const DISCOVERY_SOURCES = [
  {
    url: "https://theresanaiforthat.com",
    name: "There's An AI For That",
  },
  {
    url: "https://www.producthunt.com/topics/artificial-intelligence",
    name: "Product Hunt AI",
  },
];

async function discoverNewTools(
  existingSlugs: Set<string>
): Promise<ToolCandidate[]> {
  const candidates: ToolCandidate[] = [];

  console.log(`\n=== New tool discovery pass ===\n`);

  for (const source of DISCOVERY_SOURCES) {
    process.stdout.write(`  Fetching ${source.name}... `);
    const text = await fetchText(source.url);
    if (!text) {
      console.log("unreachable");
      continue;
    }
    console.log(`${text.length} chars`);

    const existingList = Array.from(existingSlugs).join(", ");

    const prompt = `You are looking for new AI tools to add to a catalog.

Source page text from "${source.name}":
---
${text}
---

Already cataloged tools (slugs): ${existingList.slice(0, 800)}

Find up to 10 AI tools mentioned in the page that are NOT already cataloged.
Return ONLY valid JSON array (no markdown fences):
[
  {
    "name": "Tool Name",
    "url": "https://...",
    "category": "chatbots|coding|image|video|audio|writing|presentations|marketing|data|research|design|productivity",
    "shortDescription": "one sentence"
  }
]

If you find fewer than 10, return what you found. If none, return [].`;

    try {
      const msg = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
      const raw =
        msg.content[0].type === "text" ? msg.content[0].text.trim() : "[]";
      const found = JSON.parse(raw) as Omit<
        ToolCandidate,
        "source" | "discoveredAt"
      >[];
      for (const t of found) {
        candidates.push({ ...t, source: source.name, discoveredAt: TODAY });
      }
      console.log(`  → ${found.length} new candidates from ${source.name}`);
    } catch {
      console.log(`  → parse error`);
    }

    await sleep(DELAY_MS);
  }

  return candidates;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  // 1. Pricing pass
  const deltas = await runPricingPass();

  const pricingOut = path.join(__dirname, "../src/data/pricing-updates.json");
  fs.writeFileSync(pricingOut, JSON.stringify(deltas, null, 2));
  console.log(`\nPricing updates written to ${pricingOut}`);

  const changed = deltas.filter((d) => d.changes.length > 0);
  if (changed.length > 0) {
    console.log(`\n⚡ ${changed.length} tools with detected changes:`);
    for (const d of changed) {
      console.log(`  ${d.name}:`);
      for (const c of d.changes) {
        console.log(`    ${c.field}: ${c.oldValue} → ${c.newValue}`);
      }
    }
  } else {
    console.log("\n✓ No pricing changes detected");
  }

  // 2. Discovery pass
  const existingSlugs = new Set(tools.map((t) => t.slug));
  const candidates = await discoverNewTools(existingSlugs);

  const discoveryOut = path.join(
    __dirname,
    "../src/data/new-tools-candidates.json"
  );
  // Merge with existing candidates (avoid duplicates by name)
  let existing: ToolCandidate[] = [];
  if (fs.existsSync(discoveryOut)) {
    try {
      existing = JSON.parse(fs.readFileSync(discoveryOut, "utf-8"));
    } catch {}
  }
  const existingNames = new Set(existing.map((t) => t.name.toLowerCase()));
  const newOnes = candidates.filter(
    (c) => !existingNames.has(c.name.toLowerCase())
  );
  fs.writeFileSync(
    discoveryOut,
    JSON.stringify([...existing, ...newOnes], null, 2)
  );
  console.log(
    `\nNew tool candidates written to ${discoveryOut} (${newOnes.length} new this run)`
  );

  console.log("\nDone!");
}

main().catch(console.error);
