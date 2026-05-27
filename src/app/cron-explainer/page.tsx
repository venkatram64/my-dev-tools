"use client";
import { useState } from "react";
import cronstrue from "cronstrue";
import ToolLayout from "@/components/ToolLayout";

const EXAMPLES = [
  { expr: "* * * * *",     label: "Every minute" },
  { expr: "0 * * * *",     label: "Every hour" },
  { expr: "0 9 * * 1-5",   label: "Weekdays 9am" },
  { expr: "0 0 * * 0",     label: "Every Sunday midnight" },
  { expr: "*/5 * * * *",   label: "Every 5 minutes" },
  { expr: "0 0 1 * *",     label: "First of month" },
  { expr: "0 0 1 1 *",     label: "Every Jan 1st" },
];

function getNextRuns(expr: string, count = 5): string[] {
  try {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return [];
    const [min, hour, dom, mon, dow] = parts;

    const matches = (val: number, field: string, max: number): boolean => {
      if (field === "*") return true;
      if (field.startsWith("*/")) {
        const step = parseInt(field.slice(2));
        return val % step === 0;
      }
      const ranges = field.split(",");
      for (const r of ranges) {
        if (r.includes("-")) {
          const [a, b] = r.split("-").map(Number);
          if (val >= a && val <= b) return true;
        } else if (parseInt(r) === val) return true;
      }
      return false;
    };

    const results: string[] = [];
    const d = new Date();
    d.setSeconds(0, 0);
    d.setMinutes(d.getMinutes() + 1);
    let attempts = 0;
    while (results.length < count && attempts < 527040) {
      attempts++;
      const ok =
        matches(d.getMinutes(), min, 59) &&
        matches(d.getHours(), hour, 23) &&
        matches(d.getDate(), dom, 31) &&
        matches(d.getMonth() + 1, mon, 12) &&
        matches(d.getDay(), dow, 6);
      if (ok) results.push(d.toLocaleString());
      d.setMinutes(d.getMinutes() + 1);
    }
    return results;
  } catch {
    return [];
  }
}

export default function CronExplainer() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [result, setResult] = useState<{ description: string; next: string[] } | null>(null);
  const [error, setError] = useState("");

  const explain = () => {
    setError("");
    try {
      const description = cronstrue.toString(expr, { verbose: true });
      const next = getNextRuns(expr);
      setResult({ description, next });
    } catch (e: unknown) {
      setError((e as Error).message || "Invalid cron expression.");
      setResult(null);
    }
  };

  return (
    <ToolLayout title="TEMPORAL SCHEDULER" description="Decoding algorithmic recurrence patterns into human temporal logic.">
      <style>{`
        .cron-panel {
          background: #0a0a1a;
          border: 1px solid #1a1a3e;
          border-top: 4px solid var(--accent);
        }
        .cron-input {
          background: #000 !important;
          color: #a0a0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a3e !important;
        }
        .cron-card {
          background: #0d0d16 !important;
          border: 1px solid #1a1a2e !important;
          transition: all 0.2s ease;
        }
        .run-row {
          background: rgba(0,0,0,0.4) !important;
          border: 1px solid #1a1a3e !important;
          font-family: 'Courier New', monospace !important;
        }
        .run-row:hover {
          border-color: var(--accent) !important;
          background: rgba(124, 58, 237, 0.05) !important;
        }
      `}</style>

      <div className="cron-panel p-6 rounded-sm mb-6">
        <div className="label" style={{ color: "#555", fontSize: "10px" }}>RECURRENCE_SAMPLED_PATTERN</div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && explain()}
            placeholder="* * * * *"
            className="cron-input flex-1 p-3 rounded-sm outline-none"
          />
          <button className="btn btn-primary uppercase font-bold tracking-widest text-xs px-6" onClick={explain}>DECODE</button>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: "#444" }}>
          <span className="uppercase">Sectors:</span>
          {["minute", "hour", "day", "month", "weekday"].map((f) => (
            <span key={f} className="badge badge-accent px-2 py-0.5 opacity-60">{f}</span>
          ))}
        </div>
      </div>

      <div className="cron-panel p-6 rounded-sm mb-6">
        <div className="label" style={{ color: "#555", fontSize: "10px" }}>TEMPORAL_TEMPLATES</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {EXAMPLES.map(({ expr: e, label }) => (
            <button
              key={e}
              className="btn btn-ghost text-[10px] font-mono py-1 px-2 hover:border-accent"
              onClick={() => setExpr(e)}
            >
              <span className="text-accent-light mr-1">{e}</span>
              <span style={{ color: "#555" }}>— {label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="cron-panel p-4 rounded-sm mb-6 text-[10px] text-danger font-mono border-l-4 border-l-danger">
          TEMPORAL_ERROR: {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="cron-panel p-6 rounded-sm">
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>DECODED_LOGIC</div>
            <p className="text-lg font-mono text-accent-light leading-relaxed">
              {result.description}
            </p>
          </div>

          {result.next.length > 0 && (
            <div className="space-y-3">
              <div className="label" style={{ color: "#555", fontSize: "10px" }}>NEXT_SCHEDULED_TICK_EVENTS</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.next.map((t, i) => (
                  <div key={i} className="run-row flex items-center gap-3 px-4 py-3 rounded-sm text-xs">
                    <span className="badge badge-accent w-6 text-center font-bold">{i + 1}</span>
                    <span className="flex-1 truncate" style={{ color: "var(--text)" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
