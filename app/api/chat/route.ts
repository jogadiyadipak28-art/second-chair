/**
 * GenAI: Google Gemini via completeText() in lib/ai.ts
 * Product surface: Ask the file
 */
import { NextResponse } from "next/server";
import { completeText, hasModelKey } from "@/lib/ai";
import { chatPrompt } from "@/lib/prompts";
import { excerpt } from "@/lib/samples";
import { validateDocs, validateQuestion } from "@/lib/validate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: {
    docs?: unknown;
    history?: { role: string; content: string }[];
    question?: unknown;
    forceDemo?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let question: string;
  let docs: Array<{ name: string; text: string }>;

  try {
    question = validateQuestion(body.question);
    docs = validateDocs(body.docs);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid input." },
      { status: 400 },
    );
  }

  // Sanitize history: only keep allowed roles, cap at 20 turns, truncate long content
  const history = (Array.isArray(body.history) ? body.history : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .slice(-20)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

  const block = docs
    .map((d) => `### ${d.name}\n${excerpt(d.text, 8000)}`)
    .join("\n\n");

  if (!hasModelKey() || body.forceDemo) {
    const snippet = docs[0].text.slice(0, 220).replace(/\s+/g, " ");
    const answer = `From the text that is loaded, this is what I can see — not advice, just a reading.

Your question: "${question}"

The document begins: "${snippet}…"

I do not have a live model key in this environment, so this is a demo-style answer: look at money, notice periods, what you give up, and how disputes are handled. Open the Understand tab for clause-by-clause cards on the sample files.

A lawyer in the relevant place can confirm what is actually enforceable. This is not legal advice.`;
    return NextResponse.json({ answer, mode: "demo" });
  }

  try {
    const answer = await completeText(chatPrompt(block, history, question));
    return NextResponse.json({ answer, mode: "live" });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Chat failed" },
      { status: 500 },
    );
  }
}
