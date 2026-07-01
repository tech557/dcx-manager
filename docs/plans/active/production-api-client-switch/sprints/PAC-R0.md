---
sprint: PAC-R0
plan: production-api-client-switch
title: Prerequisites, PO confirmations & switch architecture
family: planning / governance
executor: Claude / Codex
required-tools: bash scripts, Supabase MCP (read-only), git
depends-on: backend-discovery-v3 readiness gate = READY
allowed-writes: docs/backend/switch/**, docs/plans/active/production-api-client-switch/**, output/PAC-R0-*.md
forbidden-writes: src/**, any Supabase apply/execute, .github/workflows/**
status: Completed
Status: Completed
---

# PAC-R0 — Prerequisites, PO confirmations & switch architecture

Confirm the discovery dataset is READY, capture the PO's product-model confirmations, queue the requirement
intake, and record the switch architecture — before any schema is applied or code is written.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-GOV-TRACE-001-BACKEND` (anchor); **queues** `REQ-BE-API-*`, `REQ-BE-AUTH-*`, `REQ-BE-SCHEMA-*` intake for PO sign-off |
| Scope/type | planning / governance (no product behavior) |
| Acceptance outcomes | AC-PAC-0-1 … AC-PAC-0-5 |
| Actual manifestations | `docs/backend/**` discovery dataset; `src/services/mock-dispatch.ts` |
| Gate result | `req:validate` PASS expected (docs-only) |

## Intent
Establish that the plan can legally proceed (discovery READY, requirements queued, PO confirmations recorded)
and fix the switch strategy so R1–R6 execute against a decided architecture.

> **Sole first-activatable sprint (audit advisory #3 + blocking #1).** PAC-R0 is the **only** sprint the PO may
> activate initially. PAC-R1..R6 carry a hard ID-lock gate (their `REQ-BE-*` traces are placeholders); they
> become executable only after PAC-R0's intake yields **PO-signed `REQ-BE-*` IDs** and the 4 product-model
> points are confirmed. PAC-R0 produces both, then the PO activates the rest.

## Step 0 — Session environment + carry-forward (MANDATORY)
1. `bash scripts/agent/build-current-state.sh`; read the plan README + backend-discovery-v3 `readiness-scorecard.md`.
2. Read `docs/backend/endpoint-integration-overview.md` (the endpoint→feature map).

## Scope — in
- **Verify readiness prerequisite:** confirm `backend-discovery-v3` gate = READY (all G1–G6 PASS). If not
  READY, this sprint records the blocker and the plan **pauses** (it cannot proceed to apply schema).
- **Record the PO confirmations** (`docs/backend/switch/po-confirmations.md`): access model (workspace vs
  DCX-scoped), version creation (duplicate-only vs add create endpoint — OD-PAC-01), files scope, ClickUp/AI
  stub scope.
- **Queue the requirement intake** for the net-new backend requirements (`REQ-BE-*`) via `req:propose` for PO
  sign-off (does not invent locked IDs).
- **Switch architecture doc** (`docs/backend/switch/architecture.md`): the flag (`VITE_USE_REAL_BACKEND`),
  the real-dispatcher shape (implements the 22 routes, preserves `api-mappers.ts`), cutover strategy
  (OD-PAC-04), and the dev-first/prod-last apply order.

## Scope — out
- Any `src/**` change; any Supabase apply; any workflow. Those are R1+.

## Acceptance criteria
- [x] AC-PAC-0-1 — backend-discovery-v3 readiness = READY confirmed (doc-verifiable: cite the scorecard verdict), or the blocker is recorded and the plan marked paused
- [x] AC-PAC-0-2 — PO confirmations recorded for all 4 product-model points (doc-verifiable: `po-confirmations.md` has a decision per point, no "TBD")
- [x] AC-PAC-0-3 — requirement intake queued for `REQ-BE-*` via `req:propose` (tool-verifiable: proposal ledger entry exists)
- [x] AC-PAC-0-4 — switch architecture recorded incl. flag, dispatcher shape, cutover strategy (OD-PAC-04) (doc-verifiable)
- [x] AC-PAC-0-5 — no `src/**` changed, no Supabase apply (code-verifiable: diff empty under `src/`; `list_migrations` unchanged)

## Verification plan
| Criterion | Method | Evidence |
|---|---|---|
| readiness prerequisite | read scorecard verdict | READY cited, or paused |
| PO confirmations | grep `po-confirmations.md` for TBD | 0 TBD |
| intake queued | proposal ledger | entry present |
| no apply / no src | `git diff --name-only -- src/`; `list_migrations` | empty; unchanged |

## Dependencies
Discovery READY. Blocks all later sprints.

## Files likely affected
- `docs/backend/switch/po-confirmations.md`, `docs/backend/switch/architecture.md` — create
- `output/PAC-R0-prerequisites.md` — create

## Final step — Continuity wiring (MANDATORY)
Append to carry-forward: readiness verdict, the 4 PO confirmations, the queued `REQ-BE-*` intake, and the
decided switch architecture (flag + cutover strategy). Close via `dcx-sprint-close`.
