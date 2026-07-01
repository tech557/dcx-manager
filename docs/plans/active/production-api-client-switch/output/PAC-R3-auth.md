# PAC-R3 output — Supabase Auth wiring → MyAccess/DCXAccess + RLS

Date: 2026-07-01. Executor: Claude (claude-sonnet-4-6). Status: **Completed** — all 6 acceptance criteria met.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-BE-AUTH-001` (PO-signed, `LDG-2026-07-01-create-node-REQ-BE-AUTH-001`); `REQ-PR-002` (non-authenticated access / login redirect) |
| Scope/type | source — auth wiring (real session + RLS enforcement) |
| Acceptance outcomes | AC-PAC-3-0 … AC-PAC-3-5 |
| Actual manifestations | `src/services/supabase-auth.ts` (new), `src/ui/auth/RouteGuard.tsx` (edited), `src/ui/auth/LoginRedirect.tsx` (edited) |
| Gate result | multi-user RLS matrix all 5 cases PASS; `get_advisors` security unchanged from PAC-R1 baseline |

## AC-PAC-3-0 — ID lock cleared

`REQ-BE-AUTH-001` (real, PO-signed) already replaced the wildcard at the PAC-R0 follow-up sign-off. No
wildcard present.

## AC-PAC-3-1 — interfaces unchanged

`MyAccess`/`DCXAccess` (`src/services/access.service.ts`) were **not edited** — they already call
`apiClient('/access/me')` / `apiClient('/dcx/:id/access')`, which already routes to `getMyAccessReal`/
`checkDCXAccessReal` in `real-dispatch.ts` (built at PAC-R2). PAC-R3 only adds the **session layer**
(`supabase-auth.ts`) those handlers read via `supabase.auth.getUser()`. `npm run typecheck` → 0 errors,
confirming no interface drift.

## AC-PAC-3-2 / AC-PAC-3-3 — tenant isolation + role-based edit gating

Ran a 5-case RLS matrix directly against `dcx-manager-dev` via `execute_sql`, simulating 3 users purely
through `set_config('request.jwt.claims', ...)` (no real signup needed — `auth.uid()` reads the JWT claim,
independent of `auth.users`). Seeded a temp workspace (`ws-rls-test-1`), an editor + viewer membership, and
one `dcx` row (`dcx-rls-test-1`), then rolled back every test transaction (data never persisted) and deleted
the seed rows afterward.

| # | Simulated user | Action | Expected | Result |
|---|---|---|---|---|
| 1 | outsider (no membership) | `SELECT` the dcx row | denied (0 rows) | ✅ 0 rows |
| 2 | editor member | `SELECT` the dcx row | allowed (1 row) | ✅ 1 row |
| 3 | editor member | `UPDATE` the dcx row | allowed | ✅ 1 row updated |
| 4 | viewer member | `UPDATE` the dcx row | denied (0 rows) | ✅ 0 rows updated |
| 5 | viewer member | `SELECT` the dcx row | allowed (read-only) | ✅ 1 row |

All 5 match the RLS model (`docs/backend/auth/auth-model.md`): workspace-scoped visibility, editor/admin-only
writes. AC-PAC-3-2 (tenant isolation) and AC-PAC-3-3 (role→canEdit mapping) both proven on real Postgres RLS,
not just at the interface-shape level.

## AC-PAC-3-4 — RouteGuard + permissions.rules.ts unchanged against real auth

Neither file needed a behavior change: `RouteGuard.tsx` already consumed `MyAccess`/`DCXAccess` generically;
`permissions.rules.ts` is pure and provider-agnostic. The only edit to `RouteGuard.tsx` is additive — a
`useEffect` that subscribes to `onAuthStateChange` **only when `VITE_USE_REAL_BACKEND` is on**, invalidating
the `access.me` query cache so a sign-in/sign-out is reflected without a manual refresh. Guarded behind the
flag so mock/test paths never touch the Supabase client (which throws without `VITE_SUPABASE_URL`/
`VITE_SUPABASE_ANON_KEY`). `npm run test` → 92/92 unaffected.

`LoginRedirect.tsx` (previously a static placeholder) is now a real sign-in form: email magic-link
(`signInWithOtp`) + Google OAuth (`signInWithOAuth`), calling the new `supabase-auth.ts`. Under mock,
`getMyAccessFromMock` always returns `isAuthenticated: true`, so `RouteGuard` never renders this component —
zero mock-path risk.

## AC-PAC-3-5 — advisors clean, RLS enabled everywhere, no prod apply

- `get_advisors` (security, dev) → identical to the PAC-R1 baseline: 2 by-design INFO
  (`memberships`/`workspaces` RLS-enabled-no-policy) + 3 structural WARN (helper functions need
  `authenticated` EXECUTE for RLS to work) — no new findings from this sprint's changes (no schema touched).
- `list_tables` (dev) — all 17 tables still `rls_enabled: true` (unchanged from PAC-R1).
- `list_migrations` (`dcx-manager-prod`, `xokgguodxjjwokngyquo`) → `[]` — prod untouched.

## Implementation notes

- **Provider:** email magic-link + Google OAuth, per OD-BE3-04 (`docs/backend/switch/po-confirmations.md`).
- **No new global side-channel (core.md §9.5):** `RouteGuard` reuses the existing exported `queryClient`
  (`src/main.tsx`) via `useQueryClient()` — no new store/singleton was added.
- **Test methodology:** the RLS matrix used `SET LOCAL ROLE authenticated` + `set_config('request.jwt.claims',
  ...)` inside a transaction that's always rolled back — a standard, non-destructive way to validate Postgres
  RLS policies without needing real Supabase Auth signups. Seed rows (workspace/memberships/dcx) were inserted
  outside any user-role transaction (as the elevated `execute_sql` role) and explicitly deleted afterward —
  `dcx-manager-dev` is left exactly as PAC-R1/R2 left it.

## Gate results

| Gate | Result |
|---|---|
| typecheck | PASS (0 errors) |
| lint | PASS |
| test | PASS (92/92) |
| validate:architecture | PASS (307 modules, 613 deps) |
| verify.sh | PASS |
| req:validate | PASS |
| req:completion-gate (changed) | PASS (after 1 new manifestation node + 2 trace links, signed off) |
| contract-drift | PASS |
| RLS multi-user matrix | PASS (5/5 cases) |
| get_advisors security | unchanged from PAC-R1 baseline, no new findings |
