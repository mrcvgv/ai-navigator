import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { CompareBar } from "@/components/domain/CompareBar";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Navigator - Find and Compare the Best AI Tools",
    template: "%s | AI Navigator",
  },
  description:
    "Discover and compare the best AI tools. AI Navigator helps you make confident decisions with honest comparisons, scores, and real use-case guidance.",
  openGraph: {
    type: "website",
    siteName: "AI Navigator",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <CompareBar />
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          <p>AI Navigator &copy; {new Date().getFullYear()} - Helping you decide, not just search.</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
