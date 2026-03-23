import { Metadata } from "next";
import { getAllTools, getAllCategories } from "@/lib/repository";
import { ExploreClient } from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore AI Tools",
  description: "Browse and filter hundreds of AI tools by category, pricing, and features. Find exactly what you need.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const [tools, categories] = await Promise.all([
    getAllTools(),
    getAllCategories(),
  ]);

  return (
    <ExploreClient
      initialTools={tools}
      categories={categories}
      initialCategory={params.category ?? ""}
      initialFreePlan={params.freePlan === "true"}
    />
  );
}
