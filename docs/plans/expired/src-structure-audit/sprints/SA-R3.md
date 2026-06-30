---
sprint: SA-R3
plan: src-structure-audit
title: Structure Assessment & Decision Doc
status: not-started
depends-on: SA-R1
output: docs/plans/active/src-structure-audit/output/SA-R3-structure-assessment.md
assigned-to: Claude
---

# SA-R3 — Structure Assessment & Decision Doc

## Intent

Read the SA-R1 output (dependency graph + violations + scope analysis) and produce a written assessment of the five confusion zones. For each zone, present 2–3 options with trade-offs. This document is what the PO reviews and approves — no restructuring happens until PO signs off on a chosen option.

**Prerequisite:** `output/SA-R1-dependency-graph.md` must exist and be complete before this sprint starts.

---

## Input to Read

Before writing anything:
1. `docs/plans/active/src-structure-audit/output/SA-R1-dependency-graph.md` — the full dep graph and scope analysis
2. `docs/references/codebase-manifest.md` — current folder/file counts
3. `docs/agent-rules/core.md §8` — the L1–L9 layer placement rules
4. `docs/plans/active/src-structure-audit/README.md` — the five zones listed in the problem summary

Do not read session logs as input — only the output files.

---

## Five Zones to Assess

### Zone 1 — `src/components/` vs `src/ui/`

**Current state:** Both folders contain small UI primitives. `src/ui/` is supposed to be L1–L2 (glass primitives, motion, atoms). `src/components/` is L3 (shared non-builder). But in practice agents place things in either without a clear rule.

**SA-R1 data needed:** From the scope analysis — which `src/components/` files are truly shared vs builder-only?

**Options to evaluate:**
- A: Keep both folders, write a sharper boundary rule (L2 = stateless atoms with no domain knowledge, L3 = stateful or domain-aware shared components)
- B: Merge `src/ui/` into `src/components/primitives/` — one folder, clear subfolders
- C: Move builder-only components from `src/components/` into `src/builder/` — shrink `src/components/` to truly shared-only

For each option: what moves, what the import impact is (how many files change), and the risk level.

---

### Zone 2 — `src/components/forms/` (28 files)

**Current state:** All form components (date pickers, channel selectors, input fields, subtask form) live in `src/components/forms/` — but SA-R1 scope analysis will tell us whether any are used outside the builder.

**SA-R1 data needed:** Are any `src/components/forms/` files imported by `src/pages/`, `src/hooks/`, or `src/services/`? If not, they are de facto builder-specific.

**Options to evaluate:**
- A: If SA-R1 shows builder-only usage: move `src/components/forms/` to `src/builder/forms/`
- B: Keep location, add a comment block at the top of each file indicating builder-only scope
- C: Reorganize by domain (`src/components/forms/date/`, `forms/channel/` stays, but move to `src/builder/`)

For each option: import change count, risk, whether it resolves the confusion.

---

### Zone 3 — `src/builder/stage/views/` (25 files)

**Current state:** WeeklyView, KanbanView, DayGridCard, PhaseDropZone, timeline helpers, view hooks all live flat in one folder with no sub-grouping.

**SA-R1 data needed:** How many of the 25 files are unique to a single view (kanban-only, timeline-only) vs shared across views?

**Options to evaluate:**
- A: Sub-group by view type: `views/kanban/`, `views/timeline/`, `views/shared/`
- B: Extract hooks and helpers to a sibling `views-hooks/` folder, keep components flat
- C: Keep flat — 25 files is workable if the naming convention is clear (e.g. all kanban files prefixed `Kanban*`)

For each option: number of moves, import change impact, whether it reduces "scary folder" effect.

---

### Zone 4 — `src/builder/islands/EditorViewerIsland/` (16 files including TaskEditor/)

**Current state:** The largest island. Contains the editor panel, panel hook, active node hook, and a `TaskEditor/` sub-folder with 5 task-editing form files.

**SA-R1 data needed:** Does `TaskEditor/` import from `src/components/forms/`? Are the task editor forms reused anywhere else?

**Options to evaluate:**
- A: Keep as-is — 16 files in one island is large but structured (island + sub-folder)
- B: Move `TaskEditor/` forms to `src/components/forms/task/` if they are domain-generic
- C: Split EditorViewerIsland into two islands: `EditorViewerIsland` (panel chrome) + `TaskEditorIsland` (task content)

For each option: what the split gains vs costs, import changes required.

---

### Zone 5 — Large file violations (8+ files over 150 lines, some over 250)

**Current state:** Several files violate the 250-line hard cap from `docs/agent-rules/core.md §6`.

**SA-R1 data needed:** The large file index with actual `wc -l` counts.

For each file over 250 lines: propose a specific split. Format:

```markdown
#### src/actions/task.actions.ts (288 lines)
Current responsibility: All task CRUD, all task status mutations, validation logic
Proposed split:
  - task-crud.actions.ts — create, update, delete (~120 lines)
  - task-status.actions.ts — status transitions, validation (~100 lines)
  - task.actions.ts — re-exports only (~20 lines)
```

Files between 150–250 lines: flag only. No split required unless they are growing.

---

## What to Produce

### Decision doc structure

```markdown
# src/ Structure Assessment — v0.3.2
Date: YYYY-MM-DD
Based on: SA-R1 output (dependency-graph.md), codebase-manifest.md

## Summary

<3–4 sentences: overall picture, most urgent issues, what can wait>

## Zone 1 — src/components/ vs src/ui/
[findings from SA-R1 + options A/B/C with trade-offs]
**Recommended option:** [A|B|C]
**Risk:** [low|medium|high]
**Import changes if adopted:** ~N files

## Zone 2 — src/components/forms/
[same structure]

## Zone 3 — src/builder/stage/views/
[same structure]

## Zone 4 — EditorViewerIsland
[same structure]

## Zone 5 — Large file splits
[per-file split proposal for files over 250 lines]

## Prioritised action list

| Priority | Zone | Option chosen | Import changes | Risk |
|---|---|---|---|---|
| 1 | Zone 2 | Move forms/ to builder/ | ~18 files | low |
| 2 | Zone 5 | Split task.actions.ts | 0 (re-export) | low |
...

## What does NOT need to change

<list of things that look scary but are actually fine — PO needs to know what to leave alone>

## PO decision required

☐ Zone 1: approve option [A|B|C]
☐ Zone 2: approve option [A|B|C]
☐ Zone 3: approve option [A|B|C]
☐ Zone 4: approve option [A|B|C]
☐ Zone 5: confirm split list
☐ Approve creation of active plan: src-structure-refactor
```

---

## Acceptance Criteria

- [ ] `output/SA-R3-structure-assessment.md` exists with all five zones covered
- [ ] Every zone includes exactly 2–3 options with trade-offs and a recommendation
- [ ] Large file section lists every file over 250 lines with a proposed split
- [ ] A "what does NOT need to change" section exists (prevents over-engineering)
- [ ] A "PO decision required" checklist is the last section
- [ ] SA-R1 output was used as the primary input — no assumptions made that SA-R1 would have caught
- [ ] No source code changed
- [ ] Session log written at `docs/progress/sessions/<date>-<agent>/NN-SA-R3-assessment.md`
- [ ] Session log references the output file, does not duplicate zone analysis

---

## Session Log Instructions

Write your session log at:
```
docs/progress/sessions/<YYYY-MM-DD>-<agent>/NN-SA-R3-assessment.md
```

The log must include:
- Identity block
- Intent: one sentence
- Trigger: `SA-R3 sprint file, after SA-R1 completed`
- Input read: `output/SA-R1-dependency-graph.md`
- Files created: `docs/plans/active/src-structure-audit/output/SA-R3-structure-assessment.md — N lines`
- Gates: no source code changed: PASS
- Note any SA-R1 findings that were ambiguous or required judgment

---

## After This Sprint

Update `README.md` sprint table: SA-R3 → ✅ Complete.  
The plan then pauses for PO approval of the decision doc.  
Do not write SA-T1 (tool setup) or any refactoring sprint until PO checks the boxes in the decision doc.
