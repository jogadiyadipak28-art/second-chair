"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { USE_CASES } from "@/lib/use-cases";

// ── Animated word-reveal headline ─────────────────────────────────────────────
function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const wordVariant = {
    hidden: { y: "110%", opacity: 0, rotateX: -40 },
    visible: {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };
  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}
      style={{ perspective: 800 }}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span variants={wordVariant} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// ── Fade-up utility ───────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Use-case card (scroll-triggered) ─────────────────────────────────────────
function UseCaseCard({
  u,
  index,
}: {
  u: { id: string; where: string; challenge: string; how: string };
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="paper-card rounded-studio p-5 group hover:shadow-page transition-shadow duration-300"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate/60">{u.where}</p>
      <h3 className="font-serif text-lg mt-1.5 leading-snug group-hover:text-ink transition-colors">
        {u.challenge}
      </h3>
      <p className="text-sm text-slate mt-2 leading-relaxed">{u.how}</p>
    </motion.article>
  );
}

// ── PrismaHero ────────────────────────────────────────────────────────────────
interface PrismaHeroProps {
  onOpenSample: () => void;
}

export function PrismaHero({ onOpenSample }: PrismaHeroProps) {
  return (
    <div className="space-y-0">
      {/* ── Full-screen hero ─────────────────────────────────────────── */}
      <section className="relative w-full rounded-studio overflow-hidden shadow-page"
        style={{ minHeight: "min(82vh, 680px)" }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-briefing-desk.png"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Prismatic overlay — dark gradient + subtle colour prism */}
          <div className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg,
                  rgba(20,20,20,0.82) 0%,
                  rgba(20,20,20,0.55) 50%,
                  rgba(40,40,40,0.70) 100%
                )
              `,
            }}
          />
          {/* Prismatic light leak — top-left */}
          <div
            className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(200,200,200,0.10) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          {/* Prismatic light leak — bottom-right */}
          <div
            className="absolute -bottom-24 -right-16 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(180,180,180,0.08) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        {/* ── Floating minimal nav bar ─────────────────────────── */}
        <FadeUp delay={0.05}>
          <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 px-6 py-2.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px) saturate(160%)",
              WebkitBackdropFilter: "blur(18px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span className="text-white/90 text-sm font-semibold tracking-wide">Second Chair</span>
            <span className="w-px h-4 bg-white/20" />
            <span className="text-white/50 text-xs">Legal literacy, not legal advice</span>
          </nav>
        </FadeUp>

        {/* ── Hero copy ────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col justify-end h-full px-8 md:px-14 pb-12 md:pb-16 pt-28"
          style={{ minHeight: "inherit" }}
        >
          {/* Eyebrow */}
          <FadeUp delay={0.15}>
            <p className="text-[11px] uppercase tracking-[0.34em] text-white/50 mb-4">
              A briefing desk, not a robot lawyer
            </p>
          </FadeUp>

          {/* Animated word-reveal headline */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-[4.5rem] leading-[1.08] text-white max-w-3xl">
            <WordReveal text="Walk in already knowing what the paper says." />
          </h1>

          {/* Sub-copy */}
          <FadeUp delay={1.1}>
            <p className="mt-5 max-w-xl text-white/65 leading-relaxed text-base md:text-lg">
              Load a lease, offer letter, NDA, or policy. Second Chair translates
              the clauses, maps money and lock-in, and packs the questions worth
              a lawyer&apos;s time.
            </p>
          </FadeUp>

          {/* CTAs */}
          <FadeUp delay={1.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary px-6 py-3 text-sm"
                onClick={onOpenSample}
              >
                Try the sample lease
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="/architecture"
                className="btn btn-ghost px-6 py-3 text-sm border-white/25 text-white/80 hover:bg-white/10 hover:border-white/40"
              >
                See GenAI mapping
              </motion.a>
            </div>
          </FadeUp>

          {/* Scroll indicator */}
          <FadeUp delay={1.6}>
            <motion.div
              className="mt-12 flex items-center gap-2 text-white/30 text-xs"
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            >
              <span className="block w-px h-8 bg-white/20" />
              <span>scroll</span>
            </motion.div>
          </FadeUp>
        </div>
      </section>

      {/* ── Use-case cards grid ──────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-3 pt-4">
        {USE_CASES.map((u, i) => (
          <UseCaseCard key={u.id} u={u} index={i} />
        ))}
      </div>
    </div>
  );
}
