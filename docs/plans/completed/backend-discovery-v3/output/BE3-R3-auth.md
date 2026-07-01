# BE3-R3 — Auth & RLS model (output)

Agent: Claude · Model: claude-opus-4-8 · Provider: Anthropic · Date: 2026-07-01
Version: v1.0.1.0 · Change-Class: non-source

## What this sprint produced

The real Supabase Auth + RLS model that satisfies the existing `access.service.ts` seam exactly, with a draft
policy for every contract route. Draft SQL only — nothing enforced or applied.

| Artifact | Path | Content |
|---|---|---|
| Auth model | `docs/backend/auth/auth-model.md` | interface-conformance + route×policy coverage + OD-BE3-02/04 + merge note |
| Draft RLS | `docs/backend/auth/rls-policies.sql` | 25 policies (read visibility + write) |
| Auth addendum | `docs/backend/auth/schema-auth-additions.sql` | `workspaces`, `memberships`, `membership_role` enum, 3 RLS helper functions |

## Acceptance criteria

| Criterion | Verdict | Evidence |
|---|---|---|
| AC-BE3-3-1 — auth model satisfies `MyAccess` + `DCXAccess` exactly | ✅ PASS | interface-conformance table maps all 6 fields to `auth.uid()` / `app_user_workspace_ids()` / `app_user_can_edit()` |
| AC-BE3-3-2 — every write route has a write policy; every read route a visibility rule | ✅ PASS | route×policy coverage table: 7 write routes → write policies, 15 read routes → visibility rules (or session/integration resolve); 0 uncovered |
| AC-BE3-3-3 — OD-BE3-02 (tenancy) + OD-BE3-04 (provider) recorded | ✅ PASS | workspace-scoped recommended (OD-BE3-02); Supabase Auth email+OAuth recommended (OD-BE3-04) |
| AC-BE3-3-4 — `rls-policies.sql` + `schema-auth-additions.sql` syntax-valid | ⚠️ PASS (fallback) / DB-lint ⛔ BLOCKED | offline structural parse: both balanced parens; `$$` paired; 25 policies, 3 functions, no dup policy names. Full `supabase db lint` BLOCKED — no CLI (§28) |
| AC-BE3-3-5 — no `schema/**` edited, no `src/**`, no policy applied | ✅ PASS | writes only under `docs/backend/auth/` + `output/`; `docs/backend/schema/` untouched by R3; `git diff src/` empty; no migration |

## Key decisions

- **OD-BE3-02 (tenancy): workspace-scoped** — 1:1 with `MyAccess.workspaceIds`; RLS chain `version → dcx →
  workspace`; optional `dcx_grants` override table deferred. Blocks G3; final ratification BE3-R6.
- **OD-BE3-04 (provider): Supabase Auth (email + OAuth)** — native `auth.uid()` drives RLS; SSO later.

## Ownership boundary (audit blocking #3)
R3 did **not** edit `docs/backend/schema/schema.sql`. The `workspaces`/`memberships`/`roles` tables + the
`dcx.client_id → dcx.workspace_id` rename are written as a **merge note** + addendum for BE3-R6 to apply.

## Gates

| Gate | Result |
|---|---|
| interface conformance | PASS (6/6 fields) |
| route×policy coverage | PASS (0 uncovered) |
| SQL DB-lint | BLOCKED — no psql/supabase CLI (§28) |
| SQL structural (fallback) | PASS (both files) |
| no schema/src edit, no apply | PASS |

## Follow-ups
- BE3-R6 merges `schema-auth-additions.sql` into `schema.sql` + renames `dcx.client_id → workspace_id`.
- `version_members.role` and `memberships.role` should reconcile (both role concepts) at build — note for BE3-R6/build.
- Full `supabase db lint` deferred (tooling debt, shared with BE3-R2).
