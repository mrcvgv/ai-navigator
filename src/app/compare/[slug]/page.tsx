import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getComparisonBySlug, getToolsBySlugs } from "@/lib/repository";
import { ComparisonTable } from "@/components/domain/ComparisonTable";
import { CTAButton } from "@/components/domain/CTAButton";
import { Check } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comp = await getComparisonBySlug(slug);
  if (!comp) return {};
  return {
    title: comp.title,
    description: comp.summary,
  };
}

export async function generateStaticParams() {
  const comps = await import("@/data/comparisons").then((m) => m.comparisons);
  return comps.map((c) => ({ slug: c.slug }));
}

export default async function ComparePresetPage({ params }: Props) {
  const { slug } = await params;
  const comp = await getComparisonBySlug(slug);
  if (!comp) notFound();

  const tools = await getToolsBySlugs(comp.toolSlugs);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{comp.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{comp.summary}</p>
      </div>

      {/* Recommended for */}
      {comp.recommendedFor.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {comp.recommendedFor.map((rec) => {
            const tool = tools.find((t) => t.slug === rec.toolSlug);
            if (!tool) return null;
            return (
              <div key={rec.toolSlug} className="rounded-xl border border-border p-5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted font-bold text-sm">
                    {tool.name[0]}
                  </div>
                  <span className="font-semibold">{tool.name}</span>
                  <span className="text-xs text-muted-foreground">is best for:</span>
                </div>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
                <div className="mt-3">
                  <CTAButton
                    href={tool.affiliateUrl ?? tool.officialUrl}
                    label={tool.freePlan ? "Try free" : "Visit site"}
                    isAffiliate={!!tool.affiliateUrl}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ComparisonTable tools={tools} />
    </div>
  );
}
