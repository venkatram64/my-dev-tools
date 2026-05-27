"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";

type Mode = "encode" | "decode";
type Charset = "UTF-8" | "ASCII" | "ISO-8859-1";

function encodeBase64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64.trim())));
}

function processInput(
  raw: string,
  mode: Mode,
  splitLines: boolean
): { output: string; error: string } {
  if (!raw.trim()) return { output: "", error: "" };
  try {
    if (splitLines) {
      const lines = raw.split("\n");
      const processed = lines.map((line) => {
        if (!line.trim()) return "";
        try {
          return mode === "encode" ? encodeBase64(line) : decodeBase64(line);
        } catch {
          return `[ERROR: invalid ${mode === "decode" ? "Base64" : "text"} on this line]`;
        }
      });
      return { output: processed.join("\n"), error: "" };
    }
    const result =
      mode === "encode" ? encodeBase64(raw) : decodeBase64(raw);
    return { output: result, error: "" };
  } catch {
    return {
      output: "",
      error:
        mode === "decode"
          ? "Invalid Base64 — the input is not a valid Base64-encoded string."
          : "Encoding failed — the input contains characters that cannot be encoded.",
    };
  }
}

export default function Base64EncoderDecoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [charset] = useState<Charset>("UTF-8");
  const [splitLines, setSplitLines] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Live mode processing
  useEffect(() => {
    if (!liveMode) return;
    const { output: out, error: err } = processInput(input, mode, splitLines);
    setOutput(out);
    setError(err);
  }, [input, mode, splitLines, liveMode]);

  // Update char count
  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  const convert = useCallback(() => {
    const { output: out, error: err } = processInput(input, mode, splitLines);
    setOutput(out);
    setError(err);
  }, [input, mode, splitLines]);

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setOutput("");
    setError("");
  };

  const swap = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError("");
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sizeRatio =
    input && output
      ? ((output.length / input.length) * 100).toFixed(0)
      : null;

  return (
    <ToolLayout
      title="BASE64 CODEC"
      description="Encode plain text to Base64 or decode Base64 back to human-readable text."
    >
      <style>{`
        @keyframes pulse-border {
          0%, 100% { border-color: var(--accent); }
          50% { border-color: var(--cyan); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .codec-card {
          background: #0a0a12;
          border: 1px solid #1a1a2e;
          border-radius: 4px;
        }
        .tab-btn {
          padding: 8px 24px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid transparent;
          border-bottom: none;
          cursor: pointer;
          transition: all 0.18s ease;
          position: relative;
          top: 1px;
          color: #555;
          background: transparent;
        }
        .tab-btn.active {
          color: #fff;
          background: #0a0a12;
          border-color: #1a1a2e;
          border-bottom-color: #0a0a12;
        }
        .tab-btn.active.encode-tab { color: var(--accent); }
        .tab-btn.active.decode-tab { color: var(--cyan); }
        .tab-btn:not(.active):hover { color: #999; }

        .codec-textarea {
          width: 100%;
          background: #05050a !important;
          border: 1px solid #1e1e30 !important;
          border-radius: 3px;
          color: #c0c0e8 !important;
          font-family: 'Courier New', monospace !important;
          font-size: 13px;
          line-height: 1.6;
          padding: 12px 14px;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .codec-textarea:focus {
          border-color: #3a3a5e !important;
          box-shadow: 0 0 8px rgba(100, 80, 200, 0.15) !important;
        }
        .codec-textarea.output-area {
          color: #e8e8ff !important;
          background: #03030a !important;
        }
        .option-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #666;
        }
        .option-row label { cursor: pointer; }
        .codec-checkbox {
          appearance: none;
          width: 13px;
          height: 13px;
          border: 1px solid #333;
          border-radius: 2px;
          background: #05050a;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
        }
        .codec-checkbox:checked {
          background: var(--accent);
          border-color: var(--accent);
        }
        .codec-checkbox:checked::after {
          content: "✓";
          position: absolute;
          top: -1px;
          left: 1px;
          font-size: 10px;
          color: white;
          font-weight: bold;
        }
        .live-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px 3px 4px;
          border: 1px solid #222;
          border-radius: 20px;
          cursor: pointer;
          background: #05050a;
          transition: all 0.2s ease;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #555;
          user-select: none;
        }
        .live-toggle:hover { border-color: #333; color: #777; }
        .live-toggle.on {
          border-color: var(--accent);
          color: var(--accent);
          box-shadow: 0 0 8px var(--accent-glow);
        }
        .toggle-dot {
          width: 22px;
          height: 13px;
          border-radius: 7px;
          background: #222;
          position: relative;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .live-toggle.on .toggle-dot { background: var(--accent); }
        .toggle-dot::after {
          content: "";
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #555;
          top: 2px;
          left: 2px;
          transition: all 0.2s ease;
        }
        .live-toggle.on .toggle-dot::after {
          background: #fff;
          left: 11px;
        }
        .charset-badge {
          padding: 2px 8px;
          border: 1px solid #1a1a2e;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #444;
          background: #05050a;
        }
        .convert-btn {
          width: 100%;
          padding: 14px;
          font-family: 'Courier New', monospace;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
          clip-path: polygon(0 0, 100% 0, 100% 75%, 97% 100%, 0 100%);
        }
        .convert-btn.encode-mode {
          background: var(--accent);
          color: white;
        }
        .convert-btn.decode-mode {
          background: var(--cyan);
          color: #000;
        }
        .convert-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .convert-btn:active { transform: translateY(0); filter: brightness(0.95); }
        .convert-btn::before {
          content: "◀";
          margin-right: 8px;
          opacity: 0.7;
        }
        .convert-btn::after {
          content: "▶";
          margin-left: 8px;
          opacity: 0.7;
        }
        .stats-bar {
          display: flex;
          gap: 16px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #444;
          flex-wrap: wrap;
        }
        .stats-bar span { color: #666; }
        .stats-bar strong { color: #888; }
        .error-box {
          animation: fadeIn 0.2s ease;
          background: rgba(180, 20, 20, 0.08);
          border: 1px solid rgba(180, 20, 20, 0.3);
          border-left: 3px solid var(--danger);
          border-radius: 3px;
          padding: 10px 14px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #ff6b6b;
        }
        .action-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .action-btn {
          padding: 5px 14px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid #222;
          border-radius: 2px;
          background: transparent;
          color: #555;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .action-btn:hover { border-color: #444; color: #aaa; }
        .action-btn.copy-btn:not(:disabled):hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .action-btn.swap-btn:not(:disabled):hover {
          border-color: var(--cyan);
          color: var(--cyan);
        }
        .action-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .section-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #333;
          margin-bottom: 6px;
        }
      `}</style>

      {/* Tab bar */}
      <div style={{ borderBottom: "1px solid #1a1a2e", marginBottom: 0 }}>
        <button
          className={`tab-btn encode-tab ${mode === "encode" ? "active" : ""}`}
          onClick={() => switchMode("encode")}
        >
          Encode
        </button>
        <button
          className={`tab-btn decode-tab ${mode === "decode" ? "active" : ""}`}
          onClick={() => switchMode("decode")}
        >
          Decode
        </button>
      </div>

      <div className="codec-card p-5" style={{ borderTop: "none", borderRadius: "0 4px 4px 4px" }}>

        {/* Input section */}
        <div className="mb-4">
          <div className="section-label">
            {mode === "encode" ? "Plain text to encode" : "Base64 to decode"}
          </div>
          <textarea
            className="codec-textarea"
            rows={7}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Type or paste plain text here..."
                : "Type or paste Base64 string here..."
            }
            spellCheck={false}
          />
        </div>

        {/* Options row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "14px",
          }}
        >
          {/* Charset */}
          <div className="option-row">
            <span className="charset-badge">{charset}</span>
            <span style={{ color: "#3a3a50" }}>Character set</span>
          </div>

          {/* Split lines */}
          <div className="option-row">
            <input
              type="checkbox"
              id="splitLines"
              className="codec-checkbox"
              checked={splitLines}
              onChange={(e) => setSplitLines(e.target.checked)}
            />
            <label htmlFor="splitLines">
              Process each line separately
            </label>
          </div>

          {/* Live mode */}
          <div
            className={`live-toggle ${liveMode ? "on" : ""}`}
            onClick={() => setLiveMode((v) => !v)}
          >
            <div className="toggle-dot" />
            Live mode {liveMode ? "ON" : "OFF"}
          </div>

          {/* Char count */}
          <div style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: "10px", color: "#333" }}>
            {charCount > 0 && <span>{charCount.toLocaleString()} chars</span>}
          </div>
        </div>

        {/* Convert button (hidden in live mode) */}
        {!liveMode && (
          <button
            className={`convert-btn ${mode}-mode`}
            onClick={convert}
            disabled={!input.trim()}
            style={{ marginBottom: "16px", opacity: !input.trim() ? 0.5 : 1 }}
          >
            {mode === "encode" ? "ENCODE" : "DECODE"}
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="error-box mb-4">
            ⚠ {error}
          </div>
        )}

        {/* Output section */}
        {(output || liveMode) && (
          <div style={{ animation: "fadeIn 0.25s ease" }}>
            {/* Stats */}
            {output && (
              <div className="stats-bar mb-3">
                <span>Output: <strong>{output.length.toLocaleString()} chars</strong></span>
                {sizeRatio && (
                  <span>
                    Size ratio:{" "}
                    <strong style={{ color: Number(sizeRatio) > 100 ? "#f9a" : "#9fa" }}>
                      {sizeRatio}%
                    </strong>
                  </span>
                )}
                {output.split("\n").length > 1 && (
                  <span>Lines: <strong>{output.split("\n").length}</strong></span>
                )}
              </div>
            )}

            <div className="section-label">Result</div>
            <textarea
              ref={outputRef}
              className="codec-textarea output-area"
              rows={7}
              readOnly
              value={output}
              placeholder={liveMode ? "Result will appear here as you type..." : ""}
              spellCheck={false}
            />

            <div className="action-row mt-3">
              <button
                className="action-btn copy-btn"
                onClick={copy}
                disabled={!output}
              >
                {copied ? "✓ Copied" : "Copy Result"}
              </button>
              <button
                className="action-btn swap-btn"
                onClick={swap}
                disabled={!output}
                title="Swap — use output as input and flip mode"
              >
                ⇄ Swap &amp; Flip
              </button>
              <button
                className="action-btn"
                onClick={clear}
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Hint text */}
        {!output && !error && !liveMode && (
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              color: "#2a2a3a",
              marginTop: "8px",
              textAlign: "center",
            }}
          >
            {mode === "encode"
              ? "Enter plain text above and press ENCODE."
              : "Paste a Base64 string above and press DECODE."}
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
