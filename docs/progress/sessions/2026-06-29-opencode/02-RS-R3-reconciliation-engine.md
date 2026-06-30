## RS-R3 — Manifestation discovery + reconciliation engine + change-trigger
Agent: OpenCode (big-pickle)
Model: big-pickle
Provider: Anthropic
Date: 2026-06-29
Type: sprint-execution
Status: Completed
PO-Action: none

Intent: Build the reconciliation engine that inventories manifestations from code, proposes confidence-scored trace links, auto-applies high-confidence technical links with audit records, and runs a completion gate before work is marked done.
Trigger: RS-R3 sprint plan — `docs/plans/active/requirements-system/sprints/RS-R3-reconciliation-engine.md`
Requirements covered: RS-R3, RS-R0a §9 (reconciliation), RS-R0b (auto-apply threshold ≥ 0.80, technical-only auto-apply, audit ledger)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | `scripts/requirements/reconciliation-engine.ts` | Core engine: inventory, detector, inference, auto-apply, completion check | 438 |
| edited (replaced) | `scripts/requirements/reconcile.ts` | CLI entry — `req:reconcile --mode inventory\|changed` | 38 |
| edited (replaced) | `scripts/requirements/completion-gate.ts` | CLI entry — `req:completion-gate --changed <paths>` | 73 |
| created | `src/requirements/__tests__/requirements.reconciliation.test.ts` | 14 unit tests covering inventory, detectors, inference, auto-apply, queue routing, completion gate | 195 |

### Engine architecture
- **Inventory**: walks `src/` + `code-index/` (components.json, usages, labels); assigns durable IDs `MAN-<kind>-<owner>-<slug>`; tracks lifecycle state
- **Detectors**: manifestations lacking req links; reqs lacking manifestations; partial implementation (expected categories); stale/broken traces; superseded-still-in-code; tests-disconnected
- **Inference**: token-aware similarity (handles camelCase, kebab, snake) vs requirement statements/IDs/aliases; each candidate carries `confidence`, `evidence`, `reason`, `needs_confirmation`
- **Auto-apply**: confidence ≥ 0.80 + technical (SystemResponsibility) + not needs-confirmation → writes `TraceLink` JSON + appends audit `LedgerEntry` to decision-ledger.jsonl; everything else → review queue
- **Completion gate**: runs graph validation + reconciliation on changed files; prints issues report; exits 1 if issues found

### Commands
- `npm run req:reconcile -- --mode inventory`
- `npm run req:reconcile -- --mode changed -- --files <paths>`
- `npm run req:completion-gate -- --changed <paths>`
- `npm run req:refresh-code-index` (reuses `npm run generate:code-index`)

### Gates
| Gate | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (0 errors, 0 warnings — lint debt cleared in task 01) |
| `npm run validate:architecture` | PASS (0 violations) |
| `npm run test` | PASS — 9 files, 51 tests (14 new for reconciliation) |
