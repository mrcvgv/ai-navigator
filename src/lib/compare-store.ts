"use client";

import { create } from "zustand";

const MAX_COMPARE = 3;

interface CompareStore {
  tools: string[];       // tool slugs
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  canAdd: boolean;
}

export const useCompare = create<CompareStore>((set, get) => ({
  tools: [],
  canAdd: true,
  add: (slug) =>
    set((s) => {
      if (s.tools.includes(slug) || s.tools.length >= MAX_COMPARE) return s;
      const next = [...s.tools, slug];
      return { tools: next, canAdd: next.length < MAX_COMPARE };
    }),
  remove: (slug) =>
    set((s) => {
      const next = s.tools.filter((t) => t !== slug);
      return { tools: next, canAdd: next.length < MAX_COMPARE };
    }),
  clear: () => set({ tools: [], canAdd: true }),
}));
