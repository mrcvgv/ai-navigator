import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight, GitCompare } from "lucide-react";
import { getComparisonBySlug, getToolsBySlugs, getAllComparisons } from "@/lib/repository";
import { ComparisonTable } from "@/components/domain/ComparisonTable";
import { CTAButton } from "@/components/domain/CTAButton";
import { Badge } from "@/components/ui/badge";
import { AffiliateDisclosure } from "@/components/domain/AffiliateDisclosure";
import { SponsoredSlot } from "@/components/domain/SponsoredSlot";
import { ProSaveCTA } from "@/components/domain/ProSaveCTA";
import { ProCTABanner } from "@/components/domain/ProCTABanner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comp = await getComparisonBySlug(slug);
  if (!comp) return {};
  return {
    title: `${comp.title} — Which is Better?`,
    description: comp.summary,
    openGraph: { title: comp.title, description: comp.summary },
  };
}

export async function generateStaticParams() {
  const comps = await import("@/data/comparisons").then((m) => m.comparisons);
  return comps.map((c) => ({ slug: c.slug }));
}

export default async function ComparePresetPage({ params }: Props) {
  const { slug } = await params;
  const [comp, allComparisons] = await Promise.all([
    getComparisonBySlug(slug),
    getAllComparisons(),
  ]);
  if (!comp) notFound();

  const tools = await getToolsBySlugs(comp.toolSlugs);
  const relatedComparisons = allComparisons
    .filter((c) => c.slug !== slug && c.toolSlugs.some((s) => comp.toolSlugs.includes(s)))
    .slice(0, 4);

  const BASE =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://ai-navigator.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comp.title,
    description: comp.summary,
    dateModified: comp.updatedAt,
    url: `${BASE}/compare/${slug}`,
    about: tools.map((t) => ({
      "@type": "SoftwareApplication",
      name: t.name,
      url: t.officialUrl,
      applicationCategory: "AIApplication",
    })),
    publisher: {
      "@type": "Organization",
      name: "AI Navigator",
      url: BASE,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 pb-24">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/compare" className="hover:text-foreground">Compare</Link>
        <span>/</span>
        <span className="text-foreground">{comp.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">Comparison</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{comp.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed max-w-2xl">{comp.summary}</p>
        <p className="mt-2 text-xs text-muted-foreground">Updated {comp.updatedAt}</p>
      </div>

      {/* ── VERDICT (the most important section) ── */}
      <section className="mb-10 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 sm:p-8">
        <h2 className="mb-6 text-xl font-bold">
          Quick verdict — who should use what?
        </h2>
        <div className={`grid gap-4 ${comp.recommendedFor.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
          {comp.recommendedFor.map((rec) => {
            const tool = tools.find((t) => t.slug === rec.toolSlug);
            if (!tool) return null;
            return (
              <div key={rec.toolSlug} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    {tool.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{tool.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {tool.freePlan ? "Free plan available" : tool.startingPrice ?? "Paid"}
                    </div>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Best if:</strong> {rec.reason}
                </p>
                <CTAButton
                  href={tool.affiliateUrl ?? tool.officialUrl}
                  label={tool.freePlan ? "Try free" : "Visit site"}
                  variant="primary"
                  className="w-full justify-center"
                  isAffiliate={!!tool.affiliateUrl}
                  toolSlug={tool.slug}
                  toolName={tool.name}
                  comparisonSlug={slug}
                  pageType="compare"
                  ctaType="verdict_cta"
                  ctaPosition="top"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold">Full comparison</h2>
        <ComparisonTable tools={tools} />
      </section>

      {/* ── Best for / Not ideal for per tool ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold">Strengths & weaknesses</h2>
        <div className={`grid gap-6 ${tools.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
          {tools.map((tool) => (
            <div key={tool.slug} className="rounded-xl border border-border p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted font-bold text-sm">
                  {tool.name[0]}
                </div>
                <Link href={`/tools/${tool.slug}`} className="font-semibold hover:text-primary">
                  {tool.name}
                </Link>
              </div>
              <div className="mb-3">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-green-600 dark:text-green-400">
                  Best for
                </p>
                <ul className="space-y-1">
                  {tool.bestFor.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-red-500 dark:text-red-400">
                  Not ideal for
                </p>
                <ul className="space-y-1">
                  {tool.notIdealFor.slice(0, 2).map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <CTAButton
                  href={tool.affiliateUrl ?? tool.officialUrl}
                  label={tool.freePlan ? "Try free" : "Visit site"}
                  variant="secondary"
                  className="w-full justify-center"
                  isAffiliate={!!tool.affiliateUrl}
                  toolSlug={tool.slug}
                  toolName={tool.name}
                  comparisonSlug={slug}
                  pageType="compare"
                  ctaType="try_free"
                  ctaPosition="bottom"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sponsored slot ── */}
      <SponsoredSlot placement="compare" pageType="compare" comparisonSlug={slug} />

      {/* ── Save comparison + Pro CTA ── */}
      <div className="my-8 space-y-3">
        <ProSaveCTA slug={slug} title={comp.title} />
        <ProCTABanner variant="inline" />
      </div>

      {/* ── Related comparisons ── */}
      {relatedComparisons.length > 0 && (
        <section className="border-t border-border pt-8">
          <h2 className="mb-4 font-semibold">Related comparisons</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedComparisons.map((related) => (
              <Link
                key={related.slug}
                href={`/compare/${related.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium group-hover:text-primary">{related.title}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <AffiliateDisclosure variant="page" />
    </div>
    </>
  );
}
