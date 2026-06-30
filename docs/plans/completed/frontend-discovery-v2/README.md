---
plan: frontend-discovery-v2
status: completed
activated: 2026-06-26
version_context: v0.3.2
created: 2026-06-26
completed: 2026-06-27
prior-art: expired/frontend-discovery, expired/src-structure-audit
feeds-into: folder-structure-v2 (P2-components, P3-structure)
---

# Plan: Frontend Discovery v2

> ⚠️ SUPERSEDED by `folder-structure-v2` execution (P1-P6, 2026-06). Counts and
> structure here are PRE-refactor and must not be treated as live current-state
> truth. The FE/BE/UX final-discovery plans must re-discover against the live tree;
> see `docs/product/decisions/src-structure-decision.md` for current structure.

## Before starting — read prior art

Read before executing any sprint:
- `docs/plans/expired/frontend-discovery/output/` — FE-R1 component tree, FE-R2 state flow, FE-R3 duplication map
- `docs/plans/expired/src-structure-audit/output/` — SA-R1 dep graph, SA-R2 tool eval, SA-R3 structure assessment
- `docs/plans/expired/src-structure-refactor/plan/README.md` — which FE-R findings were adopted vs challenged

---

## Goal

Produce an up-to-date architectural picture of the frontend, using the new toolchain.
The expired discovery found 98 components, 131 useState, and 5 duplication groups — but that was before
P1 executed and before dep-cruiser and code-index existed. This plan produces the authoritative current-state.

Key questions:
- Which architectural boundary violations does dep-cruiser find today?
- Which components are over the 250-line cap?
- What does the code-index say about component relationships vs what the expired plan found manually?
- Which components are safe to extract (35 in expired plan) — is that number still accurate?

---

## Why v2 is needed

- code-index now exists: 131 components already indexed with props, child components, consumer maps
- dep-cruiser enforces 6 boundary rules — violations are now machine-detectable, not manually found
- ESLint v9 finds hook pattern issues precisely
- The expired plan found things manually; v2 runs scripts for reproducibility and precision

---

## Sprint Index

| Sprint | Title | Parallel? | Executor | Output |
|---|---|---|---|---|
| [FE2-R1](./sprints/FE2-R1-architecture-audit.md) | Architecture + Boundary Audit | ✓ with FE2-R2 | Codex / opencode | `output/FE2-R1-architecture.md` |
| [FE2-R2](./sprints/FE2-R2-state-hook-analysis.md) | State + Hook Pattern Analysis | ✓ with FE2-R1 | Codex / opencode | `output/FE2-R2-state-hooks.md` |
| [FE2-R3](./sprints/FE2-R3-refactorability.md) | Refactorability + Extraction Plan | After FE2-R1 + FE2-R2 | Codex / opencode | `output/FE2-R3-refactorability.md` |

---

## Definition of Done

- [x] `output/FE2-R1-architecture.md` — dep-cruiser violations, file size violations, component boundary map
- [x] `output/FE2-R2-state-hooks.md` — hook inventory, context overload findings, useState count
- [x] `output/FE2-R3-refactorability.md` — safe-to-extract list, context-locked list, extraction priority order
- [x] All findings produced by running scripts, not manual reading
- [x] No source code changed
