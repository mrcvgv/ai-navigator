import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/repository";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Tool Categories",
  description: "Browse AI tools by category: chatbots, coding, image generation, video, audio, and more.",
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold">All Categories</h1>
      <p className="mb-8 text-muted-foreground">Browse AI tools organized by what they do.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div>
              <h2 className="font-semibold group-hover:text-primary">{cat.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{cat.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">{cat.toolCount} tools</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
