import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types";

interface CategoryPillProps {
  category: Category;
  active?: boolean;
}

export function CategoryPill({ category, active }: CategoryPillProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Badge
        variant={active ? "default" : "secondary"}
        className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        {category.name}
        {category.toolCount !== undefined && (
          <span className="ml-1 opacity-70">({category.toolCount})</span>
        )}
      </Badge>
    </Link>
  );
}
