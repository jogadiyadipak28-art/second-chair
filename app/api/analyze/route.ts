/**
 * GenAI: OpenAI Chat Completions via completeJson() in lib/ai.ts
 * Product surface: Understand this (clause map)
 */
import { NextResponse } from "next/server";
import { completeJson, hasModelKey, parseJson } from "@/lib/ai";
import { demoAnalysisFor } from "@/lib/demo";
import { analysisPrompt } from "@/lib/prompts";
import { excerpt } from "@/lib/samples";
import type { DocumentAnalysis } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    id?: string;
    name?: string;
    text?: string;
    forceDemo?: boolean;
  };
  const text = excerpt(body.text || "");
  if (!text.trim()) {
    return NextResponse.json({ error: "No document text." }, { status: 400 });
  }

  const demo = body.id ? demoAnalysisFor(body.id) : null;
  if (!hasModelKey() || body.forceDemo) {
    if (demo) {
      return NextResponse.json({ analysis: demo, mode: "demo" });
    }
    return NextResponse.json(
      {
        error:
          "No API key configured. Add OPENAI_API_KEY to .env.local, or start with a built-in sample to explore the demo.",
      },
      { status: 501 },
    );
  }

  try {
    const raw = await completeJson(analysisPrompt(body.name || "Document", text));
    const analysis = parseJson<DocumentAnalysis>(raw);
    return NextResponse.json({ analysis, mode: "live" });
  } catch (e) {
    if (demo) {
      return NextResponse.json({ analysis: demo, mode: "demo-fallback" });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 500 },
    );
  }
}
