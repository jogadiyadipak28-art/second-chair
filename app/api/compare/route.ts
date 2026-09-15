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

export async function POST(req: Request) {
  const body = (await req.json()) as {
    aName?: string;
    aText?: string;
    bName?: string;
    bText?: string;
    forceDemo?: boolean;
  };
  const aText = excerpt(body.aText || "", 10000);
  const bText = excerpt(body.bText || "", 10000);
  if (!aText.trim() || !bText.trim()) {
    return NextResponse.json({ error: "Need two documents to compare." }, { status: 400 });
  }

  if (!hasModelKey() || body.forceDemo) {
    return NextResponse.json({ comparison: DEMO_COMPARE, mode: "demo" });
  }

  try {
    const raw = await completeJson(
      comparePrompt(body.aName || "Document A", aText, body.bName || "Document B", bText),
    );
    return NextResponse.json({
      comparison: parseJson<ComparisonResult>(raw),
      mode: "live",
    });
  } catch (e) {
    return NextResponse.json({ comparison: DEMO_COMPARE, mode: "demo-fallback" });
  }
}
