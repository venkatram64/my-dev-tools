"use client";
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ToolLayout from "@/components/ToolLayout";

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(() => {
    setIsGenerating(true);
    const n = Math.min(Math.max(1, count), 100);

    // Simulate a "void forge" calculation delay for aesthetic effect
    setTimeout(() => {
      setUuids(Array.from({ length: n }, () => uuidv4()));
      setIsGenerating(false);
    }, 400);
  }, [count]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolLayout title="VOID FORGE" description="Siphoning unique identifiers from the digital abyss.">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .void-panel {
          background: #050508;
          border: 2px solid #1a1a2e;
          border-left: 4px solid var(--accent);
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
        }
        .void-panel::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                      linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
          z-index: 10;
        }
        .void-input {
          background: #000 !important;
          border: 1px solid #333 !important;
          color: #00f3ff !important;
          font-family: 'Courier New', monospace !important;
          text-shadow: 0 0 5px #00f3ff;
          transition: all 0.2s ease;
        }
        .void-input:focus {
          border-color: #00f3ff !important;
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.3) !important;
        }
        .void-btn {
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.1em;
          position: relative;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          background: var(--accent) !important;
          color: white !important;
          border: none !important;
          clip-path: polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%);
        }
        .void-btn:hover {
          background: #8b5cf6 !important;
          transform: translateY(-2px);
          box-shadow: 0 0 15px var(--accent);
        }
        .void-btn:active {
          transform: translateY(0);
        }
        .void-btn-ghost {
          color: #666 !important;
          border: 1px solid #333 !important;
          background: transparent !important;
          clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 0 100%);
        }
        .void-btn-ghost:hover {
          color: #fff !important;
          border-color: #666 !important;
        }
        .uuid-row {
          animation: slideUp 0.3s ease-out forwards;
          border-left: 2px solid #1a1a2e;
          transition: all 0.2s ease;
          background: rgba(10, 10, 15, 0.6) !important;
          border: none !important;
        }
        .uuid-row:hover {
          border-left-color: #00f3ff;
          background: rgba(0, 243, 255, 0.05) !important;
          transform: translateX(4px);
        }
        .uuid-text {
          font-family: 'Courier New', monospace !important;
          color: #a0a0b8 !important;
          transition: color 0.2s ease;
        }
        .uuid-row:hover .uuid-text {
          color: #00f3ff !important;
          text-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
        }
        .scanline {
          position: absolute;
          width: 100%;
          height: 2px;
          background: rgba(0, 243, 255, 0.1);
          animation: scanline 4s linear infinite;
          pointer-events: none;
          z-index: 11;
        }
        .generating-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          backdrop-filter: blur(2px);
          color: #00f3ff;
          font-family: monospace;
          letter-spacing: 0.2em;
          animation: glitch 0.2s infinite;
        }
      `}</style>

      <div className="void-panel p-6 mb-6">
        <div className="scanline" />

        {isGenerating && (
          <div className="generating-overlay">
            Siphoning Abyss...
          </div>
        )}

        <div className="flex flex-wrap items-end gap-6">
          <div className="relative">
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>C-S-Y-S_QUANTITY</div>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="void-input w-24 py-2"
            />
          </div>

          <button className="void-btn px-8 py-2" onClick={generate}>
            Forge UUIDs
          </button>

          {uuids.length > 1 && (
            <button className="void-btn-ghost btn void-btn-ghost px-4 py-2 text-xs" onClick={copyAll}>
              {copied === "all" ? "SYNCED" : "EXTRACT ALL"}
            </button>
          )}
        </div>
      </div>

      <div className="void-panel p-4 space-y-2">
        {uuids.map((id, i) => (
          <div
            key={`${id}-${i}`}
            className="uuid-row flex items-center justify-between gap-3 px-4 py-3 rounded-sm"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="uuid-text text-sm flex-1 select-all font-mono">
              {id}
            </span>
            <button
              className="btn-ghost void-btn-ghost btn text-xs py-1 px-3"
              onClick={() => copy(id)}
            >
              {copied === id ? "✓" : "COPY"}
            </button>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
