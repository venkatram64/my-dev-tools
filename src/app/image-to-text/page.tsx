"use client";
import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function ImageToText() {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Returns a data-URL with the image scaled 2× and inverted if the background
  // is dark (Tesseract accuracy degrades sharply on light-on-dark images).
  const preprocessImage = (src: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const SCALE = 2;
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth * SCALE;
        canvas.height = img.naturalHeight * SCALE;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Sample background brightness from a corner patch
        const patch = ctx.getImageData(0, 0, Math.min(40, canvas.width), Math.min(40, canvas.height));
        let sum = 0;
        for (let i = 0; i < patch.data.length; i += 4) {
          sum += 0.299 * patch.data[i] + 0.587 * patch.data[i + 1] + 0.114 * patch.data[i + 2];
        }
        const avgBrightness = sum / (patch.data.length / 4);
        const isDark = avgBrightness < 128;

        if (isDark) {
          // Invert colors so text becomes dark-on-light
          const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < id.data.length; i += 4) {
            id.data[i] = 255 - id.data[i];
            id.data[i + 1] = 255 - id.data[i + 1];
            id.data[i + 2] = 255 - id.data[i + 2];
          }
          ctx.putImageData(id, 0, 0);
        }

        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = src;
    });

  const processImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setText("Only image files are supported.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImage(objectUrl);
    setImageName(file.name);
    setText("");
    setStatus("loading");
    setProgress(0);

    try {
      // Preprocess: scale up 2×, invert if dark-bg, boost contrast
      const preprocessed = await preprocessImage(objectUrl);

      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      // PSM 6 = single uniform block of text — reduces character-level confusion
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (worker as any).setParameters({ tessedit_pageseg_mode: "6" });

      const { data } = await worker.recognize(preprocessed);
      await worker.terminate();

      setText(data.text.trim());
      setStatus("done");
    } catch {
      setStatus("error");
      setText("OCR failed. Please try a clearer image.");
    }
  }, []);

  const handleFile = (file: File) => processImage(file);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find((i) =>
      i.type.startsWith("image/")
    );
    if (item) {
      const file = item.getAsFile();
      if (file) handleFile(file);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => {
    setImage(null);
    setImageName("");
    setText("");
    setStatus("idle");
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <ToolLayout
      title="IMAGE → TEXT"
      description="Extract text from images using on-device OCR — no uploads, no servers."
    >
      <style>{`
        @keyframes scanPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ocr-panel {
          background: #050508;
          border: 1px solid #1a1a2e;
          border-left: 3px solid var(--accent);
          position: relative;
        }
        .drop-zone {
          border: 2px dashed #2a2a3e;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .drop-zone:hover, .drop-zone.active {
          border-color: var(--accent);
          background: rgba(124, 58, 237, 0.06);
        }
        .progress-bar {
          background: linear-gradient(90deg, var(--accent), var(--cyan), var(--accent));
          background-size: 200% 100%;
          animation: shimmer 1.5s linear infinite;
          transition: width 0.3s ease;
        }
        .scan-dot {
          animation: scanPulse 1.2s ease-in-out infinite;
        }
        .ocr-textarea {
          background: #000 !important;
          border: 1px solid #2a2a3e !important;
          color: #c0c0d8 !important;
          font-family: 'Courier New', monospace !important;
          font-size: 13px !important;
          line-height: 1.7 !important;
          resize: vertical !important;
          transition: border-color 0.2s ease;
        }
        .ocr-textarea:focus {
          outline: none;
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.3);
        }
        .result-enter {
          animation: slideUp 0.4s ease-out forwards;
        }
        .action-btn {
          font-size: 11px;
          letter-spacing: 0.08em;
          font-weight: 700;
          text-transform: uppercase;
          padding: 6px 16px;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .action-btn-primary {
          background: var(--accent);
          color: #fff;
          clip-path: polygon(0 0, 100% 0, 100% 65%, 92% 100%, 0 100%);
        }
        .action-btn-primary:hover {
          background: #8b5cf6;
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.5);
        }
        .action-btn-ghost {
          background: transparent;
          color: #666;
          border-color: #333;
        }
        .action-btn-ghost:hover {
          color: #fff;
          border-color: #666;
        }
        .img-preview {
          max-height: 280px;
          object-fit: contain;
          border: 1px solid #1a1a2e;
        }
        .status-bar {
          background: #05050a;
          border-top: 1px solid #1a1a2e;
        }
      `}</style>

      <div className="space-y-4" onPaste={handlePaste}>
        {/* Drop Zone */}
        <div
          className={`drop-zone ocr-panel rounded-sm p-8 flex flex-col items-center justify-center gap-3 text-center ${dragging ? "active" : ""}`}
          style={{ minHeight: 160 }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div style={{ fontSize: 36 }}>🖼️</div>
          <div>
            <p style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>
              Drop an image, click to browse, or paste from clipboard
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>
              PNG, JPG, BMP, TIFF, WEBP — processed entirely in your browser
            </p>
          </div>
        </div>

        {/* Image Preview + Status */}
        {image && (
          <div className="ocr-panel rounded-sm overflow-hidden result-enter">
            <div className="p-4 flex items-center justify-between gap-4" style={{ borderBottom: "1px solid #1a1a2e" }}>
              <div className="flex items-center gap-2">
                <span className="scan-dot" style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: status === "done" ? "var(--success)" : status === "error" ? "var(--danger)" : "var(--accent)" }} />
                <span style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "monospace" }}>
                  {imageName}
                </span>
              </div>
              <button className="action-btn action-btn-ghost rounded-sm" onClick={reset}>
                CLEAR
              </button>
            </div>

            <div className="p-4 flex justify-center" style={{ background: "#0a0a0f" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="uploaded" className="img-preview rounded-sm" />
            </div>

            {status === "loading" && (
              <div className="status-bar px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: "var(--text-muted)", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em" }}>
                    SCANNING... {progress}%
                  </span>
                </div>
                <div style={{ background: "#1a1a2e", height: 3, borderRadius: 2, overflow: "hidden" }}>
                  <div className="progress-bar" style={{ height: "100%", width: `${progress}%`, borderRadius: 2 }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Output */}
        {(status === "done" || status === "error") && (
          <div className="ocr-panel rounded-sm result-enter">
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #1a1a2e" }}>
              <span style={{ color: status === "error" ? "var(--danger)" : "var(--accent)", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", fontWeight: 700 }}>
                {status === "error" ? "// ERROR" : "// EXTRACTED TEXT"}
              </span>
              {status === "done" && text && (
                <div className="flex items-center gap-2">
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
                    {text.split(/\s+/).filter(Boolean).length} words · {text.length} chars
                  </span>
                  <button className="action-btn action-btn-primary rounded-sm" onClick={copyText}>
                    {copied ? "✓ COPIED" : "COPY"}
                  </button>
                </div>
              )}
            </div>
            <div className="p-4">
              <textarea
                className="ocr-textarea w-full rounded-sm p-4"
                style={{ minHeight: 220 }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
                placeholder="Extracted text will appear here"
              />
            </div>
          </div>
        )}

        {/* Hint when idle */}
        {status === "idle" && (
          <p style={{ color: "var(--text-muted)", fontSize: 12, textAlign: "center", fontFamily: "monospace" }}>
            Ctrl+V to paste an image directly from clipboard
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
