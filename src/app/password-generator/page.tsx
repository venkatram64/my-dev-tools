"use client";
import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function calcStrength(pwd: string): { label: string; pct: number; cls: string } {
  let score = 0;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: "CRITICAL", pct: 25, cls: "badge-danger" };
  if (score <= 3) return { label: "UNSTABLE", pct: 50, cls: "badge-warning" };
  if (score <= 4) return { label: "STABLE", pct: 75, cls: "badge-accent" };
  return { label: "FORTIFIED", pct: 100, cls: "badge-success" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSurging, setIsSurging] = useState(false);

  const generate = useCallback(() => {
    setIsSurging(true);
    setTimeout(() => {
      let charset = "";
      if (useLower) charset += LOWER;
      if (useUpper) charset += UPPER;
      if (useDigits) charset += DIGITS;
      if (useSymbols) charset += SYMBOLS;
      if (!charset) return;
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      setPassword(Array.from(arr, (v) => charset[v % charset.length]).join(""));
      setIsSurging(false);
    }, 300);
  }, [length, useLower, useUpper, useDigits, useSymbols]);

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const strength = password ? calcStrength(password) : null;

  const Checkbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <div className={`w-4 h-4 rounded-sm border-2 transition-all ${checked ? 'bg-accent border-accent shadow-[0_0_10px_var(--accent)]' : 'border-border bg-bg-input'}`}
           onClick={(e) => {e.preventDefault(); onChange(!checked)}}/>
      <span className="text-xs font-mono uppercase tracking-wider" style={{ color: checked ? "var(--text)" : "var(--text-muted)" }}>
        {label}
      </span>
    </label>
  );

  return (
    <ToolLayout title="ENTROPY CORE" description="Mining high-density cryptographic chaos from the void.">
      <style>{`
        @keyframes surge {
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.02); filter: brightness(1.5); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 5px var(--accent); }
          50% { box-shadow: 0 0 20px var(--accent); }
          100% { box-shadow: 0 0 5px var(--accent); }
        }
        .core-panel {
          background: #08080c;
          border: 2px solid #1a1a2e;
          border-top: 4px solid var(--accent);
          position: relative;
          overflow: hidden;
        }
        .core-panel::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
                      linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 3px, 3px 100%;
          pointer-events: none;
          z-index: 10;
        }
        .power-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: #1a1a2e;
          outline: none;
          border-radius: 2px;
        }
        .power-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: var(--accent);
          cursor: pointer;
          border-radius: 0;
          box-shadow: 0 0 10px var(--accent);
        }
        .forge-btn {
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: 0.2em;
          background: var(--accent) !important;
          color: white !important;
          clip-path: polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%);
          transition: all 0.2s ease;
        }
        .forge-btn:hover {
          filter: brightness(1.2);
          transform: translateY(-2px);
          box-shadow: 0 0 20px var(--accent);
        }
        .result-vault {
          background: #000 !important;
          border: 1px solid #222 !important;
          position: relative;
          animation: slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className={`core-panel p-6 mb-6 transition-all ${isSurging ? 'animation-[surge_0.3s_ease-in-out]' : ''}`}>
        <div className="space-y-6">
          <div>
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>CORE_OUTPUT_LENGTH: {length}</div>
            <input
              type="range"
              min={4}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="power-slider"
            />
            <div className="flex justify-between text-[10px] mt-2 font-mono" style={{ color: "#444" }}>
              <span>4_BITS</span><span>128_BITS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Checkbox label="Lowercase" checked={useLower} onChange={setUseLower} />
            <Checkbox label="Uppercase" checked={useUpper} onChange={setUseUpper} />
            <Checkbox label="Digits" checked={useDigits} onChange={setUseDigits} />
            <Checkbox label="Symbols" checked={useSymbols} onChange={setUseSymbols} />
          </div>

          <button
            className="btn forge-btn w-full py-4"
            onClick={generate}
            disabled={isSurging}
          >
            {isSurging ? "SURGING..." : "INITIATE SURGE"}
          </button>
        </div>
      </div>

      {password && (
        <div className="result-vault p-6 rounded-sm border-l-4 border-l-accent">
          <div className="flex items-center justify-between mb-4">
            <div className="label" style={{ color: "#555" }}>STREAMS_EXTRACTED</div>
            {strength && <span className={`badge ${strength.cls} px-3 py-1 uppercase text-[10px] font-bold`}>{strength.label}</span>}
          </div>

          <div className="flex items-center gap-4 p-4 bg-black border border-border rounded-sm mb-4 overflow-hidden relative group">
             <span className="font-mono text-lg flex-1 break-all select-all" style={{ color: "var(--accent-light)", textShadow: "0 0 10px var(--accent-glow)" }}>
              {password}
            </span>
            <button
              className="btn btn-ghost text-xs py-1 px-3 shrink-0 uppercase font-bold tracking-tighter"
              onClick={copy}
            >
              {copied ? "SYNCED" : "COPY"}
            </button>
            <div className="absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-500" style={{ width: `${strength?.pct || 0}%` }} />
          </div>

          <div className="h-1 bg-border overflow-hidden rounded-full">
            <div
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: `${strength?.pct || 0}%`,
                background: (strength?.pct || 0) === 100 ? "var(--success)" : (strength?.pct || 0) >= 75 ? "var(--accent)" : (strength?.pct || 0) >= 50 ? "var(--warning)" : "var(--danger)",
                boxShadow: `0 0 10px ${(strength?.pct || 0) === 100 ? 'var(--success)' : 'var(--accent)'}`
              }}
            />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
