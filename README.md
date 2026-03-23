# AI Navigator

**AI tool decision-making platform** — not just a directory, but a tool to help people choose the right AI for their needs.

## What this is

AI Navigator helps users go from "I don't know which AI to use" to "I'm trying this one." It does this through:

- **Side-by-side comparison** with honest, structured scores
- **Category-based exploration** with filtering by pricing, API, Japanese support, etc.
- **Decision-oriented tool pages** (best for / not ideal for / scores)
- **Affiliate-ready CTA structure** built in from the start

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Lucide icons |
| State | Zustand (compare bar) |
| Data | Local mock data (Supabase-ready) |
| Deploy | Vercel |

## Directory structure

```
src/
  app/
    page.tsx                     # Home
    explore/page.tsx             # Server component (SSR)
    explore/ExploreClient.tsx    # Filter/search client logic
    tools/[slug]/page.tsx        # Tool detail (SSG)
    compare/page.tsx             # Dynamic compare (client)
    compare/[slug]/page.tsx      # Pre-defined comparison (SSG)
    categories/page.tsx          # Categories index
    categories/[slug]/page.tsx   # Category detail (SSG)
  components/
    layout/Header.tsx
    domain/
      ToolCard.tsx               # Card with compare button
      CompareBar.tsx             # Sticky bottom compare bar
      ComparisonTable.tsx        # Side-by-side table
      FilterPanel.tsx            # Sidebar filters
      SearchBar.tsx
      ScoreBadge.tsx
      CategoryPill.tsx
      CTAButton.tsx
  lib/
    repository.ts                # Data access layer (swap for Supabase here)
    compare-store.ts             # Zustand store for compare state
    utils.ts
  types/index.ts
  data/
    tools.ts                     # 15 tools mock data
    categories.ts                # 8 categories
    comparisons.ts               # 6 preset comparisons
```

## Monetization structure

### 1. Affiliate links
Each tool has an `affiliateUrl` field. The `CTAButton` renders with `rel="sponsored"` when affiliate.
Currently null in mock data — replace with real links per tool.

High-value placements:
- Tool detail page CTA (primary button)
- Comparison table header (per-tool CTA)
- Preset comparison "recommended" cards

### 2. Sponsored placements (ready to add)
Tools have `sponsored: boolean`. Add badge and priority sorting when true.
`featured: boolean` controls homepage featuring.

### 3. SEO
- `/compare/chatgpt-vs-claude` — high search intent
- `/categories/image-generation`
- `/tools/midjourney`

All pages use `generateMetadata()`.

## Supabase migration

All data access is in `src/lib/repository.ts`. To migrate:

1. Create Supabase project and run schema migrations
2. Replace functions in `repository.ts` with supabase queries
3. No changes in pages or components

Suggested schema:
```sql
tools (id, slug, name, short_description, full_description, category, pricing_model,
       starting_price, free_plan, api_available, open_source, japanese_support,
       platforms, official_url, affiliate_url, logo_url, status, featured, sponsored, updated_at)
tool_scores (tool_id, beginner, professional, value, speed, quality, japanese)
categories (id, slug, name, description, icon)
comparisons (id, slug, title, summary, tool_slugs, updated_at)
comparison_recommendations (comparison_id, tool_slug, reason)
```

## Running locally

```
npm install
npm run dev
```

## Next steps to increase revenue

1. Add real affiliate links (ChatGPT Plus, Claude Pro, Cursor, ElevenLabs all have programs)
2. Expand to 100 tools (data layer only, no code changes needed)
3. Add comparison SEO pages for "best AI for [use case]" queries
4. Enable sponsored placement slots (field already exists)
5. Supabase + admin UI for non-technical content management
