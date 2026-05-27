"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function decodeJWT(token: string): { header: unknown; payload: unknown; error?: string } {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT: expected 3 parts separated by dots.");
    const decode = (s: string) => JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/")));
    return { header: decode(parts[0]), payload: decode(parts[1]) };
  } catch (e: unknown) {
    return { header: null, payload: null, error: (e as Error).message };
  }
}

function ExpiryStatus({ exp }: { exp: unknown }) {
  if (typeof exp !== "number") return null;
  const now = Math.floor(Date.now() / 1000);
  const expired = exp < now;
  const diff = Math.abs(exp - now);
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const label = expired
    ? `EXPIRATION_DETECTED: ${days}d ${hours}h ago`
    : `VALID_UNTIL: ${days}d ${hours}h`;
  return (
    <span className={`badge ${expired ? "badge-danger" : "badge-success"} px-3 py-1 text-[10px] font-mono uppercase tracking-tighter`}>
      {label}
    </span>
  );
}

export default function JWTDecoder() {
  const [token, setToken] = useState("");
  const result = token.trim() ? decodeJWT(token) : null;

  const JSONBlock = ({ data, title }: { data: unknown; title: string }) => (
    <div className="sentry-block p-4 rounded-sm border border-border bg-black/40 flex flex-col gap-3">
      <div className="label" style={{ color: "#555", fontSize: "10px" }}>{title}</div>
      <pre
        className="font-mono text-xs leading-5 overflow-auto"
        style={{ color: "var(--accent-light)", maxHeight: "240px" }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );

  const payload = result?.payload as Record<string, unknown> | null;

  return (
    <ToolLayout title="SENTRY DECRYPTOR" description="Intercepting and analyzing secure identity tokens.">
      <style>{`
        .sentry-panel {
          background: #08080f;
          border: 1px solid #1a1a2e;
          border-top: 4px solid var(--accent);
        }
        .token-input {
          background: #000 !important;
          color: #00f3ff !important;
          font-family: 'Courier New', monospace !important;
          border: 1px solid #1a1a2e !important;
          box-shadow: inset 0 0 15px rgba(0, 243, 255, 0.05);
        }
        .token-input:focus {
          border-color: #00f3ff !important;
        }
        .sentry-block {
          transition: all 0.2s ease;
        }
        .sentry-block:hover {
          border-color: var(--accent) !important;
          background: rgba(124, 58, 237, 0.05) !important;
        }
      `}</style>

      <div className="sentry-panel p-6 rounded-sm mb-6">
        <div className="label" style={{ color: "#555", fontSize: "10px" }}>ENCRYPTED_TOKEN_STREAM</div>
        <textarea
          rows={4}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="PASTE JWT TOKEN..."
          className="token-input w-full p-4 mt-2 rounded-sm outline-none"
        />
        {result?.error && (
          <div className="mt-4 text-[10px] p-3 rounded-sm bg-red-900/20 text-red-400 border border-red-900/50 font-mono">
            DECRYPTION_FAILURE: {result.error}
          </div>
        )}
      </div>

      {result && !result.error && (
        <div className="space-y-6">
          {payload?.exp !== undefined && (
            <div className="flex items-center gap-4 p-4 bg-black border border-border rounded-sm">
              <ExpiryStatus exp={payload.exp} />
              <div className="flex flex-col gap-1">
                {typeof payload.iat === "number" && (
                  <span className="text-[10px] font-mono text-muted">
                    IAT: {new Date(payload.iat * 1000).toISOString()}
                  </span>
                )}
                {typeof payload.exp === "number" && (
                  <span className="text-[10px] font-mono text-muted">
                    EXP: {new Date(payload.exp * 1000).toISOString()}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <JSONBlock data={result.header} title="HEADER_METADATA" />
            <JSONBlock data={result.payload} title="CLAIM_PAYLOAD" />
          </div>

          <div className="p-4 rounded-sm border border-border bg-black/20">
            <div className="label" style={{ color: "#555", fontSize: "10px" }}>SIGNATURE_SATELLITE</div>
            <p className="text-[10px] font-mono text-muted leading-relaxed">
              SENTRY_PROTOCOL: Only decoding header and payload. Cryptographic signature verification requires server-side keys.
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
