---
sprint: RG-R2
plan: cicd-release-governance
title: Release registry + scripts
family: tooling
executor: Claude / Codex / opencode
required-tools: bash; bats or shell test harness
depends-on: RG-R1
allowed-writes: docs/releases/**, scripts/release/**, output/RG-R2-*.md
forbidden-writes: src/**
status: Completed
Status: Completed
---

# RG-R2 — Release registry + scripts

Builds the operational record (`registry.csv`) and the scripts that write/validate it. This is where later
token savings begin — coordination moves from agent memory into files + validators.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-CSV-012, REQ-RG-MD-013, REQ-RG-MAP-016, REQ-RG-ITER-008/REV-009 (classifier), REQ-RG-AUTO-019 — **Status: approved — canonical graph nodes, PO-locked 2026-06-30 (ledger LDG-2026-06-30-create-node-REQ-RG-*; OD-RG-07 closed)** |
| Acceptance IDs | AC-RG-2-1 … AC-RG-2-7 |
| Expected manifestations | `docs/releases/{README.md,registry.csv,approvals/.gitkeep}`; `scripts/release/{classify-change,append-release-row,build-release-views,validate-release-registry,claim-version}.sh`; tests |
| Verification (EVD) | script tests pass; validator catches a seeded duplicate version |

## Step 0 — Continuity & environment (mandatory)
1. Read carry-forward + §3.3/§3.5/§3.6 (schema) + §4 (concurrency).
2. `bash scripts/agent/build-current-state.sh`; log.

## Scope
- **Allowed:** `docs/releases/**`, `scripts/release/**`, tests.
- **Forbidden:** `src/**`; wiring CI (RG-R3) or Vercel (RG-R4); moving any alias.

## Steps (exact)
1. Create `docs/releases/registry.csv` with the §3.6 header row only; `docs/releases/approvals/.gitkeep`; `docs/releases/README.md` (how to read it; promotion runbook stub).
2. `classify-change.sh <base> <head>`: emits `source`|`non-source` from the diff path-set (§3.3). Path-set is authoritative. **Also define a single disposable dogfood fixture** `dogfood/source-probe.txt` that the classifier counts as **source** (an explicit allowlist entry, used only by RG-R7) and `dogfood/doc-probe.txt` that stays **non-source** — so RG-R7 can exercise both paths without touching product `src/**`.
3. `append-release-row.sh`: **append-only** new row; refuses to edit an existing version; corrections = superseding row.
4. `build-release-views.sh`: regenerate a derived summary view (disposable).
5. `validate-release-registry.sh`: fail on duplicate `version`, two `verified`/`approved` rows for the same env at different builds, malformed rows.
6. `claim-version.sh`: fallback reservation (optimistic; appends a `reserved` row).
7. **Tooling portability (core.md §36b):** derive paths from `"$(dirname "$0")/.."` — no absolute/home paths; scripts idempotent.
8. Write tests: a happy-path append, a duplicate-version rejection, a classifier source vs non-source case.

## Output
`output/RG-R2-registry.md` — schema recap, script contracts (inputs/outputs/exit codes), test results (counts computed, not hand-typed).

## Acceptance criteria
| ID | Criterion | Verification |
|---|---|---|
| AC-RG-2-1 | `registry.csv` exists with the exact §3.6 columns | head -1 matches schema |
| AC-RG-2-2 | classifier returns `source` for an `src/` diff, `non-source` for a `docs/` diff | run both cases |
| AC-RG-2-3 | append-only writer adds a row, **refuses** to edit existing | test asserts refusal |
| AC-RG-2-4 | validator rejects a seeded duplicate version | test exits non-zero |
| AC-RG-2-5 | no absolute/home paths in any script | `grep -rn '/Users/\|/home/' scripts/release` empty |
| AC-RG-2-6 | scripts idempotent (re-run = no-op/clean) | run twice |
| AC-RG-2-7 | no `src/**` changed | name-only diff |

## Gates (core.md §11)
| Gate | Applies | How |
|---|---|---|
| no-`src/**` proof | YES | name-only diff |
| shell tests | YES | test harness exits 0 |
| validate:architecture/typecheck | N/A | no TS source changed |
| verify.sh | YES | run; no forbidden patterns |

## Fallbacks (core.md §28)
- No bats installed → plain `bash` assertion script; label the harness used.
- CSV-in-git conflict semantics can't be demoed without git → simulate with two appended rows + validator; note live conflict proof deferred to RG-R7.

## Close (core.md §29/§36a/§35c)
1. `bash scripts/agent/sprint-doctor.sh cicd-release-governance RG-R2 <agent>`.
2. **Requirement gates (core.md §35c):** `<changed-files>` via `git diff --name-only`, then `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, `npm run req:completion-gate -- --changed <changed-files>`. The `dcx-sprint-close` skill bundles steps 1–2; must return PASS / PASS_WITH_QUEUED_REVIEW.
3. Carry-forward: registry + scripts now exist (list exact paths); validator contract.
4. Session log + `bash scripts/build-log-index.sh`.
