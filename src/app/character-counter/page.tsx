"use client";
import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function count(text: string) {
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;
  const sentences = text.trim() ? (text.match(/[^.!?]*[.!?]+/g) || []).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.round(words / 200));
  return { chars, charsNoSpaces, words, lines, sentences, paragraphs, readingTime };
}

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => count(text), [text]);

  const Stat = ({ label, value }: { label: string; value: number | string }) => (
    <div className="metric-card p-4 rounded-sm text-center flex flex-col justify-center gap-1">
      <div className="text-2xl font-mono font-bold" style={{ color: "var(--accent-light)" }}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest font-mono" style={{ color: "#555" }}>{label}</div>
    </div>
  );

  return (
    <ToolLayout title="METRIC ANALYZER" description="Quantitative decomposition of textual structures.">
      <style>{`
        .analyzer-panel {
          background: #08080f;
          border: 1px solid #1a1a2e;
          border-left: 4px solid var(--accent);
        }
        .metric-input {
          background: #000 !important;
          color: #a0a0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a2e !important;
        }
        .metric-card {
          background: #0d0d16 !important;
          border: 1px solid #1a1a2e !important;
          transition: all 0.2s ease;
        }
        .metric-card:hover {
          border-color: var(--accent) !important;
          transform: scale(1.05);
          background: rgba(124, 58, 237, 0.05) !important;
        }
      `}</style>

      <div className="analyzer-panel p-6 rounded-sm mb-6">
        <div className="label" style={{ color: "#555", fontSize: "10px" }}>ANALYSIS_STREAM_INPUT</div>
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Feed textual data for quantitative analysis..."
          className="metric-input w-full p-4 mt-2 rounded-sm outline-none"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Stat label="Characters" value={stats.chars} />
        <Stat label="Sans-Space" value={stats.charsNoSpaces} />
        <Stat label="Words" value={stats.words} />
        <Stat label="Lines" value={stats.lines} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Read Time (m)" value={stats.readingTime} />
      </div>
    </ToolLayout>
  );
}
