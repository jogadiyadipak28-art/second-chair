/**
 * Shared input validation helpers for API routes.
 * Keeps each route thin and validation consistent.
 */

/** Max characters of raw text accepted per document (≈ 400 KB of text). */
export const MAX_TEXT_CHARS = 400_000;

/** Max characters per user question in chat. */
export const MAX_QUESTION_CHARS = 2_000;

/** Max characters for the briefing goal field. */
export const MAX_GOAL_CHARS = 1_000;

/** Max number of documents accepted in a single request. */
export const MAX_DOCS = 5;

export function validateText(text: unknown, fieldName = "text"): string {
  if (typeof text !== "string") throw new ValidationError(`${fieldName} must be a string.`);
  const trimmed = text.trim();
  if (!trimmed) throw new ValidationError(`${fieldName} is required.`);
  if (trimmed.length > MAX_TEXT_CHARS)
    throw new ValidationError(
      `${fieldName} exceeds the ${MAX_TEXT_CHARS.toLocaleString()}-character limit. Paste a shorter excerpt.`,
    );
  return trimmed;
}

export function validateQuestion(q: unknown): string {
  if (typeof q !== "string" || !q.trim())
    throw new ValidationError("A question is required.");
  if (q.trim().length > MAX_QUESTION_CHARS)
    throw new ValidationError(`Question must be ${MAX_QUESTION_CHARS} characters or fewer.`);
  return q.trim();
}

export function validateGoal(goal: unknown): string {
  if (goal === undefined || goal === null || goal === "") return "";
  if (typeof goal !== "string") throw new ValidationError("goal must be a string.");
  if (goal.length > MAX_GOAL_CHARS)
    throw new ValidationError(`Goal must be ${MAX_GOAL_CHARS} characters or fewer.`);
  return goal.trim();
}

export function validateDocs(
  docs: unknown,
): Array<{ name: string; text: string }> {
  if (!Array.isArray(docs) || docs.length === 0)
    throw new ValidationError("At least one document is required.");
  if (docs.length > MAX_DOCS)
    throw new ValidationError(`At most ${MAX_DOCS} documents can be sent in one request.`);
  return docs.map((d, i) => {
    if (typeof d !== "object" || d === null)
      throw new ValidationError(`Document at index ${i} is invalid.`);
    const doc = d as Record<string, unknown>;
    const name = typeof doc.name === "string" ? doc.name.slice(0, 200) : `Document ${i + 1}`;
    const text = validateText(doc.text, `docs[${i}].text`);
    return { name, text };
  });
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
