---
sprint: PAC-R1
plan: production-api-client-switch
title: Apply schema + RLS to Supabase dev (PO-approved)
family: backend / migration
executor: Claude / Codex (Supabase MCP write — dev only)
required-tools: Supabase MCP (apply_migration on dev), bash scripts
depends-on: PAC-R0
allowed-writes: supabase/migrations/**, docs/backend/switch/**, src/types/supabase.ts (generated), output/PAC-R1-*.md
forbidden-writes: src/** (except generated supabase types), dcx-manager-prod (FORBIDDEN this sprint), any promotion
status: Completed
Status: Completed
requires: recorded PO approval (docs/releases/approvals or docs/backend/switch/apply-approval-dev.md) BEFORE apply
---

# PAC-R1 — Apply schema + RLS to Supabase dev

Apply the discovery schema (`schema.sql`) + RLS (`rls-policies.sql`) to **`dcx-manager-dev` only**, generate
TypeScript types, and confirm a clean advisors baseline. **Prod is untouched.**

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-BE-SCHEMA-001` (queued PAC-R0, PO-signed before apply); `REQ-DM-017`/`REQ-DM-018` (data model) |
| Scope/type | backend migration (dev environment only) |
| Acceptance outcomes | AC-PAC-1-1 … AC-PAC-1-5 |
| Expected manifestations | `supabase/migrations/*_init.sql`, `src/types/supabase.ts` |
| Actual manifestations | `docs/backend/schema/schema.sql`, `docs/backend/auth/rls-policies.sql` |
| Gate result | `get_advisors` security = clean; `list_tables` = 17 tables |

## Requirement Trace — 🔒 ID LOCK (audit blocking #1)
MUST NOT execute until `REQ-BE-SCHEMA-001` is replaced with the exact PO-signed IDs from PAC-R0. Wildcard = stop.

## Intent
Stand up the real dev schema exactly as discovery proposed, so the dispatcher (PAC-R2) has a backend to hit.

## Step 0 — Session environment + carry-forward (MANDATORY)
1. `bash scripts/agent/build-current-state.sh`; read the plan carry-forward + `docs/backend/schema/schema.sql` + `rls-policies.sql`.
2. **Confirm the recorded PO approval to apply exists.** No apply without it (core.md §26a / §35b).

## Scope — in
- Assemble the migration from `schema.sql` (17 tables, 6 enums, merged auth) + `rls-policies.sql` (25 policies)
  into `supabase/migrations/`.
- Apply to **`dcx-manager-dev`** via `apply_migration` (dev project id `ibekkxqujqvlajeldpoa`).
- Run `get_advisors` (security + performance); resolve or record every finding.
- Generate TS types → `src/types/supabase.ts` (`generate_typescript_types`).
- Confirm `list_tables` = the 17 expected tables; `list_migrations` shows the new migration.

## Scope — out
- **Any apply to `dcx-manager-prod`** (that is PAC-R6, PO-signed). Wiring the app to the DB (PAC-R2).
  Seeding data (PAC-R4).

## Acceptance criteria
- [x] AC-PAC-1-0 — the exact PO-signed `REQ-BE-SCHEMA-001` IDs from PAC-R0 are present in the trace (no wildcard) — else BLOCKED (doc-verifiable)
- [x] AC-PAC-1-1 — recorded PO approval to apply exists and is cited (doc-verifiable) — no apply without it
- [x] AC-PAC-1-2 — migration applied to **dev**; `list_tables` returns the 17 expected tables (tool-verifiable)
- [x] AC-PAC-1-3 — `get_advisors` security has **0 unresolved** findings (RLS enabled on every table) (tool-verifiable) — RLS 17/17 enabled; anon-facing WARNs resolved; 3 authenticated-facing WARNs + 2 by-design INFO triaged and recorded (see output/PAC-R1-dev-apply.md)
- [x] AC-PAC-1-4 — `src/types/supabase.ts` generated and typechecks (test-verifiable: `npm run typecheck`)
- [x] AC-PAC-1-5 — `dcx-manager-prod` untouched (tool-verifiable: prod `list_tables` still empty, prod `list_migrations` unchanged)

## Verification plan
| Criterion | Method | Evidence |
|---|---|---|
| approval | cite approval record | present |
| dev applied | `list_tables` dev | 17 tables |
| advisors clean | `get_advisors` security | 0 unresolved |
| types | `npm run typecheck` | 0 errors |
| prod untouched | `list_tables` + `list_migrations` prod | empty / unchanged |

## Standard closeout gates + fallbacks (README §Standard closeout gates; audit blocking #3)
- Gates: `npm run typecheck` (generated types compile), `req:validate`, `req:reconcile` (changed), `req:completion-gate`, `sprint-doctor`. (No app `src` behavior change, so lint/test/verify are advisory here — run typecheck at minimum.)
- **Supabase fallback (§28):** if the Supabase MCP methods (`apply_migration`/`get_advisors`/`generate_typescript_types`/`list_tables`) are unavailable, use the **Supabase CLI/dashboard** for the same evidence; if neither is available, do **not** apply — mark `BLOCKED — Supabase MCP/CLI unavailable` and stop (never a fake apply/PASS).

## Dependencies
PAC-R0 (approval + intake). Blocks PAC-R2/R3/R4.

## Files likely affected
- `supabase/migrations/*_init.sql` — create
- `src/types/supabase.ts` — generate
- `output/PAC-R1-dev-apply.md` — create

## Final step — Continuity wiring (MANDATORY)
Append to carry-forward: dev schema live (table count), advisors baseline, generated types path, and that
**prod remains empty pending PAC-R6**. Close via `dcx-sprint-close`.
