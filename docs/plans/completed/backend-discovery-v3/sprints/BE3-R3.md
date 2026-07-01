---
sprint: BE3-R3
plan: backend-discovery-v3
title: Auth & RLS model
family: discovery
executor: Claude / Codex / opencode
required-tools: bash scripts
depends-on: BE3-R1, BE3-R2
allowed-writes: docs/backend/auth/**, output/BE3-R3-*.md
forbidden-writes: src/**, Supabase apply/execute
status: Active
Status: Active
---

# BE3-R3 — Auth & RLS model

Map the existing `access.service.ts` seam to a real Supabase Auth + Row-Level-Security model, with a draft
policy for every route in the frozen contract.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-PR-001`, `REQ-PR-020` (route-guard / permissions manifestations, traced to `src/ui/auth/RouteGuard`) |
| Scope/type | discovery / security design (model + draft policies; nothing enforced) |
| Acceptance outcomes | AC-BE3-3-1 … AC-BE3-3-5 |
| Expected manifestations | `docs/backend/auth/auth-model.md` + `rls-policies.sql` |
| Actual manifestations | `src/services/access.service.ts` (`MyAccess`, `DCXAccess`), `src/ui/auth/*`, `src/services/mock/access.mock.ts` |
| Evidence | policy-per-route coverage table; interface-conformance check |
| Queued intake | new auth `REQ-BE-AUTH-*` before the build plan |
| Gate result | `req:validate` PASS |

## Intent
Define how real auth satisfies the exact `MyAccess`/`DCXAccess` interface and how RLS enforces the
multi-tenant boundary (plan §5).

## Step 0 — Session environment + carry-forward (MANDATORY, first step)
1. `bash scripts/agent/build-current-state.sh`; read plan §5 (auth) + BE3-R1 contract + BE3-R2 schema + carry-forward.
2. **Ownership boundary (audit blocking #3):** R3 does **not** edit `docs/backend/schema/schema.sql` (that
   file is BE3-R2's output and outside R3's `allowed-writes`). Auth-driven tables
   (`workspaces`/`memberships`/`roles`) are written as a **separate addendum** under `docs/backend/auth/`;
   BE3-R6 (or the build plan) merges the addendum into the canonical schema. This keeps single-owner
   carry-forward clean and avoids a two-writer collision on `schema.sql`.

## Scope — in
- `auth-model.md`: auth provider decision surface (OD-BE3-04); how a Supabase session yields `userId` +
  `workspaceIds[]` (satisfying `MyAccess`); how `DCXAccess { hasAccess, canEdit }` becomes an RLS-enforced
  membership+role check.
- Multi-tenancy boundary decision OD-BE3-02 (workspace-scoped vs. DCX-scoped) with recommendation.
- `rls-policies.sql`: a **draft** policy per table — every write route from the contract gets a write
  policy; every read route a visibility rule. Draft only; never applied.
- `schema-auth-additions.sql` **under `docs/backend/auth/`** (not `schema/`): the `workspaces`/
  `memberships`/`roles` tables the auth model needs, written as an addendum for BE3-R6 to merge into
  `schema.sql`. R3 never writes `docs/backend/schema/**`.

## Scope — out
- Editing `docs/backend/schema/schema.sql` (BE3-R2's output). Enforcing/applying any policy. Auth UI
  changes. Any `src/**` change.

## Acceptance criteria
- [ ] AC-BE3-3-1 — auth model satisfies `MyAccess` + `DCXAccess` exactly (code-verifiable: interface-conformance table maps every field)
- [ ] AC-BE3-3-2 — every contract write route has a draft RLS write policy; every read route a visibility rule (code-verifiable: route×policy coverage table, no gaps)
- [ ] AC-BE3-3-3 — OD-BE3-02 (tenancy) + OD-BE3-04 (provider) recorded with recommendations (doc-verifiable)
- [ ] AC-BE3-3-4 — `rls-policies.sql` + `schema-auth-additions.sql` syntax-valid (code-verifiable: parser / `supabase db lint`)
- [ ] AC-BE3-3-5 — no `docs/backend/schema/**` edited, no `src/**` changed, no policy applied (code-verifiable: `git diff --name-only` shows writes only under `docs/backend/auth/` + `output/`; no migration)

## Verification plan
| Criterion | Method | Evidence required | Fallback if tool unavailable |
|---|---|---|---|
| interface conformance | field-map table `MyAccess`/`DCXAccess` → auth model | every field mapped | — |
| route×policy coverage | join contract routes to policies | 0 uncovered routes | — |
| syntax | SQL parser / lint | 0 errors | documented offline check (core.md §28) |
| no src / no apply | `git diff --name-only -- src/`; `list_migrations` | empty; unchanged | mark `BLOCKED — Supabase MCP unavailable`; output notes the missing evidence and that activation CAN continue (R3 is auth modelling + draft SQL, applies nothing) (core.md §28, audit advisory #2) |

## Dependencies
BE3-R1 (contract routes to cover) + BE3-R2 (schema to attach policies to). Parallel with BE3-R4.

## Files likely affected
- `docs/backend/auth/auth-model.md`, `docs/backend/auth/rls-policies.sql` — create
- `docs/backend/auth/schema-auth-additions.sql` — create (addendum for BE3-R6 to merge; R3 does **not** touch `docs/backend/schema/**`)
- `output/BE3-R3-auth.md` — create

## Final step — Continuity wiring (MANDATORY, last step)
Append to carry-forward: auth model + tenancy decision, route×policy coverage status, and the
`schema-auth-additions.sql` addendum that **BE3-R6 must merge** into `schema.sql` (recorded as an explicit
follow-up so the merge isn't lost). Close via `dcx-sprint-close`.
