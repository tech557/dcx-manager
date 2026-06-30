---
output: RS-R3-build-notes
plan: requirements-system
sprint: RS-R3
agent: OpenCode (big-pickle)
date: 2026-06-29
status: completed
---

# RS-R3 — Manifestation discovery + reconciliation engine + change-trigger

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | `REQ-GOV-TRACE-001`, RS-R0a §9 (reconciliation), RS-R0b (auto-apply threshold ≥ 0.80) |
| Scope/type | governance, agent-workflow, devops/tooling |
| States | RS-R3 reconciliation engine + completion gate complete; all lint gates pass |
| Source/lock | RS-R0b signed command surface; RS-R1 graph store; RS-R2 queues + query engine |
| Acceptance outcomes | inventory enumerates manifestations; detectors find orphan/partial/stale/superseded; inference scores confidence; auto-apply writes trace-link + audit; completion gate validates before done |
| Responsibilities | manifestation inventory, candidate-mapping inference, orphan/partial/stale detection, auto-apply routing, change-triggered completion check |
| Expected manifestations | `scripts/requirements/reconciliation-engine.ts`, `reconcile.ts`, `completion-gate.ts`, tests |
| Actual manifestations | 3 engine files + 1 test file (see Built table) |
| Evidence | `npm run req:reconcile -- --mode inventory`, `npm run req:completion-gate -- --changed <paths>`, `npm run test` |
| Impact/dependencies | Feeds RS-R4 (wiring into skills/rules), RS-R7 (initial code reconciliation run), RS-R8 (verification evidence) |
| Coverage | complete for RS-R3; no remaining lint debt |
| Gate result | PASS |

## Built

| Concern | Path |
|---|---|
| Core reconciliation engine | `scripts/requirements/reconciliation-engine.ts` |
| Reconcile CLI | `scripts/requirements/reconcile.ts` |
| Completion gate CLI | `scripts/requirements/completion-gate.ts` |
| Unit tests (14) | `src/requirements/__tests__/requirements.reconciliation.test.ts` |

## Engine capabilities

- **Inventory**: walks `src/` + reads `code-index/{components,component-usages,text-labels,unresolved}.json`; assigns durable IDs `MAN-<kind>-<owner>-<slug>`; no product-code changes
- **Inference**: token-aware similarity (camelCase/kebab/snake → word tokens) against requirement statements, IDs, aliases; each link carries `confidence` (0.00–1.00), `evidence`, `reason`, `needs_confirmation`
- **Detectors**: manifestations lacking requirement links; requirements lacking manifestations; partial implementation (expected categories not all covered); stale/broken traces; superseded requirements still manifested; tests disconnected from acceptance outcomes
- **Auto-apply**: confidence ≥ 0.80 + technical (SystemResponsibility) + not needs-confirmation → writes `TraceLink` JSON + appends `LedgerEntry` to decision-ledger.jsonl; ambiguous → review queue piped to RS-R2 queue keys
- **Completion gate**: runs graph validation + reconciliation on changed files; reports issues; exits 1 on failure

## Commands

- `npm run req:reconcile -- --mode inventory`
- `npm run req:reconcile -- --mode changed -- --files <paths>`
- `npm run req:completion-gate -- --changed <paths>`
- `npm run req:refresh-code-index` (reuses `npm run generate:code-index`)

## Lint Cleanup

42 pre-existing `no-explicit-any` errors cleared across 14 files before RS-R3 started. All replaced with proper TypeScript types. See session log `01-lint-cleanup.md` for full file list.

## Test Coverage

RS-R3 tests cover:

- `createManifestationId` generates consistent IDs and handles special characters
- `runInventory` returns non-empty list with valid fields
- `runDetectors` catches orphan manifestations, stale/broken traces, disconnected tests
- `runDetectors` does not flag connected tests
- `inferCandidateLinks` returns candidates on name match with correct field presence
- `classifyCandidates` auto-applies high-confidence technical links
- `classifyCandidates` routes ambiguous/low-confidence mappings to review queue
- `checkCompletion` returns gatePass + issues

## Gate Evidence

| Gate | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (0 errors, 0 warnings — lint debt cleared) |
| `npm run validate:architecture` | PASS (0 violations) |
| `npm run test` | PASS — 9 files, 51 tests (14 new) |
| `bash scripts/verify.sh` | PASS |
