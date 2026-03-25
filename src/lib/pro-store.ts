"use client";

import { useState, useEffect, useCallback } from "react";

const PRO_KEY = "ai_nav_pro";
const SAVES_KEY = "ai_nav_saved_comparisons";
const FREE_LIMIT = 3;

export interface SavedComparison {
  slug: string;
  title: string;
  savedAt: string;
}

export function usePro() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(localStorage.getItem(PRO_KEY) === "true");
  }, []);

  const activatePro = useCallback(() => {
    localStorage.setItem(PRO_KEY, "true");
    setIsPro(true);
  }, []);

  return { isPro, activatePro };
}

export function useSavedComparisons() {
  const { isPro } = usePro();
  const [saved, setSaved] = useState<SavedComparison[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVES_KEY);
      setSaved(raw ? (JSON.parse(raw) as SavedComparison[]) : []);
    } catch {
      setSaved([]);
    }
  }, []);

  const canSave = isPro || saved.length < FREE_LIMIT;
  const limit = isPro ? null : FREE_LIMIT;

  const saveComparison = useCallback(
    (slug: string, title: string): "saved" | "limit" | "already" => {
      if (saved.some((s) => s.slug === slug)) return "already";
      if (!isPro && saved.length >= FREE_LIMIT) return "limit";

      const next: SavedComparison[] = [
        { slug, title, savedAt: new Date().toISOString() },
        ...saved,
      ];
      localStorage.setItem(SAVES_KEY, JSON.stringify(next));
      setSaved(next);
      return "saved";
    },
    [saved, isPro]
  );

  const removeComparison = useCallback(
    (slug: string) => {
      const next = saved.filter((s) => s.slug !== slug);
      localStorage.setItem(SAVES_KEY, JSON.stringify(next));
      setSaved(next);
    },
    [saved]
  );

  return { saved, canSave, limit, saveComparison, removeComparison, isPro };
}
