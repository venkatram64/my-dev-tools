"use client";
import { useState } from "react";
import yaml from "js-yaml";
import ToolLayout from "@/components/ToolLayout";

export default function JsonYaml() {
  const [mode, setMode] = useState<"json2yaml" | "yaml2json">("json2yaml");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    setOutput("");
    try {
      if (mode === "json2yaml") {
        const obj = JSON.parse(input);
        setOutput(yaml.dump(obj, { indent: 2 }));
      } else {
        const obj = yaml.load(input);
        setOutput(JSON.stringify(obj, null, 2));
      }
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const swap = () => {
    setMode((m) => (m === "json2yaml" ? "yaml2json" : "json2yaml"));
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
    <ToolLayout title="MORPH CORE" description="Transmuting structured data across the JSON-YAML singularity.">
      <style>{`
        .morph-panel {
          background: #0a0a1a;
          border: 1px solid #1a1a3e;
          border-top: 4px solid var(--accent);
          position: relative;
        }
        .morph-input {
          background: #050510 !important;
          color: #b0a0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a3e !important;
        }
        .morph-output {
          background: #050510 !important;
          color: #e0e0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a3e !important;
        }
        .morph-btn {
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.1em;
          clip-path: polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%);
        }
        .mode-pill {
          background: #000 !important;
          border: 1px solid #1a1a3e !important;
          color: #666 !important;
          transition: all 0.3s ease;
        }
        .mode-pill.active {
          border-color: var(--accent) !important;
          color: #fff !important;
          box-shadow: 0 0 15px var(--accent-glow);
        }
      `}</style>

      <div className="morph-panel p-6 rounded-sm mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {(["json2yaml", "yaml2json"] as const).map((m) => (
            <button
              key={m}
              className={`btn mode-pill px-4 py-1 text-xs font-mono ${mode === m ? "active" : ""}`}
              onClick={() => { setMode(m); setOutput(""); setError(""); }}
            >
              {m === "json2yaml" ? "JSON → YAML" : "YAML → JSON"}
            </button>
          ))}
          {output && (
            <button className="btn btn-ghost text-xs ml-auto font-mono" onClick={swap}>
              ⇄ INVERT_FORM
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>SOURCE_STRUCTURE</div>
            <textarea
              rows={14}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "json2yaml" ? '{"key": "value"}' : "key: value"}
              className="morph-input p-4 rounded-sm outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="label" style={{ color: "#555", fontSize: "10px" }}>MORPHED_OUTPUT</div>
              <button
                className="btn btn-ghost text-[10px] py-1 px-3 font-mono"
                onClick={copy}
                disabled={!output}
              >
                {copied ? "SYNCED" : "EXTRACT"}
              </button>
            </div>
            <textarea
              rows={14}
              readOnly
              value={output}
              placeholder="Awaiting transmutation..."
              className="morph-output p-4 rounded-sm outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 text-[10px] p-3 rounded-sm bg-red-900/20 text-red-400 border border-red-900/50 font-mono">
            MORPH_ERROR: {error}
          </div>
        )}

        <button
          className="btn btn-primary morph-btn w-full mt-6 py-4 font-mono text-sm"
          onClick={convert}
        >
          INITIATE TRANSMUTATION
        </button>
      </div>
    </ToolLayout>
  );
}
