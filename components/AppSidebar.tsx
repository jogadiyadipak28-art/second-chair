"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Logo } from "@/components/Brand";
import type { LegalDocument } from "@/lib/types";
import type { SAMPLES } from "@/lib/samples";

// ── Chrome-tab shape ──────────────────────────────────────────────────────────
// Each nav item renders as a browser-chrome-style tab: rounded top corners,
// curved "squircle" notches at the bottom edges when active.

interface SidebarProps {
  // file state
  docs: LegalDocument[];
  activeId: string | null;
  setActiveId: (id: string) => void;
  onFiles: (files: FileList | null) => void;
  onAddSample: (s: LegalDocument) => void;
  onClearDocs: () => void;
  samples: LegalDocument[];
  // status
  live: boolean | null;
}

const NAV_ITEMS = [
  { id: "files",   label: "The File",  icon: FileIcon   },
  { id: "samples", label: "Samples",   icon: SampleIcon },
  { id: "docs",    label: "Loaded",    icon: DocsIcon   },
] as const;

type NavId = typeof NAV_ITEMS[number]["id"];

export function AppSidebar({
  docs,
  activeId,
  setActiveId,
  onFiles,
  onAddSample,
  onClearDocs,
  samples,
  live,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>("files");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteName, setPasteName] = useState("Pasted document");
  const [pasteText, setPasteText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 56 : 280 }}
      transition={{ type: "spring", stiffness: 340, damping: 34 }}
      className="relative flex flex-col shrink-0 self-start lg:sticky lg:top-24 overflow-hidden"
      style={{ minHeight: 0 }}
    >
      {/* ── Top chrome-tab strip ────────────────────────────────────────── */}
      <div className="flex items-end gap-0 pl-2 pt-2 pr-1 shrink-0">
        {!collapsed && NAV_ITEMS.map((item, i) => {
          const isActive = activeNav === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className="relative flex items-center gap-1.5 px-3 pt-2.5 pb-2 text-xs font-medium transition-all duration-200 focus:outline-none"
              style={{ zIndex: isActive ? 10 : 5 - i }}
            >
              {/* Chrome tab background */}
              <span
                className={`absolute inset-0 rounded-t-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-white shadow-[0_-1px_0_0_rgba(20,20,20,0.08),1px_-1px_0_0_rgba(20,20,20,0.06),-1px_-1px_0_0_rgba(20,20,20,0.06)]"
                    : "bg-ink/4 hover:bg-ink/8"
                }`}
              />
              {/* Bottom-left notch cutout (active only) */}
              {isActive && (
                <>
                  <span className="absolute bottom-0 -left-2 w-2 h-2 overflow-hidden pointer-events-none">
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-white shadow-[2px_2px_0_2px_white] border-none" style={{ background: "none", boxShadow: "2px 2px 0 2px #f5f5f5" }} />
                  </span>
                  <span className="absolute bottom-0 -right-2 w-2 h-2 overflow-hidden pointer-events-none">
                    <span className="absolute bottom-0 left-0 w-4 h-4 rounded-full" style={{ boxShadow: "-2px 2px 0 2px #f5f5f5" }} />
                  </span>
                </>
              )}
              <Icon className={`relative z-10 h-3.5 w-3.5 shrink-0 ${isActive ? "text-ink" : "text-slate"}`} />
              <span className={`relative z-10 ${isActive ? "text-ink" : "text-slate"}`}>{item.label}</span>
            </button>
          );
        })}

        {/* Collapse / expand toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto mb-1 mr-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 hover:bg-ink/10 transition-colors shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.span
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="block"
          >
            <ChevronLeftIcon className="h-3 w-3 text-slate" />
          </motion.span>
        </button>
      </div>

      {/* ── Sidebar body ─────────────────────────────────────────────────── */}
      <div
        className="flex-1 rounded-b-studio rounded-tr-studio border border-ink/8 bg-white shadow-soft overflow-hidden"
        style={{ minHeight: 200 }}
      >
        <AnimatePresence initial={false} mode="wait">
          {collapsed ? (
            /* Icon-only collapsed rail */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              {NAV_ITEMS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setCollapsed(false); setActiveNav(id); }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-ink/6 transition-colors"
                  title={NAV_ITEMS.find(n => n.id === id)?.label}
                >
                  <Icon className="h-4 w-4 text-slate" />
                </button>
              ))}
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-2 flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white hover:bg-ink/80 transition-colors"
                title="Upload file"
              >
                <UploadIcon className="h-4 w-4" />
              </button>
              <input ref={fileRef} type="file" accept=".pdf,.txt,.md,text/plain,application/pdf" className="hidden" multiple onChange={(e) => onFiles(e.target.files)} />
            </motion.div>
          ) : (
            /* Expanded panel */
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full flex flex-col"
            >
              {/* ── Status chip ── */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-ink/6">
                <Logo compact />
                <span className={`chip text-[10px] ${live ? "text-moss border-moss/20 bg-moss/10" : "text-brass border-brass/25 bg-brass/10"}`}>
                  {live === null ? "…" : live ? "Live" : "Demo"}
                </span>
              </div>

              {/* ── Tab content ── */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

                {/* FILES tab */}
                {activeNav === "files" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <button className="btn btn-primary w-full" onClick={() => fileRef.current?.click()}>
                        Upload PDF or text
                      </button>
                      <input ref={fileRef} type="file" accept=".pdf,.txt,.md,text/plain,application/pdf" className="hidden" multiple onChange={(e) => onFiles(e.target.files)} />
                      <button className="btn btn-ghost w-full" onClick={() => setPasteOpen((v) => !v)}>
                        Paste text
                      </button>
                    </div>
                    {pasteOpen && (
                      <div className="space-y-2">
                        <input
                          className="field text-sm"
                          value={pasteName}
                          onChange={(e) => setPasteName(e.target.value)}
                          placeholder="Document name"
                        />
                        <textarea
                          className="field h-28 resize-y text-sm"
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
                            onAddSample(doc);
                            setPasteText("");
                            setPasteOpen(false);
                          }}
                        >
                          Add to file
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-slate leading-relaxed">
                      Nothing is sent to the model until you run an analysis.
                    </p>
                  </div>
                )}

                {/* SAMPLES tab */}
                {activeNav === "samples" && (
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-brass mb-3">Fictional samples</p>
                    {samples.map((s) => (
                      <button
                        key={s.id}
                        className="w-full text-left text-sm rounded-xl px-3 py-2.5 hover:bg-ink/5 transition-colors"
                        onClick={() => onAddSample(s)}
                      >
                        {s.name.replace(" (fictional)", "")}
                      </button>
                    ))}
                  </div>
                )}

                {/* LOADED DOCS tab */}
                {activeNav === "docs" && (
                  <div className="space-y-2">
                    {docs.length === 0 ? (
                      <p className="text-sm text-slate">No documents loaded yet.</p>
                    ) : (
                      <>
                        {docs.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => setActiveId(d.id)}
                            className={`w-full text-left rounded-xl p-3 text-sm transition border ${
                              activeId === d.id
                                ? "border-ink/20 bg-ink/5 font-medium"
                                : "border-transparent hover:bg-ink/4"
                            }`}
                          >
                            <div className="truncate">{d.name}</div>
                            <div className="text-[11px] text-slate mt-0.5">
                              {d.text.length.toLocaleString()} chars
                            </div>
                          </button>
                        ))}
                        <button
                          className="text-xs text-rust px-1 mt-1"
                          onClick={onClearDocs}
                        >
                          Clear all
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* ── Footer ── */}
              <div className="px-4 py-3 border-t border-ink/6">
                <a
                  href="/architecture"
                  className="text-xs text-slate hover:text-ink underline-offset-2 hover:underline"
                >
                  GenAI architecture ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

// ── Inline micro-icons ────────────────────────────────────────────────────────

function FileIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function SampleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function DocsIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function UploadIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
