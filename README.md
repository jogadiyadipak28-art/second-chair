# Second Chair

> **GenAI for legal literacy — not a robot lawyer.**

Second Chair is a briefing desk that helps anyone who is not legally trained *see what a document appears to say*, compare two versions side-by-side, and walk into a meeting with a licensed professional already holding a sensible question list.

It will not tell you to sign, sue, or ignore a deadline. It is information and preparation.

---

## The Problem It Solves

Most people encounter legal documents at high-stakes moments — a new job offer, a lease, a freelance contract, an NDA — and have no way to quickly understand what they are agreeing to. Hiring a lawyer to read every document is expensive. Reading it yourself is slow and often confusing.

Second Chair sits in the middle: it translates the clauses into plain language, maps the risks and obligations, flags what is missing, and packages the questions worth spending billed lawyer time on. The name comes from the **second chair in a courtroom** — the person who prepares the file so the lead attorney's time is used well.

---

## What It Does

| Feature | What you get |
|---|---|
| **Simplify** | Clause-by-clause cards in plain English, tagged as obligations, money, lock-in, privacy, and disputes. Each card keeps the original excerpt so you can verify the machine. |
| **Compare** | Two contracts or versions lined up topic-by-topic — focused on differences that affect money, time, and rights given up. |
| **Ask the file** | Q&A grounded in the loaded text. If it is not in the paper, the assistant says so. |
| **Walk-in brief** | Situation summary, documents to bring, red flags, and a list of questions worth spending billed minutes on. |

---

## Challenge Use Cases

| Use case | Where | How |
|---|---|---|
| Simplifying complex legal documents | **Simplify** tab | Plain-language summary + clause cards that rewrite each excerpt |
| Comparing contracts, agreements, or policies | **Compare** tab | Topic-by-topic pair view for two loaded documents |
| Highlighting important clauses, obligations, risks, or inconsistencies | **Simplify** (filters) + **Compare** | Risk pills, obligation/give-away tags, internal and cross-document inconsistency lists |
| Answering questions based on provided legal documents | **Ask** tab | Q&A grounded in loaded text |
| Helping users understand their options and potential next steps | **Simplify** + **Next steps** | Options that appear in the paper; walk-in next steps that are not legal advice |
| Generating summaries, checklists, or other actionable outputs | **Simplify** + **Next steps** | Summaries, action checklist, printable walk-in pack |
| Helping users prepare information or questions for a legal professional | **Next steps** (Walk-in brief) | Lawyer questions, documents to bring, red flags |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Google Gemini API — `gemini-2.0-flash` (via OpenAI-compatible endpoint) |
| PDF extraction | PDF.js (client-side, no server upload) |

---

## GenAI Architecture

**One generative service:** the **Google Gemini API** via its OpenAI-compatible endpoint (`POST /v1beta/openai/chat/completions`). Default model: `gemini-2.0-flash`. The base URL and model can be swapped via environment variables.

All model traffic goes through a single adapter — `lib/ai.ts` (`completeJson` / `completeText`). Prompts live in `lib/prompts.ts`. Guardrails (no legal advice) are enforced in the system message.

| Product feature | User action | Route | Prompt | GenAI call |
|---|---|---|---|---|
| Understand (clause map) | **Understand this** | `POST /api/analyze` | `analysisPrompt()` | `completeJson()` — JSON mode |
| Compare | **Compare pair** | `POST /api/compare` | `comparePrompt()` | `completeJson()` — JSON mode |
| Ask the file | **Ask** tab | `POST /api/chat` | `chatPrompt()` | `completeText()` — free text |
| Walk-in brief | **Walk-in brief** | `POST /api/briefing` | `briefingPrompt()` | `completeJson()` — JSON mode |

**Not GenAI:**
- **PDF.js** (`lib/extract.ts`) — extracts text from PDFs in the browser.
- **Guided demo** (`lib/demo.ts`) — static educational JSON when `OPENAI_API_KEY` is absent.
- **`GET /api/status`** — reports whether a key exists; does not call a model.

```
Browser (Studio)
  → POST /api/{analyze|compare|chat|briefing}
    → lib/prompts.ts  (task-specific prompt)
    → lib/ai.ts       (Google Gemini — OpenAI-compatible)
         ↓
    Gemini gemini-2.0-flash
```

The live **GenAI architecture** page at `/architecture` shows the same mapping at runtime.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Add your OPENAI_API_KEY — your Gemini API key from Google AI Studio

# 3. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
OPENAI_API_KEY=your-gemini-api-key-from-google-ai-studio
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
OPENAI_MODEL=gemini-2.0-flash
```

**Without an API key:** the three fictional samples (lease, freelance agreement, NDA) demonstrate the full interface using curated educational analyses.

**With an API key:** uploads and pasted text are analyzed live using the configured model.

---

## Project Structure

```
app/
  api/
    analyze/      # Clause extraction and simplification
    compare/      # Side-by-side document comparison
    chat/         # Document Q&A
    briefing/     # Walk-in lawyer brief
    status/       # API key presence check
  architecture/   # GenAI mapping page
  page.tsx        # Main app entry
components/
  Studio.tsx      # Full UI — tabs, file loading, all views
  Brand.tsx       # Logo and brand elements
  Icons.tsx       # SVG icon set
lib/
  ai.ts           # Gemini adapter via OpenAI-compatible endpoint (completeJson / completeText)
  prompts.ts      # All task-specific prompt builders
  types.ts        # Shared TypeScript types
  extract.ts      # PDF.js text extraction
  samples.ts      # Fictional sample contracts
  demo.ts         # Guided demo responses (no API key)
  use-cases.ts    # Landing page use-case cards
  architecture.ts # Architecture page data
public/images/    # UI photography
```

---

## Limits (by Design)

- **Not legal advice.** No attorney-client relationship is created.
- Can misread, omit, or overstate risk — always verify with a licensed professional.
- PDFs must contain real selectable text (scanned images need OCR first, or paste the text).
- Jurisdiction-specific enforceability is always a human lawyer's domain.

The fictional sample contracts are original teaching texts, not forms for real-world use.

---

## License

MIT
