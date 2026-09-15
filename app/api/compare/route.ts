/**
 * GenAI: Google Gemini via completeJson() in lib/ai.ts
 * Product surface: Compare pair
 */
import { NextResponse } from "next/server";
import { completeJson, hasModelKey, parseJson } from "@/lib/ai";
import { DEMO_COMPARE } from "@/lib/demo";
import { comparePrompt } from "@/lib/prompts";
import { excerpt } from "@/lib/samples";
import type { ComparisonResult } from "@/lib/types";

export const runtime = "nodejs";

const MAX_CHARS = 400_000;

export async function POST(req: Request) {
  let body: { aName?: string; aText?: string; bName?: string; bText?: string; forceDemo?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const aRaw = (body.aText || "").trim();
  const bRaw = (body.bText || "").trim();

  if (!aRaw || !bRaw) {
    return NextResponse.json({ error: "Need two documents to compare." }, { status: 400 });
  }
  if (aRaw.length > MAX_CHARS || bRaw.length > MAX_CHARS) {
    return NextResponse.json(
      { error: "One or both documents exceed the 400,000-character limit." },
      { status: 413 },
    );
  }

  const aText = excerpt(aRaw, 10000);
  const bText = excerpt(bRaw, 10000);

  if (!hasModelKey() || body.forceDemo) {
    return NextResponse.json({ comparison: DEMO_COMPARE, mode: "demo" });
  }

  const aName = typeof body.aName === "string" ? body.aName.slice(0, 200) : "Document A";
  const bName = typeof body.bName === "string" ? body.bName.slice(0, 200) : "Document B";

  try {
    const raw = await completeJson(comparePrompt(aName, aText, bName, bText));
    return NextResponse.json({ comparison: parseJson<ComparisonResult>(raw), mode: "live" });
  } catch {
    return NextResponse.json({ comparison: DEMO_COMPARE, mode: "demo-fallback" });
  }
}
