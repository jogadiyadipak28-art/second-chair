import { analysisPrompt, comparePrompt, briefingPrompt, chatPrompt, DISCLAIMER, SYSTEM_GUARDRAILS } from "@/lib/prompts";

describe("DISCLAIMER", () => {
  it("is a non-empty string", () => {
    expect(typeof DISCLAIMER).toBe("string");
    expect(DISCLAIMER.length).toBeGreaterThan(50);
  });

  it("contains key legal-literacy language", () => {
    expect(DISCLAIMER.toLowerCase()).toContain("legal advice");
    expect(DISCLAIMER.toLowerCase()).toContain("lawyer");
  });
});

describe("SYSTEM_GUARDRAILS", () => {
  it("is a non-empty string", () => {
    expect(typeof SYSTEM_GUARDRAILS).toBe("string");
    expect(SYSTEM_GUARDRAILS.length).toBeGreaterThan(100);
  });

  it("prohibits legal advice", () => {
    expect(SYSTEM_GUARDRAILS.toLowerCase()).toContain("not give legal advice");
  });
});

describe("analysisPrompt", () => {
  it("includes the document name", () => {
    const prompt = analysisPrompt("MyLease.pdf", "Some text");
    expect(prompt).toContain("MyLease.pdf");
  });

  it("includes the document text", () => {
    const prompt = analysisPrompt("Doc", "The tenant shall pay rent.");
    expect(prompt).toContain("The tenant shall pay rent.");
  });

  it("requests JSON output", () => {
    const prompt = analysisPrompt("Doc", "text");
    expect(prompt).toContain("Return JSON");
  });

  it("includes required JSON fields", () => {
    const prompt = analysisPrompt("Doc", "text");
    expect(prompt).toContain("titleGuess");
    expect(prompt).toContain("clauses");
    expect(prompt).toContain("actionChecklist");
  });
});

describe("comparePrompt", () => {
  it("includes both document names", () => {
    const prompt = comparePrompt("ContractA", "text a", "ContractB", "text b");
    expect(prompt).toContain("ContractA");
    expect(prompt).toContain("ContractB");
  });

  it("includes both document texts", () => {
    const prompt = comparePrompt("A", "alpha content", "B", "beta content");
    expect(prompt).toContain("alpha content");
    expect(prompt).toContain("beta content");
  });

  it("requests JSON with findings array", () => {
    const prompt = comparePrompt("A", "a", "B", "b");
    expect(prompt).toContain("findings");
    expect(prompt).toContain("whoBenefits");
  });
});

describe("briefingPrompt", () => {
  it("includes the user goal", () => {
    const prompt = briefingPrompt("doc block", "I want to negotiate my lease");
    expect(prompt).toContain("I want to negotiate my lease");
  });

  it("includes the docs block", () => {
    const prompt = briefingPrompt("LEASE CONTENT HERE", "goal");
    expect(prompt).toContain("LEASE CONTENT HERE");
  });

  it("requests questionsForALawyer", () => {
    const prompt = briefingPrompt("docs", "goal");
    expect(prompt).toContain("questionsForALawyer");
  });
});

describe("chatPrompt", () => {
  it("includes the user question", () => {
    const prompt = chatPrompt("docs", [], "What does clause 5 mean?");
    expect(prompt).toContain("What does clause 5 mean?");
  });

  it("includes the docs block", () => {
    const prompt = chatPrompt("CONTRACT TEXT", [], "question");
    expect(prompt).toContain("CONTRACT TEXT");
  });

  it("includes recent history (last 8 messages)", () => {
    const history = [
      { role: "user", content: "first question" },
      { role: "assistant", content: "first answer" },
    ];
    const prompt = chatPrompt("docs", history, "follow up");
    expect(prompt).toContain("first question");
    expect(prompt).toContain("first answer");
  });

  it("handles empty history gracefully", () => {
    const prompt = chatPrompt("docs", [], "question");
    expect(prompt).toContain("(none)");
  });
});
