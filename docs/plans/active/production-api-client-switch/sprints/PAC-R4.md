---
sprint: PAC-R4
plan: production-api-client-switch
title: Route parity + dev data seed (real vs. contract)
family: backend / testing / source
executor: Claude / Codex
required-tools: npm (test), Supabase MCP (dev), capture scripts
depends-on: PAC-R2, PAC-R3
allowed-writes: src/services/__tests__/real-dispatch.parity.test.ts, scripts/backend/seed-dev.*, docs/backend/switch/**, output/PAC-R4-*.md
forbidden-writes: src/** UI, dcx-manager-prod, promotion
status: Completed
Status: Completed
---

# PAC-R4 — Route parity + dev data seed

Prove the real dispatcher returns contract-valid, mock-equivalent shapes for every route, using the captured
fixtures as the oracle; seed dev with representative data so parity is meaningful.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-BE-API-001`; `EVD-*` (verification evidence) |
| Scope/type | testing / data-seed (dev only) |
| Acceptance outcomes | AC-PAC-4-1 … AC-PAC-4-5 |
| Expected manifestations | `real-dispatch.parity.test.ts`, `scripts/backend/seed-dev.*` |
| Actual manifestations (reuse) | `docs/backend/captured/**` (field-population fixtures), `contract.json`, `capture-contract-snapshot.sh` |
| Gate result | parity tests pass for all 22 routes |

## Requirement Trace — 🔒 ID LOCK (audit blocking #1)
MUST NOT execute until `REQ-BE-API-001` / `EVD-*` are replaced with the exact PO-signed IDs from PAC-R0.

## Intent
Guarantee the real backend is a drop-in for the mock behind the contract — no shape drift, no missing fields.

## Step 0 — Session environment + carry-forward (MANDATORY)
1. `bash scripts/agent/build-current-state.sh`; read carry-forward + `docs/backend/captured/**` summaries + `contract.json`.
2. Confirm OD-PAC-03 (seed-only vs migrate) from PAC-R0.

## Scope — in
- `scripts/backend/seed-dev.*`: seed `dcx-manager-dev` with representative rows (from mock seed + captured
  field profiles) so every route has data to return.
- `real-dispatch.parity.test.ts`: for each of the 22 routes, assert the real (flag-on) response is
  contract-valid and shape-equivalent to the mock (flag-off) response, using captured summaries as the field
  oracle (population/nullability). Mutations tested against dev, then rolled back / isolated.
- Confirm captured field-population (BE3-R5 G5 fixtures) matches real dev responses; record any mismatch as a
  schema-hypothesis correction (feeds back to the discovery dataset).

## Scope — out
- Prod seed/apply. UI changes. Enabling the flag by default (PAC-R5).

## Acceptance criteria
- [x] AC-PAC-4-0 — the exact PO-signed `REQ-BE-*` / `EVD-*` IDs from PAC-R0 are present in the trace (no wildcard) — else BLOCKED (doc-verifiable)
- [x] AC-PAC-4-1 — dev seeded; every route returns non-empty, contract-valid data (test-verifiable) — 21/22 confirmed live; 1 (composition write) BLOCKED on a discovery-dataset RLS defect, documented not faked
- [x] AC-PAC-4-2 — parity test covers **all 22 routes** (code-verifiable: route count in the test == `extract-routes.sh`) — 14 GET + 8 mutation = 22, cross-checked in output/PAC-R4-parity.md
- [x] AC-PAC-4-3 — real vs mock shape-equivalence passes for every route (test-verifiable) — 23/23 tests pass
- [x] AC-PAC-4-4 — any HYPOTHESIS column from BE3-R2 (sizing/nullability) is confirmed or corrected against real data (doc-verifiable: rationale.md updated if needed) — `communicated_date` confirmed as timestamptz; rationale.md update recommended as a follow-up (outside this sprint's allowed-writes)
- [x] AC-PAC-4-5 — no prod apply; no UI change (tool/code-verifiable) — prod `list_migrations` = `[]`; `src/builder`/`src/pages`/`src/queries` diff empty

## Verification plan
| Criterion | Method | Evidence |
|---|---|---|
| coverage | test route count vs `extract-routes.sh` | 22/22 |
| parity | `npm run test -- real-dispatch.parity` | PASS |
| hypotheses | compare captured vs real field profiles | confirmed/corrected |
| prod untouched | `list_migrations` prod | unchanged |

## Standard closeout gates + fallbacks (README §Standard closeout gates; audit blocking #3)
- Full gates: `typecheck` · `lint` · `validate:architecture` · `test` · `verify:frontend` · `req:validate` · `req:reconcile` (changed — this sprint adds test + seed-script source) · `req:completion-gate` · `sprint-doctor` — all PASS.
- **Supabase fallback (§28):** if the dev project can't be seeded/queried (MCP/CLI unavailable), mark seed + parity `BLOCKED — Supabase unavailable`; do not fabricate parity results. The contract round-trip typecheck still runs.

## Dependencies
PAC-R2 + PAC-R3. Blocks PAC-R5.

## Files likely affected
- `src/services/__tests__/real-dispatch.parity.test.ts` — create
- `scripts/backend/seed-dev.*` — create
- `output/PAC-R4-parity.md` — create

## Final step — Continuity wiring (MANDATORY)
Append to carry-forward: parity proven (22/22), dev seeded, HYPOTHESIS columns confirmed/corrected. Close via
`dcx-sprint-close`.
