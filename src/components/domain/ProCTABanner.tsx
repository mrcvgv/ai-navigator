"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { usePro } from "@/lib/pro-store";

interface ProCTABannerProps {
  variant?: "sidebar" | "inline";
}

export function ProCTABanner({ variant = "inline" }: ProCTABannerProps) {
  const { isPro } = usePro();

  if (isPro) return null;

  if (variant === "sidebar") {
    return (
      <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 dark:border-amber-800/30 dark:bg-amber-900/10 p-5 text-center">
        <Zap className="mx-auto h-5 w-5 text-amber-500 mb-2" />
        <p className="text-sm font-semibold mb-1">AI Navigator Pro</p>
        <p className="text-xs text-muted-foreground mb-3">
          Save comparisons, get price alerts, and more.
        </p>
        <Link
          href="/pro"
          className="block w-full py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Try Pro — ¥980/mo
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 dark:border-amber-800/30 dark:bg-amber-900/10 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Zap className="h-4 w-4 text-amber-500 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Upgrade to Pro</p>
          <p className="text-xs text-muted-foreground">
            Unlimited saves · Price alerts · Ad-free · ¥980/month
          </p>
        </div>
      </div>
      <Link
        href="/pro"
        className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        See Pro plans
      </Link>
    </div>
  );
}
