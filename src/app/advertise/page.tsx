"use client";

import { useState } from "react";
import { STRIPE_CONFIG, type SponsoredTier } from "@/config/stripeConfig";

const TIERS: { key: SponsoredTier; label: string; highlight?: boolean }[] = [
  { key: "starter",  label: "Starter" },
  { key: "growth",   label: "Growth", highlight: true },
  { key: "premium",  label: "Premium" },
];

export default function AdvertisePage() {
  const [loading, setLoading] = useState<SponsoredTier | null>(null);
  const [toolName, setToolName] = useState("");

  async function handleCheckout(tier: SponsoredTier) {
    setLoading(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "sponsored", tier, toolName }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong");
        setLoading(null);
      }
    } catch {
      alert("Network error. Please try again.");
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium">
          For AI Tool Vendors
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Get Featured on AI Navigator
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Reach thousands of developers, founders, and teams actively comparing AI tools.
          Sponsored placements put your tool in front of the right audience at the right moment.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <span>119+ tools cataloged</span>
          <span>·</span>
          <span>Side-by-side comparisons</span>
          <span>·</span>
          <span>SEO-optimized pages</span>
        </div>
      </section>

      {/* Tool name input */}
      <section className="px-6 max-w-md mx-auto mb-8">
        <label className="block text-sm text-gray-400 mb-2">Your tool name (optional)</label>
        <input
          type="text"
          value={toolName}
          onChange={(e) => setToolName(e.target.value)}
          placeholder="e.g. ChatGPT, Notion AI..."
          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
        />
      </section>

      {/* Pricing tiers */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map(({ key, label, highlight }) => {
            const tier = STRIPE_CONFIG.sponsored[key];
            return (
              <div
                key={key}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  highlight
                    ? "border-indigo-500 bg-indigo-950/30"
                    : "border-gray-800 bg-gray-900/50"
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 rounded-full text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-1">{label}</h2>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{tier.priceUsd}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="mt-0.5 text-indigo-400 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(key)}
                  disabled={loading !== null}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    highlight
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === key ? "Redirecting..." : `Get Started — ${tier.priceUsd}/mo`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          Billed monthly. Cancel anytime. Questions?{" "}
          <a href="mailto:hi@creama.xyz" className="text-indigo-400 hover:underline">
            hi@creama.xyz
          </a>
        </p>
      </section>
    </main>
  );
}
