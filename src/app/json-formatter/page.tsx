"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

// ── helpers ─────────────────────────────────────────────────────────────────

const SAMPLE = JSON.stringify(
  {
    name: "my-dev-tools",
    version: "1.0.0",
    description: "Developer utility toolbox",
    scripts: { dev: "next dev", build: "next build", lint: "next lint" },
    dependencies: { next: "^15.0.0", react: "^18.0.0", "tailwindcss": "^4.0.0" },
    author: { name: "Dev", email: "dev@example.com", active: true },
    license: "MIT",
    private: null,
  },
  null,
  2
);

function syntaxHighlight(json: string): string {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match))
        return /:$/.test(match)
          ? `<span class="jk">${match}</span>`
          : `<span class="js">${match}</span>`;
      if (/true|false/.test(match)) return `<span class="jb">${match}</span>`;
      if (/null/.test(match)) return `<span class="jn">${match}</span>`;
      return `<span class="jnum">${match}</span>`;
    }
  );
}

// ── tree view ────────────────────────────────────────────────────────────────

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [k: string]: JsonValue };

function TreeNode({
  value,
  label,
  depth = 0,
}: {
  value: JsonValue;
  label?: string;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 3);

  const isExpandable =
    value !== null && typeof value === "object";
  const isArray = Array.isArray(value);

  const bracket = isArray ? ["[", "]"] : ["{", "}"];
  const children = isExpandable
    ? isArray
      ? (value as JsonValue[]).map((v, i) => ({ key: String(i), val: v }))
      : Object.entries(value as Record<string, JsonValue>).map(([k, v]) => ({
          key: k,
          val: v,
        }))
    : [];

  const indent = depth * 16;

  if (!isExpandable) {
    let color = "var(--text)";
    if (typeof value === "string") color = "var(--success)";
    else if (typeof value === "boolean") color = "var(--warning)";
    else if (value === null) color = "var(--text-muted)";
    else color = "var(--cyan)";

    return (
      <div style={{ paddingLeft: indent, lineHeight: "1.7" }} className="flex gap-2 items-baseline">
        {label !== undefined && (
          <span style={{ color: "var(--accent-light)" }} className="text-xs font-mono">
            {label}:&nbsp;
          </span>
        )}
        <span style={{ color, fontSize: 12 }} className="font-mono">
          {JSON.stringify(value)}
        </span>
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: indent }}>
      <div
        className="flex items-center gap-1 cursor-pointer select-none group"
        style={{ lineHeight: "1.7" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          style={{
            color: "var(--text-muted)",
            fontSize: 9,
            width: 10,
            display: "inline-block",
            transition: "transform 0.15s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▶
        </span>
        {label !== undefined && (
          <span style={{ color: "var(--accent-light)" }} className="text-xs font-mono">
            {label}:&nbsp;
          </span>
        )}
        <span
          style={{ color: "var(--text-muted)", fontSize: 12 }}
          className="font-mono group-hover:text-white transition-colors"
        >
          {bracket[0]}
          {!open && (
            <>
              <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
                &nbsp;{children.length} {isArray ? "items" : "keys"}&nbsp;
              </span>
              {bracket[1]}
            </>
          )}
        </span>
      </div>
      {open && (
        <>
          {children.map(({ key, val }) => (
            <TreeNode key={key} value={val} label={isArray ? undefined : key} depth={depth + 1} />
          ))}
          <div style={{ paddingLeft: 10, color: "var(--text-muted)", fontSize: 12 }} className="font-mono">
            {bracket[1]}
          </div>
        </>
      )}
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────────────

type IndentMode = "2" | "4" | "tab";
type ViewMode = "code" | "tree";

export default function JSONFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [parsedTree, setParsedTree] = useState<JsonValue | null>(null);
  const [error, setError] = useState<{ msg: string; line?: number } | null>(null);
  const [validMsg, setValidMsg] = useState("");
  const [indent, setIndent] = useState<IndentMode>("2");
  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputLineRef = useRef<HTMLDivElement>(null);
  const outputScrollRef = useRef<HTMLPreElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // sync line numbers scroll with textarea
  const syncScroll = () => {
    if (inputLineRef.current && inputRef.current) {
      inputLineRef.current.scrollTop = inputRef.current.scrollTop;
    }
  };

  const resolveIndent = (m: IndentMode) =>
    m === "tab" ? "\t" : m === "2" ? 2 : 4;

  const format = useCallback(
    (minify = false) => {
      setError(null);
      setValidMsg("");
      try {
        const parsed = JSON.parse(input);
        const str = minify
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, resolveIndent(indent));
        setOutput(str);
        setParsedTree(parsed);
      } catch (e: unknown) {
        const msg = (e as Error).message;
        // try to extract line number from error message
        const lineMatch = msg.match(/line (\d+)/);
        setError({ msg, line: lineMatch ? Number(lineMatch[1]) : undefined });
        setOutput("");
        setParsedTree(null);
      }
    },
    [input, indent]
  );

  const validate = () => {
    setError(null);
    setValidMsg("");
    try {
      JSON.parse(input);
      setValidMsg("✓ Valid JSON");
    } catch (e: unknown) {
      const msg = (e as Error).message;
      const lineMatch = msg.match(/line (\d+)/);
      setError({ msg, line: lineMatch ? Number(lineMatch[1]) : undefined });
    }
  };

  // auto-format on load
  useEffect(() => {
    format();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
      setOutput("");
      setParsedTree(null);
      setError(null);
      setValidMsg("");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setParsedTree(null);
    setError(null);
    setValidMsg("");
  };

  const loadSample = () => {
    setInput(SAMPLE);
    setOutput("");
    setParsedTree(null);
    setError(null);
    setValidMsg("");
  };

  // line numbers for input
  const inputLines = input.split("\n");

  return (
    <ToolLayout title="JSON FORMATTER" description="Validate, beautify, minify, and explore JSON data.">
      <style>{`
        /* syntax colors */
        .jk   { color: #79b8ff; }
        .js   { color: #9ecbff; }
        .jb   { color: #f8c555; }
        .jn   { color: #cc99cd; }
        .jnum { color: #79e8a0; }

        .fmt-grid {
          display: grid;
          grid-template-columns: 1fr 190px 1fr;
          gap: 12px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .fmt-grid { grid-template-columns: 1fr; }
          .fmt-actions { flex-direction: row; flex-wrap: wrap; }
        }

        .fmt-panel {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .fmt-panel-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #0d0d18;
          border-bottom: 1px solid var(--border);
          gap: 8px;
          flex-shrink: 0;
        }
        .fmt-panel-label {
          font-size: 10px;
          letter-spacing: .12em;
          font-weight: 700;
          color: var(--text-muted);
          font-family: monospace;
          text-transform: uppercase;
        }

        /* editor area */
        .fmt-editor-wrap {
          display: flex;
          flex: 1;
          min-height: 0;
          position: relative;
        }
        .fmt-lines {
          width: 36px;
          flex-shrink: 0;
          background: #070710;
          border-right: 1px solid var(--border);
          padding: 14px 0;
          overflow: hidden;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.6;
          color: #2d2d4a;
          text-align: right;
          padding-right: 8px;
          user-select: none;
        }
        .fmt-textarea {
          flex: 1;
          background: transparent;
          color: #a0a0cc;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.6;
          padding: 14px 12px;
          resize: none;
          outline: none;
          border: none;
          tab-size: 2;
          min-height: 400px;
          caret-color: var(--cyan);
        }
        .fmt-textarea::placeholder { color: #2a2a40; }

        .fmt-pre {
          flex: 1;
          background: transparent;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.6;
          padding: 14px 12px;
          overflow: auto;
          white-space: pre;
          margin: 0;
          min-height: 400px;
        }

        .fmt-tree-scroll {
          flex: 1;
          overflow: auto;
          padding: 14px 12px;
          min-height: 400px;
        }

        /* actions column */
        .fmt-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 4px;
        }
        .fmt-actions-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .fmt-divider {
          height: 1px;
          background: var(--border);
          margin: 4px 0;
        }
        .fmt-action-btn {
          width: 100%;
          padding: 9px 10px;
          border-radius: 4px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .04em;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .fmt-action-btn:hover {
          border-color: var(--accent);
          background: rgba(124,58,237,.12);
          color: var(--accent-light);
        }
        .fmt-action-btn.primary {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }
        .fmt-action-btn.primary:hover {
          background: var(--accent-light);
          box-shadow: 0 0 12px rgba(124,58,237,.4);
        }
        .fmt-action-btn.danger {
          border-color: #3a1a1a;
          color: var(--danger);
        }
        .fmt-action-btn.danger:hover {
          border-color: var(--danger);
          background: rgba(239,68,68,.1);
        }
        .fmt-select {
          width: 100%;
          padding: 8px 10px;
          border-radius: 4px;
          border: 1px solid var(--border);
          background: var(--bg-input);
          color: var(--text);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          font-family: inherit;
        }
        .fmt-select:focus { border-color: var(--accent); }

        .fmt-action-btn.muted {
          color: var(--text-muted);
          font-size: 10px;
        }
        .fmt-action-btn.muted:hover { color: var(--text); border-color: #333; }

        /* status bar */
        .fmt-status {
          padding: 5px 12px;
          border-top: 1px solid var(--border);
          font-size: 10px;
          font-family: monospace;
          color: var(--text-muted);
          display: flex;
          gap: 12px;
          background: #070710;
          flex-shrink: 0;
        }
        .fmt-error-bar {
          padding: 8px 12px;
          background: rgba(239,68,68,.08);
          border-top: 1px solid rgba(239,68,68,.3);
          font-size: 11px;
          color: var(--danger);
          font-family: monospace;
          flex-shrink: 0;
        }
        .fmt-valid-bar {
          padding: 8px 12px;
          background: rgba(16,185,129,.08);
          border-top: 1px solid rgba(16,185,129,.3);
          font-size: 11px;
          color: var(--success);
          font-family: monospace;
          flex-shrink: 0;
        }

        .view-tab {
          padding: 3px 9px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .08em;
          border: 1px solid var(--border);
          border-radius: 3px;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all .15s ease;
          font-family: inherit;
        }
        .view-tab.active {
          border-color: var(--accent);
          background: rgba(124,58,237,.15);
          color: var(--accent-light);
        }

        @keyframes pulseErr {
          0%, 100% { opacity: 1; }
          50% { opacity: .6; }
        }
        .err-pulse { animation: pulseErr 1.2s ease-in-out infinite; }
      `}</style>

      <div className="fmt-grid">
        {/* ── LEFT: input panel ─────────────────────────────────── */}
        <div className="fmt-panel">
          <div className="fmt-panel-bar">
            <span className="fmt-panel-label">Input</span>
            <div className="flex gap-2">
              <button className="view-tab" onClick={loadSample} title="Load sample JSON">
                Sample
              </button>
              <button className="view-tab" onClick={clearAll} title="Clear input">
                Clear
              </button>
            </div>
          </div>

          <div className="fmt-editor-wrap">
            <div className="fmt-lines" ref={inputLineRef}>
              {inputLines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={inputRef}
              className="fmt-textarea"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
                setValidMsg("");
              }}
              onScroll={syncScroll}
              placeholder={'Paste your JSON here…'}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {error && (
            <div className="fmt-error-bar err-pulse">
              ✗ {error.msg}
              {error.line && <span style={{ color: "var(--text-muted)" }}> — Line {error.line}</span>}
            </div>
          )}
          {validMsg && <div className="fmt-valid-bar">{validMsg}</div>}

          <div className="fmt-status">
            <span>Lines: {inputLines.length}</span>
            <span>Chars: {input.length}</span>
          </div>
        </div>

        {/* ── CENTER: actions column ─────────────────────────────── */}
        <div className="fmt-actions" style={{ paddingTop: 8 }}>
          {/* upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json,text/plain"
            style={{ display: "none" }}
            onChange={uploadFile}
          />
          <div className="fmt-actions-group">
            <button
              className="fmt-action-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              ↑ Upload File
            </button>
          </div>

          <div className="fmt-divider" />

          {/* validate + format */}
          <div className="fmt-actions-group">
            <button className="fmt-action-btn" onClick={validate}>
              ✓ Validate
            </button>
            <div>
              <label style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: ".08em", fontWeight: 700, display: "block", marginBottom: 4 }}>
                INDENT
              </label>
              <select
                className="fmt-select"
                value={indent}
                onChange={(e) => setIndent(e.target.value as IndentMode)}
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="tab">Tab</option>
              </select>
            </div>
            <button
              className="fmt-action-btn primary"
              onClick={() => format(false)}
            >
              ⟳ Format / Beautify
            </button>
          </div>

          <div className="fmt-divider" />

          {/* minify + download */}
          <div className="fmt-actions-group">
            <button className="fmt-action-btn" onClick={() => format(true)}>
              ⊡ Minify / Compact
            </button>
            <button
              className="fmt-action-btn"
              onClick={download}
              disabled={!output}
              style={{ opacity: output ? 1 : .35 }}
            >
              ↓ Download
            </button>
          </div>

          <div className="fmt-divider" />

          {/* copy */}
          <div className="fmt-actions-group">
            <button
              className="fmt-action-btn"
              onClick={copy}
              disabled={!output}
              style={{ opacity: output ? 1 : .35 }}
            >
              {copied ? "✓ Copied!" : "⎘ Copy Output"}
            </button>
            <button className="fmt-action-btn danger" onClick={clearAll}>
              ✕ Clear All
            </button>
          </div>
        </div>

        {/* ── RIGHT: output panel ────────────────────────────────── */}
        <div className="fmt-panel">
          <div className="fmt-panel-bar">
            <span className="fmt-panel-label">Output</span>
            <div className="flex gap-2">
              <button
                className={`view-tab ${viewMode === "code" ? "active" : ""}`}
                onClick={() => setViewMode("code")}
              >
                Code
              </button>
              <button
                className={`view-tab ${viewMode === "tree" ? "active" : ""}`}
                onClick={() => setViewMode("tree")}
                disabled={!parsedTree}
                style={{ opacity: parsedTree ? 1 : .35 }}
              >
                Tree
              </button>
            </div>
          </div>

          {viewMode === "code" ? (
            <div className="fmt-editor-wrap">
              {output && (
                <div className="fmt-lines">
                  {output.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
              )}
              <pre
                ref={outputScrollRef}
                className="fmt-pre"
                dangerouslySetInnerHTML={{
                  __html: output
                    ? syntaxHighlight(output)
                    : '<span style="color:#2a2a40">Format your JSON to see the output…</span>',
                }}
              />
            </div>
          ) : (
            <div className="fmt-tree-scroll">
              {parsedTree !== null ? (
                <TreeNode value={parsedTree} depth={0} />
              ) : (
                <span style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "monospace" }}>
                  No parsed data yet.
                </span>
              )}
            </div>
          )}

          <div className="fmt-status">
            {output ? (
              <>
                <span>Lines: {output.split("\n").length}</span>
                <span>Size: {(new TextEncoder().encode(output).byteLength / 1024).toFixed(1)} KB</span>
                {parsedTree !== null && typeof parsedTree === "object" && parsedTree !== null && (
                  <span>
                    Keys: {Array.isArray(parsedTree) ? (parsedTree as JsonValue[]).length : Object.keys(parsedTree as Record<string, JsonValue>).length}
                  </span>
                )}
              </>
            ) : (
              <span style={{ color: "var(--text-muted)" }}>—</span>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
