"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Lock } from "lucide-react";
import { useSavedComparisons } from "@/lib/pro-store";

interface ProSaveCTAProps {
  slug: string;
  title: string;
}

export function ProSaveCTA({ slug, title }: ProSaveCTAProps) {
  const { saved, canSave, limit, saveComparison, isPro } = useSavedComparisons();
  const [state, setState] = useState<"idle" | "saved" | "limit">("idle");

  const isSaved = saved.some((s) => s.slug === slug);

  function handleSave() {
    const result = saveComparison(slug, title);
    if (result === "limit") setState("limit");
    else setState("saved");
  }

  if (isSaved || state === "saved") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-900/10 px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
          <BookmarkCheck className="h-4 w-4 shrink-0" />
          Saved to your library
        </div>
        <Link href="/saved" className="text-xs text-green-600 dark:text-green-400 hover:underline shrink-0">
          View all ({saved.length})
        </Link>
      </div>
    );
  }

  if (state === "limit") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-900/10 px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-4 w-4 text-amber-600" />
          <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
            Free limit reached ({limit} saves)
          </p>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-500 mb-3">
          Upgrade to Pro for unlimited saved comparisons.
        </p>
        <Link
          href="/pro"
          className="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Upgrade to Pro — ¥980/mo
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-muted/30 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium">Save this comparison</p>
        <p className="text-xs text-muted-foreground">
          {isPro
            ? "Saved comparisons appear in your library."
            : `${saved.length}/${limit} free saves used · Pro = unlimited`}
        </p>
      </div>
      <button
        onClick={handleSave}
        disabled={!canSave}
        className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        <Bookmark className="h-3.5 w-3.5" />
        Save
      </button>
    </div>
  );
}
