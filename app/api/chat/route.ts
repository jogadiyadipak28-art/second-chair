/**
 * GenAI: Google Gemini via completeText() in lib/ai.ts
 * Product surface: Ask the file
 */
import { NextResponse } from "next/server";
import { completeText, hasModelKey } from "@/lib/ai";
import { chatPrompt } from "@/lib/prompts";
import { excerpt } from "@/lib/samples";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    docs?: { name: string; text: string }[];
    history?: { role: string; content: string }[];
    question?: string;
    forceDemo?: boolean;
  };
  const question = (body.question || "").trim();
  const docs = (body.docs || []).filter((d) => d.text?.trim());
  if (!question) {
    return NextResponse.json({ error: "Ask a question." }, { status: 400 });
  }
  if (!docs.length) {
    return NextResponse.json({ error: "Load a document first." }, { status: 400 });
  }

  const block = docs
    .map((d) => `### ${d.name}\n${excerpt(d.text, 8000)}`)
    .join("\n\n");

  if (!hasModelKey() || body.forceDemo) {
    const snippet = docs[0].text.slice(0, 220).replace(/\s+/g, " ");
    const answer = `From the text that is loaded, this is what I can see — not advice, just a reading.

Your question: “${question}”

The document begins: “${snippet}…”

I do not have a live model key in this environment, so this is a demo-style answer: look at money, notice periods, what you give up, and how disputes are handled. Open the Understand tab for clause-by-clause cards on the sample files.

A lawyer in the relevant place can confirm what is actually enforceable. This is not legal advice.`;
    return NextResponse.json({ answer, mode: "demo" });
  }

  try {
    const answer = await completeText(chatPrompt(block, body.history || [], question));
    return NextResponse.json({ answer, mode: "live" });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Chat failed" },
      { status: 500 },
    );
  }
}
