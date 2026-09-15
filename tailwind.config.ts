import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c1915",
        paper: "#f4efe4",
        cream: "#faf6ee",
        brass: "#9a7b3c",
        moss: "#3d5a45",
        rust: "#8b3a2a",
        slate: "#5c5852",
      },
      fontFamily: {
        serif: ["Iowan Old Style", "Palatino Linotype", "Palatino", "Georgia", "serif"],
        sans: ["Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        page: "0 30px 70px -32px rgba(22, 20, 16, 0.5)",
        soft: "0 10px 30px -18px rgba(22, 20, 16, 0.28)",
      },
      borderRadius: {
        studio: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
