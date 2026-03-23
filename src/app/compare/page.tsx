"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { GitCompare, Plus } from "lucide-react";
import { ComparisonTable } from "@/components/domain/ComparisonTable";
import { ToolCard } from "@/components/domain/ToolCard";
import { Button } from "@/components/ui/button";
import { tools as allTools } from "@/data/tools";
import type { Tool } from "@/types";

function CompareContent() {
  const searchParams = useSearchParams();
  const slugs = searchParams.get("tools")?.split(",").filter(Boolean) ?? [];
  const selectedTools = slugs
    .map((s) => allTools.find((t) => t.slug === s))
    .filter(Boolean) as Tool[];

  if (selectedTools.length === 0) {
    return (
      <div className="py-20 text-center">
        <GitCompare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
        <h2 className="mb-2 text-xl font-semibold">No tools selected</h2>
        <p className="mb-6 text-muted-foreground">
          Add tools to compare by clicking the Compare button on any tool card.
        </p>
        <Link href="/explore">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Browse tools to compare
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Comparing {selectedTools.map((t) => t.name).join(" vs ")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Side-by-side comparison of {selectedTools.length} AI tools
        </p>
      </div>
      <ComparisonTable tools={selectedTools} />
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 pb-24">
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
        <CompareContent />
      </Suspense>
    </div>
  );
}
