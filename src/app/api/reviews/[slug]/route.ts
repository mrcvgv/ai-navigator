import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { auth } from "@/auth";
import type { UserReview } from "@/types";

const MAX_REVIEWS = 500;
const MAX_BODY = 1000;
const MAX_TITLE = 120;

function hashUserId(sub: string): string {
  return createHash("sha256").update(sub).digest("hex").slice(0, 20);
}

type Params = { params: Promise<{ slug: string }> };

// GET /api/reviews/[slug]?page=0
export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const page = Number(req.nextUrl.searchParams.get("page") ?? "0");
  const pageSize = 10;

  try {
    const reviews: UserReview[] = (await kv.get(`reviews:${slug}`)) ?? [];
    const sorted = [...reviews].sort((a, b) => b.createdAt - a.createdAt);
    const slice = sorted.slice(page * pageSize, (page + 1) * pageSize);
    return NextResponse.json({ reviews: slice, total: reviews.length });
  } catch {
    return NextResponse.json({ reviews: [], total: 0 });
  }
}

// POST /api/reviews/[slug]
export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to post a review" }, { status: 401 });
  }

  let body: { rating: number; title: string; body: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { rating, title, body: reviewBody } = body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }
  if (!title?.trim() || title.trim().length > MAX_TITLE) {
    return NextResponse.json({ error: `Title required (max ${MAX_TITLE} chars)` }, { status: 400 });
  }
  if (!reviewBody?.trim() || reviewBody.trim().length < 20 || reviewBody.trim().length > MAX_BODY) {
    return NextResponse.json({ error: `Review must be 20-${MAX_BODY} chars` }, { status: 400 });
  }

  const userId = hashUserId(session.user.id ?? session.user.email ?? "anon");

  try {
    const reviews: UserReview[] = (await kv.get(`reviews:${slug}`)) ?? [];

    // One review per user per tool
    if (reviews.some((r) => r.userId === userId)) {
      return NextResponse.json({ error: "already_reviewed" }, { status: 429 });
    }

    const review: UserReview = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      slug,
      userId,
      userName: session.user.name ?? "Anonymous",
      userAvatar: session.user.image ?? null,
      rating,
      title: title.trim().slice(0, MAX_TITLE),
      body: reviewBody.trim().slice(0, MAX_BODY),
      createdAt: Date.now(),
      helpfulCount: 0,
      helpfulBy: [],
    };

    const updated = [review, ...reviews].slice(0, MAX_REVIEWS);
    await kv.set(`reviews:${slug}`, updated);

    return NextResponse.json({ ok: true, review });
  } catch (err) {
    console.error("KV error:", err);
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }
}

// PATCH /api/reviews/[slug] — mark helpful
export async function PATCH(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to vote" }, { status: 401 });
  }

  const { reviewId } = await req.json();
  const userId = hashUserId(session.user.id ?? session.user.email ?? "anon");

  try {
    const reviews: UserReview[] = (await kv.get(`reviews:${slug}`)) ?? [];
    const updated = reviews.map((r) => {
      if (r.id !== reviewId) return r;
      if (r.helpfulBy.includes(userId)) return r; // already voted
      return { ...r, helpfulCount: r.helpfulCount + 1, helpfulBy: [...r.helpfulBy, userId] };
    });
    await kv.set(`reviews:${slug}`, updated);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }
}
