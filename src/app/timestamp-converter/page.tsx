"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const ZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Kolkata",
  "Australia/Sydney",
];

function formatInZone(ts: number, tz: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric", month: "short", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false, timeZoneName: "short",
    }).format(new Date(ts * 1000));
  } catch {
    return "—";
  }
}

export default function TimestampConverter() {
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [tsResult, setTsResult] = useState<number | null>(null);
  const [dateResult, setDateResult] = useState<number | null>(null);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");

  const nowTs = () => setTsInput(String(Math.floor(Date.now() / 1000)));

  const convertTs = () => {
    setError1("");
    const n = Number(tsInput.trim());
    if (isNaN(n)) { setError1("Invalid numeric sequence."); return; }
    const ms = String(tsInput.trim()).length >= 13 ? n : n * 1000;
    setTsResult(Math.floor(ms / 1000));
  };

  const convertDate = () => {
    setError2("");
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) { setError2("Invalid temporal sequence."); return; }
    setDateResult(Math.floor(d.getTime() / 1000));
  };

  const copy = (v: string) => navigator.clipboard.writeText(v);

  return (
    <ToolLayout title="CHRONOS ENGINE" description="Mapping temporal coordinates across divergent global zones.">
      <style>{`
        .chronos-panel {
          background: #0a0a1a;
          border: 1px solid #1a1a3e;
          border-top: 4px solid var(--accent);
        }
        .chronos-input {
          background: #000 !important;
          color: #a0a0ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a3e !important;
        }
        .zone-row {
          background: rgba(0,0,0,0.4) !important;
          border: 1px solid #1a1a3e !important;
          transition: all 0.2s ease;
        }
        .zone-row:hover {
          border-color: var(--accent) !important;
          background: rgba(124, 58, 237, 0.05) !important;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div className="chronos-panel p-6 rounded-sm space-y-4">
          <div className="label" style={{ color: "#555", fontSize: "10px" }}>UNIX_TIMESTAMP → TEMPORAL_DATE</div>
          <div className="flex gap-2">
            <input type="text" value={tsInput} onChange={(e) => setTsInput(e.target.value)} placeholder="e.g. 1716844800" className="chronos-input flex-1 p-2 rounded-sm outline-none" />
            <button className="btn btn-ghost text-xs px-3 font-mono" onClick={nowTs}>SAMP_NOW</button>
          </div>
          {error1 && <div className="text-[10px] text-danger font-mono">CORE_ERROR: {error1}</div>}
          <button className="btn btn-primary w-full py-3 uppercase font-bold tracking-widest text-xs" onClick={convertTs}>CALIBRATE</button>

          {tsResult !== null && (
            <div className="space-y-2 pt-4">
              {ZONES.map((tz) => (
                <div key={tz} className="zone-row flex items-center justify-between gap-2 px-3 py-2 rounded-sm text-xs font-mono">
                  <span style={{ color: "#555" }} className="w-32 shrink-0">{tz}</span>
                  <span className="flex-1 text-right" style={{ color: "var(--text)" }}>{formatInZone(tsResult, tz)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chronos-panel p-6 rounded-sm space-y-4">
          <div className="label" style={{ color: "#555", fontSize: "10px" }}>TEMPORAL_DATE → UNIX_TIMESTAMP</div>
          <input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder="e.g. 2024-05-28T12:00:00Z"
            className="chronos-input w-full p-2 rounded-sm outline-none"
          />
          {error2 && <div className="text-[10px] text-danger font-mono">CORE_ERROR: {error2}</div>}
          <button className="btn btn-primary w-full py-3 uppercase font-bold tracking-widest text-xs" onClick={convertDate}>CALIBRATE</button>

          {dateResult !== null && (
            <div className="space-y-2 pt-4">
              {(["seconds", "milliseconds"] as const).map((unit) => {
                const val = unit === "seconds" ? String(dateResult) : String(dateResult * 1000);
                return (
                  <div key={unit} className="zone-row flex items-center justify-between gap-2 px-3 py-2 rounded-sm text-xs font-mono">
                    <span style={{ color: "#555" }}>{unit === "seconds" ? "S_PRECISION" : "MS_PRECISION"}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-accent-light">{val}</span>
                      <button className="btn btn-ghost text-[10px] py-0.5 px-2" onClick={() => copy(val)}>COPY</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
