"use client";

import { useRouter } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/lib/compare-store";

export function CompareBar() {
  const { tools, remove, clear } = useCompare();
  const router = useRouter();

  if (tools.length === 0) return null;

  const handleCompare = () => {
    router.push(`/compare?tools=${tools.join(",")}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Comparing:</span>
          <div className="flex gap-1.5">
            {tools.map((slug) => (
              <span
                key={slug}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {slug}
                <button
                  onClick={() => remove(slug)}
                  className="ml-0.5 rounded-full hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {tools.length < 3 && (
              <span className="flex items-center rounded-full border border-dashed border-muted-foreground/40 px-2.5 py-1 text-xs text-muted-foreground">
                + add {3 - tools.length} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clear} className="text-xs">
            Clear
          </Button>
          <Button size="sm" onClick={handleCompare} className="gap-1.5" disabled={tools.length < 2}>
            Compare now
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
