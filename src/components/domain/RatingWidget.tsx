"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RatingReason } from "@/types";

interface RatingStats {
  count: number;
  score: number | null;
  distribution: [number, number, number, number, number];
}

const REASONS: { value: RatingReason; label: string }[] = [
  { value: "too_expensive", label: "Too expensive" },
  { value: "not_as_advertised", label: "Doesn't work as advertised" },
  { value: "limited_features", label: "Limited features" },
  { value: "better_alternatives", label: "Better alternatives exist" },
  { value: "poor_reliability", label: "Poor reliability" },
  { value: "other", label: "Other" },
];

export function RatingWidget({ slug }: { slug: string }) {
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [reason, setReason] = useState<RatingReason | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "done" | "already" | "error">("idle");

  useEffect(() => {
    fetch(`/api/ratings/${slug}`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, [slug]);

  const handleSubmit = async () => {
    if (!selected) return;
    if (selected <= 2 && !reason) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/ratings/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: selected, reason: reason || undefined }),
      });
      const data = await res.json();
      if (res.status === 429 || data.error === "already_rated") {
        setStatus("already");
      } else if (res.ok) {
        setStatus("done");
        if (data.stats) setStats(data.stats);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const active = hovered || selected;

  return (
    <div className="rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Community Rating</h3>
        {stats?.score != null && (
          <div className="text-right">
            <span className="text-xl font-bold">{stats.score}</span>
            <span className="text-xs text-muted-foreground">/5</span>
            <p className="text-xs text-muted-foreground">{stats.count} ratings</p>
          </div>
        )}
        {stats?.score == null && stats?.count != null && (
          <p className="text-xs text-muted-foreground">
            {stats.count > 0 ? `${stats.count} rating${stats.count > 1 ? "s" : ""} (need ${5 - stats.count} more)` : "No ratings yet"}
          </p>
        )}
      </div>

      {/* Score bar */}
      {stats?.score != null && (
        <div className="space-y-1">
          {stats.distribution.map((n, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-right text-muted-foreground">{i + 1}</span>
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: stats.count > 0 ? `${(n / stats.count) * 100}%` : "0%" }}
                />
              </div>
              <span className="w-4 text-muted-foreground">{n}</span>
            </div>
          ))}
        </div>
      )}

      {/* Rating input */}
      {status === "idle" && (
        <div className="space-y-3 border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">Rate this tool</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setSelected(n)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 ${
                    n <= active
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>

          {selected > 0 && selected <= 2 && (
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">
                What's your main concern? <span className="text-red-400">*</span>
              </p>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as RatingReason)}
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs"
              >
                <option value="">Select a reason...</option>
                {REASONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          )}

          {selected > 0 && (
            <Button
              size="sm"
              className="w-full"
              disabled={submitting || (selected <= 2 && !reason)}
              onClick={handleSubmit}
            >
              {submitting ? "Submitting..." : "Submit rating"}
            </Button>
          )}
        </div>
      )}

      {status === "done" && (
        <p className="border-t border-border pt-3 text-xs text-green-600 dark:text-green-400">
          Thanks for rating!
        </p>
      )}
      {status === "already" && (
        <p className="border-t border-border pt-3 text-xs text-muted-foreground">
          You already rated this tool today.
        </p>
      )}
      {status === "error" && (
        <p className="border-t border-border pt-3 text-xs text-red-500">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
