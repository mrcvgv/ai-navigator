/**
 * Tool Status Crawler
 * Checks if tool URLs are reachable and writes results to src/data/tool-status.json.
 * Run via: npx tsx scripts/crawl-check.ts
 */

import { tools } from "../src/data/tools";
import * as fs from "fs";
import * as path from "path";

interface StatusEntry {
  slug: string;
  lastChecked: string;
  httpStatus: number;
  ok: boolean;
}

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

async function main() {
  const now = new Date().toISOString().split("T")[0];
  const results: StatusEntry[] = [];

  console.log(`Crawling ${tools.length} tools...`);

  for (const tool of tools) {
    const url = tool.officialUrl;
    process.stdout.write(`  ${tool.slug}... `);
    const status = await checkUrl(url);
    const ok = status >= 200 && status < 400;
    results.push({ slug: tool.slug, lastChecked: now, httpStatus: status, ok });
    console.log(ok ? `✓ ${status}` : `✗ ${status}`);
  }

  const outPath = path.join(__dirname, "../src/data/tool-status.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nWritten to ${outPath}`);

  const dead = results.filter((r) => !r.ok);
  if (dead.length > 0) {
    console.log(`\n⚠️  ${dead.length} tools unreachable:`);
    dead.forEach((d) => console.log(`  ${d.slug}: ${d.httpStatus}`));
  }
}

main().catch(console.error);
