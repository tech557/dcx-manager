---
sprint: PAC-R2
plan: production-api-client-switch
title: Real dispatcher implementing the 22 routes (flagged)
family: backend / source
executor: Claude / Codex
required-tools: npm (typecheck/lint/test/verify:frontend), Supabase JS client
depends-on: PAC-R1
allowed-writes: src/services/real-dispatch.ts, src/services/supabase-client.ts, src/services/api-client.ts (flag switch only), src/services/**/*.ts (route impl), output/PAC-R2-*.md
forbidden-writes: UI components (src/builder/**, src/pages/**), src/services/api-mappers.ts semantics, any Supabase apply/promotion
status: Completed
Status: Completed
---

# PAC-R2 — Real dispatcher implementing the 22 routes (flagged)

Implement a real Supabase-backed dispatcher that satisfies the exact 22-route contract, selected behind
`VITE_USE_REAL_BACKEND`. Mock stays the default; the mapper layer and all UI are unchanged.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-BE-API-001` (queued PAC-R0, PO-signed); `REQ-SC-001` (service layer); `REQ-DM-017` (types) |
| Scope/type | source — the backend seam swap, behind an off-by-default flag |
| Acceptance outcomes | AC-PAC-2-1 … AC-PAC-2-6 |
| Expected manifestations | `src/services/real-dispatch.ts`, `src/services/supabase-client.ts`, flag switch in `api-client.ts` |
| Actual manifestations (reuse) | `src/services/mock-dispatch.ts` (route table = the contract), `src/services/api-mappers.ts`, `src/types/supabase.ts` |
| Gate result | `verify:frontend` + `npm run test` PASS; contract-drift gate green |

## Intent
Provide a real backend behind the identical contract so the app can run on Supabase with zero UI change.

## Requirement Trace — 🔒 ID LOCK (audit blocking #1)
This sprint MUST NOT execute until the placeholder `REQ-BE-API-001` above is replaced with the **exact PO-signed
IDs** produced by PAC-R0's intake. A wildcard trace = stop and return to PAC-R0.

## Step 0 — Session environment + carry-forward (MANDATORY)
1. `bash scripts/agent/build-current-state.sh`; read carry-forward + `contract.json` + `endpoint-integration-overview.md`.
2. **Confirm the mapper boundary direction (core.md §5/§9.4, audit blocking #2):** the real dispatcher/services
   return **`Api*` shapes** (exactly what `mockDispatch` returns today); the **query layer** (`src/queries/*`)
   is what calls `api-mappers.ts` to convert `Api* → domain` — and it stays **unchanged**. The dispatcher does
   **not** call the mappers.

## Scope — in
- `src/services/supabase-client.ts`: the Supabase JS client (dev URL + anon key from env; no secrets in code).
- `src/services/real-dispatch.ts`: implement **all 22 routes** from `contract.json` against the dev schema,
  returning **contract-valid `Api*` responses only** (same method/path/params/request/response types as the
  mock). It maps Postgres rows → `Api*`; it **never returns domain types** and **never calls `api-mappers.ts`**
  (that is the query layer's job, which stays untouched — proven by `versions.queries.ts` etc. calling
  `apiVersionToDomain` on the service result).
- `src/services/api-client.ts`: select `realDispatch` vs `mockDispatch` on `VITE_USE_REAL_BACKEND` (**default
  off** → mock). The capture tap (BE3-R5a) is preserved.
- Handle the builder tree read/write per OD-PAC-02; version-create per OD-PAC-01 (duplicate-only unless PO
  added a create route). ClickUp/AI routes keep returning the existing stub (decision matrix).

## Scope — out
- Any UI/component change. Changing `api-mappers.ts` semantics. Auth wiring (PAC-R3). Applying/promoting.
  Enabling the flag by default (mock stays default until PAC-R5).

## Acceptance criteria
- [x] AC-PAC-2-0 — the exact PO-signed `REQ-BE-API-001` IDs from PAC-R0 are present in this sprint's trace (no wildcard) — else BLOCKED (doc-verifiable)
- [x] AC-PAC-2-1 — `real-dispatch.ts` implements **every** route in `contract.json` (code-verifiable: route-parity vs `extract-routes.sh`, 22/22)
- [x] AC-PAC-2-2 — with the flag **off**, behavior is unchanged: `verify:frontend` + `npm run test` PASS (test-verifiable; record count) — 92/92 tests pass
- [x] AC-PAC-2-3 — with the flag **on** (dev), each route returns a contract-valid **`Api*`** shape (test-verifiable: parity harness — full detail in PAC-R4)
- [x] AC-PAC-2-4 — **the service boundary returns `Api*` only** — no domain types returned from `apiClient`/`realDispatch`, the dispatcher does **not** call `api-mappers.ts`, existing query-layer mapper calls are unchanged, and there is no `as any` at the boundary (code-verifiable: `bash scripts/verify.sh` + grep for domain returns / `as any`; `git diff src/queries` empty)
- [x] AC-PAC-2-5 — no UI/component file changed (code-verifiable: diff empty under `src/builder`, `src/pages`, `src/queries`)
- [x] AC-PAC-2-6 — contract-drift gate green (code-verifiable: `capture-contract-snapshot.sh`)

## Verification plan
| Criterion | Method | Evidence | Fallback (§28) |
|---|---|---|---|
| ID lock | trace cites signed IDs | present | BLOCKED if wildcard — return to PAC-R0 |
| route parity | `extract-routes.sh` vs implemented routes | 22/22 | — |
| flag-off no-harm | `verify:frontend` + `npm run test` | PASS (record count) | — |
| Api*-only boundary | `bash scripts/verify.sh`; grep dispatcher for `toDomain(`/`as any`; `git diff src/queries` | 0 hits; queries unchanged | — |
| no UI change | `git diff --name-only -- src/builder src/pages src/queries` | empty | — |
| real-backend route probe | flag-on route call vs contract type | contract-valid | if Supabase MCP/CLI unavailable: `BLOCKED — Supabase unavailable`, defer to PAC-R4 |

## Standard closeout gates (README §Standard closeout gates)
typecheck · lint · validate:architecture · test · verify:frontend · req:validate · req:reconcile (changed) ·
req:completion-gate · sprint-doctor — all PASS and recorded in the log.

## Dependencies
PAC-R1 (dev schema + types). Overlaps PAC-R3. Blocks PAC-R4/R5.

## Files likely affected
- `src/services/supabase-client.ts`, `src/services/real-dispatch.ts` — create
- `src/services/api-client.ts` — edit (flag switch only)
- `output/PAC-R2-real-dispatch.md` — create

## Final step — Continuity wiring (MANDATORY)
Append to carry-forward: real dispatcher live behind `VITE_USE_REAL_BACKEND` (default off), routes implemented,
mapper boundary preserved, OD-PAC-01/02 resolutions. Close via `dcx-sprint-close`.
