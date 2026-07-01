---
sprint: BE3-R2
plan: backend-discovery-v3
title: Schema derivation (proposed, never applied)
family: discovery
executor: Claude / Codex / opencode
required-tools: bash scripts, Supabase MCP (read-only: list_tables, get_advisors)
depends-on: BE3-R0
allowed-writes: docs/backend/schema/**, output/BE3-R2-*.md
forbidden-writes: src/**, Supabase apply_migration/execute_sql (FORBIDDEN — D-BE3-NO-APPLY)
status: Active
Status: Active
---

# BE3-R2 — Schema derivation

Derive a **proposed** Supabase schema from the `Api*` types + mock seed data — tables, columns, enums,
relationships, constraints, RLS placeholders — recorded with per-decision rationale. **Nothing is applied.**

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-DM-017`, `REQ-DM-018` (data model), `REQ-GOV-TRACE-001-DATA` |
| Scope/type | discovery / data-model design (proposal only) |
| Acceptance outcomes | AC-BE3-2-1 … AC-BE3-2-6 |
| Expected manifestations | `docs/backend/schema/schema.sql` + `erd.md` + `rationale.md` |
| Actual manifestations | `src/types/api.ts`, `src/types/lifecycle.ts` (enums), `src/services/mock/*.mock.ts` + `src/mock/*` (seed) |
| Evidence | entity-parity check; `.sql` syntax check; read-only advisors baseline |
| Coverage | complete for current entities; column sizing/index/nullability marked HYPOTHESIS pending R5 capture |
| Queued intake | new `REQ-BE-*` (tables/RLS) to be proposed before the build plan — not invented here |
| Gate result | `req:validate` PASS |

## Intent
Produce the schema the build plan will apply, derived mechanically from types + seed (plan §4).

## Step 0 — Session environment + carry-forward (MANDATORY, first step)
1. `bash scripts/agent/build-current-state.sh`; read plan §4 (entity→table map + derivation rules) + carry-forward.
2. Confirm D-BE3-NO-APPLY: **no** `apply_migration`/`execute_sql`. Supabase tools are read-only here.

## Scope — in
- Emit `schema.sql`: one table per `Api*` entity per the plan §4 map; enum unions (`VersionStatus`,
  `ApiPhaseIconType`, `LifecycleEventType`, file `source`) → Postgres enums / `check` constraints;
  metadata + `ApiJsonValue` → `jsonb`; FKs per the relationship column.
- Record OD-BE3-01: `ApiTaskDate` / `ApiFieldCompletionState` → jsonb vs. normalized columns, with the
  trade-off and a recommendation.
- `erd.md` (relationship diagram) + `rationale.md` (per-column: type, nullability, HYPOTHESIS flags for
  anything awaiting R5 capture, e.g. string sizing, index candidates).
- Read-only Supabase baseline: `list_tables` (confirm still empty), `get_advisors` (baseline).

## Scope — out
- Applying any migration. Contract/auth/integration content. Any `src/**` change.
- Finalizing column sizes / indexes on hypotheses — those stay open until capture (G5).

## Acceptance criteria
- [ ] AC-BE3-2-1 — every `Api*` entity in plan §4 has a table in `schema.sql` (code-verifiable: entity-parity checklist)
- [ ] AC-BE3-2-2 — every enum union → a Postgres enum or check constraint (code-verifiable: enum list vs. schema)
- [ ] AC-BE3-2-3 — `schema.sql` is syntax-valid (code-verifiable: `psql --dry-run`/parser or `supabase db lint` if available; else documented parser check)
- [ ] AC-BE3-2-4 — OD-BE3-01 recorded with recommendation (doc-verifiable: decision section present)
- [ ] AC-BE3-2-5 — both Supabase projects confirmed still empty; no migration applied (tool-verifiable: `list_tables` = 0; `list_migrations` unchanged)
- [ ] AC-BE3-2-6 — no `src/**` changed (code-verifiable: name-only diff empty)

## Verification plan
| Criterion | Method | Evidence required | Fallback if tool unavailable |
|---|---|---|---|
| entity parity | checklist `Api*` types vs. tables | all mapped | — |
| syntax | SQL parser / `supabase db lint` | 0 syntax errors | documented offline parser check; mark tool `BLOCKED` per core.md §28 |
| no-apply proof | `list_migrations` before/after identical | no new migration | mark `BLOCKED — Supabase MCP unavailable`; **output must note the missing evidence and that activation CAN continue** — no tool could apply anyway, and the schema is a proposal not an application (core.md §28, audit advisory #2) |
| no src | `git diff --name-only -- src/` | empty | — |

## Dependencies
BE3-R0. Parallel with BE3-R1 (uses types, not the frozen contract, so no hard R1 dependency).

## Files likely affected
- `docs/backend/schema/schema.sql`, `erd.md`, `rationale.md` — create
- `output/BE3-R2-schema.md` — create

## Final step — Continuity wiring (MANDATORY, last step)
Append to carry-forward: schema proposed (table count), enums mapped, OD-BE3-01 status, and the list of
HYPOTHESIS columns capture (R5) must confirm before G2 can pass. Close via `dcx-sprint-close`.
