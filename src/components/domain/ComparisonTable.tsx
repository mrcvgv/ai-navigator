import { Check, X, Crown } from "lucide-react";
import Link from "next/link";
import { CTAButton } from "@/components/domain/CTAButton";
import type { Tool, ToolScores } from "@/types";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  tools: Tool[];
}

const PRICING_LABEL: Record<string, string> = {
  free: "Free", freemium: "Freemium", paid: "Paid",
  "open-source": "Open Source", contact: "Contact",
};

const SCORE_KEYS: { key: keyof ToolScores; label: string }[] = [
  { key: "beginner",     label: "Beginner friendly" },
  { key: "professional", label: "Pro power"          },
  { key: "value",        label: "Value for money"    },
  { key: "speed",        label: "Speed"              },
  { key: "quality",      label: "Output quality"     },
];

function Bool({ value }: { value: boolean }) {
  return value
    ? <Check className="mx-auto h-4 w-4 text-green-500" />
    : <X    className="mx-auto h-4 w-4 text-muted-foreground/30" />;
}

function ScoreBar({ score, isWinner }: { score: number; isWinner: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={cn("text-sm font-bold tabular-nums", isWinner && "text-primary")}>
        {score}<span className="text-xs font-normal text-muted-foreground">/5</span>
      </span>
      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", isWinner ? "bg-primary" : "bg-muted-foreground/40")}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

function SectionHeader({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="bg-muted/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </td>
    </tr>
  );
}

function Row({ label, winner, children }: { label: string; winner?: boolean; children: React.ReactNode }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-muted-foreground whitespace-nowrap w-36">{label}</td>
      {children}
    </tr>
  );
}

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td className={cn("px-4 py-3 text-sm text-center align-middle", highlight && "bg-primary/5")}>
      {children}
    </td>
  );
}

export function ComparisonTable({ tools }: ComparisonTableProps) {
  if (tools.length === 0) return null;

  const totalScores = tools.map((t) =>
    Object.values(t.scores).reduce((s, v) => s + v, 0)
  );
  const overallWinner = totalScores.indexOf(Math.max(...totalScores));

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-border bg-muted/30">
            <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground w-36" />
            {tools.map((tool, i) => (
              <th key={tool.slug} className={cn("px-4 py-4 text-center min-w-[180px]", i === overallWinner && "bg-primary/5")}>
                <div className="flex flex-col items-center gap-2">
                  {i === overallWinner && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      <Crown className="h-3 w-3" /> Top pick
                    </span>
                  )}
                  <Link href={`/tools/${tool.slug}`} className="font-bold text-base hover:text-primary">
                    {tool.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {tool.freePlan ? "Free plan available" : tool.startingPrice ?? "Paid"}
                  </div>
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
          <SectionHeader label="Pricing" colSpan={tools.length + 1} />
          <Row label="Model">
            {tools.map((t) => <Cell key={t.slug}>{PRICING_LABEL[t.pricingModel]}</Cell>)}
          </Row>
          <Row label="Starting price">
            {tools.map((t) => (
              <Cell key={t.slug}>
                {t.startingPrice ?? <span className="font-medium text-green-600">Free</span>}
              </Cell>
            ))}
          </Row>
          <Row label="Free plan">
            {tools.map((t) => {
              const hasFree = t.freePlan;
              return (
                <Cell key={t.slug} highlight={hasFree}>
                  <Bool value={hasFree} />
                </Cell>
              );
            })}
          </Row>
          <Row label="API">
            {tools.map((t) => <Cell key={t.slug}><Bool value={t.apiAvailable} /></Cell>)}
          </Row>
          <Row label="Open source">
            {tools.map((t) => <Cell key={t.slug}><Bool value={t.openSource} /></Cell>)}
          </Row>
          <Row label="Platforms">
            {tools.map((t) => (
              <Cell key={t.slug}>
                <span className="text-xs text-muted-foreground leading-relaxed">{t.platforms.join(", ")}</span>
              </Cell>
            ))}
          </Row>

          <SectionHeader label="Scores" colSpan={tools.length + 1} />
          {SCORE_KEYS.map(({ key, label }) => {
            const scores = tools.map((t) => t.scores[key]);
            const max = Math.max(...scores);
            return (
              <Row key={key} label={label}>
                {tools.map((t, i) => {
                  const isWinner = t.scores[key] === max && scores.filter((s) => s === max).length === 1;
                  return (
                    <Cell key={t.slug} highlight={isWinner}>
                      <ScoreBar score={t.scores[key]} isWinner={isWinner} />
                    </Cell>
                  );
                })}
              </Row>
            );
          })}

          <SectionHeader label="Use cases" colSpan={tools.length + 1} />
          <Row label="Best for">
            {tools.map((t) => (
              <Cell key={t.slug}>
                <ul className="space-y-1 text-left">
                  {t.bestFor.map((b) => (
                    <li key={b} className="flex items-start gap-1 text-xs text-muted-foreground">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />{b}
                    </li>
                  ))}
                </ul>
              </Cell>
            ))}
          </Row>
          <Row label="Not ideal for">
            {tools.map((t) => (
              <Cell key={t.slug}>
                <ul className="space-y-1 text-left">
                  {t.notIdealFor.map((b) => (
                    <li key={b} className="flex items-start gap-1 text-xs text-muted-foreground">
                      <X className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />{b}
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
