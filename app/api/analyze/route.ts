/**
 * GenAI: Google Gemini via completeJson() in lib/ai.ts
 * Product surface: Understand this (clause map)
 */
import { NextResponse } from "next/server";
import { completeJson, hasModelKey, parseJson } from "@/lib/ai";
import { demoAnalysisFor } from "@/lib/demo";
import { analysisPrompt } from "@/lib/prompts";
import { excerpt } from "@/lib/samples";
import { ValidationError } from "@/lib/validate";
import type { DocumentAnalysis } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { id?: string; name?: string; text?: string; forceDemo?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawText = (body.text || "").trim();
  if (!rawText) {
    return NextResponse.json({ error: "No document text." }, { status: 400 });
  }
  if (rawText.length > 400_000) {
    return NextResponse.json(
      { error: "Document exceeds the 400,000-character limit. Paste a shorter excerpt." },
      { status: 413 },
    );
  }

  const text = excerpt(rawText);
  const demo = body.id ? demoAnalysisFor(body.id) : null;

  if (!hasModelKey() || body.forceDemo) {
    if (demo) return NextResponse.json({ analysis: demo, mode: "demo" });
    return NextResponse.json(
      { error: "No API key configured. Add OPENAI_API_KEY to .env.local, or start with a built-in sample to explore the demo." },
      { status: 501 },
    );
  }

  try {
    const name = typeof body.name === "string" ? body.name.slice(0, 200) : "Document";
    const raw = await completeJson(analysisPrompt(name, text));
    const analysis = parseJson<DocumentAnalysis>(raw);
    return NextResponse.json({ analysis, mode: "live" });
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    if (demo) return NextResponse.json({ analysis: demo, mode: "demo-fallback" });
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 500 },
    );
  }
}
