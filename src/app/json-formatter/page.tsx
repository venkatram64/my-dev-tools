"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const INDENTS = [2, 4] as const;

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<2 | 4>(2);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = (minify = false) => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent));
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolLayout title="DATA PRISM" description="Refracting unstructured JSON into crystalline order.">
      <style>{`
        .prism-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 1024px) { .prism-grid { grid-template-columns: 1fr; } }

        .prism-panel {
          background: #0a0a12;
          border: 1px solid #1a1a2e;
          position: relative;
          transition: border-color 0.3s ease;
        }
        .prism-panel:hover { border-color: #4f46e5; }

        .prism-input {
          background: #05050a !important;
          color: #a0a0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a2e !important;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }
        .prism-output {
          background: #05050a !important;
          color: #e0e0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a2e !important;
          text-shadow: 0 0 5px rgba(160, 160, 255, 0.2);
        }
        .prism-btn {
          text-transform: uppercase;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.1em;
          transition: all 0.2s ease;
          clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 0 100%);
        }
        .prism-btn-primary {
          background: #4f46e5 !important;
          color: white !important;
        }
        .prism-btn-ghost {
          background: transparent !important;
          border: 1px solid #1a1a2e !important;
          color: #666 !important;
        }
        .prism-btn-ghost:hover {
          border-color: #4f46e5 !important;
          color: #fff !important;
        }
        .error-flash {
          animation: flash 0.5s ease-in-out infinite alternate;
        }
        @keyframes flash {
          from { opacity: 1; }
          to { opacity: 0.6; }
        }
      `}</style>

      <div className="prism-grid">
        <div className="prism-panel p-6 rounded-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>RAW_STREAM_INPUT</div>
            <div className="flex gap-2 items-center">
              <span className="text-[10px] font-mono text-muted uppercase">Symmetry:</span>
              {INDENTS.map((n) => (
                <button
                  key={n}
                  className={`prism-btn btn text-[10px] py-1 px-2 ${indent === n ? "prism-btn-primary" : "prism-btn-ghost"}`}
                  onClick={() => setIndent(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={16}
            placeholder='{"stream": "intercepted"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="prism-input flex-1 rounded-sm p-4 outline-none"
          />

          <div className="flex gap-3">
            <button className="btn prism-btn prism-btn-primary flex-1 py-3" onClick={() => format(false)}>Refract (Prettify)</button>
            <button className="btn prism-btn prism-btn-ghost px-4 py-3" onClick={() => format(true)}>Compress (Minify)</button>
          </div>

          {error && (
            <div className="error-flash text-[10px] p-3 rounded-sm bg-red-900/20 text-red-400 border border-red-900/50 font-mono">
              FRAGMENTATION_ERROR: {error}
            </div>
          )}
        </div>

        <div className="prism-panel p-6 rounded-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>RECONSTRUCTED_DATA</div>
            <button
              className="btn prism-btn prism-btn-ghost text-[10px] py-1 px-3"
              onClick={copy}
              disabled={!output}
            >
              {copied ? "SYNCED" : "EXTRACT"}
            </button>
          </div>

          <textarea
            rows={16}
            readOnly
            value={output}
            placeholder="Awaiting refraction..."
            className="prism-output flex-1 rounded-sm p-4 outline-none"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
