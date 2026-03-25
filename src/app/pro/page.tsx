"use client";

import { useState } from "react";
import { STRIPE_CONFIG, type ProInterval } from "@/config/stripeConfig";

export default function ProPage() {
  const [interval, setInterval] = useState<ProInterval>("monthly");
  const [loading, setLoading] = useState(false);

  const plan = STRIPE_CONFIG.pro[interval];

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pro", interval }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong");
        setLoading(false);
      }
    } catch {
      alert("Network error. Please try again.");
      setLoading(false);
    }
  }

  const features = STRIPE_CONFIG.pro.monthly.features;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-2xl mx-auto">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium">
          AI Navigator Pro
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Power up your AI tool research
        </h1>
        <p className="text-lg text-gray-400">
          Save comparisons, get price alerts, and experience AI Navigator without distractions.
        </p>
      </section>

      {/* Pricing card */}
      <section className="px-6 pb-20 max-w-md mx-auto">
        {/* Toggle */}
        <div className="flex items-center justify-center gap-1 mb-8 bg-gray-900 rounded-xl p-1 border border-gray-800">
          <button
            onClick={() => setInterval("monthly")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              interval === "monthly"
                ? "bg-amber-500 text-gray-950"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("annual")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              interval === "annual"
                ? "bg-amber-500 text-gray-950"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
              2 months free
            </span>
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-gray-900/50 p-8">
          <div className="mb-6">
            {interval === "monthly" ? (
              <div>
                <span className="text-4xl font-bold">¥980</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
            ) : (
              <div>
                <span className="text-4xl font-bold">¥7,800</span>
                <span className="text-gray-400 text-sm">/year</span>
                <div className="text-sm text-green-400 mt-1">¥650/month · Save ¥3,960</div>
              </div>
            )}
          </div>

          <ul className="space-y-3 mb-8">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-0.5 text-amber-400 flex-shrink-0">✓</span>
                {f}
              </li>
            ))}
            {interval === "annual" &&
              STRIPE_CONFIG.pro.annual.features.slice(features.length).map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-0.5 text-amber-400 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
          </ul>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-xl font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Redirecting to Stripe..." : "Start Pro"}
          </button>

          <p className="text-center text-xs text-gray-600 mt-4">
            Cancel anytime · Secure payment via Stripe
          </p>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Questions?{" "}
          <a href="mailto:hi@creama.xyz" className="text-amber-400 hover:underline">
            hi@creama.xyz
          </a>
        </p>
      </section>
    </main>
  );
}
