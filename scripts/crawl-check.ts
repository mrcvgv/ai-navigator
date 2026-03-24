/**
 * Tool Status Crawler + Dead-Tool Reaper
 *
 * 1. HEAD-checks every tool URL
 * 2. Tracks consecutiveFailures in tool-status.json (map keyed by slug)
 * 3. If consecutiveFailures >= 2 → patches status: "dead" in tools.ts
 *    (auto-added tools with dead status are fully removed from tools.ts)
 *
 * Run: npx tsx scripts/crawl-check.ts
 */

import { tools } from "../src/data/tools";
import * as fs from "fs";
import * as path from "path";

const TOOLS_PATH = path.join(__dirname, "../src/data/tools.ts");
const STATUS_PATH = path.join(__dirname, "../src/data/tool-status.json");
const DEAD_THRESHOLD = 2; // consecutive failed checks before marking dead

interface StatusEntry {
  lastChecked: string;
  httpStatus: number;
  ok: boolean;
  consecutiveFailures: number;
}

type StatusMap = Record<string, StatusEntry>;

async function checkUrl(url: string): Promise<number> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "AI-Navigator-Crawler/1.0" },
    });
    clearTimeout(timeout);
    return res.status;
  } catch {
    return 0;
  }
}

/** Patch status: "dead" for a slug in tools.ts */
function markDeadInFile(slug: string): boolean {
  let src = fs.readFileSync(TOOLS_PATH, "utf-8");

  // Find the slug entry and the status field near it (within 500 chars)
  const slugPattern = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]{0,500}?status:\\s*)"(active|beta)"`, "m");
  if (!slugPattern.test(src)) return false;

  src = src.replace(slugPattern, `$1"dead"`);
  fs.writeFileSync(TOOLS_PATH, src, "utf-8");
  return true;
}

/** Fully remove an auto-added dead tool's entry from tools.ts */
function removeToolFromFile(slug: string): boolean {
  let src = fs.readFileSync(TOOLS_PATH, "utf-8");

  // Match the full object block for this tool: from `  {` before the slug to the matching `  },`
  // Strategy: find the slug string, then walk back to `  {` and forward to `  },`
  const slugIdx = src.indexOf(`  slug: "${slug}",`);
  if (slugIdx === -1) return false;

  // Walk back to find the opening `  {`
  let start = src.lastIndexOf("\n  {", slugIdx);
  if (start === -1) return false;
  start += 1; // include the newline before `  {`

  // Walk forward to find the closing `  },` or `  }` (last entry)
  let end = src.indexOf("\n  },", slugIdx);
  if (end === -1) {
    // Last entry — try `\n  }` followed by `\n]`
    end = src.indexOf("\n  }", slugIdx);
    if (end === -1) return false;
    end += "\n  }".length;
  } else {
    end += "\n  },".length;
  }

  src = src.slice(0, start) + src.slice(end);
  fs.writeFileSync(TOOLS_PATH, src, "utf-8");
  return true;
}

async function main() {
  const today = new Date().toISOString().split("T")[0];

  // Load existing status map
  let statusMap: StatusMap = {};
  if (fs.existsSync(STATUS_PATH)) {
    try {
      statusMap = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
    } catch {}
  }

  const newlyDead: string[] = [];
  const removed: string[] = [];

  console.log(`\n=== URL health check (${tools.length} tools) ===\n`);

  for (const tool of tools) {
    process.stdout.write(`  [${tool.slug}] `);
    const status = await checkUrl(tool.officialUrl);

    // 403/405 = bot-blocked but alive; 0 = timeout/error
    const ok = (status >= 200 && status < 400) || status === 403 || status === 405;
    const prev = statusMap[tool.slug];
    const prevFails = prev?.consecutiveFailures ?? 0;
    const consecutiveFailures = ok ? 0 : prevFails + 1;

    statusMap[tool.slug] = { lastChecked: today, httpStatus: status, ok, consecutiveFailures };

    const note = status === 403 || status === 405 ? " (bot-blocked)" : "";
    const failNote = !ok && consecutiveFailures > 0 ? ` [fail #${consecutiveFailures}]` : "";
    console.log(`${ok ? "✓" : "✗"} ${status}${note}${failNote}`);

    // Dead threshold reached
    if (!ok && consecutiveFailures >= DEAD_THRESHOLD && tool.status !== "dead") {
      if (tool.autoAdded) {
        // Auto-added dead tools: remove entirely
        const removed_ = removeToolFromFile(tool.slug);
        if (removed_) {
          removed.push(tool.slug);
          delete statusMap[tool.slug];
          console.log(`    → REMOVED from tools.ts (auto-added, dead)`);
        }
      } else {
        // Human-curated tools: mark dead (keep for audit)
        const marked = markDeadInFile(tool.slug);
        if (marked) {
          newlyDead.push(tool.slug);
          console.log(`    → marked status: "dead" in tools.ts`);
        }
      }
    }
  }

  fs.writeFileSync(STATUS_PATH, JSON.stringify(statusMap, null, 2));
  console.log(`\nStatus written to ${STATUS_PATH}`);

  if (newlyDead.length > 0) {
    console.log(`\n⚠️  Marked dead (${newlyDead.length}): ${newlyDead.join(", ")}`);
  }
  if (removed.length > 0) {
    console.log(`\n🗑  Removed from tools.ts (${removed.length}): ${removed.join(", ")}`);
  }

  const totalFailing = Object.values(statusMap).filter((s) => !s.ok).length;
  if (totalFailing > 0) {
    console.log(`\n${totalFailing} tools currently failing health check`);
  } else {
    console.log(`\n✓ All tools reachable`);
  }
}

main().catch(console.error);
