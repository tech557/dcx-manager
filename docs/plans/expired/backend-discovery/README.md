---
plan: backend-discovery
status: expired
version_context: v0.3.2
created: 2026-06-25
feeds-into: src-structure-refactor (P4-backend)
---

# Plan: Backend Discovery

## Goal

Produce a complete map of the current service layer, type contracts, and mock data structure. Identify exactly where a real backend could plug in today vs what would break. The output tells P4 exactly what to fix in the type layer and service files.

---

## Sprint Index

| Sprint | Title | Parallel? | Output |
|---|---|---|---|
| [BE-R1](./sprints/BE-R1-type-inventory.md) | Type + Mock Inventory | ✓ with BE-R2 | `output/BE-R1-type-inventory.md` |
| [BE-R2](./sprints/BE-R2-service-audit.md) | Service Layer Audit | ✓ with BE-R1 | `output/BE-R2-service-audit.md` |
| [BE-R3](./sprints/BE-R3-integration-gap.md) | Integration Gap Analysis | After BE-R1 + BE-R2 | `output/BE-R3-integration-gap.md` |

---

## Definition of Done

- [ ] `output/BE-R1-type-inventory.md` — every type in `api.ts` and `domain.ts`, classified and cross-referenced with mock data
- [ ] `output/BE-R2-service-audit.md` — every service function, its input/output types, whether it uses `any`, and what mock it calls
- [ ] `output/BE-R3-integration-gap.md` — what would break today if we swapped mock for real API, and the exact fix list P4 must implement
- [ ] No source code changed
