import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, ExternalLink, GitCompare, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScoreBadge } from "@/components/domain/ScoreBadge";
import { CTAButton } from "@/components/domain/CTAButton";
import { RatingWidget } from "@/components/domain/RatingWidget";
import { ToolCard } from "@/components/domain/ToolCard";
import {
  getToolBySlug,
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
    title: `${tool.name} Review — Is it Worth It?`,
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
];

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const [alternatives, comparisons] = await Promise.all([
    getAlternatives(tool),
    getComparisonsForTool(tool.slug),
  ]);

  const avgScore = (Object.values(tool.scores).reduce((s, v) => s + v, 0) / 5).toFixed(1);
  const topScore = Object.entries(tool.scores).sort((a, b) => b[1] - a[1])[0];
  const SCORE_NAME: Record<string, string> = {
    beginner: "beginner-friendly",
    professional: "pro-level power",
    value: "value for money",
    speed: "speed",
    quality: "output quality",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 pb-24">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-muted text-2xl font-bold">
            {tool.name[0]}
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              {tool.featured && (
                <Badge variant="default" className="text-xs">Featured</Badge>
              )}
              <Badge variant="secondary" className="text-xs capitalize">{tool.category.replace("-", " ")}</Badge>
              {tool.status === "beta" && <Badge variant="outline" className="text-xs">Beta</Badge>}
            </div>
            <h1 className="text-2xl font-bold">{tool.name}</h1>
            <p className="text-muted-foreground">{tool.shortDescription}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end shrink-0">
          <div className="text-3xl font-bold tabular-nums">
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

      {/* ── VERDICT (top of page) ── */}
      <section className="mb-8 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-sm uppercase tracking-wide text-primary">Bottom line</h2>
        </div>
        <p className="text-sm leading-relaxed mb-3">
          <strong>{tool.name}</strong> is best known for{" "}
          <strong>{SCORE_NAME[topScore[0]]}</strong> (scored {topScore[1]}/5).{" "}
          {tool.freePlan
            ? "A free plan is available, making it easy to try before committing."
            : `Starts at ${tool.startingPrice ?? "paid"} with no free tier.`}{" "}
        </p>
        <div className="flex flex-wrap gap-2">
          {tool.bestFor.slice(0, 3).map((b) => (
            <span key={b} className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <Check className="h-3 w-3" />
              {b}
            </span>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="mb-3 font-semibold">About {tool.name}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{tool.fullDescription}</p>
          </section>

          <Separator />

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

          {comparisons.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className="mb-3 font-semibold">Compare {tool.name} with</h2>
                <div className="flex flex-col gap-2">
                  {comparisons.map((comp) => (
                    <Link
                      key={comp.slug}
                      href={`/compare/${comp.slug}`}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <GitCompare className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium group-hover:text-primary">{comp.title}</span>
                      </div>
                      <span className="text-xs text-primary">See comparison →</span>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}

          {alternatives.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className="mb-3 font-semibold">Alternatives to {tool.name}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {alternatives.slice(0, 4).map((alt) => (
                    <ToolCard key={alt.slug} tool={alt} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="space-y-5">
          <div className="rounded-xl border border-border p-5">
            <h3 className="mb-4 font-semibold">Scores</h3>
            <div className="space-y-3">
              {SCORE_LABELS.map(({ key, label }) => (
                <ScoreBadge key={key} label={label} score={tool.scores[key]} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border p-5">
            <h3 className="mb-4 font-semibold">Details</h3>
            <dl className="space-y-2.5 text-sm">
              {[
                ["Pricing", <span key="p" className="font-medium capitalize">{tool.pricingModel}</span>],
                ["Starting price", <span key="sp" className="font-medium">{tool.startingPrice ?? "Free"}</span>],
                ["Free plan", tool.freePlan ? <Check key="fp" className="h-4 w-4 text-green-500" /> : <X key="fp" className="h-4 w-4 text-muted-foreground/40" />],
                ["API", tool.apiAvailable ? <Check key="api" className="h-4 w-4 text-green-500" /> : <X key="api" className="h-4 w-4 text-muted-foreground/40" />],
                ["Open source", tool.openSource ? <Check key="os" className="h-4 w-4 text-green-500" /> : <X key="os" className="h-4 w-4 text-muted-foreground/40" />],
].map(([label, value]) => (
                <div key={String(label)} className="flex items-center justify-between">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              <div className="flex items-start justify-between gap-2">
                <dt className="text-muted-foreground shrink-0">Platforms</dt>
                <dd className="text-right text-xs">{tool.platforms.join(", ")}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
            <p className="mb-1 font-medium text-sm">Ready to try {tool.name}?</p>
            <p className="mb-4 text-xs text-muted-foreground">
              {tool.freePlan ? "No credit card required to start." : `Starts at ${tool.startingPrice}.`}
            </p>
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

          <RatingWidget slug={tool.slug} />

          <div className="text-xs text-center text-muted-foreground">
            Last updated {tool.updatedAt}
          </div>
        </aside>
      </div>
    </div>
  );
}
