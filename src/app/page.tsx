"use client";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-56px)] flex items-center justify-center overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-bg-card/50 text-[10px] font-bold uppercase tracking-widest text-text-muted mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          System Operational
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight" style={{ color: "var(--text)" }}>
          Daily <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-light to-cyan">
            Developer Tools
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12" style={{ color: "var(--text-muted)" }}>
          A high-precision suite of utilities for the modern engineer.
          Fast, private, and surgically accurate — <span className="text-text">no sign-up, no telemetry</span>.
        </p>

        <div className="flex items-center justify-center gap-4">
          <div className="p-1 rounded-lg border border-border bg-bg-card/30 backdrop-blur-sm">
            <div className="flex items-center gap-6 px-6 py-3 text-xs font-mono uppercase tracking-widest text-text-muted">
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent" />
                Encrypted
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-cyan" />
                Client-Sided
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-pink" />
                Open Source
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
