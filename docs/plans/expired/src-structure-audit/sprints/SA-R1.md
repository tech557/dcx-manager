---
sprint: SA-R1
plan: src-structure-audit
title: Dependency Graph
status: not-started
parallel-with: SA-R2
output: docs/plans/active/src-structure-audit/output/SA-R1-dependency-graph.md
assigned-to: Claude or Codex (terminal required)
---

# SA-R1 — Dependency Graph

## Intent

Produce a folder-to-folder import matrix for `src/` so we can see which folders depend on which others, detect upward imports that violate the L1–L9 layer rule, and identify which `src/components/` files are truly shared vs builder-only.

**This sprint produces an output file, not just a log entry. See the output spec below.**

---

## Tools to Use

`ts-morph` is already installed (`^28.0.0`). `scripts/generate-code-index.ts` already uses it. Do not install new tools for this sprint — extend what exists or write a new script alongside it.

### Option A — Extend the existing script

`scripts/generate-code-index.ts` already walks all source files and tracks imports via ts-morph. Add a folder-matrix export to it.

### Option B — Write a focused script

Create `scripts/gen-dep-graph.ts` that only does the import matrix. Simpler scope. Run with:

```bash
npx tsx scripts/gen-dep-graph.ts > docs/plans/active/src-structure-audit/output/SA-R1-dependency-graph.md
```

Either approach is acceptable. Prefer Option B if the existing script is hard to extend cleanly.

---

## What to Produce

### Section 1 — Folder-to-folder import matrix

For every top-level `src/` folder (actions, brand, builder, components, hooks, mock, pages, queries, rules, services, store, telemetry, types, ui, utils), list which other folders it imports from.

Format:

```markdown
## Folder Import Matrix

| From ↓ imports From → | actions | brand | builder | components | hooks | pages | queries | rules | services | store | types | ui | utils |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| actions | — | | | | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ |
| builder | | | — | ✓ | ✓ | | ✓ | ✓ | | ✓ | ✓ | ✓ | ✓ |
| components | | | ? | — | | | | | | | ✓ | ✓ | |
...
```

Fill `✓` where an import exists, `—` for self, empty for no imports. `?` where you find an import that surprises you — flag it.

### Section 2 — Layer violations

List any file that imports **upward** in the L1–L9 hierarchy defined in `docs/agent-rules/core.md §8`:

```
L1  src/ui/surfaces/, src/ui/motion/
L2  src/ui/
L3  src/components/
L4  src/builder/cards/
L5  src/builder/cards/templates/
L6  src/builder/islands/BuilderIslandShell
L7  src/builder/islands/<Name>/
L8  src/builder/stage/
L9  src/pages/
```

Expected format:

```markdown
## Layer Violations

| File | Imports | Expected direction | Violation |
|---|---|---|---|
| src/ui/BuilderBg/BuilderBg.tsx | src/builder/... | L2 should not import L4+ | ⚠️ upward |
```

If no violations: write "No layer violations found."

### Section 3 — components/ scope analysis

For each file under `src/components/`, answer: is it imported by anything outside `src/builder/`?

```markdown
## src/components/ — Scope Analysis

| File | Imported by builder? | Imported outside builder? | Verdict |
|---|---|---|---|
| components/forms/date/DatePickerPopup.tsx | Yes | No | builder-only |
| components/auth/RouteGuard.tsx | No | Yes (pages/) | truly shared |
```

Verdict values: `builder-only`, `truly-shared`, `unused`.

### Section 4 — Large file index

List all files exceeding 150 lines with their actual line count (use `wc -l`, not estimates).

```markdown
## Files Exceeding 150 Lines

| File | Lines | Cap | Action needed |
|---|---|---|---|
| src/actions/task.actions.ts | 288 | 250 | must split |
| src/builder/stage/views/DayGridCard.tsx | 248 | 250 | watch |
```

---

## Acceptance Criteria

- [ ] `output/SA-R1-dependency-graph.md` exists with all four sections above
- [ ] Folder import matrix covers all 15 top-level `src/` folders
- [ ] Layer violations section lists every upward import found (or states "none found")
- [ ] `src/components/` scope analysis covers every file in that folder
- [ ] Large file index is built from actual `wc -l` output, not estimates
- [ ] No source code was changed
- [ ] Session log written at `docs/progress/sessions/<date>-<agent>/NN-SA-R1-dep-graph.md`
- [ ] Session log includes the path to the output file under "Files created"

---

## Session Log Instructions

Write your session log at:
```
docs/progress/sessions/<YYYY-MM-DD>-<agent>/NN-SA-R1-dep-graph.md
```

The log must include:
- Identity block (Agent / Model / Provider / Date)
- Intent: one sentence
- Trigger: `SA-R1 sprint file`
- Files created: `docs/plans/active/src-structure-audit/output/SA-R1-dependency-graph.md — N lines`
- Any script created: `scripts/gen-dep-graph.ts — N lines` (if written)
- Gates: typecheck PASS/FAIL, verify.sh PASS/FAIL, no source code changed: PASS
- Do **not** copy the matrix or analysis into the log — reference the output file path only

---

## Do Not

- Move any files
- Change any imports
- Interpret the findings or propose solutions — that is SA-R3's job
- Write analysis into the session log — write it to the output file
