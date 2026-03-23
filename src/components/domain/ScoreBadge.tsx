import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  label: string;
  score: number;
  className?: string;
}

export function ScoreBadge({ label, score, className }: ScoreBadgeProps) {
  const pct = (score / 5) * 100;

  const color =
    score >= 4.5
      ? "bg-green-500"
      : score >= 3.5
        ? "bg-blue-500"
        : score >= 2.5
          ? "bg-yellow-500"
          : "bg-red-400";

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score}/5</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className={cn("h-1.5 rounded-full transition-all", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
