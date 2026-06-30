---
sprint: RG-R5
plan: cicd-release-governance
title: Supabase environment separation
family: external-config
executor: Claude / Codex / opencode (Supabase tool)
required-tools: Supabase (MCP or CLI)
depends-on: RG-R4
allowed-writes: env/key scoping config, migration-gating config, output/RG-R5-*.md
forbidden-writes: src/**
status: Completed
Status: Completed
---

# RG-R5 — Supabase environment separation

Keeps preview/staging/prod data separate and gates production migrations to approved releases, so a preview
never touches production data.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PLAT-018, REQ-RG-APPROVAL-005 (prod migrations follow approval), REQ-RG-AUTO-019 — **Status: approved — canonical graph nodes, PO-locked 2026-06-30 (ledger LDG-2026-06-30-create-node-REQ-RG-*; OD-RG-07 closed)** |
| Acceptance IDs | AC-RG-5-1 … AC-RG-5-5 |
| Expected manifestations | per-environment Supabase keys scoped to Vercel envs; migration-gating rule; OD-RG-05 decision recorded |
| Verification (EVD) | preview env uses non-prod data target; a prod migration requires a production-approved release |

## Step 0 — Continuity & environment (mandatory)
1. Read carry-forward (promote.sh + env scoping per RG-R4); §5 Supabase row; OD-RG-05.
2. `bash scripts/agent/build-current-state.sh`; confirm Supabase tool availability.

## Scope
- **Allowed:** env/key scoping config, migration-gating policy + check.
- **Forbidden:** `src/**`; running destructive prod migrations; pointing preview at prod.

## Steps (exact)
1. Decide OD-RG-05: **preview branches** for preview/staging, **separate project** for prod (record PO choice).
2. Scope Supabase keys per Vercel environment (preview/staging/prod) — keys as secrets, never in-repo.
3. Migration gating: a migration touching prod runs **only** when the release is production-approved (tie to `promote.sh` / the approval record). Preview/staging migrations run against non-prod targets.
4. Add a `validate-release-registry`-adjacent check (or promote.sh step): block a prod migration without a `promoted-prod`-eligible approved release.
5. Test: attempt a prod migration without approval → blocked; with a production approval record → allowed (dry-run/non-destructive).

## Output
`output/RG-R5-supabase.md` — env model (OD-RG-05 decision), key-scoping map, migration-gating rule + the blocked/allowed test.

## Acceptance criteria
| ID | Criterion | Verification |
|---|---|---|
| AC-RG-5-1 | OD-RG-05 decided + recorded | decision row present |
| AC-RG-5-2 | Keys scoped per environment; none in-repo | scan shows no keys committed |
| AC-RG-5-3 | Preview never targets prod data | config shows non-prod target for preview |
| AC-RG-5-4 | Prod migration gated to an approved release | blocked-without-approval test |
| AC-RG-5-5 | no `src/**` changed | name-only diff |

## Gates (core.md §11)
| Gate | Applies | How |
|---|---|---|
| no-`src/**` proof | YES | name-only diff |
| migration-gate test | YES | blocked + allowed cases |
| advisors | optional | `get_advisors` security check on the project |

## Fallbacks (core.md §28)
- No Supabase tool in-session → write the config + runbook; mark live-test criteria `BLOCKED — Supabase access unavailable`, hand off or defer; do not fake.
- Separate-project cost not approved → default to preview branches for all non-prod; record as documented debt.

## Close (core.md §29/§36a/§35c)
1. `bash scripts/agent/sprint-doctor.sh cicd-release-governance RG-R5 <agent>`.
2. **Requirement gates (core.md §35c):** `<changed-files>` via `git diff --name-only`, then `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, `npm run req:completion-gate -- --changed <changed-files>`. The `dcx-sprint-close` skill bundles steps 1–2; must return PASS / PASS_WITH_QUEUED_REVIEW.
3. Carry-forward: Supabase env model + migration gating live; OD-RG-05 resolution.
4. Session log + `bash scripts/build-log-index.sh`.
