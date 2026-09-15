/**
 * Sole GenAI adapter. Calls models via OpenRouter (OpenAI-compatible) using
 * the official openai SDK. Default model: google/gemini-2.0-flash-001.
 * Used by /api/analyze, /api/compare, /api/chat, and /api/briefing.
 */
import OpenAI from "openai";
import { DISCLAIMER, SYSTEM_GUARDRAILS } from "./prompts";

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: (process.env.OPENAI_BASE_URL ?? "").replace(/\/$/, "") || undefined,
  });
}

export function hasModelKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

/** Runtime view of the single GenAI service (no secrets). */
export function getGenAIRuntime() {
  const base = (process.env.OPENAI_BASE_URL ?? "").replace(/\/$/, "");
  return {
    live: hasModelKey(),
    service: "Google AI Studio (Gemini 3.6 Flash)",
    endpoint: `${base}/chat/completions`,
    model: process.env.OPENAI_MODEL || "",
    adapter: "lib/ai.ts",
  };
}

export async function completeJson(userPrompt: string) {
  return complete(userPrompt, true);
}

export async function completeText(userPrompt: string) {
  return complete(userPrompt, false);
}

async function complete(userPrompt: string, json: boolean) {
  if (!hasModelKey()) {
    throw new Error("NO_KEY");
  }

  const client = getClient();
  const model = process.env.OPENAI_MODEL || "";

  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    ...(json ? { response_format: { type: "json_object" as const } } : {}),
    messages: [
      {
        role: "system",
        content: `${SYSTEM_GUARDRAILS}\n\nPublic disclaimer to respect: ${DISCLAIMER}`,
      },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error("EMPTY_MODEL_RESPONSE");
  return content;
}

export function parseJson<T>(raw: string): T {
  const trimmed = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/```$/, "");
  return JSON.parse(trimmed) as T;
}
