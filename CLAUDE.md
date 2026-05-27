# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build (type-checks + compiles)
npm run lint     # Run ESLint
```

There is no test suite. TypeScript type-checking runs as part of `build`.

## Architecture

**MyDevTools** is a Next.js 16 (App Router) single-page developer toolbox — a collection of client-side utility tools with no backend.

### Routing
Each tool lives at `src/app/<tool-slug>/page.tsx`. All tool pages are `"use client"` components (pure browser-side logic, no server actions or API routes).

### Shared components
- `src/components/ToolLayout.tsx` — wrapper used by every tool page. Renders a back-link, title, description, and a `children` slot. Always wrap new tool pages in this.
- `src/components/Navbar.tsx` — top nav bar (brand/logo only; no tool links).
- `src/components/Sidebar.tsx` — left sidebar that renders the tool list from `src/config/tools.ts` with active-state highlighting via `usePathname`.

### Adding a new tool
1. Create `src/app/<slug>/page.tsx` as a `"use client"` component wrapping `<ToolLayout>`.
2. Add an entry to the `tools` array in **`src/config/tools.ts`** — this is the single source of truth used by both `Sidebar` and any other nav consumers. Do **not** add hardcoded tool lists elsewhere.

### Styling
Tailwind CSS v4 (with `@tailwindcss/postcss`). The design system is a dark "abyss" theme defined entirely in CSS custom properties in `src/app/globals.css`. Use these variables directly via `style={{ color: "var(--text)" }}` etc. — do not use Tailwind color utilities for theme colors.

Available CSS variables: `--bg`, `--bg-card`, `--bg-input`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-light`, `--accent-glow`, `--cyan`, `--cyan-glow`, `--pink`, `--pink-glow`, `--success`, `--danger`, `--warning`.

Reusable CSS classes defined in `globals.css`: `.btn`, `.btn-primary`, `.btn-ghost`, `.cyber-card`, `.label`, `.badge`, `.badge-success`, `.badge-danger`, `.badge-warning`, `.badge-accent`, `.glass-panel`.

Tool pages often embed additional `<style>` blocks with page-specific animations and component variants (see `uuid-generator/page.tsx` for an example of the pattern).

### Key dependencies
| Package | Purpose |
|---|---|
| `uuid` | UUID v4 generation |
| `crypto-js` | MD5, SHA-1, SHA-256, SHA-512 hashing |
| `jwt-decode` | JWT decoding |
| `js-yaml` | JSON ↔ YAML conversion |
| `cronstrue` | Human-readable cron descriptions |
| `date-fns` | Date formatting in timestamp tool |
