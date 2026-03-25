/**
 * POST /api/advertise/inquiry
 * Stores advertise inquiry in Vercel KV (if configured).
 * Returns 200 regardless of KV availability so the form always succeeds.
 */

import { NextRequest, NextResponse } from "next/server";

interface InquiryBody {
  name: string;
  email: string;
  tool: string;
  message: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as InquiryBody;

  if (!body.email || !body.message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const record = {
    ...body,
    receivedAt: new Date().toISOString(),
  };

  // Try to store in KV — silently ignore if KV not configured
  try {
    const { kv } = await import("@vercel/kv");
    await kv.lpush("advertise:inquiries", record);
  } catch {
    // KV not configured — just log server-side
    console.log("[advertise/inquiry]", JSON.stringify(record));
  }

  return NextResponse.json({ ok: true });
}
