"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, ThumbsUp } from "lucide-react";
import type { UserReview } from "@/types";

interface Props {
  slug: string;
  refreshKey?: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      ))}
    </span>
  );
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function ReviewList({ slug, refreshKey = 0 }: Props) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${slug}?page=${p}`);
      const data = await res.json();
      setReviews(p === 0 ? data.reviews : (prev) => [...prev, ...data.reviews]);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { setPage(0); load(0); }, [slug, refreshKey, load]);

  async function markHelpful(reviewId: string) {
    if (helpfulClicked.has(reviewId)) return;
    setHelpfulClicked((prev) => new Set(prev).add(reviewId));
    await fetch(`/api/reviews/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId }),
    });
    load(0);
  }

  if (loading && reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">Loading reviews…</p>;
  }

  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No reviews yet — be the first!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{total} review{total !== 1 ? "s" : ""}</p>
      {reviews.map((r) => (
        <div key={r.id} className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="flex items-center gap-2">
            {r.userAvatar ? (
              <img src={r.userAvatar} alt="" className="h-7 w-7 rounded-full" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold">
                {r.userName[0]}
              </div>
            )}
            <span className="text-sm font-medium">{r.userName}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <Stars rating={r.rating} />
            <span className="ml-auto text-xs text-muted-foreground">{timeAgo(r.createdAt)}</span>
          </div>
          <p className="text-sm font-semibold">{r.title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
          <button
            onClick={() => markHelpful(r.id)}
            disabled={helpfulClicked.has(r.id)}
            className={`flex items-center gap-1.5 text-xs transition-colors disabled:cursor-default ${helpfulClicked.has(r.id) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${helpfulClicked.has(r.id) ? "fill-primary" : ""}`} />
            {helpfulClicked.has(r.id) ? "Thanks!" : `Helpful${r.helpfulCount > 0 ? ` (${r.helpfulCount})` : ""}`}
          </button>
        </div>
      ))}
      {reviews.length < total && (
        <button
          onClick={() => { const next = page + 1; setPage(next); load(next); }}
          className="w-full rounded-lg border border-border py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Load more
        </button>
      )}
    </div>
  );
}
