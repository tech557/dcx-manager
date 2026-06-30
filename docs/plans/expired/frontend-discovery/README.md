---
plan: frontend-discovery
status: expired
version_context: v0.3.2
created: 2026-06-25
feeds-into: src-structure-refactor (P2-components, P3-structure)
---

# Plan: Frontend Discovery

## Goal

Produce a complete map of the frontend codebase: component tree, data/state flow, duplication hotspots, and hook dependencies. This data prevents P2 and P3 from breaking component dependencies that aren't obvious from the folder structure.

The critical question this plan answers: **if we move or split component X, exactly which other files break?**

---

## Sprint Index

| Sprint | Title | Parallel? | Output |
|---|---|---|---|
| [FE-R1](./sprints/FE-R1-component-tree.md) | Component Tree + Dependencies | ✓ with FE-R2 | `output/FE-R1-component-tree.md` |
| [FE-R2](./sprints/FE-R2-state-and-data-flow.md) | State + Data Flow Map | ✓ with FE-R1 | `output/FE-R2-state-flow.md` |
| [FE-R3](./sprints/FE-R3-duplication-map.md) | Duplication + Consolidation Map | After FE-R1 + FE-R2 | `output/FE-R3-duplication-map.md` |

---

## Definition of Done

- [ ] `output/FE-R1-component-tree.md` — full tree of which components render which, with file paths
- [ ] `output/FE-R2-state-flow.md` — which state lives where, which hooks are used by which components
- [ ] `output/FE-R3-duplication-map.md` — every case of duplicate or overlapping component logic, with consolidation recommendation
- [ ] No source code changed across all three sprints
