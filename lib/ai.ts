/**
 * Sole GenAI adapter. Calls Google Gemini via the OpenAI-compatible endpoint
 * (POST {OPENAI_BASE_URL}/chat/completions, default model gemini-2.0-flash).
 * Used by /api/analyze, /api/compare, /api/chat, and /api/briefing.
 */
import { DISCLAIMER, SYSTEM_GUARDRAILS } from "./prompts";

export function hasModelKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

/** Runtime view of the single GenAI service (no secrets). */
export function getGenAIRuntime() {
  const base = (process.env.OPENAI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai").replace(/\/$/, "");
  return {
    live: hasModelKey(),
    service: "Google Gemini API (OpenAI-compatible endpoint)",
    endpoint: `${base}/chat/completions`,
    model: process.env.OPENAI_MODEL || "gemini-2.0-flash",
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
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("NO_KEY");
  }
  const base = (process.env.OPENAI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "gemini-2.0-flash";

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      ...(json ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: `${SYSTEM_GUARDRAILS}\n\nPublic disclaimer to respect: ${DISCLAIMER}` },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MODEL_ERROR ${res.status}: ${err.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("EMPTY_MODEL_RESPONSE");
  return content;
}

export function parseJson<T>(raw: string): T {
  const trimmed = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```$/, "");
  return JSON.parse(trimmed) as T;
}
