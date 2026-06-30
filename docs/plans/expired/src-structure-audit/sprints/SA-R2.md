---
sprint: SA-R2
plan: src-structure-audit
title: Tool Evaluation
status: not-started
parallel-with: SA-R1
output: docs/plans/active/src-structure-audit/output/SA-R2-tool-evaluation.md
assigned-to: Claude (no terminal required — research only)
---

# SA-R2 — Tool Evaluation

## Intent

Evaluate 5–6 code-analysis tools and produce a scored recommendation. The goal is to pick 1–2 tools to adopt for ongoing structure enforcement so future agents don't have to re-discover the codebase layout every session.

**This sprint is research-only. No tool is installed. No npm commands run.**  
Findings go in the output file, not in the session log.

---

## Tools to Evaluate

### 1. madge
- **What:** Circular dependency detection + ASCII/JSON dep graphs. Reads `require`/`import` statically.
- **Repo:** github.com/pahen/madge
- **Key question:** Does it handle Vite path aliases (`@/`) via tsconfig?

### 2. dependency-cruiser
- **What:** Configurable import rule enforcer. You write rules like "nothing in `src/ui` may import from `src/builder`" and it reports violations in CI.
- **Repo:** github.com/sverweij/dependency-cruiser
- **Key question:** Does it integrate with Vite/tsconfig alias resolution? Can output be markdown?

### 3. skott
- **What:** Modern TypeScript-native dep graph. Built-in circular detection, JSON/HTML output.
- **Repo:** github.com/antoine-coulon/skott
- **Key question:** Newer tool — is it maintained? Does it understand path aliases?

### 4. ts-morph (already installed)
- **What:** Full TypeScript AST access. Already used in `scripts/generate-code-index.ts`. Can find all exports, count imports, detect unused exports.
- **Key question:** Can it also enforce import rules, or is it analysis-only?

### 5. Rollup Plugin Visualizer
- **What:** Generates an interactive HTML treemap of bundle size by source folder. Vite-compatible.
- **Repo:** github.com/btd/rollup-plugin-visualizer
- **Key question:** Useful for bundle audit, but does it help agents understand source structure?

### 6. source-map-explorer
- **What:** Analyses production bundle sourcemaps to show which source files contribute most to bundle size.
- **Key question:** Useful for a different concern (bundle bloat) — evaluate separately from dependency structure tools.

---

## Evaluation Criteria

Score each tool 1–3 on each criterion. Add a total.

| Criterion | Weight | Description |
|---|---|---|
| Vite + alias support | 3 | Works with `@/` path aliases from `tsconfig.json` without manual config |
| Agent-readable output | 3 | Produces markdown, JSON, or text — not just interactive HTML |
| Rule enforcement | 2 | Can define "folder A must not import from folder B" and fail on violation |
| Install cost | 1 | Small package, few transitive deps |
| Maintenance health | 2 | Active releases within last 6 months, no abandoned status |
| Complements ts-morph | 2 | Fills a gap ts-morph doesn't cover, rather than overlapping |

---

## What to Produce

### Section 1 — Scored evaluation table

```markdown
## Tool Scores

| Tool | Vite+alias (×3) | Agent output (×3) | Rule enforce (×2) | Install (×1) | Health (×2) | Complements ts-morph (×2) | Total /39 |
|---|---|---|---|---|---|---|---|
| madge | 2×3=6 | 3×3=9 | 1×2=2 | 3×1=3 | 2×2=4 | 2×2=4 | 28 |
| dependency-cruiser | ... | | | | | | |
...
```

### Section 2 — Per-tool notes (max 5 bullet points each)

Brief factual notes — version, key config file, known limitations with Vite/aliases, last release date. No marketing language.

### Section 3 — Recommendation

State which 1–2 tools to adopt and why. Format:

```markdown
## Recommendation

**Adopt:** <tool name(s)>
**Do not adopt:** <remaining tools with one-line reason each>

Rationale: <3–5 sentences — what gap each adopted tool fills, why the others were rejected>

Next step: If adopted, write a sprint SA-T1 (Tool Setup) to install and configure.
```

---

## Acceptance Criteria

- [ ] `output/SA-R2-tool-evaluation.md` exists with all three sections
- [ ] All 6 tools are evaluated (even if just to rule them out)
- [ ] Scores are based on stated criteria — no unjustified scores
- [ ] Recommendation names exactly 1 or 2 tools to adopt
- [ ] No tool was installed or npm commands run
- [ ] No source code changed
- [ ] Session log written at `docs/progress/sessions/<date>-<agent>/NN-SA-R2-tool-eval.md`
- [ ] Session log references the output file path, does not duplicate the evaluation table

---

## Session Log Instructions

Write your session log at:
```
docs/progress/sessions/<YYYY-MM-DD>-<agent>/NN-SA-R2-tool-eval.md
```

The log must include:
- Identity block
- Intent: one sentence
- Trigger: `SA-R2 sprint file`
- Files created: `docs/plans/active/src-structure-audit/output/SA-R2-tool-evaluation.md — N lines`
- Gates: no source code changed: PASS, no packages installed: PASS
- Do **not** copy the evaluation table into the log

---

## Do Not

- Install any npm packages
- Run any terminal commands
- Benchmark tools by actually running them (that belongs in a future SA-T1 sprint)
- Write the evaluation into the session log
