jest.mock("@/lib/ai", () => ({
  hasModelKey: jest.fn(),
  completeJson: jest.fn(),
  parseJson: jest.fn(),
}));

jest.mock("@/lib/demo", () => ({
  DEMO_COMPARE: { headline: "Demo comparison" },
}));

jest.mock("@/lib/samples", () => ({
  excerpt: jest.fn((text: string) => text),
}));

import { POST } from "@/app/api/compare/route";
import { hasModelKey, completeJson, parseJson } from "@/lib/ai";

const mockHasModelKey = hasModelKey as jest.MockedFunction<typeof hasModelKey>;
const mockCompleteJson = completeJson as jest.MockedFunction<typeof completeJson>;
const mockParseJson = parseJson as jest.MockedFunction<typeof parseJson>;

function makeRequest(body: object) {
  return new Request("http://localhost/api/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/compare", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 400 when aText is missing", async () => {
    const res = await POST(makeRequest({ aText: "", bText: "some text" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/two documents/i);
  });

  it("returns 400 when bText is missing", async () => {
    const res = await POST(makeRequest({ aText: "some text", bText: "" }));
    expect(res.status).toBe(400);
  });

  it("returns demo when no API key", async () => {
    mockHasModelKey.mockReturnValue(false);
    const res = await POST(makeRequest({ aText: "doc a", bText: "doc b" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.mode).toBe("demo");
    expect(json.comparison.headline).toBe("Demo comparison");
  });

  it("returns live result when API key present", async () => {
    mockHasModelKey.mockReturnValue(true);
    mockCompleteJson.mockResolvedValue('{"headline":"Live comparison"}');
    mockParseJson.mockReturnValue({ headline: "Live comparison" } as any);
    const res = await POST(makeRequest({ aText: "doc a text", bText: "doc b text" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.mode).toBe("live");
    expect(json.comparison.headline).toBe("Live comparison");
  });

  it("falls back to demo on API error", async () => {
    mockHasModelKey.mockReturnValue(true);
    mockCompleteJson.mockRejectedValue(new Error("fail"));
    const res = await POST(makeRequest({ aText: "doc a text", bText: "doc b text" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.mode).toBe("demo-fallback");
  });

  it("forceDemo skips live call", async () => {
    mockHasModelKey.mockReturnValue(true);
    const res = await POST(makeRequest({ aText: "a", bText: "b", forceDemo: true }));
    const json = await res.json();
    expect(json.mode).toBe("demo");
    expect(mockCompleteJson).not.toHaveBeenCalled();
  });
});
