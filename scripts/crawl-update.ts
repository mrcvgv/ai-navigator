/**
 * AI Tool Pricing Updater + Full-Coverage Auto-Adder
 *
 * Pass 1 — Pricing update:
 *   Visits each tool's pricing page, uses Haiku to detect changes,
 *   applies high-confidence changes directly to tools.ts.
 *
 * Pass 2 — Discovery + auto-add:
 *   Scrapes multiple discovery sources, uses Haiku to find new tools,
 *   generates a full Tool entry for each new candidate,
 *   and APPENDS it directly to tools.ts (autoAdded: true).
 *
 * Removal criteria (handled by crawl-check.ts, not here):
 *   - URL dead for 2+ consecutive checks → status: "dead" (or removed if autoAdded)
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
const DELAY_MS = 1200;
const TOOLS_PATH = path.join(__dirname, "../src/data/tools.ts");

// ── helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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
        "User-Agent": "Mozilla/5.0 (compatible; AI-Navigator-Updater/1.0)",
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

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Pass 1: pricing update ────────────────────────────────────────────────────

interface PricingExtract {
  pricingModel: string | null;
  startingPrice: string | null;
  freePlan: boolean | null;
  confidence: "high" | "medium" | "low";
  notes: string;
}

interface PricingDelta {
  slug: string;
  name: string;
  checkedAt: string;
  source: string;
  extracted: PricingExtract;
  changes: { field: string; oldValue: unknown; newValue: unknown }[];
}

async function extractPricing(toolName: string, pageText: string): Promise<PricingExtract> {
  const prompt = `You are analyzing a pricing page for "${toolName}".

Page content (truncated):
---
${pageText}
---

Return ONLY valid JSON (no markdown fences):
{"pricingModel":"free|freemium|subscription|usage-based|one-time|open-source|enterprise|null","startingPrice":"e.g. $20/month or null","freePlan":true,"confidence":"high|medium|low","notes":"brief summary"}

Rules: pricingModel null if unclear. confidence=high means clear pricing table found.`;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    });
    const text = msg.content[0].type === "text" ? msg.content[0].text.trim() : "{}";
    return JSON.parse(text) as PricingExtract;
  } catch {
    return { pricingModel: null, startingPrice: null, freePlan: null, confidence: "low", notes: "parse error" };
  }
}

/** Apply a single field change directly in tools.ts via string replacement */
function patchToolField(slug: string, field: string, newValue: unknown): boolean {
  let src = fs.readFileSync(TOOLS_PATH, "utf-8");

  // Find the slug marker, then within ~800 chars find the field
  const slugIdx = src.indexOf(`  slug: "${slug}",`);
  if (slugIdx === -1) return false;

  // Build pattern for the specific field within this entry
  const fieldPattern = new RegExp(
    `(slug:\\s*"${slug}"[\\s\\S]{0,800}?${field}:\\s*)` +
    `(?:"[^"]*"|true|false|null)`,
    "m"
  );

  const replacement = typeof newValue === "string"
    ? `$1"${newValue}"`
    : `$1${newValue}`;

  if (!fieldPattern.test(src)) return false;
  src = src.replace(fieldPattern, replacement);
  fs.writeFileSync(TOOLS_PATH, src, "utf-8");
  return true;
}

async function runPricingPass(): Promise<PricingDelta[]> {
  const deltas: PricingDelta[] = [];
  console.log(`\n=== Pass 1: Pricing update (${tools.length} tools) ===\n`);

  for (const tool of tools) {
    if (tool.status === "dead") {
      console.log(`  [${tool.slug}] skip (dead)`);
      continue;
    }

    process.stdout.write(`  [${tool.slug}] fetching... `);
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
    console.log(`${extracted.confidence} — ${extracted.notes.slice(0, 60)}`);

    const changes: PricingDelta["changes"] = [];

    if (extracted.pricingModel && extracted.pricingModel !== "null" &&
        extracted.pricingModel !== tool.pricingModel && extracted.confidence !== "low") {
      if (patchToolField(tool.slug, "pricingModel", extracted.pricingModel)) {
        changes.push({ field: "pricingModel", oldValue: tool.pricingModel, newValue: extracted.pricingModel });
      }
    }
    if (extracted.freePlan !== null && extracted.freePlan !== tool.freePlan && extracted.confidence !== "low") {
      if (patchToolField(tool.slug, "freePlan", extracted.freePlan)) {
        changes.push({ field: "freePlan", oldValue: tool.freePlan, newValue: extracted.freePlan });
      }
    }
    if (extracted.startingPrice !== null && extracted.startingPrice !== tool.startingPrice &&
        extracted.confidence === "high") {
      if (patchToolField(tool.slug, "startingPrice", extracted.startingPrice)) {
        changes.push({ field: "startingPrice", oldValue: tool.startingPrice, newValue: extracted.startingPrice });
      }
    }

    if (changes.length > 0 || extracted.confidence === "high") {
      deltas.push({ slug: tool.slug, name: tool.name, checkedAt: TODAY, source, extracted, changes });
    }

    await sleep(DELAY_MS);
  }

  return deltas;
}

// ── Pass 2: discovery + auto-add ──────────────────────────────────────────────

const DISCOVERY_SOURCES = [
  { url: "https://theresanaiforthat.com",                              name: "There's An AI For That" },
  { url: "https://www.producthunt.com/topics/artificial-intelligence", name: "Product Hunt AI" },
  { url: "https://www.futurepedia.io",                                 name: "Futurepedia" },
  { url: "https://toolify.ai",                                         name: "Toolify" },
  { url: "https://aitools.fyi",                                        name: "AI Tools FYI" },
  { url: "https://www.aitoolsdirectory.com",                           name: "AI Tools Directory" },
];

interface ToolCandidate {
  name: string;
  url: string;
  category: string;
  shortDescription: string;
  source: string;
}

async function discoverCandidates(existingSlugs: Set<string>): Promise<ToolCandidate[]> {
  const all: ToolCandidate[] = [];
  console.log(`\n=== Pass 2a: Discovery (${DISCOVERY_SOURCES.length} sources) ===\n`);

  for (const src of DISCOVERY_SOURCES) {
    process.stdout.write(`  ${src.name}... `);
    const text = await fetchText(src.url);
    if (!text) { console.log("unreachable"); continue; }

    const prompt = `Find up to 15 AI tools mentioned in this page from "${src.name}" that are NOT in the existing catalog.

Page text:
---
${text}
---

Already cataloged (slugs): ${Array.from(existingSlugs).slice(0, 60).join(", ")}

Return ONLY valid JSON array (no markdown):
[{"name":"Tool Name","url":"https://...","category":"chatbots|coding|image|video|audio|writing|presentations|marketing|data|research|design|productivity|other","shortDescription":"one sentence, max 120 chars"}]

If none found, return [].`;

    try {
      const msg = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
      const raw = msg.content[0].type === "text" ? msg.content[0].text.trim() : "[]";
      const found = JSON.parse(raw) as Omit<ToolCandidate, "source">[];
      // Filter out any that already exist (by slug)
      const novel = found.filter((t) => !existingSlugs.has(toSlug(t.name)));
      novel.forEach((t) => all.push({ ...t, source: src.name }));
      console.log(`${novel.length} new`);
    } catch {
      console.log("parse error");
    }
    await sleep(DELAY_MS);
  }
  return all;
}

interface FullToolEntry {
  slug: string;
  name: string;
  category: string;
  pricingModel: string;
  startingPrice: string | null;
  freePlan: boolean;
  apiAvailable: boolean;
  openSource: boolean;
  platforms: string[];
  bestFor: string[];
  notIdealFor: string[];
  tags: string[];
  shortDescription: string;
}

async function generateToolEntry(candidate: ToolCandidate, pageText: string | null): Promise<FullToolEntry> {
  const context = pageText
    ? `Page content:\n---\n${pageText}\n---\n`
    : `Only the candidate info is available (page unreachable).\n`;

  const prompt = `You are adding "${candidate.name}" (${candidate.url}) to an AI tool catalog.

${context}
Known info: category="${candidate.category}", description="${candidate.shortDescription}"

Return ONLY valid JSON (no markdown):
{
  "pricingModel": "free|freemium|paid|open-source|contact",
  "startingPrice": "$20/mo or null",
  "freePlan": true,
  "apiAvailable": false,
  "openSource": false,
  "platforms": ["web"],
  "bestFor": ["use case 1","use case 2","use case 3"],
  "notIdealFor": ["limitation 1","limitation 2"],
  "tags": ["tag1","tag2","tag3"],
  "shortDescription": "one sentence, max 120 chars"
}

Rules:
- platforms: subset of ["web","ios","android","mac","windows","linux","api"]
- bestFor: 2-4 specific use cases
- notIdealFor: 1-3 real limitations
- tags: 3-5 lowercase keywords
- If page unreachable, use defaults: pricingModel="freemium", freePlan=false, everything minimal`;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = msg.content[0].type === "text" ? msg.content[0].text.trim() : "{}";
    const parsed = JSON.parse(raw);
    return {
      slug: toSlug(candidate.name),
      name: candidate.name,
      category: candidate.category,
      ...parsed,
      shortDescription: parsed.shortDescription ?? candidate.shortDescription,
    };
  } catch {
    return {
      slug: toSlug(candidate.name),
      name: candidate.name,
      category: candidate.category,
      pricingModel: "freemium",
      startingPrice: null,
      freePlan: false,
      apiAvailable: false,
      openSource: false,
      platforms: ["web"],
      bestFor: [],
      notIdealFor: [],
      tags: [],
      shortDescription: candidate.shortDescription,
    };
  }
}

function serializeTool(entry: FullToolEntry, officialUrl: string): string {
  const arr = (a: unknown[]) => JSON.stringify(a);
  return `  {
    id: "${entry.slug}",
    slug: "${entry.slug}",
    name: ${JSON.stringify(entry.name)},
    shortDescription: ${JSON.stringify(entry.shortDescription)},
    fullDescription: ${JSON.stringify(entry.shortDescription)},
    category: "${entry.category}",
    subcategories: [],
    tags: ${arr(entry.tags)},
    bestFor: ${arr(entry.bestFor)},
    notIdealFor: ${arr(entry.notIdealFor)},
    pricingModel: "${entry.pricingModel}",
    startingPrice: ${entry.startingPrice === null ? "null" : JSON.stringify(entry.startingPrice)},
    freePlan: ${entry.freePlan},
    apiAvailable: ${entry.apiAvailable},
    openSource: ${entry.openSource},
    platforms: ${arr(entry.platforms)},
    officialUrl: ${JSON.stringify(officialUrl)},
    affiliateUrl: null,
    logoUrl: null,
    screenshotUrl: null,
    status: "active",
    updatedAt: "${TODAY}",
    scores: { beginner: 3, professional: 3, value: 3, speed: 3, quality: 3 },
    alternatives: [],
    relatedComparisons: [],
    featured: false,
    sponsored: false,
    autoAdded: true,
    addedAt: "${TODAY}",
  },`;
}

function appendToolToFile(toolTs: string): boolean {
  let src = fs.readFileSync(TOOLS_PATH, "utf-8");
  // Find the closing `];` of the tools array
  const closeIdx = src.lastIndexOf("];");
  if (closeIdx === -1) return false;
  src = src.slice(0, closeIdx) + toolTs + "\n" + src.slice(closeIdx);
  fs.writeFileSync(TOOLS_PATH, src, "utf-8");
  return true;
}

async function runAutoAddPass(candidates: ToolCandidate[], existingSlugs: Set<string>): Promise<number> {
  console.log(`\n=== Pass 2b: Auto-add (${candidates.length} candidates) ===\n`);
  let added = 0;

  for (const candidate of candidates) {
    const slug = toSlug(candidate.name);
    if (existingSlugs.has(slug)) {
      console.log(`  [${slug}] already exists, skip`);
      continue;
    }

    process.stdout.write(`  [${slug}] generating entry... `);
    const pageText = await fetchText(candidate.url);
    const entry = await generateToolEntry(candidate, pageText);

    const toolTs = serializeTool(entry, candidate.url);
    const ok = appendToolToFile(toolTs);
    if (ok) {
      existingSlugs.add(slug);
      added++;
      console.log(`added (${candidate.source})`);
    } else {
      console.log(`FAILED to append`);
    }
    await sleep(DELAY_MS);
  }

  return added;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  const skipPricing = process.argv.includes("--skip-pricing");

  // Pass 1: pricing (skipped on non-Monday daily runs to avoid hammering tool sites)
  let changedCount = 0;
  if (!skipPricing) {
    const deltas = await runPricingPass();
    const pricingOut = path.join(__dirname, "../src/data/pricing-updates.json");
    fs.writeFileSync(pricingOut, JSON.stringify(deltas, null, 2));
    const changed = deltas.filter((d) => d.changes.length > 0);
    changedCount = changed.length;
    console.log(`\nPricing: ${changed.length} changes applied`);
    for (const d of changed) {
      for (const c of d.changes) console.log(`  ${d.name}: ${c.field} ${c.oldValue} → ${c.newValue}`);
    }
  } else {
    console.log(`\n=== Pass 1: Pricing skipped (--skip-pricing) ===`);
  }

  // Pass 2a: discover candidates
  const existingSlugs = new Set(tools.map((t) => t.slug));
  const candidates = await discoverCandidates(existingSlugs);

  // Pass 2b: auto-add
  const added = await runAutoAddPass(candidates, existingSlugs);

  console.log(`\n✓ Done. Pricing changes: ${changedCount}. New tools added: ${added}.`);
}

main().catch(console.error);
