/**
 * Challenge use cases → exact product surface.
 * These labels appear in the app so coverage is not implied.
 */
export const USE_CASES = [
  {
    id: "simplify",
    challenge: "Simplifying complex legal documents",
    where: "Understand",
    how: "Plain-language summary plus clause cards that rewrite the original excerpt in everyday words.",
    tab: "understand" as const,
  },
  {
    id: "compare",
    challenge: "Comparing contracts, agreements, or policies",
    where: "Compare",
    how: "Two loaded documents are lined up by topic (money, exit, rights given up), with who the text appears to favor.",
    tab: "compare" as const,
  },
  {
    id: "highlight",
    challenge: "Highlighting important clauses, obligations, risks, or inconsistencies",
    where: "Understand + Compare",
    how: "Risk pills (high / watch / low), obligation tags, internal inconsistency notes, and cross-document mismatches.",
    tab: "understand" as const,
  },
  {
    id: "qa",
    challenge: "Answering questions based on provided legal documents",
    where: "Ask the file",
    how: "Answers are grounded in the loaded text and should quote a short excerpt or say the paper is silent.",
    tab: "ask" as const,
  },
  {
    id: "options",
    challenge: "Helping users understand their options and potential next steps",
    where: "Understand + Walk-in brief",
    how: "Options that appear in the document (renew, terminate, negotiate) plus practical next steps that are not legal advice.",
    tab: "brief" as const,
  },
  {
    id: "outputs",
    challenge: "Generating summaries, checklists, or other actionable outputs",
    where: "Understand + Walk-in brief",
    how: "One-sentence and long summaries, a pre-signature checklist, and a printable walk-in pack.",
    tab: "understand" as const,
  },
  {
    id: "prepare",
    challenge: "Helping users prepare information or questions for a legal professional",
    where: "Walk-in brief",
    how: "Questions for a licensed lawyer, documents to bring, red flags to mention in the first five minutes.",
    tab: "brief" as const,
  },
] as const;
