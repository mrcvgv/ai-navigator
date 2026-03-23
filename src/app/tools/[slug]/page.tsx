import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, ExternalLink, GitCompare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScoreBadge } from "@/components/domain/ScoreBadge";
import { CTAButton } from "@/components/domain/CTAButton";
import { ToolCard } from "@/components/domain/ToolCard";
import {
  getToolBySlug,
  getAllTools,
  getAlternatives,
  getComparisonsForTool,
} from "@/lib/repository";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} Review`,
    description: tool.shortDescription,
  };
}

export async function generateStaticParams() {
  const tools = await import("@/data/tools").then((m) => m.tools);
  return tools.map((t) => ({ slug: t.slug }));
}

const SCORE_LABELS = [
  { key: "beginner" as const, label: "Beginner friendly" },
  { key: "professional" as const, label: "Pro power" },
  { key: "value" as const, label: "Value for money" },
  { key: "speed" as const, label: "Speed" },
  { key: "quality" as const, label: "Output quality" },
  { key: "japanese" as const, label: "Japanese support" },
];

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const [tool, allTools] = await Promise.all([
    getToolBySlug(slug),
    getAllTools(),
  ]);

  if (!tool) notFound();

  const [alternatives, comparisons] = await Promise.all([
    getAlternatives(tool),
    getComparisonsForTool(tool.slug),
  ]);

  const avgScore = (Object.values(tool.scores).reduce((s, v) => s + v, 0) / 6).toFixed(1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 pb-24">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-2xl font-bold">
            {tool.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{tool.name}</h1>
            <p className="text-muted-foreground">{tool.shortDescription}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tool.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="text-3xl font-bold">
            {avgScore}
            <span className="text-base font-normal text-muted-foreground">/5</span>
          </div>
          <CTAButton
            href={tool.affiliateUrl ?? tool.officialUrl}
            label={tool.freePlan ? "Try for free" : "Visit official site"}
            variant="primary"
            isAffiliate={!!tool.affiliateUrl}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2 className="mb-3 font-semibold">About {tool.name}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{tool.fullDescription}</p>
          </section>

          <Separator />

          {/* Best for / Not ideal for */}
          <section className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-3 font-semibold text-green-600 dark:text-green-400">Best for</h2>
              <ul className="space-y-2">
                {tool.bestFor.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 font-semibold text-red-500 dark:text-red-400">Not ideal for</h2>
              <ul className="space-y-2">
                {tool.notIdealFor.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          {/* Comparisons */}
          {comparisons.length > 0 && (
            <section>
              <h2 className="mb-3 font-semibold">Compare {tool.name} with</h2>
              <div className="flex flex-col gap-2">
                {comparisons.map((comp) => (
                  <Link
                    key={comp.slug}
                    href={`/compare/${comp.slug}`}
                    className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                  >
                    <GitCompare className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{comp.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <section>
              <h2 className="mb-3 font-semibold">Alternatives to {tool.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {alternatives.map((alt) => (
                  <ToolCard key={alt.slug} tool={alt} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          {/* Scores */}
          <div className="rounded-xl border border-border p-5">
            <h3 className="mb-4 font-semibold">Scores</h3>
            <div className="space-y-3">
              {SCORE_LABELS.map(({ key, label }) => (
                <ScoreBadge key={key} label={label} score={tool.scores[key]} />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="rounded-xl border border-border p-5">
            <h3 className="mb-4 font-semibold">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pricing</dt>
                <dd className="font-medium capitalize">{tool.pricingModel}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Starting price</dt>
                <dd className="font-medium">{tool.startingPrice ?? "Free"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Free plan</dt>
                <dd>{tool.freePlan ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground/40" />}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">API</dt>
                <dd>{tool.apiAvailable ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground/40" />}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Open source</dt>
                <dd>{tool.openSource ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground/40" />}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Japanese</dt>
                <dd>{tool.japaneseSupport ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground/40" />}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Platforms</dt>
                <dd className="text-right text-xs">{tool.platforms.join(", ")}</dd>
              </div>
            </dl>
          </div>

          {/* CTA */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
            <p className="mb-3 text-sm font-medium">Ready to try {tool.name}?</p>
            <CTAButton
              href={tool.affiliateUrl ?? tool.officialUrl}
              label={tool.freePlan ? "Start for free" : "Visit official site"}
              className="w-full justify-center"
              isAffiliate={!!tool.affiliateUrl}
            />
            {tool.affiliateUrl && (
              <a
                href={tool.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Official site
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
