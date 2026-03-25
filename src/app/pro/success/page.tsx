"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProSuccessPage() {
  useEffect(() => {
    // Activate Pro in localStorage so features unlock immediately
    localStorage.setItem("ai_nav_pro", "true");
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">⚡</div>
        <h1 className="text-3xl font-bold mb-3">Welcome to Pro!</h1>
        <p className="text-gray-400 mb-6">
          Your Pro subscription is now active. All Pro features are unlocked — unlimited saves, price alerts, and more.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Manage your subscription anytime via the receipt email from Stripe.
          Questions?{" "}
          <a href="mailto:hi@creama.xyz" className="text-amber-400 hover:underline">
            hi@creama.xyz
          </a>
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/saved"
            className="inline-block px-5 py-3 border border-amber-500/40 text-amber-400 rounded-xl font-medium hover:bg-amber-500/10 transition-colors"
          >
            View Saved
          </Link>
          <Link
            href="/"
            className="inline-block px-5 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-xl font-bold transition-colors"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </main>
  );
}
