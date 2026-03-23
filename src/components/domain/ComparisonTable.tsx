import { Check, X, Minus } from "lucide-react";
import Link from "next/link";
import { ScoreBadge } from "@/components/domain/ScoreBadge";
import { CTAButton } from "@/components/domain/CTAButton";
import type { Tool } from "@/types";

interface ComparisonTableProps {
  tools: Tool[];
}

const PRICING_LABEL: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "Open Source",
  contact: "Contact",
};

function Bool({ value }: { value: boolean }) {
  return value ? (
    <Check className="mx-auto h-4 w-4 text-green-500" />
  ) : (
    <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 text-sm text-center align-middle">{children}</td>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-muted-foreground whitespace-nowrap">{label}</td>
      {children}
    </tr>
  );
}

export function ComparisonTable({ tools }: ComparisonTableProps) {
  if (tools.length === 0) return null;

  const scoreKeys = [
    { key: "beginner" as const, label: "Beginner friendly" },
    { key: "professional" as const, label: "Pro power" },
    { key: "value" as const, label: "Value for money" },
    { key: "speed" as const, label: "Speed" },
    { key: "quality" as const, label: "Output quality" },
    { key: "japanese" as const, label: "Japanese support" },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-36">
              Feature
            </th>
            {tools.map((tool) => (
              <th key={tool.slug} className="px-4 py-3 text-center min-w-[160px]">
                <Link href={`/tools/${tool.slug}`} className="font-semibold hover:text-primary">
                  {tool.name}
                </Link>
                <div className="mt-1">
                  <CTAButton
                    href={tool.affiliateUrl ?? tool.officialUrl}
                    label={tool.freePlan ? "Try free" : "Visit site"}
                    isAffiliate={!!tool.affiliateUrl}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Basics */}
          <Row label="Pricing">
            {tools.map((t) => (
              <Cell key={t.slug}>{PRICING_LABEL[t.pricingModel]}</Cell>
            ))}
          </Row>
          <Row label="Starting price">
            {tools.map((t) => (
              <Cell key={t.slug}>{t.startingPrice ?? "Free"}</Cell>
            ))}
          </Row>
          <Row label="Free plan">
            {tools.map((t) => (
              <Cell key={t.slug}><Bool value={t.freePlan} /></Cell>
            ))}
          </Row>
          <Row label="API available">
            {tools.map((t) => (
              <Cell key={t.slug}><Bool value={t.apiAvailable} /></Cell>
            ))}
          </Row>
          <Row label="Open source">
            {tools.map((t) => (
              <Cell key={t.slug}><Bool value={t.openSource} /></Cell>
            ))}
          </Row>
          <Row label="Japanese support">
            {tools.map((t) => (
              <Cell key={t.slug}><Bool value={t.japaneseSupport} /></Cell>
            ))}
          </Row>
          <Row label="Platforms">
            {tools.map((t) => (
              <Cell key={t.slug}>
                <span className="text-xs text-muted-foreground">{t.platforms.join(", ")}</span>
              </Cell>
            ))}
          </Row>

          {/* Scores */}
          <tr>
            <td
              colSpan={tools.length + 1}
              className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground bg-muted/30"
            >
              Scores
            </td>
          </tr>
          {scoreKeys.map(({ key, label }) => (
            <Row key={key} label={label}>
              {tools.map((t) => (
                <Cell key={t.slug}>
                  <ScoreBadge label="" score={t.scores[key]} className="mx-auto max-w-[120px]" />
                </Cell>
              ))}
            </Row>
          ))}

          {/* Best for */}
          <tr>
            <td
              colSpan={tools.length + 1}
              className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground bg-muted/30"
            >
              Best for
            </td>
          </tr>
          <Row label="Best use cases">
            {tools.map((t) => (
              <Cell key={t.slug}>
                <ul className="space-y-0.5 text-left text-xs text-muted-foreground">
                  {t.bestFor.map((b) => (
                    <li key={b} className="flex items-start gap-1">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Cell>
            ))}
          </Row>
          <Row label="Not ideal for">
            {tools.map((t) => (
              <Cell key={t.slug}>
                <ul className="space-y-0.5 text-left text-xs text-muted-foreground">
                  {t.notIdealFor.map((b) => (
                    <li key={b} className="flex items-start gap-1">
                      <X className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Cell>
            ))}
          </Row>
        </tbody>
      </table>
    </div>
  );
}
