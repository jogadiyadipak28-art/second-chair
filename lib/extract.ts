"use client";

import type { LegalDocument } from "@/lib/types";

export async function readFileAsDocument(file: File): Promise<LegalDocument> {
  const id = `upload-${crypto.randomUUID()}`;
  const name = file.name;
  if (file.type === "application/pdf" || name.toLowerCase().endsWith(".pdf")) {
    const text = await extractPdf(file);
    return { id, name, kind: "other", text, source: "upload" };
  }
  const text = await file.text();
  return { id, name, kind: "other", text, source: "upload" };
}

async function extractPdf(file: File) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  const max = Math.min(pdf.numPages, 40);
  for (let i = 1; i <= max; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(line);
  }
  const text = pages.join("\n\n").replace(/[ \t]+/g, " ").trim();
  if (!text) {
    throw new Error("This PDF has no extractable text (it may be a scan). Paste the text instead.");
  }
  return text;
}
