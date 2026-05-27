"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools } from "@/config/tools";

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside
      className="w-64 h-screen sticky top-0 flex flex-col border-r transition-all"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)"
      }}
    >
      <div className="p-6 flex flex-col gap-8 h-full">
        <nav className="flex flex-col gap-1 overflow-y-auto">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 px-3 opacity-50" style={{ color: "var(--text)" }}>
            Toolbox
          </p>
          {tools.map((t) => {
            const isActive = path === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="group relative px-3 py-2 rounded-sm text-xs font-medium transition-all duration-200"
                style={{
                  background: isActive ? "var(--accent-glow)" : "transparent",
                  color: isActive ? "var(--text)" : "var(--text-muted)",
                }}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-full" />
                )}
                <span className={`transition-colors ${isActive ? "text-white" : "group-hover:text-white"}`}>
                  {t.label}
                </span>
              </Link>
            );
          })}
        </nav>

      </div>
    </aside>
  );
}
