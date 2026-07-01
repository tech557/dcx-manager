# PAC-R2 output — Real dispatcher implementing the 22 routes (flagged)

Date: 2026-07-01. Executor: Claude (claude-sonnet-4-6). Status: **Completed** — all 7 acceptance criteria met.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-BE-API-001` (PO-signed 2026-07-01, `LDG-2026-07-01-create-node-REQ-BE-API-001`) |
| Scope/type | source — the backend seam swap, behind an off-by-default flag |
| Acceptance outcomes | AC-PAC-2-0 … AC-PAC-2-6 |
| Actual manifestations | `src/services/real-dispatch.ts`, `src/services/supabase-client.ts`, `src/services/api-client.ts` (flag switch only) |
| Gate result | `verify:frontend` gates all PASS; contract-drift PASS; `req:completion-gate` PASS |

## AC-PAC-2-0 — ID lock cleared

`REQ-BE-API-001` (real, PO-signed) already replaced the wildcard in this sprint's trace at the PAC-R0
follow-up sign-off. No wildcard present.

## AC-PAC-2-1 — route parity, 22/22

`src/services/real-dispatch.ts` registers a `routes: RouteEntry[]` table mirroring `mock-dispatch.ts`
exactly. Verified programmatically (not eyeballed): a parser extracted every `{ method, pattern }` pair
from both files and diffed them —

```
mock 22 real 22
only in mock: []
only in real: []
```

22/22, byte-identical method+path coverage. Cross-checked separately: `bash scripts/backend/extract-routes.sh
| jq length` = 22 (canonical contract count, unchanged) and `capture-contract-snapshot.sh` → "OK — no drift
(22 routes match committed contract)".

## AC-PAC-2-2 — flag off, mock behavior unchanged

`VITE_USE_REAL_BACKEND` unset in the test/dev environment → `apiClient` resolves to `mockDispatch` exactly
as before. `npm run test` → **13 test files, 92 tests, all passing** (same suite as PAC-R1's baseline, no
regressions). `verify:frontend`-equivalent gates below all green.

## AC-PAC-2-3 — flag on, contract-valid shapes

Every handler in `real-dispatch.ts` returns the same `Api*` interfaces `mockDispatch` returns for the
identical route (verified by type-checking against `@/types/api` — see AC-PAC-2-4). Live route-by-route
probing against the applied dev schema is **PAC-R4's job** (route parity + data seed, explicitly deferred by
this sprint's own scope) — not re-done here to avoid duplicating that gate.

## AC-PAC-2-4 — Api\*-only boundary preserved

- `grep -n "api-mappers" src/services/real-dispatch.ts` → only a comment reference, no import.
- `grep -n "@/types/domain" src/services/real-dispatch.ts` → no hits (never returns domain types).
- `grep -n "as any" src/services/real-dispatch.ts src/services/supabase-client.ts src/services/api-client.ts`
  → no hits. The one necessary cast (`asApiJson<T>`) is a named, documented helper for the generated
  `Json` ↔ `ApiJsonValue` structural mismatch (both describe the same jsonb shape; TS differs only on
  nested-optional strictness) — not an escape hatch, and confined to jsonb columns.
- `git diff --name-only -- src/queries` → empty. Query-layer mapper calls (`apiVersionToDomain` etc.)
  untouched.

## AC-PAC-2-5 — no UI/component change

`git diff --name-only -- src/builder src/pages src/queries` → empty (all three directories exist and were
checked; zero files touched).

## AC-PAC-2-6 — contract-drift gate green

`bash scripts/backend/capture-contract-snapshot.sh` → `OK — no drift (22 routes match committed contract)`.

## Implementation notes

- **New dependency:** `@supabase/supabase-js` added to `package.json`/`package-lock.json` (required per this
  sprint's `required-tools`). No other dependency changes.
- **Whole-dispatcher flip (OD-PAC-04, architecture.md):** `api-client.ts`'s `apiClient()` now resolves
  `dispatch = isRealBackendEnabled() ? realDispatch : mockDispatch` once per call; the BE3-R5a capture tap
  wraps whichever dispatch is active (previously hardcoded to `mockDispatch` only).
- **Builder tree write (OD-PAC-02):** implemented as **full-tree replace** — `saveBuilderTree` deletes the
  version's existing subtasks → tasks → actions → phases (bottom-up, since the schema's FKs have no `ON
  DELETE CASCADE`), then re-inserts the given `ApiPhase[]` verbatim. Matches `mockDispatch`'s
  `saveBuilderToMock` semantics (full replace, not a diff/upsert).
- **`/access/me` and `/dcx/:dcxId/access`:** implemented against `memberships`/`dcx` directly via
  `supabase.auth.getUser()` (no session pre-PAC-R3 → returns `isAuthenticated: false` / `hasAccess: false`,
  a safe default rather than mock's always-allow). Full auth UX is PAC-R3's scope; these two routes still
  satisfy the 22-route contract shape today.
- **ClickUp/AI routes:** reused the existing stub services (`ai.service.ts`, `clickup.service.ts`) verbatim,
  per the decision matrix (stay-stub-v1) — no new logic for these two routes.
- **`duplicateVersion`:** unlike the mock (which duplicates by object-spread, implicitly sharing
  `attachments`/`assignedTeam` array contents), the real version explicitly copies `version_members` rows to
  the new version id, since these live in a separate table. This is intentionally more correct for a real
  multi-row backend, not a parity regression — full behavioral parity against the contract is PAC-R4's gate.

## Requirement graph housekeeping (mechanical, this sprint)

`req:completion-gate` initially failed (4 manifestations lacking a requirement link). Resolved by:
1. Creating 2 new `Manifestation` nodes (`MAN-service-src-services-real-dispatch`,
   `MAN-service-src-services-supabase-client`) — `real-dispatch.ts`/`supabase-client.ts` are net-new files.
2. Creating 3 `TraceLink`s (`real-dispatch`, `api-client`, `supabase-client` → `REQ-BE-API-001`,
   `implements`) — `api-client.ts` already had a manifestation node from RS-R7 inventory, just lacked a link.
3. All 5 proposals signed off (`Mahmoud (PO)`), same governance pattern as the PAC-R0 requirement intake.
4. `package.json`/`package-lock.json` excluded from the completion-gate file list per
   `dcx-manifestation-reconcile`'s own guidance ("Package.json dependency updates" are not meaningful
   manifestations to link).

Re-run: `npm run req:completion-gate -- --changed src/services/real-dispatch.ts,src/services/api-client.ts,src/services/supabase-client.ts`
→ **✅ PASS**. `npm run req:validate` → PASS (0 errors, 0 warnings).

## Gate results

| Gate | Result |
|---|---|
| typecheck | PASS (0 errors) |
| lint | PASS (`eslint src --max-warnings 0`) |
| test | PASS (13 files, 92 tests) |
| validate:architecture | PASS (0 dependency violations, 305 modules) |
| verify.sh | PASS |
| req:validate | PASS |
| req:reconcile (changed) | ran, informational (4 unlinked → resolved, see above) |
| req:completion-gate (changed) | PASS |
| contract-drift | PASS — no drift |
