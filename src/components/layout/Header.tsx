"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompare } from "@/lib/compare-store";

const nav = [
  { label: "比較する", href: "/compare", highlight: true },
  { label: "探す", href: "/explore" },
  { label: "カテゴリ", href: "/categories" },
];

export function Header() {
  const pathname = usePathname();
  const { tools } = useCompare();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Compass className="h-5 w-5 text-primary" />
          <span>AI Navigator</span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map(({ label, href, highlight }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors font-medium",
                pathname.startsWith(href)
                  ? "bg-primary text-primary-foreground"
                  : highlight
                    ? "text-primary border border-primary/40 hover:bg-primary hover:text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {highlight && <GitCompare className="h-3.5 w-3.5" />}
              {label}
              {highlight && tools.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary">
                  {tools.length}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
