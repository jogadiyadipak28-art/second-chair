export type DocKind =
  | "lease"
  | "employment"
  | "nda"
  | "freelance"
  | "policy"
  | "other";

export type RiskLevel = "low" | "watch" | "high";

export type ClauseTag =
  | "you-must"
  | "they-must"
  | "you-give-up"
  | "money"
  | "deadline"
  | "exit"
  | "privacy"
  | "dispute";

export type LegalDocument = {
  id: string;
  name: string;
  kind: DocKind;
  text: string;
  source: "upload" | "sample" | "paste";
};

export type ClauseCard = {
  title: string;
  originalExcerpt: string;
  plainLanguage: string;
  tags: ClauseTag[];
  risk: RiskLevel;
  whyItMatters: string;
  questionsToAsk: string[];
};

export type DocumentAnalysis = {
  titleGuess: string;
  kindGuess: DocKind;
  oneSentence: string;
  plainSummary?: string;
  parties: string[];
  moneyTerms: string[];
  datesAndDeadlines: string[];
  clauses: ClauseCard[];
  overallWatchouts: string[];
  missingProtections: string[];
  inconsistencies?: string[];
  optionsInTheText?: string[];
  actionChecklist?: string[];
};

export type CompareFinding = {
  topic: string;
  docA: string;
  docB: string;
  whoBenefits: "A" | "B" | "balanced" | "unclear";
  practicalDifference: string;
  risk: RiskLevel;
};

export type ComparisonResult = {
  headline: string;
  findings: CompareFinding[];
  whatToNegotiate: string[];
  inconsistencies?: string[];
};

export type BriefingPack = {
  situationInPlainEnglish: string;
  goalsToClarify: string[];
  questionsForALawyer: { question: string; why: string }[];
  documentsToBring: string[];
  redFlagsToMention: string[];
  nextStepsYouCanTake: string[];
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
