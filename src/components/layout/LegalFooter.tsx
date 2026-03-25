import Link from "next/link";
import { AI_NAVIGATOR_CONFIG as C } from "@/config/operatorConfig";

export function LegalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Brand */}
        <p className="mb-4 text-sm font-medium text-foreground">
          {C.siteName}
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            by {C.operatorTradeName}
          </span>
        </p>

        {/* Product links */}
        <nav
          aria-label="Product"
          className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs"
        >
          <Link href="/pro" className="font-medium text-amber-500 hover:text-amber-400 transition-colors">
            Pro
          </Link>
          <Link href="/advertise" className="text-muted-foreground hover:text-foreground transition-colors">
            Advertise
          </Link>
          <Link href="/saved" className="text-muted-foreground hover:text-foreground transition-colors">
            Saved
          </Link>
        </nav>

        {/* Legal links */}
        <nav
          aria-label="Legal"
          className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground"
        >
          <Link href="/legal/disclosure" className="hover:text-foreground transition-colors">
            Legal Disclosure
          </Link>
          <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>

        {/* Affiliate disclosure */}
        <p className="mb-3 text-xs text-muted-foreground">
          Some links on this site are affiliate links. We may earn a commission if you sign up
          through them, at no extra cost to you. This does not influence our editorial rankings or recommendations.
        </p>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          &copy; {year} {C.copyrightOwner}. All rights reserved.
          {C.trademarkNotice && (
            <span className="ml-2">{C.trademarkNotice}</span>
          )}
        </p>
      </div>
    </footer>
  );
}
