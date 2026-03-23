import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { CompareBar } from "@/components/domain/CompareBar";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AI Navigator — Compare AI Tools Side by Side",
    template: "%s | AI Navigator",
  },
  description:
    "Compare AI tools side-by-side. Pricing, features, and scores in one table. Find the right tool with confidence.",
  openGraph: { type: "website", siteName: "AI Navigator" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <CompareBar />
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          <p>AI Navigator &copy; {new Date().getFullYear()} &mdash; Helping you decide, not just search.</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
