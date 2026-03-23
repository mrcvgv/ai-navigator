import type { Metadata } from "next";
import Link from "next/link";
import { GitCompare, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComparisonTable } from "@/components/domain/ComparisonTable";
import { getToolsBySlugs, getAllComparisons } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Compare AI Tools",
  description: "Side-by-side comparison of AI tools. Pick up to 3 tools and see exactly how they stack up.",
};

interface Props {
  searchParams: Promise<{ tools?: string }>;
}

export default async function ComparePage({ searchParams }: Props) {
  const params = await searchParams;
  const slugs = params.tools?.split(",").filter(Boolean) ?? [];
  const [selectedTools, allComparisons] = await Promise.all([
    getToolsBySlugs(slugs),
    getAllComparisons(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 pb-24">
      {selectedTools.length >= 2 ? (
        /* ── Active comparison ── */
        <div>
          <div className="mb-8">
            <p className="mb-1 text-sm font-medium text-primary uppercase tracking-wide">Side-by-side comparison</p>
            <h1 className="text-3xl font-bold">
              {selectedTools.map((t) => t.name).join(" vs ")}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Comparing {selectedTools.length} AI tools across pricing, features, and scores.
            </p>
          </div>
          <ComparisonTable tools={selectedTools} />
        </div>
      ) : (
        /* ── Landing state: no tools selected ── */
        <div>
          <div className="mb-10 text-center">
            <GitCompare className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h1 className="mb-2 text-3xl font-bold">Compare AI Tools</h1>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Add tools from the{" "}
              <Link href="/explore" className="text-primary hover:underline">
                Explore page
              </Link>{" "}
              using the Compare button, or start with a popular comparison below.
            </p>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-lg">Popular comparisons</h2>
            <span className="text-sm text-muted-foreground">{allComparisons.length} total</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allComparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-2 flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold group-hover:text-primary">{comp.title}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{comp.summary}</p>
                <div className="flex items-center gap-1 text-xs font-medium text-primary">
                  See full comparison
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="mb-2 font-semibold">Can't find your comparison?</h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Browse all tools and add up to 3 to compare side-by-side.
            </p>
            <Link href="/explore">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Browse tools to compare
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
