# Switch architecture — `production-api-client-switch` (PAC-R0)

Fixes the mechanical shape of the mock → real-Supabase switch so PAC-R1..R6 execute against a decided
architecture, not an implicit one. Nothing here changes `src/**` (PAC-R0 is docs-only, non-source).

## 1. The flag

`VITE_USE_REAL_BACKEND` (boolean env var, default unset/false).

- **Default (unset) → mock stays the backend.** No behavior change for any environment until this plan
  proves parity and a later sprint (PAC-R5/R6) flips a specific environment's default.
- Read once at the `apiClient` composition root (`src/services/api-client.ts` or equivalent — confirmed at
  PAC-R2), not per-call, so a single flag decides the dispatcher for the whole session.
- Per-environment override lives in that environment's env config (`.env.local`, Vercel project env,
  GitHub Actions secrets for CI) — never hardcoded in source.

## 2. Cutover strategy (OD-PAC-04) — **whole-dispatcher flip**

Decided over the alternative (per-route strangler): when `VITE_USE_REAL_BACKEND=true`, **all 22 routes**
switch to the real Supabase dispatcher at once. When false/unset, all 22 stay on `mockDispatch`.

**Why whole-flip over strangler:**
- The 22-route contract is frozen and fully implemented in one pass (PAC-R2) — there's no partial-readiness
  state to strangle through; per-route toggling would add dispatch-table complexity for no real benefit here.
- Simpler to reason about and test: exactly two dispatcher states exist, not 2^22.
- Matches the plan's existing "mock stays default until parity is proven" framing — parity is proven as a
  whole (PAC-R4 tests all 22 routes against `contract.json` before any flip), not route-by-route.

**Mechanically:** `apiClient(route, options)` resolves to `dispatch = USE_REAL_BACKEND ? realDispatch : mockDispatch`
once per composition, then calls `dispatch(route, options)` — identical call signature both sides, so
`api-mappers.ts` and every caller are unaffected (per the plan's core constraint).

## 3. Real-dispatcher shape (implemented at PAC-R2 — fixed here so R2 has no open questions)

- New module `src/services/real-dispatch.ts` (name confirmed at PAC-R2), implementing the **same** 22 routes
  as `mock-dispatch.ts`, same function signature, same return shapes (post-mapper).
- Backed by the Supabase JS client against the schema from `docs/backend/schema/schema.sql` (17 tables, 6
  enums) and RLS from `docs/backend/auth/rls-policies.sql` (25 policies) — applied to **dev** first (PAC-R1).
- Never bypasses `api-mappers.ts` (core.md §5/§9.4): `realDispatch` returns raw Supabase rows shaped to the
  same intermediate contract `mockDispatch` returns today, so the existing mapper layer is reused unchanged.
- No UI/component changes — the contract, not the transport, is the interface UI code depends on.

## 4. Apply order — dev-first, prod-last

1. **PAC-R1** — apply `schema.sql` + `rls-policies.sql` to the Supabase **dev** project only (PO-approved
   `apply_migration`). Generate TS types from dev.
2. **PAC-R2/R3** — build `realDispatch` + Supabase Auth wiring against **dev**, flag off by default.
3. **PAC-R4** — parity tests (dev) against `contract.json` + captured fixtures; seed dev data.
4. **PAC-R5** — flip the flag **on a preview** pointed at dev backend; validate; flag stays off in prod.
5. **PAC-R6** — only sprint that touches **prod**: schema apply to prod (PO-signed), promotion through
   `scripts/release/promote.sh` + recorded approval (`docs/releases/approvals/`). No auto-promotion.

No step skips ahead: prod is never touched before dev has proven parity (PAC-R4) and a flagged preview
(PAC-R5) has validated the flip.

## 5. Deferred to their owning sprint (not resolved here)

| ID | Deferred to | Why not resolved at PAC-R0 |
|---|---|---|
| OD-PAC-02 (builder-tree write: full-replace vs diff-upsert) | PAC-R2 | Implementation-level choice made when writing `realDispatch`'s `PATCH /versions/:id/builder` handler; doesn't block architecture or PAC-R1's schema apply. |
| OD-PAC-03 (data migration: seed dev only vs migrate existing mock/localStorage data) | PAC-R4 | Needs the dev schema to exist first (PAC-R1) before a migration/seed strategy can be evaluated against it. |

## Resolved at PAC-R0

- OD-PAC-01 (version creation): **duplicate-only**, closed — see `po-confirmations.md`. No new route added
  to the 22-route contract.
- OD-PAC-04 (cutover strategy): **whole-dispatcher flip**, closed — §2 above.
