import { parseJson, hasModelKey, getGenAIRuntime } from "@/lib/ai";

describe("parseJson", () => {
  it("parses a plain JSON string", () => {
    const raw = '{"foo":"bar"}';
    expect(parseJson<{ foo: string }>(raw)).toEqual({ foo: "bar" });
  });

  it("strips leading ```json fence", () => {
    const raw = "```json\n{\"foo\":\"bar\"}\n```";
    expect(parseJson<{ foo: string }>(raw)).toEqual({ foo: "bar" });
  });

  it("strips leading ``` fence without language", () => {
    const raw = "```\n{\"x\":1}\n```";
    expect(parseJson<{ x: number }>(raw)).toEqual({ x: 1 });
  });

  it("throws on invalid JSON", () => {
    expect(() => parseJson("not json")).toThrow();
  });

  it("handles nested objects", () => {
    const raw = '{"a":{"b":{"c":42}}}';
    expect(parseJson<{ a: { b: { c: number } } }>(raw)).toEqual({ a: { b: { c: 42 } } });
  });

  it("handles arrays", () => {
    const raw = '[1,2,3]';
    expect(parseJson<number[]>(raw)).toEqual([1, 2, 3]);
  });
});

describe("hasModelKey", () => {
  const original = process.env.OPENAI_API_KEY;

  afterEach(() => {
    if (original === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = original;
  });

  it("returns false when OPENAI_API_KEY is not set", () => {
    delete process.env.OPENAI_API_KEY;
    expect(hasModelKey()).toBe(false);
  });

  it("returns true when OPENAI_API_KEY is set", () => {
    process.env.OPENAI_API_KEY = "test-key";
    expect(hasModelKey()).toBe(true);
  });

  it("returns false for empty string", () => {
    process.env.OPENAI_API_KEY = "";
    expect(hasModelKey()).toBe(false);
  });
});

describe("getGenAIRuntime", () => {
  const originalKey = process.env.OPENAI_API_KEY;
  const originalBase = process.env.OPENAI_BASE_URL;
  const originalModel = process.env.OPENAI_MODEL;

  afterEach(() => {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
    if (originalBase === undefined) delete process.env.OPENAI_BASE_URL;
    else process.env.OPENAI_BASE_URL = originalBase;
    if (originalModel === undefined) delete process.env.OPENAI_MODEL;
    else process.env.OPENAI_MODEL = originalModel;
  });

  it("returns live:false when no key", () => {
    delete process.env.OPENAI_API_KEY;
    expect(getGenAIRuntime().live).toBe(false);
  });

  it("returns live:true when key is set", () => {
    process.env.OPENAI_API_KEY = "test-key";
    expect(getGenAIRuntime().live).toBe(true);
  });

  it("returns correct service label", () => {
    expect(getGenAIRuntime().service).toBe("Google AI Studio (Gemini 3.6 Flash)");
  });

  it("uses OPENAI_MODEL env var", () => {
    process.env.OPENAI_MODEL = "gemini-3.6-flash";
    expect(getGenAIRuntime().model).toBe("gemini-3.6-flash");
  });

  it("strips trailing slash from base URL", () => {
    process.env.OPENAI_BASE_URL = "https://example.com/v1/";
    const runtime = getGenAIRuntime();
    expect(runtime.endpoint).not.toContain("//chat");
  });
});
