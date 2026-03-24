// ============================================================
// Sponsor Configuration
// ============================================================
// Manage sponsored placements here, separate from tools.ts.
// Do NOT embed billing logic here — this is a static config.
//
// When a sponsorship is sold:
//   1. Add an entry to `sponsorConfig`
//   2. Set `sponsored: true` on the matching tool in tools.ts
//   3. Deploy
//
// Placement types:
//   "homepage"  → featured slot on the home page (top of Top AI Tools)
//   "category"  → pinned at top of a category page
//   "compare"   → shown in related comparisons section
//   "explore"   → pinned at top of explore/search results
// ============================================================

export type SponsorPlacement = "homepage" | "category" | "compare" | "explore";

export interface SponsorEntry {
  toolSlug: string;
  /** Label shown on the badge. Defaults to "Sponsored" if null. */
  label: string | null;
  /** Lower = shown first when multiple sponsors exist in the same placement. */
  priority: number;
  /** ISO date string or null for no start restriction. */
  startAt: string | null;
  /** ISO date string or null for no end restriction. */
  endAt: string | null;
  /** Which placements this sponsor occupies. */
  placementTypes: SponsorPlacement[];
}

export const sponsorConfig: SponsorEntry[] = [
  // Example (inactive):
  // {
  //   toolSlug: "chatgpt",
  //   label: "Sponsored",
  //   priority: 1,
  //   startAt: "2026-04-01",
  //   endAt: "2026-06-30",
  //   placementTypes: ["homepage", "compare"],
  // },
];

// ── Helpers ──────────────────────────────────────────────────

const today = () => new Date().toISOString().split("T")[0];

function isActive(entry: SponsorEntry): boolean {
  const t = today();
  if (entry.startAt && t < entry.startAt) return false;
  if (entry.endAt && t > entry.endAt) return false;
  return true;
}

export function getActiveSponsors(placement: SponsorPlacement): SponsorEntry[] {
  return sponsorConfig
    .filter((e) => e.placementTypes.includes(placement) && isActive(e))
    .sort((a, b) => a.priority - b.priority);
}

export function getSponsorForTool(toolSlug: string): SponsorEntry | null {
  return sponsorConfig.find((e) => e.toolSlug === toolSlug && isActive(e)) ?? null;
}
