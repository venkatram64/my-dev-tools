import Link from "next/link";

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolLayout({ title, description, children }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="mb-10 flex flex-col gap-1">
        <Link
          href="/"
          className="text-[10px] font-bold uppercase tracking-widest transition-all hover:text-white mb-4 flex items-center gap-2 group"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Portal
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--text)" }}>
            {title}
          </h1>
          <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
        </div>
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
