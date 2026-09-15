export const DISCLAIMER = `Second Chair is an educational information tool. It is not a lawyer, law firm, or substitute for professional legal advice. It can misread documents, miss important terms, and is not tailored to your jurisdiction. Do not rely on it to make legal decisions, sign, waive rights, or miss deadlines. If the matter involves money, housing, employment, immigration, family, criminal, or other significant rights, talk to a licensed attorney in your area.`;

export const SYSTEM_GUARDRAILS = `You are Second Chair, an educational legal-literacy assistant.

Hard rules:
- You do NOT give legal advice, predictions about court outcomes, or "you should sue / you should sign" directives.
- You explain what documents appear to say, flag issues to discuss with a licensed lawyer, and help the user prepare.
- Always speak in plain language. Avoid pretending certainty. Use "this appears to", "the text says", "a lawyer can confirm".
- If the user asks you to draft a binding legal instrument to be used as-is, refuse and instead offer discussion questions and a checklist.
- Never claim to be a lawyer. Never cite fake cases or statutes. If you mention a general legal concept, label it as general information, not advice.
- If the document is incomplete or unclear, say so.
- Tailor explanations to a non-lawyer adult. Be calm, specific, and practical.
- Output must follow the requested JSON schema exactly when JSON is requested. No markdown fences.`;

export function analysisPrompt(docName: string, docText: string) {
  return `Analyze this document for a non-lawyer. Extract what the text appears to say. Do not invent clauses that are not in the text.

Document name: ${docName}

DOCUMENT:
${docText}

Return JSON with this shape:
{
  "titleGuess": string,
  "kindGuess": "lease" | "employment" | "nda" | "freelance" | "policy" | "other",
  "oneSentence": string,
  "plainSummary": string,
  "parties": string[],
  "moneyTerms": string[],
  "datesAndDeadlines": string[],
  "clauses": [
    {
      "title": string,
      "originalExcerpt": string,
      "plainLanguage": string,
      "tags": array of "you-must" | "they-must" | "you-give-up" | "money" | "deadline" | "exit" | "privacy" | "dispute",
      "risk": "low" | "watch" | "high",
      "whyItMatters": string,
      "questionsToAsk": string[]
    }
  ],
  "overallWatchouts": string[],
  "missingProtections": string[],
  "inconsistencies": string[],
  "optionsInTheText": string[],
  "actionChecklist": string[]
}

Include 6 to 10 of the most important clauses. Prefer obligations, money, lock-in, waiver, dispute, privacy, and exit terms. Risk "high" only when the text appears unusually one-sided, punitive, or easy to miss.
plainSummary: 2-4 short paragraphs in plain language (simplifying the document).
inconsistencies: clashes inside this one document (e.g. a waiver that fights another clause), or "none obvious from the text".
optionsInTheText: paths the paper itself appears to leave open (renew, terminate, dispute, stay silent) — not advice.
actionChecklist: 5-8 practical, non-advice items (calendar a date written in the paper, gather exhibits, ask a lawyer about X).`;
}

export function comparePrompt(aName: string, aText: string, bName: string, bText: string) {
  return `Compare these two documents for a non-lawyer. Focus on practical differences that could affect money, time, rights given up, lock-in, and how disputes are handled.

Document A (${aName}):
${aText}

Document B (${bName}):
${bText}

Return JSON:
{
  "headline": string,
  "findings": [
    {
      "topic": string,
      "docA": string,
      "docB": string,
      "whoBenefits": "A" | "B" | "balanced" | "unclear",
      "practicalDifference": string,
      "risk": "low" | "watch" | "high"
    }
  ],
  "whatToNegotiate": string[],
  "inconsistencies": string[]
}

Cover 5 to 8 topics. whoBenefits refers to which document's terms appear more favorable to the typical individual/consumer/worker signing it, if that can be inferred; otherwise "unclear".
inconsistencies: places the two papers conflict, or a paper conflicts with itself if that is visible from the pair.`;
}

export function briefingPrompt(docsBlock: string, userGoal: string) {
  return `Create a walk-in briefing pack so the user can have a better first conversation with a licensed lawyer. This is preparation, not advice.

User's stated goal or situation:
${userGoal || "(not specified — infer careful, neutral questions from the documents)"}

Documents:
${docsBlock}

Return JSON:
{
  "situationInPlainEnglish": string,
  "goalsToClarify": string[],
  "questionsForALawyer": [{ "question": string, "why": string }],
  "documentsToBring": string[],
  "redFlagsToMention": string[],
  "nextStepsYouCanTake": string[]
}

questionsForALawyer: 8 to 12 specific questions grounded in the documents.
nextStepsYouCanTake must be non-legal-advice actions (organize papers, write a timeline, do not miss stated notice dates, consult a lawyer, etc.). Include a reminder not to ignore deadlines in the document.`;
}

export function chatPrompt(docsBlock: string, history: { role: string; content: string }[], question: string) {
  const prior = history
    .slice(-8)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");
  return `Answer using ONLY the provided documents plus general literacy caveats. Quote short excerpts when you rely on a clause. If the documents do not say, say you cannot tell from the text.

Documents:
${docsBlock}

Recent conversation:
${prior || "(none)"}

User question:
${question}

Write a clear answer in 2-6 short paragraphs or a short bullet list. End with one sentence: a question they could confirm with a lawyer, and a reminder this is not legal advice.`;
}
