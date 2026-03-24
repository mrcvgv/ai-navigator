import Link from "next/link";
import type { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

const NAV_LINKS = [
  { href: "/legal/disclosure", label: "Legal Disclosure" },
  { href: "/legal/privacy",    label: "Privacy Policy" },
  { href: "/legal/terms",      label: "Terms of Service" },
  { href: "/contact",          label: "Contact" },
];

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Breadcrumb nav */}
      <nav aria-label="Legal pages" className="mb-8 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-foreground transition-colors">
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Title */}
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">Legal</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      {/* Content */}
      <div className="prose prose-sm max-w-none text-foreground [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-5 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:text-muted-foreground [&_li]:my-0.5">
        {children}
      </div>

      {/* Footer nav */}
      <div className="mt-16 flex flex-wrap gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-foreground transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
