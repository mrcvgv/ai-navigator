import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getToolsByCategory, getAllComparisons } from "@/lib/repository";
import { ToolCard } from "@/components/domain/ToolCard";
import Link from "next/link";
import { GitCompare } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} AI Tools`,
    description: cat.description,
  };
}

export async function generateStaticParams() {
  const cats = await import("@/data/categories").then((m) => m.categories);
  return cats.map((c) => ({ slug: c.slug }));
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const [category, tools, allComparisons] = await Promise.all([
    getCategoryBySlug(slug),
    getToolsByCategory(slug),
    getAllComparisons(),
  ]);

  if (!category) notFound();

  const relatedComparisons = allComparisons.filter((comp) =>
    comp.toolSlugs.some((s) => tools.find((t) => t.slug === s))
  );

  const sortedTools = [...tools].sort((a, b) => {
    const sa = Object.values(a.scores).reduce((s, v) => s + v, 0);
    const sb = Object.values(b.scores).reduce((s, v) => s + v, 0);
    return sb - sa;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{category.name} AI Tools</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">{category.description}</p>
        <p className="mt-1 text-sm text-muted-foreground">{category.toolCount} tools</p>
      </div>

      {relatedComparisons.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 font-semibold">Compare {category.name} tools</h2>
          <div className="flex flex-wrap gap-2">
            {relatedComparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                <GitCompare className="h-3.5 w-3.5 text-primary" />
                {comp.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
