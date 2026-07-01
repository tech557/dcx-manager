---
sprint: BE3-R0
plan: backend-discovery-v3
title: Discovery baseline & dataset scaffold
family: discovery
executor: Claude / Codex / opencode
required-tools: bash scripts, git, Supabase MCP (read-only)
depends-on: —
allowed-writes: docs/backend/README.md, docs/plans/active/README.md, output/BE3-R0-*.md
forbidden-writes: src/**, any Supabase apply/execute
status: Active
Status: Active
---

# BE3-R0 — Discovery baseline & dataset scaffold

Re-verify the live current-state (the v2 discovery is pre-refactor and must not be trusted as truth) and
create the `docs/backend/` readiness-dataset home the rest of the plan fills.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-DM-017` (api.ts data model), `REQ-GOV-TRACE-001-BACKEND` / `RSP-GOV-TRACE-BACKEND` — governance-trace backend anchor |
| Scope/type | governance / discovery (dataset scaffold; no product behavior) |
| Acceptance outcomes | AC-BE3-0-1 … AC-BE3-0-4 |
| Actual manifestations | `src/services/mock-dispatch.ts` (22 routes), `src/types/api.ts`, `src/services/mock/*`, Supabase `dcx-manager-prod`/`dcx-manager-dev` (empty) |
| Evidence | re-run current-state + route count + empty-schema confirmation |
| Coverage | governance-exempt for product behavior; anchors existing manifestation IDs |
| Gate result | `req:validate` PASS expected (docs-only) |

## Intent
Establish a trustworthy baseline and the dataset skeleton so R1–R6 build on verified facts, not the stale
v2 numbers.

## Step 0 — Session environment + carry-forward (MANDATORY, first step)
1. `bash scripts/agent/build-current-state.sh` + `bash scripts/agent/verify-tooling-state.sh`; log output.
2. Read the plan README `## Carry-forward contract` and §1 gap table. Obey REUSE-don't-RECREATE (core.md §7/§27):
   the contract SoT is `mock-dispatch.ts`; domain shapes are `src/types/api.ts`; do not fork them.
3. Read prior art: `completed/backend-discovery-v2/output/BE2-R3-gap-report.md` (note it is **pre-refactor**).

## Scope — in
- Re-verify: an **approximate** route-count baseline in `mock-dispatch.ts` (a rough `grep` is acceptable
  here as a bootstrap sanity check only — **the authoritative count is BE3-R1's deterministic
  `extract-routes.sh`**, reaudit advisory #1); the `Api*` type set; that both Supabase projects are empty.
- Create `docs/backend/README.md` — the dataset index (contract / schema / auth / integrations / captured /
  scorecard), each marked `PENDING`, with a "how to read this dataset" section.
- Add/confirm this plan in `docs/plans/active/README.md`.

## Scope — out
- Any contract/schema/auth/integration *content* (that is R1–R4).
- Any `src/**` change; any Supabase `apply_migration`/`execute_sql` (read-only tools only).

## Acceptance criteria
- [ ] AC-BE3-0-1 — `docs/backend/README.md` exists and indexes all five dataset parts + the scorecard (code-verifiable: file present, links resolve)
- [ ] AC-BE3-0-2 — an approximate route-count baseline recorded, **explicitly deferring the authoritative count to BE3-R1's `extract-routes.sh`** (code-verifiable: baseline noted + deferral stated; not gated on a formatting-dependent exact match)
- [ ] AC-BE3-0-3 — both Supabase projects confirmed empty (tool-verifiable: `list_tables` returns none; or BLOCKED if MCP unavailable)
- [ ] AC-BE3-0-4 — no `src/**` changed (code-verifiable: name-only diff empty under `src/`)

## Verification plan
| Criterion | Method | Evidence required | Fallback if tool unavailable |
|---|---|---|---|
| dataset home | `ls docs/backend/README.md` + link check | file + resolving links | — |
| route-count baseline | rough `grep` of `mock-dispatch.ts` (bootstrap sanity only) | approximate count noted + "authoritative count = BE3-R1 extract-routes.sh" recorded | — |
| empty schema | Supabase `list_tables` on both projects | "0 tables" logged | mark AC-BE3-0-3 `BLOCKED — Supabase MCP unavailable`; **the sprint output must state the missing evidence (empty-schema confirmation) and that activation CAN continue without it** — this is a read-only baseline check, not a blocker; RG-R5 already recorded both projects as schema-less (core.md §28, audit advisory #2) |
| no src | `git diff --name-only -- src/` | empty | — |

## Dependencies
None. First sprint of the plan.

## Files likely affected
- `docs/backend/README.md` — create
- `docs/plans/active/README.md` — edit/confirm plan row
- `output/BE3-R0-baseline.md` — create (session output)

## Final step — Continuity wiring (MANDATORY, last step)
Append to the plan README `## Carry-forward contract → Facts each sprint leaves behind`: verified route
count, confirmed-empty Supabase state, and the created dataset home. The sprint is not closeable until this
is written. Close via `dcx-sprint-close` (sprint-doctor + `req:validate`/`req:reconcile`/`req:completion-gate`).
