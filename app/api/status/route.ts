import { NextResponse } from "next/server";
import { getGenAIRuntime } from "@/lib/ai";
import { GENAI_INTEGRATION_POINTS, GENAI_SERVICE, NOT_GENAI } from "@/lib/architecture";

export async function GET() {
  return NextResponse.json({
    ...getGenAIRuntime(),
    service: GENAI_SERVICE,
    integrations: GENAI_INTEGRATION_POINTS,
    notGenAI: NOT_GENAI,
  });
}
