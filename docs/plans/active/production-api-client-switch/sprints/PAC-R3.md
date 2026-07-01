---
sprint: PAC-R3
plan: production-api-client-switch
title: Supabase Auth wiring → MyAccess/DCXAccess + RLS
family: backend / auth / source
executor: Claude / Codex
required-tools: npm, Supabase Auth
depends-on: PAC-R1 (schema+RLS), PAC-R2 (dispatcher)
allowed-writes: src/services/access.service.ts, src/services/supabase-auth.ts, src/ui/auth/**, src/services/real-dispatch.ts (access routes), output/PAC-R3-*.md
forbidden-writes: src/services/api-mappers.ts semantics, any Supabase prod apply/promotion, disabling RLS
status: Completed
Status: Completed
---

# PAC-R3 — Supabase Auth wiring

Wire real Supabase Auth so a session yields `MyAccess`/`DCXAccess` exactly as the seam requires, with RLS
enforcing the workspace-scoped multi-tenant boundary (from the BE3-R3 model).

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-BE-AUTH-001` (queued PAC-R0, PO-signed); `REQ-PR-001`, `REQ-PR-020` (route-guard/permissions) |
| Scope/type | source — auth wiring (real session + RLS enforcement) |
| Acceptance outcomes | AC-PAC-3-1 … AC-PAC-3-5 |
| Expected manifestations | `src/services/supabase-auth.ts`, updated `access.service.ts`, `src/ui/auth/*` |
| Actual manifestations (reuse) | `src/services/access.service.ts` (`MyAccess`/`DCXAccess`), `src/ui/auth/RouteGuard.tsx`, `src/rules/permissions.rules.ts`, `docs/backend/auth/auth-model.md` |
| Gate result | multi-user RLS tests pass; `get_advisors` security clean |

## Requirement Trace — 🔒 ID LOCK (audit blocking #1)
MUST NOT execute until `REQ-BE-AUTH-001` is replaced with the exact PO-signed IDs from PAC-R0. Wildcard = stop.

## Intent
Replace mock open-access with real Supabase Auth + RLS, satisfying the exact `MyAccess`/`DCXAccess` interface
(no interface change) so `RouteGuard` and permission rules work unchanged.

## Step 0 — Session environment + carry-forward (MANDATORY)
1. `bash scripts/agent/build-current-state.sh`; read carry-forward + `docs/backend/auth/auth-model.md` + `rls-policies.sql`.
2. Confirm the access model decision (workspace-scoped) from PAC-R0 po-confirmations.

## Scope — in
- `src/services/supabase-auth.ts`: session management (email + OAuth per OD-BE3-04); expose the current
  `auth.uid()` + workspace memberships.
- Update `access.service.ts` real path: `getMyAccess` → session → `{ userId, isAuthenticated, workspaceIds }`;
  `checkDCXAccess` → RLS-backed `{ hasAccess, canEdit }`. **Interface unchanged.**
- `src/ui/auth/**`: a real login/session gate feeding `RouteGuard` (no new global side-channels — core.md §9.5).
- Verify the 25 RLS policies enforce visibility/edit correctly with real sessions.

## Scope — out
- Changing the `MyAccess`/`DCXAccess` interface. Prod apply/promotion. Building SSO (deferred). Disabling RLS.

## Acceptance criteria
- [x] AC-PAC-3-0 — the exact PO-signed `REQ-BE-AUTH-001` IDs from PAC-R0 are present in the trace (no wildcard) — else BLOCKED (doc-verifiable)
- [x] AC-PAC-3-1 — real `getMyAccess`/`checkDCXAccess` satisfy the existing interfaces exactly (code-verifiable: typecheck; no interface change)
- [x] AC-PAC-3-2 — a signed-in user sees only their workspace's campaigns; a non-member is denied (test-verifiable: multi-user RLS test on dev) — 5-case matrix on real dev RLS, all pass
- [x] AC-PAC-3-3 — `canEdit` maps to role (editor/admin) per the RLS model (test-verifiable) — editor write allowed, viewer write denied
- [x] AC-PAC-3-4 — `RouteGuard` + `permissions.rules.ts` work unchanged against real auth (test-verifiable) — additive-only edit, gated behind the flag, 92/92 tests unaffected
- [x] AC-PAC-3-5 — `get_advisors` security clean; RLS still enabled on all tables; no prod apply (tool-verifiable) — unchanged from PAC-R1 baseline, prod list_migrations = []

## Verification plan
| Criterion | Method | Evidence |
|---|---|---|
| interface unchanged | `npm run typecheck` | 0 errors |
| tenant isolation | multi-user RLS test (member vs non-member) | member sees, non-member denied |
| edit gating | role-based edit test | editor edits, viewer blocked |
| advisors | `get_advisors` security | clean |

## Standard closeout gates + fallbacks (README §Standard closeout gates; audit blocking #3)
- Full gates: `typecheck` · `lint` · `validate:architecture` · `test` · `verify:frontend` · `req:validate` · `req:reconcile` (changed) · `req:completion-gate` · `sprint-doctor` — all PASS, recorded in the log.
- **RLS multi-user test:** run the tenant-isolation test against `dcx-manager-dev` with ≥2 seeded users (member + non-member, editor + viewer). **Fallback (§28):** if the Supabase MCP/CLI is unavailable to seed/query test users, mark the RLS test `BLOCKED — Supabase unavailable` (never claim isolation without running it); the interface-conformance typecheck still runs.

## Dependencies
PAC-R1 + PAC-R2. Overlaps PAC-R2. Blocks PAC-R4/R5.

## Files likely affected
- `src/services/supabase-auth.ts` — create
- `src/services/access.service.ts`, `src/ui/auth/**` — edit
- `output/PAC-R3-auth.md` — create

## Final step — Continuity wiring (MANDATORY)
Append to carry-forward: auth wired (provider, session→access mapping), RLS tenant-isolation proven, interface
unchanged. Close via `dcx-sprint-close`.
