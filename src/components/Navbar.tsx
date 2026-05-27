"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="glass-panel sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center h-14">
          <Link
            href="/"
            className="font-black text-sm uppercase tracking-[0.2em] transition-all hover:text-white"
            style={{ color: "var(--accent-light)" }}
          >
            MyDevTools <span className="text-[10px] font-normal opacity-50 ml-1">v1.0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
