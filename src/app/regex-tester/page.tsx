"use client";
import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const ALL_FLAGS = ["g", "i", "m", "s"] as const;
type Flag = (typeof ALL_FLAGS)[number];

interface MatchResult {
  index: number;
  length: number;
  value: string;
  groups: Record<string, string> | undefined;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<Set<Flag>>(new Set(["g"]));
  const [testStr, setTestStr] = useState("");

  const toggleFlag = (f: Flag) => {
    setFlags((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  };

  const result = useMemo(() => {
    if (!pattern || !testStr) return null;
    try {
      const re = new RegExp(pattern, [...flags].join(""));
      const matches: MatchResult[] = [];
      if (flags.has("g")) {
        let m;
        const reCopy = new RegExp(pattern, [...flags].join(""));
        while ((m = reCopy.exec(testStr)) !== null) {
          matches.push({ index: m.index, length: m[0].length, value: m[0], groups: m.groups });
          if (!flags.has("g")) break;
        }
      } else {
        const m = re.exec(testStr);
        if (m) matches.push({ index: m.index, length: m[0].length, value: m[0], groups: m.groups });
      }
      return { matches, error: null };
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flags, testStr]);

  const highlighted = useMemo(() => {
    if (!result || !result.matches.length) return testStr;
    const spans: { start: number; end: number }[] = result.matches.map((m) => ({
      start: m.index,
      end: m.index + m.length,
    }));
    spans.sort((a, b) => a.start - b.start);
    const parts: React.ReactNode[] = [];
    let pos = 0;
    for (const s of spans) {
      if (pos < s.start) parts.push(<span key={pos}>{testStr.slice(pos, s.start)}</span>);
      parts.push(
        <mark key={s.start} style={{ background: "var(--accent)", color: "white", borderRadius: "2px", padding: "0 2px", boxShadow: "0 0 8px var(--accent)" }}>
          {testStr.slice(s.start, s.end)}
        </mark>
      );
      pos = s.end;
    }
    if (pos < testStr.length) parts.push(<span key={pos}>{testStr.slice(pos)}</span>);
    return parts;
  }, [result, testStr]);

  return (
    <ToolLayout title="PATTERN SCANNER" description="Archaeological excavation of textual anomalies via regular expressions.">
      <style>{`
        .scanner-panel {
          background: #0a0a12;
          border: 1px solid #1a1a2e;
          border-left: 4px solid var(--accent);
        }
        .pattern-input-group {
          background: #000 !important;
          border: 1px solid #1a1a2e !important;
        }
        .pattern-input-group:focus-within {
          border-color: var(--accent) !important;
          box-shadow: 0 0 10px var(--accent-glow) !important;
        }
        .scan-textarea {
          background: #05050a !important;
          color: #a0a0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a2e !important;
        }
        .match-display {
          background: #000 !important;
          color: #e0e0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a2e !important;
          line-height: 1.6;
        }
        .match-packet {
          background: #0d0d16 !important;
          border: 1px solid #1a1a2e !important;
          transition: all 0.2s ease;
        }
        .match-packet:hover {
          border-color: var(--accent) !important;
          transform: translateX(4px);
        }
      `}</style>

      <div className="scanner-panel p-6 rounded-sm mb-6">
        <div className="flex flex-wrap items-end gap-6 mb-6">
          <div className="flex-1 min-w-[300px]">
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>REGEX_PATTERN_SAMPLED</div>
            <div className="pattern-input-group flex items-center px-3 py-1 rounded-sm">
              <span className="text-muted font-mono text-sm">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="[a-z]+"
                className="flex-1 bg-transparent outline-none px-2 text-sm font-mono text-accent-light"
              />
              <span className="text-muted font-mono text-sm">/{[...flags].join("")}</span>
            </div>
            {result?.error && <div className="text-[10px] mt-2 text-danger font-mono">SYNTAX_ERROR: {result.error}</div>}
          </div>

          <div>
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>SCAN_FLAGS</div>
            <div className="flex gap-2">
              {ALL_FLAGS.map((f) => (
                <button
                  key={f}
                  className={`btn text-xs py-1 px-3 font-mono ${flags.has(f) ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => toggleFlag(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="label" style={{ color: "#555", fontSize: "10px" }}>SAMPLED_TEXT_STREAM</div>
        <textarea
          rows={6}
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          placeholder="Feed text stream here for anomaly detection..."
          className="scan-textarea w-full p-4 rounded-sm outline-none mt-2"
        />
      </div>

      {testStr && (
        <div className="scanner-panel p-6 rounded-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>VISUAL_HIGHLIGHTS</div>
            {result && (
              <span className="badge badge-accent text-[10px] font-mono uppercase px-2 py-1">
                MATCHES: {result.matches.length}
              </span>
            )}
          </div>
          <pre className="match-display p-4 rounded-sm whitespace-pre-wrap break-all text-sm min-h-[100px]">
            {highlighted}
          </pre>
        </div>
      )}

      {result && result.matches.length > 0 && (
        <div className="space-y-3">
          <div className="label" style={{ color: "#555", fontSize: "10px" }}>ANOMALY_DETAILS</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.matches.map((m, i) => (
              <div key={i} className="match-packet p-3 rounded-sm flex items-center gap-3 text-xs">
                <span className="badge badge-accent w-6 text-center font-mono">#{i + 1}</span>
                <span className="font-mono flex-1 truncate text-accent-light">{JSON.stringify(m.value)}</span>
                <span className="text-muted font-mono opacity-60">idx:{m.index}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
