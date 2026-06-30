---
plan: src-structure-audit
status: expired
version_context: v0.3.2
created: 2026-06-25
sprints: [SA-R1, SA-R2, SA-R3]
---

# Plan: src/ Structure Audit

**Status:** Active

> "The folder structure inside src is so scary for a simple tool" — PO, 2026-06-25

---

## Sprint Status

| Sprint | Title | Status | Output file |
|---|---|---|---|
| SA-R1 | Dependency Graph | ✅ Complete | `output/SA-R1-dependency-graph.md` |
| SA-R2 | Tool Evaluation | ✅ Complete | `output/SA-R2-tool-evaluation.md` |
| SA-R3 | Structure Assessment | ✅ Complete | `output/SA-R3-structure-assessment.md` |

SA-R1 and SA-R2 run in parallel. SA-R3 requires SA-R1 output first.

---

## Output Convention — READ THIS BEFORE STARTING ANY SPRINT

Every sprint produces **two separate records**:

### 1. Sprint output → plan folder (primary artifact)

```
docs/plans/active/src-structure-audit/output/<sprint-id>-<name>.md
```

This is the **analysis result** — the actual dependency graph, tool scorecard, or decision doc. It must exist and be complete before the sprint can be marked done. It travels with the plan when the plan moves to `completed/`.

### 2. Session log → progress folder (execution record)

```
docs/progress/sessions/<YYYY-MM-DD>-<agent>/NN-<sprint-id>-<name>.md
```

This follows the standard log format from `docs/agent-rules/log-format.md`. It records what the agent ran, any errors hit, gates checked. It **references** the output file — it does not duplicate its content.

**A sprint is NOT complete if its analysis only exists inside the session log.**  
**A sprint IS complete when the output file exists at the path above AND the session log references it.**

---

## Problem Summary

305 source files, 15 top-level folders. Key confusion zones:

| Zone | Files | Problem |
|---|---|---|
| `src/components/` vs `src/ui/` | 46 + 13 | Overlapping roles — both have small UI atoms |
| `src/components/forms/` | 28 | Entirely builder-specific; living outside `src/builder/` |
| `src/builder/stage/views/` | 25 | Largest single folder; no sub-grouping by view type |
| `src/builder/islands/EditorViewerIsland/` | 16 | TaskEditor sub-folder has unclear ownership |
| Large file violations | 8+ files | task.actions.ts (288 lines), ReadinessCheckModal.tsx (282 lines) over the 250-line cap |

---

## Constraints

- No file moves, no import changes, no `tsconfig` edits during this plan
- No code changes of any kind — read-only research only
- All findings go in `output/` — not in session logs, not in AGENTS.md
- SA-R3 produces a decision doc — PO must approve it before any restructuring plan is written
