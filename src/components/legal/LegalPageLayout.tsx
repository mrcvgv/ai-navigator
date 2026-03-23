import Link from "next/link";
import type { ReactNode } from "react";

interface LegalNavLink {
  href: string;
  label: string;
}

interface LegalPageLayoutProps {
  lang: "en" | "ja";
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

const NAV_LINKS: Record<"en" | "ja", LegalNavLink[]> = {
  en: [
    { href: "/en/legal",   label: "Legal Disclosure" },
    { href: "/en/privacy", label: "Privacy Policy" },
    { href: "/en/terms",   label: "Terms of Service" },
    { href: "/en/contact", label: "Contact" },
  ],
  ja: [
    { href: "/ja/legal",   label: "特定商取引法に基づく表記" },
    { href: "/ja/privacy", label: "プライバシーポリシー" },
    { href: "/ja/terms",   label: "利用規約" },
    { href: "/ja/contact", label: "お問い合わせ" },
  ],
};

export function LegalPageLayout({ lang, title, lastUpdated, children }: LegalPageLayoutProps) {
  const links = NAV_LINKS[lang];
  const altLang = lang === "en" ? "ja" : "en";
  const altLabel = lang === "en" ? "日本語" : "English";
  // Derive the same page in the other language
  const currentSlug = links.find((l) => l.label === title)?.href.split("/").pop();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Breadcrumb nav */}
      <nav aria-label="Legal pages" className="mb-8 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-foreground transition-colors">
            {l.label}
          </Link>
        ))}
        <span className="text-border">|</span>
        <Link href={`/${altLang}/${currentSlug ?? "legal"}`} className="hover:text-foreground transition-colors">
          {altLabel}
        </Link>
      </nav>

      {/* Title */}
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {lang === "en" ? "Legal" : "法的情報"}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === "en" ? "Last updated:" : "最終更新:"} {lastUpdated}
        </p>
      </header>

      {/* Content */}
      <div className="prose prose-sm max-w-none text-foreground [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-5 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:text-muted-foreground [&_li]:my-0.5">
        {children}
      </div>

      {/* Footer nav */}
      <div className="mt-16 flex flex-wrap gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-foreground transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
