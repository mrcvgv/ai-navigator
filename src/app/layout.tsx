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
    default: "AI Navigator — AIツール比較・選び方ガイド",
    template: "%s | AI Navigator",
  },
  description:
    "75種類のAIツールを横断比較。価格・機能・スコアを一覧で確認して、確信を持って選ぶ。",
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
    <html lang="ja" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <CompareBar />
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          <p>AI Navigator &copy; {new Date().getFullYear()} &ndash; 検索じゃなく、意思決定を助ける。</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
