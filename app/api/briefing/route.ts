/**
 * GenAI: Google Gemini via completeJson() in lib/ai.ts
 * Product surface: Walk-in brief
 */
import { NextResponse } from "next/server";
import { completeJson, hasModelKey, parseJson } from "@/lib/ai";
import { DEMO_BRIEFING } from "@/lib/demo";
import { briefingPrompt } from "@/lib/prompts";
import { excerpt } from "@/lib/samples";
import { validateDocs, validateGoal } from "@/lib/validate";
import type { BriefingPack } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { docs?: unknown; goal?: unknown; forceDemo?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let docs: Array<{ name: string; text: string }>;
  let goal: string;

  try {
    docs = validateDocs(body.docs);
    goal = validateGoal(body.goal);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid input." },
      { status: 400 },
    );
  }

  const block = docs
    .map((d) => `### ${d.name}\n${excerpt(d.text, 8000)}`)
    .join("\n\n");

  if (!hasModelKey() || body.forceDemo) {
    return NextResponse.json({ briefing: DEMO_BRIEFING, mode: "demo" });
  }

  try {
    const raw = await completeJson(briefingPrompt(block, goal));
    return NextResponse.json({ briefing: parseJson<BriefingPack>(raw), mode: "live" });
  } catch {
    return NextResponse.json({ briefing: DEMO_BRIEFING, mode: "demo-fallback" });
  }
}
