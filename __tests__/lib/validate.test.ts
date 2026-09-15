import {
  validateText,
  validateQuestion,
  validateGoal,
  validateDocs,
  ValidationError,
  MAX_TEXT_CHARS,
  MAX_QUESTION_CHARS,
  MAX_GOAL_CHARS,
  MAX_DOCS,
} from "@/lib/validate";

describe("validateText", () => {
  it("returns trimmed text for valid input", () => {
    expect(validateText("  hello world  ")).toBe("hello world");
  });

  it("throws for empty string", () => {
    expect(() => validateText("")).toThrow(ValidationError);
    expect(() => validateText("   ")).toThrow(ValidationError);
  });

  it("throws for non-string input", () => {
    expect(() => validateText(123)).toThrow(ValidationError);
    expect(() => validateText(null)).toThrow(ValidationError);
  });

  it("throws when text exceeds MAX_TEXT_CHARS", () => {
    const huge = "a".repeat(MAX_TEXT_CHARS + 1);
    expect(() => validateText(huge)).toThrow(ValidationError);
  });

  it("accepts text exactly at MAX_TEXT_CHARS", () => {
    const edge = "a".repeat(MAX_TEXT_CHARS);
    expect(validateText(edge)).toBe(edge);
  });

  it("uses custom field name in error message", () => {
    expect(() => validateText("", "myField")).toThrow(/myField/);
  });
});

describe("validateQuestion", () => {
  it("returns trimmed question", () => {
    expect(validateQuestion("  What does clause 5 mean?  ")).toBe("What does clause 5 mean?");
  });

  it("throws for empty string", () => {
    expect(() => validateQuestion("")).toThrow(ValidationError);
  });

  it("throws for non-string", () => {
    expect(() => validateQuestion(null)).toThrow(ValidationError);
  });

  it("throws when question exceeds MAX_QUESTION_CHARS", () => {
    const long = "q".repeat(MAX_QUESTION_CHARS + 1);
    expect(() => validateQuestion(long)).toThrow(ValidationError);
  });

  it("accepts question exactly at MAX_QUESTION_CHARS", () => {
    const edge = "q".repeat(MAX_QUESTION_CHARS);
    expect(validateQuestion(edge)).toBe(edge);
  });
});

describe("validateGoal", () => {
  it("returns empty string for undefined/null/empty", () => {
    expect(validateGoal(undefined)).toBe("");
    expect(validateGoal(null)).toBe("");
    expect(validateGoal("")).toBe("");
  });

  it("returns trimmed goal", () => {
    expect(validateGoal("  sign a lease  ")).toBe("sign a lease");
  });

  it("throws for non-string", () => {
    expect(() => validateGoal(42)).toThrow(ValidationError);
  });

  it("throws when goal exceeds MAX_GOAL_CHARS", () => {
    const long = "g".repeat(MAX_GOAL_CHARS + 1);
    expect(() => validateGoal(long)).toThrow(ValidationError);
  });
});

describe("validateDocs", () => {
  const validDoc = { name: "Lease.pdf", text: "The tenant shall pay rent." };

  it("returns array of validated docs", () => {
    const result = validateDocs([validDoc]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Lease.pdf");
    expect(result[0].text).toBe("The tenant shall pay rent.");
  });

  it("throws for empty array", () => {
    expect(() => validateDocs([])).toThrow(ValidationError);
  });

  it("throws for non-array", () => {
    expect(() => validateDocs("not an array")).toThrow(ValidationError);
    expect(() => validateDocs(null)).toThrow(ValidationError);
  });

  it("throws when more than MAX_DOCS provided", () => {
    const tooMany = Array(MAX_DOCS + 1).fill(validDoc);
    expect(() => validateDocs(tooMany)).toThrow(ValidationError);
  });

  it("truncates doc name to 200 chars", () => {
    const longName = "n".repeat(300);
    const result = validateDocs([{ name: longName, text: "text" }]);
    expect(result[0].name.length).toBe(200);
  });

  it("uses fallback name when name is missing", () => {
    const result = validateDocs([{ text: "some text" }]);
    expect(result[0].name).toMatch(/Document/);
  });

  it("throws for doc with empty text", () => {
    expect(() => validateDocs([{ name: "test", text: "" }])).toThrow(ValidationError);
  });

  it("throws for doc with oversized text", () => {
    const huge = "a".repeat(MAX_TEXT_CHARS + 1);
    expect(() => validateDocs([{ name: "test", text: huge }])).toThrow(ValidationError);
  });

  it("throws for null doc entry", () => {
    expect(() => validateDocs([null])).toThrow(ValidationError);
  });
});

describe("ValidationError", () => {
  it("is an instance of Error", () => {
    const err = new ValidationError("bad input");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("ValidationError");
    expect(err.message).toBe("bad input");
  });
});
