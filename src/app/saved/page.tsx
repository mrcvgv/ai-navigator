"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookmarkX, GitCompare } from "lucide-react";
import type { SavedComparison } from "@/lib/pro-store";

const SAVES_KEY = "ai_nav_saved_comparisons";

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedComparison[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVES_KEY);
      setSaved(raw ? (JSON.parse(raw) as SavedComparison[]) : []);
    } catch {
      setSaved([]);
    }
  }, []);

  function remove(slug: string) {
    const next = (saved ?? []).filter((s) => s.slug !== slug);
    localStorage.setItem(SAVES_KEY, JSON.stringify(next));
    setSaved(next);
  }

  if (saved === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Saved Comparisons</h1>
        <Link href="/pro" className="text-sm text-amber-500 hover:underline font-medium">
          Upgrade to Pro
        </Link>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/30 p-12 text-center">
          <GitCompare className="mx-auto h-10 w-10 text-muted-foreground/40 mb-4" />
          <p className="text-sm font-medium mb-1">No saved comparisons yet</p>
          <p className="text-xs text-muted-foreground mb-4">
            Browse comparisons and click &quot;Save&quot; to build your library.
          </p>
          <Link
            href="/compare"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Browse comparisons
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {saved.map((item) => (
            <li
              key={item.slug}
              className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:bg-accent/30 transition-colors"
            >
              <Link
                href={`/compare/${item.slug}`}
                className="flex items-center gap-3 flex-1 min-w-0 group"
              >
                <GitCompare className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saved {new Date(item.savedAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => remove(item.slug)}
                className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label="Remove"
              >
                <BookmarkX className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-xs text-muted-foreground text-center">
        Saved locally in your browser ·{" "}
        <Link href="/pro" className="text-amber-500 hover:underline">
          Pro
        </Link>{" "}
        = unlimited saves
      </p>
    </main>
  );
}
