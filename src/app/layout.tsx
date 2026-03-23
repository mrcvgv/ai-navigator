import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

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
    <html className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
