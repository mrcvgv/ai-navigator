"use client";

import { useState } from "react";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";

interface SaveComparisonCTAProps {
  comparisonSlug?: string;
  comparisonTitle?: string;
}

type State = "idle" | "open" | "loading" | "done" | "error";

export function SaveComparisonCTA({ comparisonSlug, comparisonTitle }: SaveComparisonCTAProps) {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");

  const handleOpen = () => setState("open");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    track("save_comparison_submit", {
      comparisonSlug: comparisonSlug ?? "",
      comparisonTitle: comparisonTitle ?? "",
    });
    try {
      const res = await fetch("/api/save-comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, comparisonSlug, comparisonTitle }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-900/10 px-5 py-4 flex items-center gap-3 text-sm text-green-700 dark:text-green-400">
        <Check className="h-4 w-4 shrink-0" />
        Saved — we&apos;ll email you when pricing changes or better alternatives appear.
      </div>
    );
  }

  if (state === "open" || state === "loading" || state === "error") {
    return (
      <div className="rounded-xl border border-border bg-muted/30 px-5 py-4">
        <p className="mb-1 text-sm font-medium">Get notified about pricing changes</p>
        <p className="mb-3 text-xs text-muted-foreground">
          We&apos;ll email you if prices change or a better alternative appears for this comparison.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button type="submit" size="sm" disabled={state === "loading"}>
            {state === "loading" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Notify me"
            )}
          </Button>
        </form>
        {state === "error" && (
          <p className="mt-2 text-xs text-red-500">Something went wrong — please try again.</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-muted/30 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium">Get pricing change alerts</p>
        <p className="text-xs text-muted-foreground">
          We&apos;ll notify you if prices change or better alternatives appear.
        </p>
      </div>
      <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={handleOpen}>
        <Bookmark className="h-3.5 w-3.5" />
        Notify me
      </Button>
    </div>
  );
}
