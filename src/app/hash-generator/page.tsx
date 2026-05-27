"use client";
import { useState } from "react";
import CryptoJS from "crypto-js";
import ToolLayout from "@/components/ToolLayout";

const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

function hash(text: string, algo: Algo): string {
  switch (algo) {
    case "MD5":    return CryptoJS.MD5(text).toString();
    case "SHA-1":  return CryptoJS.SHA1(text).toString();
    case "SHA-256":return CryptoJS.SHA256(text).toString();
    case "SHA-512":return CryptoJS.SHA512(text).toString();
  }
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolLayout title="CIPHER STATION" description="Generating high-integrity cryptographic digests.">
      <style>{`
        .cipher-panel {
          background: #0a0a0f;
          border: 1px solid #1a1a2e;
          position: relative;
        }
        .signal-buffer {
          background: #000 !important;
          color: #00ffaa !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a2e !important;
          transition: all 0.3s ease;
          box-shadow: inset 0 0 15px rgba(0, 255, 170, 0.05);
        }
        .signal-buffer:focus {
          border-color: #00ffaa !important;
          box-shadow: 0 0 10px rgba(0, 255, 170, 0.2) !important;
        }
        .hash-packet {
          background: #0d0d16 !important;
          border: 1px solid #1a1a2e !important;
          transition: all 0.2s ease;
          animation: fadeIn 0.3s ease-out forwards;
        }
        .hash-packet:hover {
          border-color: #333 !important;
          transform: translateX(4px);
          background: #11111d !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cipher-badge {
          font-family: 'Courier New', monospace;
          background: #00ffaa22 !important;
          color: #00ffaa !important;
          border: 1px solid #00ffaa44 !important;
          text-transform: uppercase;
          font-size: 10px;
        }
        .copy-btn {
          text-transform: uppercase;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.1em;
        }
      `}</style>

      <div className="cipher-panel p-6 mb-6 rounded-sm border-t-4 border-t-accent">
        <div className="label" style={{ color: "#555", fontSize: "10px" }}>SIGNAL_INPUT_BUFFER</div>
        <textarea
          rows={4}
          placeholder="INPUT RAW DATA FOR HASHING..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="signal-buffer w-full p-4 mt-2 rounded-sm outline-none"
        />
      </div>

      <div className="space-y-4">
        {ALGOS.map((algo, i) => {
          const result = input ? hash(input, algo) : "";
          return (
            <div
              key={algo}
              className="hash-packet p-4 rounded-sm flex flex-col gap-3"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="cipher-badge badge px-2 py-0.5">{algo}</span>
                <button
                  className="btn btn-ghost copy-btn px-3 py-1"
                  onClick={() => copy(result, algo)}
                  disabled={!result}
                >
                  {copied === algo ? "SYNCED" : "COPY"}
                </button>
              </div>
              <div
                className="px-3 py-2 rounded-sm font-mono text-xs break-all select-all min-h-[32px] flex items-center"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  color: result ? "var(--text)" : "#444",
                  border: "1px solid #1a1a2e",
                  textShadow: result ? "0 0 5px rgba(255,255,255,0.1)" : "none"
                }}
              >
                {result || "AWAITING SIGNAL..."}
              </div>
            </div>
          );
        })}
      </div>
    </ToolLayout>
  );
}
