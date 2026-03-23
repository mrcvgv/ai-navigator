import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { CompareBar } from "@/components/domain/CompareBar";
import { Analytics } from "@vercel/analytics/next";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ja" }];
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <main className="flex-1">{children}</main>
      <CompareBar />
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>AI Navigator &copy; {new Date().getFullYear()} &ndash; Helping you decide, not just search.</p>
      </footer>
      <Analytics />
    </NextIntlClientProvider>
  );
}
