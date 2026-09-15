"use client";

import { Logo } from "@/components/Brand";
import { IconBrief, IconChat, IconDoc, IconSplit } from "@/components/Icons";
import { readFileAsDocument } from "@/lib/extract";
import { SAMPLES } from "@/lib/samples";
import { USE_CASES } from "@/lib/use-cases";
import type {
  BriefingPack,
  ChatMessage,
  ClauseTag,
  ComparisonResult,
  DocumentAnalysis,
  LegalDocument,
  RiskLevel,
} from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";

type Tab = "understand" | "compare" | "ask" | "brief";

const TAGS: Record<string, string> = {
  "you-must": "You must",
  "they-must": "They must",
  "you-give-up": "You give up",
  money: "Money",
  deadline: "Deadlines",
  exit: "Getting out",
  privacy: "Privacy / access",
  dispute: "Disputes",
};

export default function Studio() {
  const [accepted, setAccepted] = useState(false);
  const [docs, setDocs] = useState<LegalDocument[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("understand");
  const [analyses, setAnalyses] = useState<Record<string, DocumentAnalysis>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState<boolean | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [briefing, setBriefing] = useState<BriefingPack | null>(null);
  const [goal, setGoal] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteName, setPasteName] = useState("Pasted document");
  const [pasteText, setPasteText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const active = docs.find((d) => d.id === activeId) || docs[0] || null;
  const analysis = active ? analyses[active.id] : undefined;

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => setLive(Boolean(d.live)))
      .catch(() => setLive(false));
  }, []);

  async function addDocs(next: LegalDocument[]) {
    setDocs((prev) => {
      const merged = [...prev];
      for (const d of next) {
        if (!merged.some((x) => x.id === d.id)) merged.push(d);
      }
      return merged;
    });
    setActiveId(next[0]?.id || activeId);
    setError(null);
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    try {
      setBusy("Reading file…");
      const loaded: LegalDocument[] = [];
      for (const file of Array.from(files)) {
        loaded.push(await readFileAsDocument(file));
      }
      await addDocs(loaded);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    } finally {
      setBusy(null);
    }
  }

  async function runAnalyze(doc: LegalDocument) {
    setBusy("Reading the document the way a careful assistant would…");
    setError(null);
    setTab("understand");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doc.id, name: doc.name, text: doc.text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalyses((prev) => ({ ...prev, [doc.id]: data.analysis }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setBusy(null);
    }
  }

  async function runCompare() {
    if (docs.length < 2) {
      setError("Load a second document to compare.");
      return;
    }
    const a = active || docs[0];
    const b = docs.find((d) => d.id !== a.id) || docs[1];
    setBusy("Lining up the terms that actually differ…");
    setError(null);
    setTab("compare");
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aName: a.name,
          aText: a.text,
          bName: b.name,
          bText: b.text,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Compare failed");
      setComparison(data.comparison);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    } finally {
      setBusy(null);
    }
  }

  async function runBriefing() {
    if (!docs.length) return;
    setBusy("Packing a walk-in brief for a licensed lawyer…");
    setError(null);
    setTab("brief");
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          docs: docs.map((d) => ({ name: d.name, text: d.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Briefing failed");
      setBriefing(data.briefing);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Briefing failed");
    } finally {
      setBusy(null);
    }
  }

  async function sendQuestion() {
    if (!question.trim() || !docs.length) return;
    const q = question.trim();
    setQuestion("");
    const nextHistory = [...messages, { role: "user" as const, content: q }];
    setMessages(nextHistory);
    setBusy("Looking in the document…");
    setTab("ask");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          history: nextHistory,
          docs: docs.map((d) => ({ name: d.name, text: d.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not answer");
      setMessages([...nextHistory, { role: "assistant", content: data.answer }]);
    } catch (e) {
      setMessages([
        ...nextHistory,
        {
          role: "assistant",
          content: e instanceof Error ? e.message : "Could not answer.",
        },
      ]);
    } finally {
      setBusy(null);
    }
  }

  const riskCounts = useMemo(() => {
    const clauses = analysis?.clauses || [];
    return {
      high: clauses.filter((c) => c.risk === "high").length,
      watch: clauses.filter((c) => c.risk === "watch").length,
      low: clauses.filter((c) => c.risk === "low").length,
    };
  }, [analysis]);

  if (!accepted) {
    return (
      <main className="min-h-screen px-4 py-8 md:px-8 md:py-12">
        <div className="max-w-5xl mx-auto paper-card rounded-studio overflow-hidden shadow-page grid md:grid-cols-2">
          <div className="photo-frame min-h-[280px] md:min-h-full">
            <img src="/images/welcome-contract.png" alt="Open contract, glasses, and a small brass chair paperweight" />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <Logo />
            <p className="text-brass tracking-[0.28em] text-[11px] uppercase mt-8">Not a law firm</p>
            <h1 className="font-serif text-4xl md:text-[2.6rem] mt-3 leading-[1.15]">
              Sit with the papers before you sit with counsel.
            </h1>
            <p className="mt-4 text-slate leading-relaxed">
              In court, the second chair does not replace the lawyer. They prepare the file:
              what the text says, what looks uneven, and what is worth the billed minute.
            </p>
            <p className="mt-5 text-sm text-slate leading-relaxed border-l-2 border-brass/70 pl-4">
              This product explains and organizes information. It can be wrong. It is not legal
              advice, it does not create an attorney-client relationship, and it is not a
              substitute for a licensed professional in your jurisdiction.
            </p>
            <button className="btn btn-primary mt-8 w-full md:w-auto" onClick={() => setAccepted(true)}>
              I understand — continue
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-ink/8 bg-[#f5f5f5]/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
          <Logo compact />
          <div className="flex items-center gap-3 text-xs">
            <a
              href="/architecture"
              className="hidden sm:inline text-slate hover:text-ink underline-offset-4 hover:underline"
            >
              Architecture
            </a>
            <span
              className={`chip ${live ? "text-moss border-moss/20 bg-moss/10" : "text-brass border-brass/25 bg-brass/10"}`}
            >
              {live ? "Live · Gemini 3.6 Flash" : "Guided demo"}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-5 py-6 grid lg:grid-cols-[300px_minmax(0,1fr)] gap-6 items-start">
        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="paper-card rounded-studio p-5">
            <h2 className="font-serif text-xl">The file</h2>
            <p className="text-xs text-slate mt-1 leading-relaxed">
              PDF or text. Nothing is sent to a model until you run an analysis.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
                Upload PDF or text
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt,.md,.docx,text/plain,application/pdf"
                className="hidden"
                multiple
                onChange={(e) => onFiles(e.target.files)}
              />
              <button className="btn btn-ghost" onClick={() => setPasteOpen((v) => !v)}>
                Paste text
              </button>
            </div>
            {pasteOpen && (
              <div className="mt-3 space-y-2">
                <input
                  className="field"
                  value={pasteName}
                  onChange={(e) => setPasteName(e.target.value)}
                />
                <textarea
                  className="field h-28 resize-y"
                  placeholder="Paste the clause or whole document…"
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                />
                <button
                  className="text-sm text-moss font-medium"
                  onClick={() => {
                    if (!pasteText.trim()) return;
                    const doc: LegalDocument = {
                      id: `paste-${crypto.randomUUID()}`,
                      name: pasteName || "Pasted document",
                      kind: "other",
                      text: pasteText,
                      source: "paste",
                    };
                    addDocs([doc]);
                    setPasteText("");
                    setPasteOpen(false);
                  }}
                >
                  Add to file
                </button>
              </div>
            )}
          </section>

          <section className="paper-card rounded-studio p-5">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-brass">Fictional samples</h3>
            <ul className="mt-3 space-y-1">
              {SAMPLES.map((s) => (
                <li key={s.id}>
                  <button
                    className="w-full text-left text-sm rounded-xl px-3 py-2.5 hover:bg-brass/10 transition-colors"
                    onClick={() => addDocs([s])}
                  >
                    {s.name.replace(" (fictional)", "")}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            {docs.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`w-full text-left paper-card rounded-2xl p-3.5 text-sm transition ${
                  active?.id === d.id ? "ring-2 ring-brass/70" : "hover:shadow-soft"
                }`}
              >
                <div className="font-medium truncate">{d.name}</div>
                <div className="text-[11px] text-slate mt-0.5">{d.text.length.toLocaleString()} characters</div>
              </button>
            ))}
            {docs.length > 0 && (
              <button
                className="text-xs text-rust px-1"
                onClick={() => {
                  setDocs([]);
                  setActiveId(null);
                  setAnalyses({});
                  setComparison(null);
                  setBriefing(null);
                  setMessages([]);
                }}
              >
                Clear file
              </button>
            )}
          </section>
        </aside>

        <main className="min-w-0">
          {!active ? (
            <EmptyState onOpenSample={() => addDocs([SAMPLES[0]])} />
          ) : (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-brass">Active document</p>
                  <h1 className="font-serif text-3xl md:text-4xl mt-1 leading-tight truncate">{active.name}</h1>
                </div>
                <div className="flex flex-wrap gap-2 no-print">
                  <button disabled={!!busy} className="btn btn-moss" onClick={() => runAnalyze(active)}>
                    Understand this
                  </button>
                  <button
                    disabled={!!busy || docs.length < 2}
                    className="btn btn-ghost"
                    onClick={runCompare}
                  >
                    Compare pair
                  </button>
                  <button disabled={!!busy} className="btn btn-ghost" onClick={runBriefing}>
                    Walk-in brief
                  </button>
                </div>
              </div>

              <nav className="tab-track mb-5 no-print overflow-x-auto">
                {(
                  [
                    ["understand", "Simplify", IconDoc],
                    ["compare", "Compare", IconSplit],
                    ["ask", "Ask", IconChat],
                    ["brief", "Next steps", IconBrief],
                  ] as [Tab, string, typeof IconDoc][]
                ).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    className={`flex-1 min-w-[7rem] rounded-full px-3 py-2 text-sm inline-flex items-center justify-center gap-2 transition ${
                      tab === id ? "bg-ink text-cream shadow-sm" : "text-slate hover:text-ink"
                    }`}
                    onClick={() => setTab(id)}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </nav>

              {busy && (
                <p className="mb-4 text-sm text-brass italic paper-card rounded-full px-4 py-2 inline-block">
                  {busy}
                </p>
              )}
              {error && (
                <p className="mb-4 text-sm text-rust paper-card rounded-xl px-4 py-2">{error}</p>
              )}

              {tab === "understand" && (
                <Understand
                  doc={active}
                  analysis={analysis}
                  riskCounts={riskCounts}
                />
              )}
              {tab === "compare" && (
                <CompareView
                  docs={docs}
                  comparison={comparison}
                  onRun={runCompare}
                />
              )}
              {tab === "ask" && (
                <AskView
                  messages={messages}
                  question={question}
                  setQuestion={setQuestion}
                  onSend={sendQuestion}
                  busy={!!busy}
                />
              )}
              {tab === "brief" && (
                <BriefView
                  goal={goal}
                  setGoal={setGoal}
                  briefing={briefing}
                  onRun={runBriefing}
                  busy={!!busy}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyState({ onOpenSample }: { onOpenSample: () => void }) {
  return (
    <div className="space-y-6">
      <div className="paper-card rounded-studio overflow-hidden shadow-page">
        <div className="photo-frame h-52 md:h-72">
          <img
            src="/images/hero-briefing-desk.png"
            alt="Warm oak briefing desk with legal folders, a lamp, and an empty second chair"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/75 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-cream">
            <p className="text-[11px] uppercase tracking-[0.28em] text-brass">A briefing desk, not a robot lawyer</p>
            <h2 className="font-serif text-3xl md:text-5xl mt-2 max-w-2xl leading-[1.12]">
              Walk in already knowing what the paper says.
            </h2>
          </div>
        </div>
        <div className="p-6 md:p-10">
          <p className="max-w-2xl text-slate leading-relaxed">
            Load a lease, offer letter, NDA, or policy. Second Chair translates the clauses,
            maps money and lock-in, compares two versions, and packs the questions worth a
            lawyer’s time.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={onOpenSample}>
              Try the sample lease
            </button>
            <a href="/architecture" className="btn btn-ghost">
              See GenAI mapping
            </a>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {USE_CASES.map((u) => (
          <article key={u.id} className="paper-card rounded-studio p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-brass">{u.where}</p>
            <h3 className="font-serif text-lg mt-1 leading-snug">{u.challenge}</h3>
            <p className="text-sm text-slate mt-2 leading-relaxed">{u.how}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function RiskPill({ risk }: { risk: RiskLevel }) {
  return (
    <span className={`chip risk-${risk}`}>{risk}</span>
  );
}

function Understand({
  doc,
  analysis,
  riskCounts,
}: {
  doc: LegalDocument;
  analysis?: DocumentAnalysis;
  riskCounts: { high: number; watch: number; low: number };
}) {
  const [filter, setFilter] = useState<"all" | "high" | ClauseTag>("all");

  if (!analysis) {
    return (
      <div className="grid lg:grid-cols-[1fr_260px] gap-4 items-start">
        <pre className="paper-card rounded-studio p-5 text-xs leading-relaxed whitespace-pre-wrap max-h-[70vh] overflow-auto text-ink/80">
          {doc.text}
        </pre>
        <aside className="paper-card rounded-studio p-5 text-sm text-slate leading-relaxed">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brass">Next</p>
          <p className="font-serif text-xl text-ink mt-2">Make it readable</p>
          <p className="mt-2">
            Press <strong className="text-ink">Understand this</strong> to simplify, highlight
            obligations and risks, and build a checklist. The original stays here so you can check the machine.
          </p>
        </aside>
      </div>
    );
  }

  const clauses = analysis.clauses.filter((c) => {
    if (filter === "all") return true;
    if (filter === "high") return c.risk === "high";
    return c.tags.includes(filter);
  });

  return (
    <div className="space-y-6">
      <section className="paper-card rounded-studio p-6">
        <p className="text-xs uppercase tracking-widest text-brass">
          Simplify · {analysis.kindGuess}
        </p>
        <h2 className="font-serif text-2xl mt-1">{analysis.titleGuess}</h2>
        <p className="mt-3 text-lg leading-relaxed">{analysis.oneSentence}</p>
        <p className="mt-4 text-slate leading-relaxed whitespace-pre-wrap">
          {analysis.plainSummary || analysis.oneSentence}
        </p>
        <div className="mt-5 flex gap-3 text-sm">
          <span className="chip risk-high">{riskCounts.high} high</span>
          <span className="chip risk-watch">{riskCounts.watch} watch</span>
          <span className="chip risk-low">{riskCounts.low} lower</span>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
          <Fact label="Parties" items={analysis.parties} />
          <Fact label="Money the text mentions" items={analysis.moneyTerms} />
          <Fact label="Dates & windows" items={analysis.datesAndDeadlines} />
        </div>
      </section>

      <div className="flex flex-wrap gap-1">
        <span className="text-xs text-slate mr-2 self-center">Highlight:</span>
        {(
          [
            ["all", "All clauses"],
            ["high", "Risks"],
            ["you-must", "Obligations"],
            ["you-give-up", "Give-aways"],
            ["money", "Money"],
            ["deadline", "Deadlines"],
            ["dispute", "Disputes"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            className={`chip ${
              filter === id ? "border-ink bg-ink text-cream" : "border-ink/15"
            }`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="space-y-4">
        {clauses.map((c, i) => (
          <article key={`${c.title}-${i}`} className="paper-card rounded-studio p-5">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <h3 className="font-serif text-xl">{c.title}</h3>
              <RiskPill risk={c.risk} />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {c.tags.map((t) => (
                <span key={t} className="chip">
                  {TAGS[t] || t}
                </span>
              ))}
            </div>
            <p className="mt-3 leading-relaxed">{c.plainLanguage}</p>
            <blockquote className="mt-3 text-sm text-slate italic border-l-2 border-brass/50 pl-3">
              {c.originalExcerpt}
            </blockquote>
            <p className="mt-3 text-sm">{c.whyItMatters}</p>
            {c.questionsToAsk.length > 0 && (
              <ul className="mt-2 text-sm list-disc pl-5 text-moss">
                {c.questionsToAsk.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="paper-card rounded-studio p-5">
          <h3 className="font-serif text-lg">Risks &amp; watchouts</h3>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            {analysis.overallWatchouts.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
        <div className="paper-card rounded-studio p-5">
          <h3 className="font-serif text-lg">Inconsistencies</h3>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            {(analysis.inconsistencies || ["None flagged from this text."]).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="paper-card rounded-studio p-5">
          <h3 className="font-serif text-lg">Options that appear in the text</h3>
          <p className="text-xs text-slate mt-1">Not advice — paths the paper itself mentions or leaves open.</p>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            {(analysis.optionsInTheText || []).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
        <div className="paper-card rounded-studio p-5">
          <h3 className="font-serif text-lg">Action checklist</h3>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            {(analysis.actionChecklist || []).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="paper-card rounded-studio p-5">
        <h3 className="font-serif text-lg">What this paper does not appear to protect</h3>
        <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
          {analysis.missingProtections.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Fact({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-slate">{label}</p>
      <ul className="mt-2 space-y-1">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

function CompareView({
  docs,
  comparison,
  onRun,
}: {
  docs: LegalDocument[];
  comparison: ComparisonResult | null;
  onRun: () => void;
}) {
  if (docs.length < 2) {
    return (
      <div className="paper-card rounded-studio overflow-hidden">
        <div className="photo-frame h-44">
          <img src="/images/compare-desk.png" alt="Two contracts on a blotter with a magnifying glass" />
        </div>
        <div className="p-6">
          <h3 className="font-serif text-2xl">Load a second paper</h3>
          <p className="text-slate text-sm mt-2 max-w-lg leading-relaxed">
            Add another version, a counterparty draft, or a sample from the left rail. Compare then
            lines up money, exit, and rights given up — not a wall of redlines.
          </p>
        </div>
      </div>
    );
  }
  if (!comparison) {
    return (
      <button className="btn btn-primary" onClick={onRun}>
        Compare the open pair
      </button>
    );
  }
  return (
    <div className="space-y-4">
      <p className="font-serif text-2xl">{comparison.headline}</p>
      <p className="text-xs text-slate">
        Comparing {docs[0].name} with {docs[1].name}. “Who benefits” is a reading aid, not a legal conclusion.
      </p>
      {comparison.findings.map((f) => (
        <article key={f.topic} className="paper-card rounded-studio p-5">
          <div className="flex justify-between gap-3">
            <h3 className="font-serif text-xl">{f.topic}</h3>
            <RiskPill risk={f.risk} />
          </div>
          <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
            <div className="bg-cream/80 p-3">
              <p className="text-[11px] uppercase text-slate">Document A</p>
              <p className="mt-1">{f.docA}</p>
            </div>
            <div className="bg-cream/80 p-3">
              <p className="text-[11px] uppercase text-slate">Document B</p>
              <p className="mt-1">{f.docB}</p>
            </div>
          </div>
          <p className="mt-3 text-sm">{f.practicalDifference}</p>
          <p className="mt-1 text-xs text-brass">Apparent tilt: {f.whoBenefits}</p>
        </article>
      ))}
      <div className="paper-card rounded-studio p-5">
        <h3 className="font-serif text-lg">Worth discussing in a negotiation</h3>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {comparison.whatToNegotiate.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
      {(comparison.inconsistencies || []).length > 0 && (
        <div className="paper-card rounded-studio p-5">
          <h3 className="font-serif text-lg">Inconsistencies &amp; mismatches</h3>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {(comparison.inconsistencies || []).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AskView({
  messages,
  question,
  setQuestion,
  onSend,
  busy,
}: {
  messages: ChatMessage[];
  question: string;
  setQuestion: (v: string) => void;
  onSend: () => void;
  busy: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  return (
    <div>
      <p className="text-sm text-slate mb-4">
        Questions are answered from the loaded text. If it is not in the paper, the assistant should say so.
      </p>
      <div className="space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {[
              "What happens if I leave early?",
              "Where is money mentioned?",
              "What rights does this ask me to give up?",
            ].map((q) => (
              <button
                key={q}
                className="chip hover:border-brass/50"
                onClick={() => {
                  setQuestion(q);
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user" ? "bg-ink text-cream ml-6 md:ml-16" : "paper-card mr-6 md:mr-16"
            }`}
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="paper-card rounded-2xl p-4 mr-6 md:mr-16 flex items-center gap-1.5">
            <span className="text-xs text-slate italic mr-1">Thinking</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brass animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-brass animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-brass animate-bounce [animation-delay:300ms]" />
          </div>
        )}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <input
          className="field flex-1"
          placeholder="Ask about a clause, deadline, or fee…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="btn btn-primary" disabled={busy || !question.trim()}>
          Ask
        </button>
      </form>
      <div ref={bottomRef} />
    </div>
  );
}

function BriefView({
  goal,
  setGoal,
  briefing,
  onRun,
  busy,
}: {
  goal: string;
  setGoal: (v: string) => void;
  briefing: BriefingPack | null;
  onRun: () => void;
  busy: boolean;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate">
        Options, next steps, checklists, and questions for a licensed lawyer — preparation, not advice.
      </p>
      <div className="paper-card rounded-studio p-5">
        <label className="text-sm">What do you want help preparing for?</label>
        <textarea
          className="field mt-2 h-24 resize-y"
          placeholder="e.g. I have to sign this lease by Friday and I work from home. I want to know what to ask a tenants' lawyer."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button className="btn btn-moss mt-3" disabled={busy} onClick={onRun}>
          Build walk-in pack
        </button>
      </div>
      {briefing && (
        <div className="space-y-4 print:text-black" id="briefing-pack">
          <article className="paper-card rounded-studio p-6">
            <h2 className="font-serif text-2xl">Situation in plain English</h2>
            <p className="mt-2 leading-relaxed">{briefing.situationInPlainEnglish}</p>
          </article>
          <GridList title="Goals to clarify first" items={briefing.goalsToClarify} />
          <article className="paper-card rounded-studio p-6">
            <h2 className="font-serif text-2xl">Questions for a licensed lawyer</h2>
            <ol className="mt-3 space-y-3">
              {briefing.questionsForALawyer.map((q) => (
                <li key={q.question}>
                  <p className="font-medium">{q.question}</p>
                  <p className="text-sm text-slate">{q.why}</p>
                </li>
              ))}
            </ol>
          </article>
          <GridList title="Bring these if you have them" items={briefing.documentsToBring} />
          <GridList title="Red flags to mention in the first five minutes" items={briefing.redFlagsToMention} />
          <GridList title="Practical next steps (not legal advice)" items={briefing.nextStepsYouCanTake} />
          <button className="btn btn-ghost no-print" onClick={() => window.print()}>
            Print / save as PDF
          </button>
        </div>
      )}
    </div>
  );
}

function GridList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="paper-card rounded-studio p-6">
      <h2 className="font-serif text-2xl">{title}</h2>
      <ul className="mt-3 list-disc pl-5 space-y-1 text-sm">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </article>
  );
}
