import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, comparisonSlug, comparisonTitle } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const entry = {
      email: email.trim().toLowerCase(),
      comparisonSlug: comparisonSlug ?? "",
      comparisonTitle: comparisonTitle ?? "",
      savedAt: Date.now(),
    };

    await kv.lpush("saved-comparisons", JSON.stringify(entry));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
