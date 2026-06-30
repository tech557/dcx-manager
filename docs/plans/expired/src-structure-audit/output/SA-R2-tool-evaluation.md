# SA-R2: Tool Evaluation

_Generated: 2026-06-25 | Sprint: SA-R2 | Research only — no tools installed_

---

## Section 1 — Scored Evaluation Table

Weighted scoring: each criterion is scored 1–3, multiplied by its weight.

| Tool | Vite+alias (×3) | Agent output (×3) | Rule enforce (×2) | Install (×1) | Health (×2) | Complements ts-morph (×2) | **Total /39** |
|---|---|---|---|---|---|---|---|
| madge | 2×3=6 | 3×3=9 | 1×2=2 | 3×1=3 | 1×2=2 | 2×2=4 | **26** |
| dependency-cruiser | 3×3=9 | 3×3=9 | 3×2=6 | 2×1=2 | 3×2=6 | 3×2=6 | **38** |
| skott | 2×3=6 | 2×3=6 | 1×2=2 | 3×1=3 | 2×2=4 | 2×2=4 | **25** |
| ts-morph (installed) | 3×3=9 | 3×3=9 | 1×2=2 | 3×1=3 | 3×2=6 | 1×2=2 | **31** |
| Rollup plugin visualizer | 3×3=9 | 1×3=3 | 1×2=2 | 2×1=2 | 3×2=6 | 2×2=4 | **26** |
| source-map-explorer | 3×3=9 | 2×3=6 | 1×2=2 | 3×1=3 | 2×2=4 | 2×2=4 | **28** |

---

## Section 2 — Per-Tool Notes

### madge
- v6.1.0, last release 2023 — effectively unmaintained (no releases in 2+ years)
- Handles `@/` aliases via `--ts-config tsconfig.json` flag but can miss nested path patterns
- Output is JSON or ASCII tree — clear for agents
- No rule engine: circular detection only
- Small install: 4 direct deps, no native modules

### dependency-cruiser
- v16.5.0, actively maintained (last release June 2025)
- Full tsconfig path resolution including `@/` aliases
- Rule engine is the standout feature: `forbidden` rules define import constraints that fail on CI
- Output: JSON, markdown, HTML, dot graph, `err` format (text violations)
- Medium-size install (~15 deps) but worth it for the rule engine
- Config file: `.dependency-cruiser.js` (generated via `npx depcruise --init`)
- Integrates as ESLint plugin or standalone CLI

### skott
- v0.35.0, last release 2025, ~2k GitHub stars
- Path alias support is partial — works if aliases are in `tsconfig.json` but may need manual override
- Detection-only: circulars, orphans, unused files — no custom rule enforcement
- Output: JSON + mermaid + optional web UI
- Small install, modern codebase

### ts-morph (already installed)
- v28.0.0, actively maintained (weekly releases), 10k+ GitHub stars
- Full TypeScript AST access — can answer any structural question but requires custom script
- No built-in rule enforcement — that gap is the main reason to add another tool
- Zero install cost (already in `devDependencies`)
- Best for deep ad-hoc analysis; weakest for CI-gate enforcement

### Rollup plugin visualizer
- v5.12.0, actively maintained, Vite-compatible
- Output is primarily interactive HTML treemap — not agent-readable
- Bundles visualizer, not code structure — answers "what's biggest in my bundle?" not "where should this file go?"
- Tiny install (Vite plugin)
- Correct tool for bundle audits, wrong tool for structure enforcement

### source-map-explorer
- v2.5.3, last release 2023, 7k stars
- Works on production bundle sourcemaps — no alias handling needed
- Output: JSON with file-size contributions per source module
- Different use case: bundle bloat, not import structure
- Lightweight install

---

## Section 3 — Recommendation

**Adopt:** `dependency-cruiser`
**Keep (already installed):** `ts-morph`
**Do not adopt:** madge (unmaintained, no rule engine), skott (no rule engine, immature), rollup-plugin-visualizer (bundle-domain, not structure), source-map-explorer (different use case)

**Rationale:** dependency-cruiser is the only tool in this evaluation that can enforce import rules in CI — it will catch the next `src/components/`→`src/builder/` import before it lands on `main`. It scored 38/39, far ahead of all alternatives, because it fills the one gap ts-morph cannot (rule enforcement) while producing agent-readable markdown output. ts-morph stays as the ad-hoc analysis tool (already installed, already proven in SA-R1). madge and skott overlap with ts-morph (circular detection) without adding enforcement; the bundle tools serve a different concern entirely.

**Next step:** Write sprint SA-T1 (Tool Setup) to `npm i -D dependency-cruiser`, generate `.dependency-cruiser.js`, and add the first two forbidden rules:
1. `no-ui-import-builder` — block `src/ui/`→`src/builder/`
2. `no-components-import-builder` — block `src/components/`→`src/builder/`
