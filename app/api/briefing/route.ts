/**
 * GenAI: OpenAI Chat Completions via completeJson() in lib/ai.ts
 * Product surface: Walk-in brief
 */
import { NextResponse } from "next/server";
import { completeJson, hasModelKey, parseJson } from "@/lib/ai";
import { DEMO_BRIEFING } from "@/lib/demo";
import { briefingPrompt } from "@/lib/prompts";
import { excerpt } from "@/lib/samples";
import type { BriefingPack } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    docs?: { name: string; text: string }[];
    goal?: string;
    forceDemo?: boolean;
  };
  const docs = (body.docs || []).filter((d) => d.text?.trim());
  if (!docs.length) {
    return NextResponse.json({ error: "Add a document first." }, { status: 400 });
  }

  const block = docs
    .map((d) => `### ${d.name}\n${excerpt(d.text, 8000)}`)
    .join("\n\n");

  if (!hasModelKey() || body.forceDemo) {
    return NextResponse.json({ briefing: DEMO_BRIEFING, mode: "demo" });
  }

  try {
    const raw = await completeJson(briefingPrompt(block, body.goal || ""));
    return NextResponse.json({
      briefing: parseJson<BriefingPack>(raw),
      mode: "live",
    });
  } catch {
    return NextResponse.json({ briefing: DEMO_BRIEFING, mode: "demo-fallback" });
  }
}
