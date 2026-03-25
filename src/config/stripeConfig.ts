/**
 * Stripe product/price configuration for AI Navigator.
 *
 * B2B: Sponsored placement tiers (one-time monthly subscriptions for tool vendors)
 * B2C: Pro subscription for end users
 *
 * Price IDs come from env vars — set these after creating products in Stripe dashboard.
 * Use NEXT_PUBLIC_ prefix only for prices shown in the UI (safe to expose).
 */

export const STRIPE_CONFIG = {
  // ── B2B Sponsored Placement ──────────────────────────────────────────────────
  // Recurring monthly subscriptions for AI tool vendors who want featured placement.
  sponsored: {
    starter: {
      name: "Starter Sponsorship",
      price: 14900,          // ¥14,900/mo (display: ~$99)
      priceUsd: "$99",
      interval: "month" as const,
      features: [
        "Featured badge on tool card",
        "Priority in category listings",
        "1 comparison page highlight",
        "Monthly performance report",
      ],
      priceId: process.env.STRIPE_PRICE_SPONSORED_STARTER ?? "",
    },
    growth: {
      name: "Growth Sponsorship",
      price: 34900,          // ¥34,900/mo (~$229)
      priceUsd: "$229",
      interval: "month" as const,
      features: [
        "Everything in Starter",
        "Homepage featured section slot",
        "Up to 3 comparison page highlights",
        "Custom tool description",
        "Priority customer support",
      ],
      priceId: process.env.STRIPE_PRICE_SPONSORED_GROWTH ?? "",
    },
    premium: {
      name: "Premium Sponsorship",
      price: 74900,          // ¥74,900/mo (~$499)
      priceUsd: "$499",
      interval: "month" as const,
      features: [
        "Everything in Growth",
        "Top placement in all relevant categories",
        "Dedicated comparison landing page",
        "Newsletter feature (monthly)",
        "Dedicated account manager",
      ],
      priceId: process.env.STRIPE_PRICE_SPONSORED_PREMIUM ?? "",
    },
  },

  // ── B2C Pro Subscription ─────────────────────────────────────────────────────
  // Monthly/annual subscription for power users.
  pro: {
    monthly: {
      name: "Pro Monthly",
      price: 980,            // ¥980/mo
      interval: "month" as const,
      features: [
        "Save unlimited comparisons",
        "Export comparisons to PDF",
        "Advanced filtering & sorting",
        "Price change alerts",
        "Ad-free experience",
        "Early access to new features",
      ],
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
    },
    annual: {
      name: "Pro Annual",
      price: 7800,           // ¥7,800/yr (saves ¥3,960 vs monthly)
      pricePerMonth: 650,
      interval: "year" as const,
      features: [
        "Everything in Pro Monthly",
        "2 months free (vs monthly)",
      ],
      priceId: process.env.STRIPE_PRICE_PRO_ANNUAL ?? "",
    },
  },
} as const;

export type SponsoredTier = keyof typeof STRIPE_CONFIG.sponsored;
export type ProInterval = keyof typeof STRIPE_CONFIG.pro;

/** Valid product types for the checkout route */
export type CheckoutProduct =
  | { type: "sponsored"; tier: SponsoredTier }
  | { type: "pro"; interval: ProInterval };
