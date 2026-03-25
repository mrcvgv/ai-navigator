/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session for:
 *   - Sponsored placement (B2B): { type: "sponsored", tier: "starter"|"growth"|"premium" }
 *   - Pro subscription (B2C):    { type: "pro", interval: "monthly"|"annual" }
 *
 * Returns { url: string } — redirect the client to this URL.
 */

import { NextRequest, NextResponse } from "next/server";
import { STRIPE_CONFIG, type CheckoutProduct } from "@/config/stripeConfig";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://ai-navigator.vercel.app";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CheckoutProduct & { toolName?: string };

  // Lazy-init Stripe inside the handler to avoid build-time errors
  const Stripe = (await import("stripe")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" as any });

  let priceId: string;
  let successUrl: string;
  let cancelUrl: string;
  let metadata: Record<string, string> = {};

  if (body.type === "sponsored") {
    const tier = STRIPE_CONFIG.sponsored[body.tier];
    if (!tier) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    priceId = tier.priceId;
    successUrl = `${BASE_URL}/advertise/success?tier=${body.tier}&session_id={CHECKOUT_SESSION_ID}`;
    cancelUrl = `${BASE_URL}/advertise`;
    metadata = { type: "sponsored", tier: body.tier, toolName: body.toolName ?? "" };
  } else if (body.type === "pro") {
    const plan = STRIPE_CONFIG.pro[body.interval];
    if (!plan) return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
    priceId = plan.priceId;
    successUrl = `${BASE_URL}/pro/success?session_id={CHECKOUT_SESSION_ID}`;
    cancelUrl = `${BASE_URL}/pro`;
    metadata = { type: "pro", interval: body.interval };
  } else {
    return NextResponse.json({ error: "Invalid product type" }, { status: 400 });
  }

  if (!priceId) {
    return NextResponse.json(
      { error: "Price not configured. Set Stripe price IDs in environment variables." },
      { status: 500 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
