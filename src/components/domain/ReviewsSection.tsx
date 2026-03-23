"use client";

import { useState } from "react";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";

interface Props {
  slug: string;
  toolName: string;
}

export function ReviewsSection({ slug, toolName }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <ReviewForm
        slug={slug}
        toolName={toolName}
        onPosted={() => setRefreshKey((k) => k + 1)}
      />
      <ReviewList slug={slug} refreshKey={refreshKey} />
    </div>
  );
}
