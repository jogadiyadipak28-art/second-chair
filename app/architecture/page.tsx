import Link from "next/link";
import { Logo } from "@/components/Brand";
import { GENAI_INTEGRATION_POINTS, GENAI_SERVICE, NOT_GENAI } from "@/lib/architecture";
import { USE_CASES } from "@/lib/use-cases";

export const metadata = {
  title: "GenAI architecture — Second Chair",
};

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-ink/8 bg-[#f4eee3]/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Logo compact />
          <Link href="/" className="text-sm text-slate hover:text-ink">
            Back to studio
          </Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="photo-frame rounded-studio h-48 mb-10 shadow-page">
          <img src="/images/hero-briefing-desk.png" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161410]/70 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-cream">
            <p className="text-[11px] uppercase tracking-[0.28em] text-brass">Explicit mapping</p>
            <h1 className="font-serif text-4xl mt-1">Which GenAI is used, and where</h1>
          </div>
        </div>
        <p className="text-slate leading-relaxed -mt-2 mb-10">
          Second Chair uses <strong className="text-ink">one</strong> generative service. Every live analysis,
          comparison, Q&amp;A turn, and walk-in brief is the same API call, with a different prompt.
        </p>

      <section className="mt-4">
        <h2 className="font-serif text-2xl">Challenge use cases → product</h2>
        <div className="mt-4 overflow-x-auto paper-card rounded-studio p-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-ink/15">
                <th className="py-3 px-3">Use case</th>
                <th className="py-3 px-3">Where in Second Chair</th>
                <th className="py-3 px-3">How</th>
              </tr>
            </thead>
            <tbody>
              {USE_CASES.map((u) => (
                <tr key={u.id} className="border-b border-ink/10 align-top last:border-0">
                  <td className="py-3 px-3 font-medium">{u.challenge}</td>
                  <td className="py-3 px-3">{u.where}</td>
                  <td className="py-3 px-3 text-slate">{u.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="paper-card rounded-studio p-6 mt-8">
        <h2 className="font-serif text-2xl">Service</h2>
        <dl className="mt-4 grid sm:grid-cols-[160px_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-slate">Name</dt>
          <dd className="font-medium">{GENAI_SERVICE.name}</dd>
          <dt className="text-slate">Vendor</dt>
          <dd>{GENAI_SERVICE.vendor}</dd>
          <dt className="text-slate">Protocol</dt>
          <dd>
            <code>{GENAI_SERVICE.protocol}</code>
          </dd>
          <dt className="text-slate">Default endpoint</dt>
          <dd>
            <code>{GENAI_SERVICE.defaultEndpoint}</code>
          </dd>
          <dt className="text-slate">Default model</dt>
          <dd>
            <code>{GENAI_SERVICE.defaultModel}</code>
          </dd>
          <dt className="text-slate">Credentials</dt>
          <dd>
            <code>{GENAI_SERVICE.env.join(", ")}</code>
          </dd>
          <dt className="text-slate">Single adapter</dt>
          <dd>
            <code>{GENAI_SERVICE.adapterFile}</code> — {GENAI_SERVICE.method}
          </dd>
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Integration points (product → code → model)</h2>
        <div className="mt-4 overflow-x-auto paper-card rounded-studio p-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-ink/15">
                <th className="py-3 px-3">In the product</th>
                <th className="py-3 px-3">API route</th>
                <th className="py-3 px-3">Prompt</th>
                <th className="py-3 px-3">Model call</th>
              </tr>
            </thead>
            <tbody>
              {GENAI_INTEGRATION_POINTS.map((row) => (
                <tr key={row.route} className="border-b border-ink/10 align-top last:border-0">
                  <td className="py-3 px-3">
                    <div className="font-medium">{row.productSurface}</div>
                    <div className="text-slate text-xs mt-1">{row.userAction}</div>
                    <div className="text-[11px] text-slate mt-1">{row.fallback}</div>
                  </td>
                  <td className="py-3 px-3">
                    <code>{row.route}</code>
                    <div className="text-[11px] text-slate mt-1">{row.routeFile}</div>
                  </td>
                  <td className="py-3 px-3 text-xs">{row.promptFn}</td>
                  <td className="py-3 px-3 text-xs">{row.modelCall}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 paper-card rounded-studio p-6">
        <h2 className="font-serif text-2xl">Not GenAI</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {NOT_GENAI.map((item) => (
            <li key={item.piece}>
              <span className="font-medium">{item.piece}</span>
              <span className="text-slate"> — {item.where}. {item.role}</span>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </main>
  );
}
