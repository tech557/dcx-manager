# Plan Audit: ux-discovery-v2
Date: 2026-06-26 | Auditor: Claude Code

---

## Verdict: CONDITIONAL — Fix 1 broken path before activating

The plan is structurally sound and nearly ready to hand to opencode. One broken file reference must be corrected first. Everything else checks out.

---

## What was checked

| Item | Status |
|---|---|
| README.md — goal, sprint index, DoD | PASS |
| UX2-R1 sprint file | PASS (with 1 broken ref) |
| UX2-R2 sprint file | PASS |
| UX2-R3 sprint file | PASS |
| Prior-art files referenced by sprints | PASS (all exist) |
| Scripts referenced by sprints | PASS |
| package.json scripts referenced | PASS |
| output/ directory pre-created | PASS (empty, correct) |
| version_context matches VERSION.md | PASS |

---

## Issue 1 — BLOCKER: Broken path reference in UX2-R1

**Sprint:** UX2-R1 (`sprints/UX2-R1-token-verification.md`, Context section)

**What the sprint says:**
```
docs/plans/expired/src-structure-refactor/output/P1-design-tokens-output.md
```

**Actual file location:**
```
docs/plans/expired/src-structure-refactor/plan/output/P1-design-tokens-output.md
```

The path is missing the `plan/` segment. An executor following instructions verbatim will fail to find this file and may either halt or fabricate context.

**Fix:** Change the reference in UX2-R1 Context section:

Old:
```
Read `docs/plans/expired/src-structure-refactor/output/P1-design-tokens-output.md`
```

New:
```
Read `docs/plans/expired/src-structure-refactor/plan/output/P1-design-tokens-output.md`
```

---

## Findings — no blockers

### Prior-art files

All three files referenced in the README "Before starting" section exist:
- `docs/plans/expired/ui-ux-discovery/output/UX-R1-token-inventory.md` — exists
- `docs/plans/expired/ui-ux-discovery/output/UX-R2-component-css-map.md` — exists
- `docs/plans/expired/ui-ux-discovery/output/UX-R3-style-synthesis.md` — exists

UX2-R3 references `docs/plans/expired/src-structure-refactor/plan/README.md` — the README exists in the `plan/` subdirectory.

### Scripts

All scripts invoked by the sprints exist under `scripts/agent/`:
- `build-current-state.sh` — exists
- `verify-tooling-state.sh` — exists
- `code-query.sh hardcoded-tokens` — mode confirmed in script
- `code-query.sh duplicate-controls` — mode confirmed in script

### package.json scripts

`npm run lint` is defined. No sprint invokes any missing npm script.

### Sprint dependency chain

UX2-R1 and UX2-R2 are marked `parallel-with` each other. UX2-R3 requires both outputs. The README sprint index correctly documents this. UX2-R3 will halt if R1 or R2 outputs are absent — this is intentional and correct behavior, not a defect.

### Output directory

`docs/plans/drafted/ux-discovery-v2/output/` exists (empty). The sprints write to relative paths `output/UX2-R*.md` which resolves correctly from that directory if the executor treats the plan root as CWD. No path ambiguity for R1/R2; R3 reads the R1/R2 outputs from the same `output/` directory which is correct.

### Version context

`version_context: v0.3.2` in README.md matches `current: v0.3.2` in `docs/VERSION.md`. No staleness.

### No-source-change constraint

All three sprints have explicit "No source files changed" acceptance criteria. No sprint step writes to `src/`. The constraint is consistently enforced across R1, R2, and R3.

### Toolchain assumptions

The plan justifies its existence by referencing ESLint v9, `code-query.sh hardcoded-tokens`, and dep-cruiser. All three are confirmed present in `package.json` devDependencies or `scripts/agent/`. The plan's stated rationale for superseding v1 is valid.

---

## Summary of required changes before activation

| # | File | Change |
|---|---|---|
| 1 | `sprints/UX2-R1-token-verification.md` | Fix broken path: add `plan/` segment to `src-structure-refactor/output/P1-design-tokens-output.md` |

One file, one line edit. After that fix, the plan is ready to activate and hand to opencode.
