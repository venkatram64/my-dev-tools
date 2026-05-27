"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function toCamel(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase());
}
function toPascal(s: string) {
  const c = toCamel(s);
  return c.charAt(0).toUpperCase() + c.slice(1);
}
function toSnake(s: string) {
  return s
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .toLowerCase();
}
function toKebab(s: string) {
  return toSnake(s).replace(/_/g, "-");
}
function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
function toSentence(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
function toAlternating(s: string) {
  return s.split("").map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join("");
}

const CASES = [
  { label: "camelCase",    fn: toCamel },
  { label: "PascalCase",   fn: toPascal },
  { label: "snake_case",   fn: toSnake },
  { label: "kebab-case",   fn: toKebab },
  { label: "UPPER CASE",   fn: (s: string) => s.toUpperCase() },
  { label: "lower case",   fn: (s: string) => s.toLowerCase() },
  { label: "Title Case",   fn: toTitle },
  { label: "Sentence case",fn: toSentence },
  { label: "aLtErNaTiNg",  fn: toAlternating },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolLayout title="GLYPH SHIFTER" description="Manipulating textual polarity and glyph arrangement.">
      <style>{`
        .glyph-panel {
          background: #0a0a12;
          border: 1px solid #1a1a2e;
          position: relative;
        }
        .glyph-input {
          background: #000 !important;
          color: #a0a0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a2e !important;
        }
        .glyph-card {
          background: #0d0d16 !important;
          border: 1px solid #1a1a2e !important;
          transition: all 0.2s ease;
        }
        .glyph-card:hover {
          border-color: var(--accent) !important;
          background: rgba(124, 58, 237, 0.05) !important;
          transform: translateY(-2px);
        }
        .glyph-badge {
          font-family: 'Courier New', monospace;
          background: #4f46e522 !important;
          color: #a0a0ff !important;
          border: 1px solid #4f46e544 !important;
          text-transform: uppercase;
          font-size: 10px;
        }
      `}</style>

      <div className="glyph-panel p-6 rounded-sm mb-6 border-t-4 border-t-accent">
        <div className="label" style={{ color: "#555", fontSize: "10px" }}>RAW_GLYPH_STREAM</div>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Input text for shift..."
          className="glyph-input w-full p-4 mt-2 rounded-sm outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CASES.map(({ label, fn }) => {
          const result = input ? fn(input) : "";
          return (
            <div key={label} className="glyph-card p-4 rounded-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="glyph-badge badge px-2 py-0.5">{label}</span>
                <button
                  className="btn btn-ghost text-[10px] py-1 px-3 font-mono uppercase tracking-tighter"
                  onClick={() => copy(result, label)}
                  disabled={!result}
                >
                  {copied === label ? "SYNCED" : "COPY"}
                </button>
              </div>
              <div
                className="px-3 py-2 rounded-sm font-mono text-xs break-all select-all min-h-[32px] flex items-center"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  color: result ? "var(--text)" : "#444",
                  border: "1px solid #1a1a2e",
                }}
              >
                {result || "—"}
              </div>
            </div>
          );
        })}
      </div>
    </ToolLayout>
  );
}
