---
plan: backend-discovery-v2
status: completed
completed: 2026-06-27
activated: 2026-06-26
version_context: v0.3.2
created: 2026-06-26
prior-art: expired/backend-discovery
feeds-into: folder-structure-v2 (P3-types, P4-backend)
---

# Plan: Backend Discovery v2

> ⚠️ SUPERSEDED by `folder-structure-v2` execution (P1-P6, 2026-06). Counts and
> structure here are PRE-refactor and must not be treated as live current-state
> truth. The FE/BE/UX final-discovery plans must re-discover against the live tree;
> see `docs/product/decisions/src-structure-decision.md` for current structure.

## Before starting — read prior art

Read before executing any sprint:
- `docs/plans/expired/backend-discovery/output/BE-R1-type-inventory.md` — pre-P1 type inventory
- `docs/plans/expired/backend-discovery/output/BE-R2-service-audit.md` — service layer pre-P1
- `docs/plans/expired/backend-discovery/output/BE-R3-integration-gap.md` — integration gap pre-P1
- `docs/plans/expired/src-structure-refactor/plan/README.md` — what P4 was planned to do

---

## Goal

Produce a current-state picture of the type system and service layer after P1.
The expired discovery found: 50% of domain.ts = exact duplicate of api.ts, 0 `any` in services,
8 services need localStorage → fetch swap, apiClient() seam exists but throws.
P1 was supposed to clean up domain.ts duplication. Verify what actually changed.

---

## Sprint Index

| Sprint | Title | Parallel? | Executor | Output |
|---|---|---|---|---|
| [BE2-R1](./sprints/BE2-R1-type-system.md) | Type System Health | ✓ with BE2-R2 | Codex / opencode | `output/BE2-R1-type-health.md` |
| [BE2-R2](./sprints/BE2-R2-service-audit.md) | Service Layer Readiness | ✓ with BE2-R1 | Codex / opencode | `output/BE2-R2-service-readiness.md` |
| [BE2-R3](./sprints/BE2-R3-integration-gap.md) | Integration Gap Report | After BE2-R1 + BE2-R2 | Codex / opencode | `output/BE2-R3-gap-report.md` |

---

## Definition of Done

- [x] `output/BE2-R1-type-health.md` — TypeScript strict errors, any-type count, api.ts/domain.ts duplication status
- [x] `output/BE2-R2-service-readiness.md` — service contract map, mock completeness, fetch seam status
- [x] `output/BE2-R3-gap-report.md` — exact list of what breaks if mock → real API today
- [x] All findings from running `npm run typecheck` and `npm run lint` — not manual reads
- [x] No source code changed
