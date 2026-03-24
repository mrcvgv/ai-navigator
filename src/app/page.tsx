import Link from "next/link";
import { ArrowRight, GitCompare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/domain/ToolCard";
import { CategoryPill } from "@/components/domain/CategoryPill";
import { getFeaturedTools, getAllCategories, getAllComparisons } from "@/lib/repository";

export default async function HomePage() {
  const [featured, categories, comparisons] = await Promise.all([
    getFeaturedTools(),
    getAllCategories(),
    getAllComparisons(),
  ]);

  return (
    <div className="pb-20">

      {/* Hero — compare-first */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Which AI tool is right for you?
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
          Side-by-side comparisons across pricing, features, and use cases.
          Know exactly what differs — then decide.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/compare">
            <Button size="lg" className="gap-2 shadow-md shadow-primary/20">
              <GitCompare className="h-5 w-5" />
              Start comparing
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Browse all tools
            </Button>
          </Link>
        </div>
      </section>

      {/* Popular Comparisons — primary content */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Popular comparisons</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The most-searched head-to-heads — pick the one closest to your decision
              </p>
            </div>
            <Link href="/compare">
              <Button variant="outline" size="sm" className="gap-1.5">
                All {comparisons.length}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {comparisons.slice(0, 8).map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <GitCompare className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-sm font-semibold group-hover:text-primary leading-snug">
                    {comp.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{comp.summary}</p>
                <p className="mt-2 text-xs font-medium text-primary">See comparison →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured tools — secondary, compare-adjacent */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Top AI tools</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add any two to your tray — then compare
              </p>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="sm" className="gap-1.5">
                All tools <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} pageType="home" ctaPosition="card" />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-border bg-muted/20 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Browse by category</h2>
            <Link href="/categories" className="text-sm text-primary hover:underline">
              All categories
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => <CategoryPill key={cat.slug} category={cat} />)}
          </div>
        </div>
      </section>

    </div>
  );
}
