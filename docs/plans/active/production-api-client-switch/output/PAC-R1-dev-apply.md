# PAC-R1 output — Apply schema + RLS to Supabase dev

Date: 2026-07-01. Executor: Claude (claude-sonnet-4-6). Status: **Completed** — all 6 acceptance criteria met.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-BE-SCHEMA-001` (PO-signed 2026-07-01, `LDG-2026-07-01-create-node-REQ-BE-SCHEMA-001`) |
| Scope/type | backend migration (dev environment only) |
| Acceptance outcomes | AC-PAC-1-0 … AC-PAC-1-5 |
| Expected manifestations | `supabase/migrations/*_init.sql`, `src/types/supabase.ts` |
| Actual manifestations | `supabase/migrations/20260701120812_init.sql`, `supabase/migrations/20260701121415_harden_rls_helper_grants.sql`, `src/types/supabase.ts` |
| Gate result | `list_tables` (dev) = 17/17 RLS-enabled; `npm run typecheck` PASS; prod untouched |

## AC-PAC-1-0 — ID lock cleared

`REQ-BE-SCHEMA-001` (PO-signed at PAC-R0 follow-up, `LDG-2026-07-01-create-node-REQ-BE-SCHEMA-001`) replaces
the `REQ-BE-SCHEMA-*` wildcard in this sprint's trace and the plan README. No wildcard remains.

## AC-PAC-1-1 — recorded PO approval

[`docs/backend/switch/apply-approval-dev.md`](../../../../backend/switch/apply-approval-dev.md) — PO approved
dev-only apply 2026-07-01 ("Approve dev apply"), explicitly excluding prod.

## AC-PAC-1-2 — migration applied to dev; 17 tables

Applied via 3 migrations to `dcx-manager-dev` (`ibekkxqujqvlajeldpoa`):
1. `pac_r1_init_schema_rls` — the 17 tables/6 enums from `schema.sql` + 25 policies from `rls-policies.sql`
2. `pac_r1_harden_rls_helper_grants` — attempted `REVOKE ... FROM PUBLIC` (no-op, see advisors below)
3. `pac_r1_revoke_anon_rls_helper_execute` — the actual fix (`REVOKE ... FROM anon`)

`list_tables` (dev) → 17 tables, all `rls_enabled: true`: `channels, subtask_definitions,
channel_compositions, channel_available_compositions, composition_definitions,
subtask_definition_channels, workspaces, memberships, dcx, versions, phases, actions, tasks, subtasks,
file_attachments, version_members, activity_events`.

**Discovery-dataset defect found at apply time (not a schema/logic change):** `schema.sql`'s literal
statement order defines the 3 RLS helper functions (`app_user_workspace_ids`, `app_user_can_edit`,
`app_version_workspace`) **before** the `dcx`/`versions` tables they reference. Postgres validates
`LANGUAGE sql` function bodies against existing catalog objects at `CREATE FUNCTION` time, so applying the
file exactly as ordered fails (`42P01: relation "versions" does not exist`). The assembled migration moves
the 3 functions to immediately after `dcx`/`versions` are created — **identical DDL, no columns/types/policies
changed**, only sequenced so Postgres can resolve the dependency. `docs/backend/schema/schema.sql` itself is
**not** edited (still the frozen discovery artifact); this is recorded here as an apply-time finding to feed
back to a future discovery-dataset correction, per core.md's "any change is a discovery-dataset edit first."

## AC-PAC-1-3 — advisors (security)

**Resolved:** the 3 helper functions defaulted to `anon`-callable via PostgREST RPC (`SECURITY DEFINER`
functions get schema-level default `EXECUTE` grants to `anon`/`authenticated` in Supabase, not via `PUBLIC` —
the first hardening migration revoking from `PUBLIC` was a no-op; the second, revoking from `anon` directly,
fixed it). Re-ran `get_advisors` after each step; anon-facing WARNs are gone.

**Remaining findings, triaged (not silently dropped):**
| Finding | Level | Disposition |
|---|---|---|
| `app_user_workspace_ids`/`app_user_can_edit`/`app_version_workspace` still `authenticated`-executable via RPC | WARN ×3 | **Accepted, structural.** RLS policies invoke these functions under the querying role; `authenticated` must retain `EXECUTE` for policy evaluation to work at all for signed-in users. Fully closing this WARN requires moving the helpers to a non-PostgREST-exposed schema (e.g. `private`) — a `rls-policies.sql`/`schema.sql` source change, out of PAC-R1's "apply as-is" scope. Flagged as a PAC-R2+/hardening-pass follow-up, not fixed here. |
| `memberships`/`workspaces` RLS enabled, no policy | INFO ×2 | **By design.** Both tables are managed only via the auth/membership flow (not directly exposed CRUD routes in the 22-route contract); RLS-enabled-no-policy means default-deny for all direct table access, which is the intended posture — not a gap. |

**RLS coverage (the AC's core intent):** 17/17 tables have RLS enabled — 0 tables unprotected.

## AC-PAC-1-4 — generated types typecheck

`src/types/supabase.ts` generated via `generate_typescript_types` (dev project), written verbatim.
`npm run typecheck` → 0 errors.

## AC-PAC-1-5 — prod untouched

- `list_tables` (`dcx-manager-prod`, `xokgguodxjjwokngyquo`) → `[]` (still empty)
- `list_migrations` (prod) → `[]` (unchanged, still zero)
- `git status --short src/` shows only `src/types/supabase.ts` (new, generated, in-scope) plus 2 pre-existing
  unrelated uncommitted files (`api-client.ts`, `capture-sink.*` from prior BE3-R5a work) — no other `src/**`
  touched by this sprint.

## Performance advisors (recorded, not blocking)

`get_advisors` (performance) on dev → 64 findings, all INFO/WARN, no ERROR: 40 `multiple_permissive_policies`
(expected — `FOR ALL` + `FOR SELECT` policies coexist per table by the rls-policies.sql design), 16
`unindexed_foreign_keys` (the discovery G2 caveat — "Column sizing/index... HYPOTHESIS pending capture"), 7
`auth_rls_initplan` (Supabase's `auth.uid()` → `(select auth.uid())` caching recommendation — a
`rls-policies.sql` source optimization, deferred), 1 `unused_index` (expected, zero rows/queries yet). None
require action before dev usage; tracked as a post-apply hardening backlog for a later sprint.

## Gate results

| Gate | Result |
|---|---|
| typecheck | PASS (0 errors) |
| req:validate | PASS (unaffected — no requirement graph change this sprint) |
| lint/test/verify/validate:architecture | N/A per sprint's own gate table — "no app `src` behavior change" (advisory only; ran typecheck, the required minimum) |

## Migration files

- `supabase/migrations/20260701120812_init.sql` — local record of the assembled migration (matches
  `pac_r1_init_schema_rls` as applied; the 2 follow-up grant fixes are recorded above, not re-embedded in this
  file, since Supabase's migration history is the source of truth for what actually ran)
