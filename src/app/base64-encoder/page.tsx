"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function Base64Encoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string." : "Encoding failed.");
      setOutput("");
    }
  };

  const swap = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output);
    setOutput("");
    setError("");
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolLayout title="SIGNAL TRANSLATOR" description="Transmuting textual streams between human and machine formats.">
      <style>{`
        .translator-panel {
          background: #0d0d16;
          border: 1px solid #1a1a2e;
          border-left: 4px solid var(--accent);
        }
        .stream-input {
          background: #05050a !important;
          color: #a0a0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a2e !important;
        }
        .stream-output {
          background: #05050a !important;
          color: #e0e0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a2e !important;
        }
        .translate-btn {
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.1em;
          clip-path: polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%);
        }
        .mode-switch {
          background: #000 !important;
          border: 1px solid #1a1a2e !important;
          color: #666 !important;
          transition: all 0.2s ease;
        }
        .mode-switch.active {
          border-color: var(--accent) !important;
          color: #fff !important;
          box-shadow: 0 0 10px var(--accent-glow);
        }
      `}</style>

      <div className="translator-panel p-6 rounded-sm mb-6">
        <div className="flex items-center gap-3 mb-6">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              className={`btn mode-switch px-4 py-1 text-xs font-mono ${mode === m ? "active" : ""}`}
              onClick={() => { setMode(m); setOutput(""); setError(""); }}
            >
              {m === "encode" ? "HUMAN → B64" : "B64 → HUMAN"}
            </button>
          ))}
          {output && (
            <button className="btn btn-ghost text-xs ml-auto font-mono" onClick={swap}>
              ⇄ INVERT_STREAM
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>SOURCE_SIGNAL</div>
            <textarea
              rows={8}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? "Enter plain text..." : "Enter Base64 stream..."}
              className="stream-input p-4 rounded-sm outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="label" style={{ color: "#555", fontSize: "10px" }}>TRANSLATED_SIGNAL</div>
              <button
                className="btn btn-ghost text-[10px] py-1 px-3 font-mono"
                onClick={copy}
                disabled={!output}
              >
                {copied ? "SYNCED" : "COPY"}
              </button>
            </div>
            <textarea
              rows={8}
              readOnly
              value={output}
              placeholder="Awaiting translation..."
              className="stream-output p-4 rounded-sm outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 text-[10px] p-3 rounded-sm bg-red-900/20 text-red-400 border border-red-900/50 font-mono">
            SIGNAL_ERROR: {error}
          </div>
        )}

        <button
          className="btn btn-primary translate-btn w-full mt-6 py-4 font-mono text-sm"
          onClick={convert}
        >
          {mode === "encode" ? "TRANSMUTE → B64" : "TRANSMUTE → HUMAN"}
        </button>
      </div>
    </ToolLayout>
  );
}
