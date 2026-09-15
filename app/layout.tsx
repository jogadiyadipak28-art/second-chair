import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Second Chair — understand legal papers before you walk in",
  description:
    "Educational GenAI that translates contracts into plain language, maps risks, compares documents, and prepares questions for a licensed lawyer. Not legal advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
