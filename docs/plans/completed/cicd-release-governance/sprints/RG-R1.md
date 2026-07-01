---
sprint: RG-R1
plan: cicd-release-governance
title: Versioning model + rule changes (docs)
family: governance-docs
executor: Claude / Codex / opencode
required-tools: bash
depends-on: RG-R0a
allowed-writes: docs/VERSION.md, docs/agent-rules/core.md, docs/agent-rules/log-format.md, scripts/build-log-index.sh, README decision register, output/RG-R1-*.md
forbidden-writes: src/**
status: Completed
Status: Completed
---

# RG-R1 — Versioning model + rule changes

Encodes the 4-part scheme and split ownership in the canonical rule docs, **before** any auto-assignment
tooling exists. This is `Type: process-governance` work.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-VER-006, REQ-RG-OWN-007, REQ-RG-ITER-008, REQ-RG-REV-009, REQ-RG-RESET-010, REQ-RG-LOG-011 — **Status: approved — canonical graph nodes, PO-locked 2026-06-30 (ledger LDG-2026-06-30-create-node-REQ-RG-*; OD-RG-07 closed)** |
| Acceptance IDs | AC-RG-1-1 … AC-RG-1-6 |
| Expected manifestations | edited `VERSION.md`, `core.md §26`+new Release-Governance §, `log-format.md §0`, `build-log-index.sh` |
| Verification (EVD) | grep for the new fields/sections; `build-log-index.sh` runs clean with new columns |

## Step 0 — Continuity & environment (mandatory)
1. Read carry-forward + Decisions (D-RG-VER) + §3.1/§3.2/§3.2a of the plan.
2. `bash scripts/agent/build-current-state.sh`; log.

## Scope
- **Allowed:** the rule docs + the index builder + README decision register.
- **Forbidden:** `src/**`; building registry/scripts (that is RG-R2); changing the version number itself beyond documenting `v0.3.5.0` as the bootstrap.

## Steps (exact)
1. `docs/VERSION.md`: extend to 4-part `Major.Stage.Iteration.Revision`; document split ownership (PO owns Major.Stage; system owns Iteration.Revision); add the migration note `v0.3.5 → v0.3.5.0` (carry as-is, manual "version 0"); supersede the 3-part semantics; keep the old table as "legacy (pre-governance)".
2. `core.md §26`: rewrite from "agents never change the version" → split ownership + the §3.2 increment/reset rules; cross-reference this plan.
3. `core.md` new section "Release Governance": point to `docs/releases/`, the promotion gate (§2.3), and the no-auto-promotion rule.
4. `log-format.md §0`: add `Version:` and `Change-Class:` to the identity block (additive; old logs render `—`).
5. `scripts/build-log-index.sh`: add `version`, `change_class` columns (additive; old rows empty). Keep it idempotent.
6. Run `bash scripts/build-log-index.sh` → confirm it still succeeds and new columns appear.

## Output
`output/RG-R1-version-model.md` — what changed in each file + before/after of the §26 rule + a sample 4-part log header.

## Acceptance criteria
| ID | Criterion | Verification |
|---|---|---|
| AC-RG-1-1 | VERSION.md documents 4-part scheme + split ownership | grep `Major.Stage.Iteration.Revision` + ownership rows |
| AC-RG-1-2 | Migration note `v0.3.5 → v0.3.5.0` present | grep |
| AC-RG-1-3 | core.md §26 rewritten (no longer "agents never change the version") | grep old phrase absent; new rule present |
| AC-RG-1-4 | log-format §0 has `Version:` + `Change-Class:` | grep |
| AC-RG-1-5 | index builder adds columns + runs clean; **old logs untouched** | run script; diff old rows unchanged |
| AC-RG-1-6 | No `src/**` changed | `git diff --name-only` excludes `src/` |

## Gates (core.md §11)
| Gate | Applies | How |
|---|---|---|
| no-`src/**` proof | YES | name-only diff |
| index integrity | YES | `build-log-index.sh` exits 0; `index.csv` parses |
| typecheck/lint/validate:architecture/test | N/A | no source/TS changed |

## Fallbacks (core.md §28)
- If editing `build-log-index.sh` risks breaking the hook → add columns in a backward-compatible way (append at end); if it errors, revert the script change and mark AC-RG-1-5 `BLOCKED`, log it.

## Close (core.md §29/§36a/§35c)
1. `bash scripts/agent/sprint-doctor.sh cicd-release-governance RG-R1 <agent>`.
2. **Requirement gates (core.md §35c):** `<changed-files>` via `git diff --name-only`, then `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, `npm run req:completion-gate -- --changed <changed-files>`. The `dcx-sprint-close` skill bundles steps 1–2; must return PASS / PASS_WITH_QUEUED_REVIEW.
3. Carry-forward: VERSION.md/core.md/log-format now 4-part; index has version/change_class columns.
4. Session log + `bash scripts/build-log-index.sh`.
