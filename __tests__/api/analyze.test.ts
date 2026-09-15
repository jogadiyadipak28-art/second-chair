/**
 * Tests for /api/analyze route
 * Mocks lib/ai and lib/demo to avoid real API calls
 */

jest.mock("@/lib/ai", () => ({
  hasModelKey: jest.fn(),
  completeJson: jest.fn(),
  parseJson: jest.fn(),
}));

jest.mock("@/lib/demo", () => ({
  demoAnalysisFor: jest.fn(),
}));

jest.mock("@/lib/samples", () => ({
  excerpt: jest.fn((text: string) => text),
}));

import { POST } from "@/app/api/analyze/route";
import { hasModelKey, completeJson, parseJson } from "@/lib/ai";
import { demoAnalysisFor } from "@/lib/demo";

const mockHasModelKey = hasModelKey as jest.MockedFunction<typeof hasModelKey>;
const mockCompleteJson = completeJson as jest.MockedFunction<typeof completeJson>;
const mockParseJson = parseJson as jest.MockedFunction<typeof parseJson>;
const mockDemoAnalysisFor = demoAnalysisFor as jest.MockedFunction<typeof demoAnalysisFor>;

function makeRequest(body: object) {
  return new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/analyze", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when no text is provided", async () => {
    const res = await POST(makeRequest({ text: "" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/no document text/i);
  });

  it("returns 400 when text is only whitespace", async () => {
    const res = await POST(makeRequest({ text: "   " }));
    expect(res.status).toBe(400);
  });

  it("returns demo mode when no API key and demo exists", async () => {
    mockHasModelKey.mockReturnValue(false);
    mockDemoAnalysisFor.mockReturnValue({ titleGuess: "Demo Lease" } as any);
    const res = await POST(makeRequest({ text: "lease text", id: "sample-1" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.mode).toBe("demo");
    expect(json.analysis.titleGuess).toBe("Demo Lease");
  });

  it("returns 501 when no API key and no demo", async () => {
    mockHasModelKey.mockReturnValue(false);
    mockDemoAnalysisFor.mockReturnValue(null);
    const res = await POST(makeRequest({ text: "some text", id: undefined }));
    expect(res.status).toBe(501);
  });

  it("returns live analysis when API key is present", async () => {
    mockHasModelKey.mockReturnValue(true);
    mockCompleteJson.mockResolvedValue('{"titleGuess":"NDA"}');
    mockParseJson.mockReturnValue({ titleGuess: "NDA" } as any);
    const res = await POST(makeRequest({ text: "this is an NDA document text" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.mode).toBe("live");
    expect(json.analysis.titleGuess).toBe("NDA");
  });

  it("falls back to demo when live call throws and demo exists", async () => {
    mockHasModelKey.mockReturnValue(true);
    mockCompleteJson.mockRejectedValue(new Error("API error"));
    mockDemoAnalysisFor.mockReturnValue({ titleGuess: "Fallback Demo" } as any);
    const res = await POST(makeRequest({ text: "some text", id: "sample-1" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.mode).toBe("demo-fallback");
  });

  it("returns 500 when live call throws and no demo fallback", async () => {
    mockHasModelKey.mockReturnValue(true);
    mockCompleteJson.mockRejectedValue(new Error("Network error"));
    mockDemoAnalysisFor.mockReturnValue(null);
    const res = await POST(makeRequest({ text: "some text" }));
    expect(res.status).toBe(500);
  });

  it("forceDemo bypasses live API even with a key", async () => {
    mockHasModelKey.mockReturnValue(true);
    mockDemoAnalysisFor.mockReturnValue({ titleGuess: "Forced Demo" } as any);
    const res = await POST(makeRequest({ text: "some text", id: "sample-1", forceDemo: true }));
    const json = await res.json();
    expect(json.mode).toBe("demo");
    expect(mockCompleteJson).not.toHaveBeenCalled();
  });
});
