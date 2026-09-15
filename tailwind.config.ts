import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Graphite Mono palette — pure grayscale, zero chroma
        ink: "#141414",          // oklch(0.205 0 0) — near-black
        paper: "#f5f5f5",        // oklch(0.97 0 0)  — off-white
        cream: "#fafafa",        // oklch(1 0 0)     — white
        graphite: "#3a3a3a",     // dark mid-gray (replaces moss for primary actions)
        silver: "#dedede",       // oklch(0.87 0 0)  — secondary/muted (replaces brass)
        mist: "#f2f2f2",         // oklch(0.95 0 0)  — accent/subtle bg
        slate: "#5c5c5c",        // mid-gray for secondary text (replaces warm slate)
        rust: "#8b3a3a",         // kept for error states (slight desaturation)
        // Legacy aliases so existing Tailwind classes don't break
        brass: "#b4b4b4",        // maps to light gray (was gold/brass)
        moss: "#3a3a3a",         // maps to graphite (was forest green)
      },
      fontFamily: {
        serif: ["ui-serif", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        page: "0 30px 70px -32px rgba(20, 20, 20, 0.18)",
        soft: "0 10px 30px -18px rgba(20, 20, 20, 0.12)",
      },
      borderRadius: {
        studio: "1rem",   // Graphite Mono uses 1rem radius
      },
    },
  },
  plugins: [],
};

export default config;
