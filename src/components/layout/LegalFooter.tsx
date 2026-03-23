import Link from "next/link";
import { AI_NAVIGATOR_CONFIG as C } from "@/config/operatorConfig";

export function LegalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Top row: brand + lang switcher */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-foreground">
            {C.siteName}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              by {C.operatorTradeName}
            </span>
          </p>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <Link href="/en/legal" className="hover:text-foreground transition-colors">
              English
            </Link>
            <Link href="/ja/legal" className="hover:text-foreground transition-colors">
              日本語
            </Link>
          </div>
        </div>

        {/* Legal links */}
        <nav
          aria-label="Legal"
          className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground"
        >
          <Link href="/en/legal" className="hover:text-foreground transition-colors">
            Legal Disclosure
          </Link>
          <Link href="/en/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/en/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/en/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
          <span className="text-border" aria-hidden>|</span>
          <Link href="/ja/legal" className="hover:text-foreground transition-colors">
            特定商取引法に基づく表記
          </Link>
          <Link href="/ja/privacy" className="hover:text-foreground transition-colors">
            プライバシーポリシー
          </Link>
          <Link href="/ja/terms" className="hover:text-foreground transition-colors">
            利用規約
          </Link>
          <Link href="/ja/contact" className="hover:text-foreground transition-colors">
            お問い合わせ
          </Link>
        </nav>

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
