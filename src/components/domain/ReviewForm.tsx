"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  toolName: string;
  onPosted: () => void;
}

export function ReviewForm({ slug, toolName, onPosted }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [userName, setUserName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating"); return; }
    setSubmitting(true);
    setError(null);

    const res = await fetch(`/api/reviews/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, title, body, userName: userName || undefined }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(
        data.error === "already_reviewed"
          ? "You've already reviewed this tool from this device."
          : (data.error ?? "Something went wrong")
      );
      return;
    }

    onPosted();
    setRating(0);
    setUserName("");
    setTitle("");
    setBody("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-muted/20 p-5">
      <p className="text-sm font-medium">Write a review</p>

      {/* Star picker */}
      <div>
        <p className="mb-1.5 text-xs text-muted-foreground">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  s <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Your name (optional)"
        maxLength={40}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Review title (e.g. Best AI for writing)"
        maxLength={120}
        required
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={`Share your experience with ${toolName}… (min 20 chars)`}
        rows={4}
        minLength={20}
        maxLength={1000}
        required
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{body.length}/1000</span>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Posting…" : "Post review"}
        </button>
      </div>
    </form>
  );
}
