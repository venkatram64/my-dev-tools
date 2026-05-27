# Graph Report - ./src  (2026-05-26)

## Corpus Check
- Corpus is ~6,878 words - fits in a single context window. You may not need a graph.

## Summary
- 160 nodes · 162 edges · 24 communities (15 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Tool Implementation Logic|Tool Implementation Logic]]
- [[_COMMUNITY_TSConfig Options|TSConfig Options]]
- [[_COMMUNITY_Tool Index & Registry|Tool Index & Registry]]
- [[_COMMUNITY_Application Infrastructure|Application Infrastructure]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Production Dependencies|Production Dependencies]]
- [[_COMMUNITY_Text Case Tool|Text Case Tool]]
- [[_COMMUNITY_Claude Settings|Claude Settings]]
- [[_COMMUNITY_Hash Tool|Hash Tool]]
- [[_COMMUNITY_JWT Tool|JWT Tool]]
- [[_COMMUNITY_Project Scripts|Project Scripts]]
- [[_COMMUNITY_Regex Tool|Regex Tool]]
- [[_COMMUNITY_Landing Page|Landing Page]]
- [[_COMMUNITY_Cron Tool|Cron Tool]]
- [[_COMMUNITY_System Architecture|System Architecture]]
- [[_COMMUNITY_Shell Utilities|Shell Utilities]]
- [[_COMMUNITY_Shared Layout Elements|Shared Layout Elements]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]
- [[_COMMUNITY_Next.js Configuration|Next.js Configuration]]
- [[_COMMUNITY_PostCSS Configuration|PostCSS Configuration]]
- [[_COMMUNITY_Page Components|Page Components]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `ToolLayout` - 12 edges
3. `scripts` - 5 edges
4. `statusLine` - 4 edges
5. `decodeJWT()` - 3 edges
6. `JWTDecoder()` - 3 edges
7. `calcStrength()` - 3 edges
8. `PasswordGenerator()` - 3 edges
9. `paths` - 2 edges
10. `enabledPlugins` - 2 edges

## Surprising Connections (you probably didn't know these)
- `ToolLayout` --calls--> `Base64 Encoder Tool`  [EXTRACTED]
  src/components/ToolLayout.tsx → src/app/base64-encoder/page.tsx
- `ToolLayout` --calls--> `Character Counter Tool`  [EXTRACTED]
  src/components/ToolLayout.tsx → src/app/character-counter/page.tsx
- `ToolLayout` --calls--> `Cron Explainer Tool`  [EXTRACTED]
  src/components/ToolLayout.tsx → src/app/cron-explainer/page.tsx
- `ToolLayout` --calls--> `Hash Generator Tool`  [EXTRACTED]
  src/components/ToolLayout.tsx → src/app/hash-generator/page.tsx
- `ToolLayout` --calls--> `JSON Formatter Tool`  [EXTRACTED]
  src/components/ToolLayout.tsx → src/app/json-formatter/page.tsx

## Hyperedges (group relationships)
- **Tool Routing Pattern** — base64_page, char_count_page, cron_page, hash_page, json_fmt_page, json_yaml_page, jwt_page, pwd_gen_page, regex_page, case_conv_page, ts_conv_page, uuid_page [INFERRED 0.95]

## Communities (24 total, 9 thin omitted)

### Community 0 - "Tool Implementation Logic"
Cohesion: 0.10
Nodes (6): Props, ToolLayout(), INDENTS, calcStrength(), PasswordGenerator(), ZONES

### Community 1 - "TSConfig Options"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Tool Index & Registry"
Cohesion: 0.14
Nodes (16): Base64 Encoder Tool, Text Case Converter Tool, Character Counter Tool, Cron Explainer Tool, Hash Generator Tool, JSON Formatter Tool, JSON-YAML Converter Tool, JWT Decoder Tool (+8 more)

### Community 3 - "Application Infrastructure"
Cohesion: 0.18
Nodes (8): geistMono, geistSans, metadata, RootLayout(), Navbar(), tools, Tool, tools

### Community 4 - "Dev Dependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/crypto-js, @types/js-yaml, @types/node (+4 more)

### Community 5 - "Production Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, cronstrue, crypto-js, date-fns, js-yaml, jwt-decode, next, react (+2 more)

### Community 6 - "Text Case Tool"
Cohesion: 0.24
Nodes (5): CASES, toCamel(), toKebab(), toPascal(), toSnake()

### Community 7 - "Claude Settings"
Cohesion: 0.29
Nodes (6): enabledPlugins, commit-commands@claude-plugins-official, statusLine, command, padding, type

### Community 9 - "JWT Tool"
Cohesion: 0.70
Nodes (3): decodeJWT(), ExpiryStatus(), JWTDecoder()

### Community 10 - "Project Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 11 - "Regex Tool"
Cohesion: 0.40
Nodes (3): ALL_FLAGS, Flag, MatchResult

### Community 14 - "System Architecture"
Cohesion: 0.67
Nodes (3): Pure Client-Side Logic, CSS Custom Property Dark Theme, MyDevTools

## Knowledge Gaps
- **75 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Tool Index & Registry`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Production Dependencies` to `Tool Index & Registry`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Tool Implementation Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.09782608695652174 - nodes in this community are weakly interconnected._
- **Should `TSConfig Options` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Tool Index & Registry` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._