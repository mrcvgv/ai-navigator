import Link from "next/link";
import { ArrowRight, GitCompare, Search, Zap } from "lucide-react";
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

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Zap className="h-3 w-3" />
          AI tool decisions, simplified
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Stop guessing.{" "}
          <span className="text-primary">Start comparing.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
          Compare AI tools side-by-side across pricing, features, and scores.
          See exactly what differs — then decide with confidence.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/compare">
            <Button size="lg" className="gap-2 shadow-md shadow-primary/20">
              <GitCompare className="h-5 w-5" />
              Compare AI Tools
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

      {/* Popular Comparisons — first content section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Popular Comparisons</h2>
              <p className="text-sm text-muted-foreground mt-1">The most-searched head-to-heads</p>
            </div>
            <Link href="/compare">
              <Button variant="outline" size="sm" className="gap-1.5">
                All {comparisons.length} comparisons
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
                  <span className="text-sm font-semibold group-hover:text-primary leading-snug">{comp.title}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{comp.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-8 text-xl font-bold text-center">How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: "1", icon: "🔍", title: "Pick your tools", desc: 'Hit "Compare" on any tool card to add it to your comparison tray — up to 3 at a time.' },
            { step: "2", icon: "⚖️", title: "See the diff", desc: "Pricing, features, and scores in one table. Winners highlighted per row." },
            { step: "3", icon: "✅", title: "Decide with confidence", desc: "Know exactly which tool fits your use case before you sign up." },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="rounded-xl border border-border p-6 text-center">
              <div className="mb-3 text-3xl">{icon}</div>
              <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Step {step}</div>
              <div className="mb-2 font-semibold">{title}</div>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured tools */}
      <section className="border-t border-border bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Top AI Tools</h2>
              <p className="text-sm text-muted-foreground">Hit "Compare" to add any card to your tray</p>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="sm" className="gap-1.5">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Browse by Category</h2>
          <Link href="/categories" className="text-sm text-primary hover:underline">All categories</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => <CategoryPill key={cat.slug} category={cat} />)}
        </div>
      </section>

    </div>
  );
}
