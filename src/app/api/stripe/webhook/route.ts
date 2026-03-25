/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events:
 *   - checkout.session.completed → store order in KV
 *   - customer.subscription.deleted → mark subscription cancelled in KV
 *
 * Requires: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET env vars.
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Stripe requires the raw body for signature verification
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  // Lazy-init Stripe inside the handler
  const Stripe = (await import("stripe")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" as any });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook signature failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Import KV only when needed (avoids build issues if KV is not configured)
  async function getKV() {
    const { kv } = await import("@vercel/kv");
    return kv;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as {
        id: string;
        customer_email: string | null;
        metadata: Record<string, string>;
        subscription: string | null;
        status: string;
      };

      if (session.status !== "complete") break;

      const record = {
        sessionId: session.id,
        email: session.customer_email ?? "",
        metadata: session.metadata,
        subscriptionId: session.subscription,
        createdAt: new Date().toISOString(),
        status: "active",
      };

      try {
        const kv = await getKV();
        // Store by session ID for retrieval on success page
        await kv.set(`order:${session.id}`, record, { ex: 60 * 60 * 24 * 30 }); // 30d TTL
        // Store subscription separately for lifecycle management
        if (session.subscription) {
          await kv.set(`sub:${session.subscription}`, record);
        }
      } catch {
        // KV failure should not fail the webhook
        console.error("KV store failed for session", session.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as { id: string };
      try {
        const kv = await getKV();
        const existing = await kv.get<Record<string, unknown>>(`sub:${sub.id}`);
        if (existing) {
          await kv.set(`sub:${sub.id}`, { ...existing, status: "cancelled" });
        }
      } catch {
        console.error("KV update failed for sub", sub.id);
      }
      break;
    }

    default:
      // Ignore other events
      break;
  }

  return NextResponse.json({ received: true });
}
