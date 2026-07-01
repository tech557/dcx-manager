---
sprint: BE3-R1
plan: backend-discovery-v3
title: API contract freeze
family: discovery
executor: Claude / Codex / opencode
required-tools: bash scripts, npm (typecheck)
depends-on: BE3-R0
allowed-writes: docs/backend/contract/**, scripts/backend/**, output/BE3-R1-*.md
forbidden-writes: src/**, any Supabase apply/execute
status: Active
Status: Active
---

# BE3-R1 — API contract freeze

Freeze the current contract surface from `mock-dispatch.ts` into a machine + human spec the backend must
implement, and prove it has not drifted from the live `Api*` types.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-DM-017` (api.ts), `REQ-SC-001` (service layer) via existing trace-links to `src/services/*` and `src/types/api.ts` |
| Scope/type | discovery (read-only mirror of code into the dataset) |
| Acceptance outcomes | AC-BE3-1-1 … AC-BE3-1-5 |
| Expected manifestations | `docs/backend/contract/contract.json` + `contract.md` |
| Actual manifestations | `src/services/mock-dispatch.ts` route table; per-service `@route` JSDoc; `src/types/api.ts` |
| Evidence | route-parity check + generated-type round-trip typecheck |
| Coverage | complete for the current surface |
| Gate result | `req:validate` PASS; typecheck PASS on the generated check file |

## Intent
Turn the implicit 22-route contract into an explicit, drift-checkable spec (plan §3).

## Step 0 — Session environment + carry-forward (MANDATORY, first step)
1. `bash scripts/agent/build-current-state.sh`; read the plan README §3 (contract model) + carry-forward.
2. Confirm D-BE3-CONTRACT-SOT: the `mock-dispatch.ts` route table is the source of truth — mirror it, never
   invent routes.

## Scope — in
- Add `scripts/backend/extract-routes.sh` (advisory #3): a **deterministic** extractor that parses the
  `mock-dispatch.ts` route table (method + pattern + paramNames per `RouteEntry`) and emits the route list
  as JSON — **the same source `capture-contract-snapshot.sh` (BE3-R5a) reuses.** All route-count gates in
  this plan use this extractor, never a formatting-dependent `grep -c`.
- Emit `docs/backend/contract/contract.json` — one entry per extracted route: `method`, `path`, path
  params, `request_body_type`, `response_type`, calling `service`, `mutation?` (plan §3 field table).
- Emit `docs/backend/contract/contract.md` — human view grouped by the eight resource families.
- Drift findings: any service calling a route not in the table; any registered route with no caller.
- A generated TypeScript check that imports the `Api*` types (via **relative** import to `src/types/api`,
  not the `@/` alias) and asserts the contract's declared types are assignable — proving contract ≡ code.
  It lives at `scripts/backend/check-contract-types.ts` with a dedicated
  `scripts/backend/tsconfig.contract-check.json` (extends the root tsconfig), run as
  `npx tsc -p scripts/backend/tsconfig.contract-check.json --noEmit`. **Not** a stray file under `docs/`
  that the app `tsc --noEmit` would never include (audit blocking #2).

## Scope — out
- Schema, auth, integrations (R2–R4). No `src/**` change. No runtime capture (that is R5).

## Acceptance criteria
- [ ] AC-BE3-1-1 — every route the `extract-routes.sh` extractor emits has exactly one `contract.json` entry (code-verifiable: `extract-routes.sh | jq length` == `jq length contract.json`)
- [ ] AC-BE3-1-2 — each entry records method/path/params/request-type/response-type/service (code-verifiable: schema-lint of contract.json)
- [ ] AC-BE3-1-3 — the contract type-check passes against live `Api*` types (test-verifiable: `npx tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` → 0 errors)
- [ ] AC-BE3-1-4 — drift list produced (dead routes / unregistered calls), even if empty (code-verifiable: section present)
- [ ] AC-BE3-1-5 — no `src/**` changed (code-verifiable: name-only diff empty under `src/`)

## Verification plan
| Criterion | Method | Evidence required | Fallback if tool unavailable |
|---|---|---|---|
| route parity | `scripts/backend/extract-routes.sh \| jq length` vs. `jq length contract.json` | equal counts (deterministic extractor, not `grep -c`) | — |
| type round-trip | `npx tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` | 0 errors | — |
| drift scan | extractor route set vs. service `apiClient(` call sites | drift section written | — |
| no src | `git diff --name-only -- src/` | empty | — |

## Dependencies
BE3-R0 (dataset home). Parallel with BE3-R2.

## Files likely affected
- `docs/backend/contract/contract.json`, `docs/backend/contract/contract.md` — create
- `scripts/backend/extract-routes.sh` — create (deterministic route extractor, reused by BE3-R5a)
- `scripts/backend/check-contract-types.ts` + `scripts/backend/tsconfig.contract-check.json` — create (executable type round-trip)
- `output/BE3-R1-contract.md` — create

## Final step — Continuity wiring (MANDATORY, last step)
Append to the plan carry-forward: contract frozen (route count), drift status, and that the contract-drift
CI gate (R5) will hold it honest. Close via `dcx-sprint-close`.
