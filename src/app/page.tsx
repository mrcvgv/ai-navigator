import Link from "next/link";
import { ArrowRight, Zap, GitCompare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/domain/ToolCard";
import { CategoryPill } from "@/components/domain/CategoryPill";
import {
  getFeaturedTools,
  getAllCategories,
  getAllComparisons,
} from "@/lib/repository";

export default async function HomePage() {
  const [featured, categories, comparisons] = await Promise.all([
    getFeaturedTools(),
    getAllCategories(),
    getAllComparisons(),
  ]);

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Zap className="h-3 w-3" />
          AI tool decision-making, simplified
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Find the right AI tool.
          <br />
          <span className="text-primary">Stop guessing, start comparing.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
          AI Navigator helps you cut through the noise. Compare tools side-by-side,
          filter by what matters, and make confident decisions — not just searches.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/explore">
            <Button size="lg" className="gap-2">
              Explore AI Tools
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/compare">
            <Button size="lg" variant="outline" className="gap-2">
              <GitCompare className="h-4 w-4" />
              Compare Tools
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-border bg-muted/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Browse by Category</h2>
            <Link href="/categories" className="text-sm text-primary hover:underline">
              All categories
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <CategoryPill key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Top AI Tools</h2>
            <p className="text-sm text-muted-foreground">The most popular tools across all categories</p>
          </div>
          <Link href="/explore">
            <Button variant="outline" size="sm" className="gap-1.5">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Popular comparisons */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Popular Comparisons</h2>
            <p className="text-sm text-muted-foreground">See how top tools stack up against each other</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-primary" />
                  <span className="font-medium group-hover:text-primary">{comp.title}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{comp.summary}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-primary">
                  See comparison
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: Free tools */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">Just getting started?</h2>
          <p className="mb-6 text-muted-foreground">
            Explore AI tools with a free plan — no credit card required.
          </p>
          <Link href="/explore?freePlan=true">
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Browse free AI tools
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
