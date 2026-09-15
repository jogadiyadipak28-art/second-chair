/**
 * Canonical GenAI architecture map for Second Chair.
 * One generative service is used. All live calls go through the same adapter.
 */

export const GENAI_SERVICE = {
  name: "OpenAI Chat Completions API",
  vendor: "OpenAI (or any OpenAI-compatible host)",
  protocol: "HTTPS POST /v1/chat/completions",
  defaultEndpoint: "https://api.openai.com/v1/chat/completions",
  defaultModel: "gpt-4o-mini",
  env: ["OPENAI_API_KEY", "OPENAI_BASE_URL", "OPENAI_MODEL"],
  adapterFile: "lib/ai.ts",
  method: "complete() / completeJson() / completeText()",
} as const;

export const GENAI_INTEGRATION_POINTS = [
  {
    productSurface: "Understand this",
    userAction: "Clause map, plain-language cards, money/dates, risk tags",
    route: "POST /api/analyze",
    routeFile: "app/api/analyze/route.ts",
    promptFn: "analysisPrompt() in lib/prompts.ts",
    modelCall: "completeJson() in lib/ai.ts → Chat Completions, response_format=json_object",
    fallback: "lib/demo.ts curated analysis when OPENAI_API_KEY is missing (sample docs only)",
  },
  {
    productSurface: "Compare pair",
    userAction: "Side-by-side practical differences between two documents",
    route: "POST /api/compare",
    routeFile: "app/api/compare/route.ts",
    promptFn: "comparePrompt() in lib/prompts.ts",
    modelCall: "completeJson() in lib/ai.ts → Chat Completions, response_format=json_object",
    fallback: "DEMO_COMPARE in lib/demo.ts when no API key",
  },
  {
    productSurface: "Ask the file",
    userAction: "Grounded Q&A over loaded document text",
    route: "POST /api/chat",
    routeFile: "app/api/chat/route.ts",
    promptFn: "chatPrompt() in lib/prompts.ts",
    modelCall: "completeText() in lib/ai.ts → Chat Completions (free-text, not JSON mode)",
    fallback: "Template demo answer in app/api/chat/route.ts when no API key",
  },
  {
    productSurface: "Walk-in brief",
    userAction: "Lawyer-meeting pack: questions, red flags, documents to bring",
    route: "POST /api/briefing",
    routeFile: "app/api/briefing/route.ts",
    promptFn: "briefingPrompt() in lib/prompts.ts",
    modelCall: "completeJson() in lib/ai.ts → Chat Completions, response_format=json_object",
    fallback: "DEMO_BRIEFING in lib/demo.ts when no API key",
  },
] as const;

export const NOT_GENAI = [
  {
    piece: "PDF.js (pdfjs-dist)",
    where: "lib/extract.ts (browser)",
    role: "Extracts text from uploaded PDFs. Not a generative model.",
  },
  {
    piece: "Guided demo analyses",
    where: "lib/demo.ts",
    role: "Static educational JSON used only when no live Chat Completions key is configured.",
  },
  {
    piece: "Status probe",
    where: "GET /api/status → app/api/status/route.ts",
    role: "Reports whether OPENAI_API_KEY is present. Does not call a model.",
  },
] as const;
