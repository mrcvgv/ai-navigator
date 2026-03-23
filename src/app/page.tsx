import Link from "next/link";
import { ArrowRight, GitCompare, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/domain/ToolCard";
import { CategoryPill } from "@/components/domain/CategoryPill";
import {
  getFeaturedTools,
  getAllCategories,
  getAllComparisons,
} from "@/lib/repository";

export default async function HomePage() {
  const [featured, categories, comparisons] = await Promise.all([
    getFeaturedTools(),
    getAllCategories(),
    getAllComparisons(),
  ]);

  return (
    <div className="pb-20">

      {/* ── Hero: Compare-first ── */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Zap className="h-3 w-3" />
          AIツール比較サイト — 決めるための道具
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          迷ったら、<span className="text-primary">並べて比べろ。</span>
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
          75種類のAIツールを横断比較。価格・機能・スコアを一覧で確認して、
          検索ではなく<strong>確信を持って選ぶ</strong>。
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/compare">
            <Button size="lg" className="gap-2 shadow-md shadow-primary/20">
              <GitCompare className="h-5 w-5" />
              ツールを比較する
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              全ツールを探す
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Popular Comparisons: FIRST content section ── */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">人気の比較</h2>
              <p className="text-sm text-muted-foreground mt-1">よく比べられるツールの組み合わせ</p>
            </div>
            <Link href="/compare">
              <Button variant="outline" size="sm" className="gap-1.5">
                全{comparisons.length}件
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {comparisons.slice(0, 8).map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <GitCompare className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-sm font-semibold group-hover:text-primary leading-snug">{comp.title}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{comp.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to use: 3 steps ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-8 text-xl font-bold text-center">使い方は3ステップ</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: "1", title: "ツールを選ぶ", desc: "Exploreページからカード右下の「Compare」ボタンで最大3つ追加", icon: "🔍" },
            { step: "2", title: "並べて比較", desc: "価格・機能・スコアを一覧表で比較。強みと弱点が一目でわかる", icon: "⚖️" },
            { step: "3", title: "確信を持って選ぶ", desc: "「自分のケースに合うのはどれか」が明確になってから試す", icon: "✅" },
          ].map(({ step, title, desc, icon }) => (
            <div key={step} className="rounded-xl border border-border p-6 text-center">
              <div className="mb-3 text-3xl">{icon}</div>
              <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Step {step}</div>
              <div className="mb-2 font-semibold">{title}</div>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/explore">
            <Button size="lg" variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              ツールを探して比較を始める
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Featured tools ── */}
      <section className="border-t border-border bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">人気AIツール</h2>
              <p className="text-sm text-muted-foreground">カードの「Compare」で追加して比較しよう</p>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="sm" className="gap-1.5">
                全ツールを見る
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">カテゴリから探す</h2>
          <Link href="/categories" className="text-sm text-primary hover:underline">
            すべてのカテゴリ
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <CategoryPill key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

    </div>
  );
}
