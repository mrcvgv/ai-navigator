"use client";

import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const nav = [
    { label: t("explore"), href: "/explore" },
    { label: t("compare"), href: "/compare" },
    { label: t("categories"), href: "/categories" },
  ] as const;

  const switchLocale = (locale === "en" ? "ja" : "en") as "en" | "ja";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Compass className="h-5 w-5 text-primary" />
          <span>AI Navigator</span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                pathname.startsWith(href)
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href={pathname as any}
            locale={switchLocale}
            className="ml-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            {t("switchLang")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
