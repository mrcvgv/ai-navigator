"use client";

import { useRouter } from "next/navigation";
import { X, ArrowRight, GitCompare } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import { tools as allTools } from "@/data/tools";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const { tools: slugs, remove, clear } = useCompare();
  const router = useRouter();
  if (slugs.length === 0) return null;

  const selected = slugs.map((s) => allTools.find((t) => t.slug === s)).filter(Boolean) as typeof allTools;
  const canCompare = slugs.length >= 2;
  const emptySlots = Array.from({ length: 3 - slugs.length });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/98 shadow-2xl backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3 overflow-hidden">
          <GitCompare className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium text-muted-foreground shrink-0 hidden sm:block">Comparing:</span>
          <div className="flex items-center gap-2">
            {selected.map((tool) => (
              <div key={tool.slug} className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 pl-2 pr-1.5 py-1">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[11px] font-bold text-primary-foreground shrink-0">
                  {tool.name[0]}
                </span>
                <span className="text-sm font-medium max-w-[90px] truncate">{tool.name}</span>
                <button onClick={() => remove(tool.slug)} className="ml-0.5 rounded p-0.5 text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {emptySlots.map((_, i) => (
              <div key={i} className="flex h-8 items-center rounded-lg border border-dashed border-muted-foreground/30 px-3 text-xs text-muted-foreground/50">
                + add
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1">Clear</button>
          <button
            onClick={() => router.push(`/compare?tools=${slugs.join(",")}`)}
            disabled={!canCompare}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
              canCompare
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/30"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            Compare now <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
