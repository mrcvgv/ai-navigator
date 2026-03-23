import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import type { StoredRating, RatingStats, RatingReason } from "@/types";

const C = 10;       // Bayesian prior weight
const PRIOR = 3.5;  // Bayesian prior mean
const MIN_COUNT = 5; // Minimum ratings before showing community score

function hashIp(ip: string, date: string): string {
  return createHash("sha256").update(`${ip}:${date}`).digest("hex").slice(0, 16);
}

function computeStats(ratings: StoredRating[]): RatingStats {
  const valid = ratings.filter((r) => r.weight > 0);

  if (valid.length === 0) {
    return { bayesianScore: PRIOR, rawAverage: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
  }

  // Outlier detection: exclude values outside mean ± 2σ
  const values = valid.map((r) => r.value);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance);
  const lo = mean - 2 * std;
  const hi = mean + 2 * std;

  const trimmed = valid.filter((r) => r.value >= lo && r.value <= hi);
  const weightSum = trimmed.reduce((s, r) => s + r.weight, 0);
  const weightedSum = trimmed.reduce((s, r) => s + r.weight * r.value, 0);

  const bayesianScore = (C * PRIOR + weightedSum) / (C + weightSum);

  const rawAverage = valid.reduce((s, r) => s + r.value, 0) / valid.length;

  const distribution: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  for (const r of valid) {
    distribution[r.value - 1]++;
  }

  return {
    bayesianScore: Math.round(bayesianScore * 10) / 10,
    rawAverage: Math.round(rawAverage * 10) / 10,
    count: valid.length,
    distribution,
  };
}

// GET /api/ratings/[slug]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const ratings: StoredRating[] = (await kv.get(`ratings:${slug}`)) ?? [];
    const stats = computeStats(ratings);

    if (stats.count < MIN_COUNT) {
      return NextResponse.json({ count: stats.count, score: null, distribution: stats.distribution });
    }

    return NextResponse.json({
      count: stats.count,
      score: stats.bayesianScore,
      rawAverage: stats.rawAverage,
      distribution: stats.distribution,
    });
  } catch {
    return NextResponse.json({ count: 0, score: null, distribution: [0, 0, 0, 0, 0] });
  }
}

// POST /api/ratings/[slug]
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let body: { value: number; reason?: RatingReason };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { value, reason } = body;

  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  if (value <= 2 && !reason) {
    return NextResponse.json({ error: "Reason required for low ratings" }, { status: 400 });
  }

  // Get client IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const today = new Date().toISOString().split("T")[0];
  const ipHash = hashIp(ip, today);

  try {
    const ratings: StoredRating[] = (await kv.get(`ratings:${slug}`)) ?? [];

    // Rate limit: 1 rating per IP per tool per day
    const alreadyRated = ratings.some((r) => r.ipHash === ipHash);
    if (alreadyRated) {
      return NextResponse.json({ error: "already_rated" }, { status: 429 });
    }

    const entry: StoredRating = {
      value,
      timestamp: Date.now(),
      ipHash,
      reason,
      weight: 1.0,
    };

    const updated = [...ratings, entry].slice(-500); // keep last 500
    await kv.set(`ratings:${slug}`, updated);

    const stats = computeStats(updated);
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    console.error("KV error:", err);
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }
}
