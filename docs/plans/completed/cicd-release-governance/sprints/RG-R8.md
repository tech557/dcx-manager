---
sprint: RG-R8
plan: cicd-release-governance
title: First-production bootstrap (one-time)
family: dogfood / bootstrap
executor: Claude / opencode + PO approval (PO is the only approver)
required-tools: git, Vercel, browser/Playwright
depends-on: RG-R4, RG-R7
allowed-writes: docs/releases/registry.csv (one seed row via append-release-row.sh), docs/releases/approvals/v0.3.5.0-production.md, output/RG-R8-*.md
forbidden-writes: src/**
status: Completed
Status: Completed
---

# RG-R8 — First-production bootstrap (one-time)

The very first production release is **not** an ordinary promotion: there is no prior verified registry
row, CI history, or promoted-artifact lineage. This one-time sprint seeds `v0.3.5.0` manually, binds it to
the approved existing build, records the PO approval, sets the production alias **once**, then hands off to
the normal §2.3 promotion rules. After this, no further bootstrap is ever needed.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PROD-004, REQ-RG-APPROVAL-005, REQ-RG-VER-006, REQ-RG-RESET-010 (bootstrap value), D-RG-VER — **Status: approved — canonical graph nodes, PO-locked 2026-06-30 (ledger LDG-2026-06-30-create-node-REQ-RG-*; OD-RG-07 closed)** |
| Acceptance IDs | AC-RG-8-1 … AC-RG-8-6 |
| Expected manifestations | one seed registry row `v0.3.5.0`; `approvals/v0.3.5.0-production.md`; production alias pointing at the approved build |
| Verification (EVD) | production URL serves the bound deployment; registry shows `promoted-prod`; approval record exists |

## Step 0 — Continuity & environment (mandatory)
1. Read carry-forward (everything live; dogfood passed); §3.2a (bootstrap = `v0.3.5.0`, carry-as-is, manual "version 0"); §2.3 gate.
2. `bash scripts/agent/build-current-state.sh`; log.

## Scope
- **Allowed:** seed the single `v0.3.5.0` row; write the production approval record (on PO sign-off); set the prod alias once.
- **Forbidden:** `src/**`; bumping to v0.3.6 (PO decided carry-as-is); auto-promotion; any second bootstrap.

## Steps (exact)
1. Identify the build to bind: the current deployed/approved existing build (the manual "version 0"). Record its commit + Vercel `deployment_id`.
2. `append-release-row.sh` → seed row: `version=v0.3.5.0`, `change_class=bootstrap`, the bound commit + deployment_id, `status=verified`, note "manual version-0 bootstrap".
3. **PO approval (the gate):** PO flips ClickUp "Approved for Production" (OD-RG-09) → write `docs/releases/approvals/v0.3.5.0-production.md` (approved_by, approved_at, deployment_id).
4. `promote.sh v0.3.5.0 production` → validates the four §2.3 layers → sets the production alias to the bound deployment **once**. No rebuild.
5. Confirm production URL serves that exact deployment; registry row → `promoted-prod`.
6. Hand-off note: from here, all releases follow normal rules (source → Iteration + preview; promotions PO-approved). No bootstrap path runs again.

## Output
`output/RG-R8-first-production.md` — the bound build identity, the seed row, the approval record reference, the alias-set evidence (screenshot → evidence/), and the hand-off-to-normal-rules statement.

## Acceptance criteria
| ID | Criterion | Verification |
|---|---|---|
| AC-RG-8-1 | `v0.3.5.0` seed row created (carry-as-is, not v0.3.6) | registry row present, version exact |
| AC-RG-8-2 | Bound to the approved existing build (exact deployment_id) | row + alias share the deployment_id |
| AC-RG-8-3 | PO production approval record exists before alias move | approvals/ file timestamp precedes alias-set |
| AC-RG-8-4 | Production alias set **once**, no rebuild | same deployment_id; build count unchanged |
| AC-RG-8-5 | Subsequent releases use normal rules (no second bootstrap) | hand-off note; bootstrap path not re-runnable |
| AC-RG-8-6 | no `src/**` changed | name-only diff |

## Gates (core.md §11)
| Gate | Applies | How |
|---|---|---|
| no-`src/**` proof | YES | name-only diff |
| §2.3 promotion gate | YES | `promote.sh` refuses without the approval record |
| browser | YES | screenshot production serving the bound build → evidence/ |

## Fallbacks (core.md §28)
- PO not ready to approve production → stop after the seed row; mark AC-RG-8-3..4 `BLOCKED — awaiting PO production approval`; never set the prod alias without the record.
- Vercel Pattern B in force (from RG-R4) → bootstrap binds via the branch mechanism; explicitly note the exact-build caveat the PO accepted.

## Close (core.md §29/§36a/§35c)
1. `bash scripts/agent/sprint-doctor.sh cicd-release-governance RG-R8 <agent>`.
2. **Requirement gates (core.md §35c):** `<changed-files>` via `git diff --name-only`, then `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, `npm run req:completion-gate -- --changed <changed-files>`. The `dcx-sprint-close` skill bundles steps 1–2; must return PASS / PASS_WITH_QUEUED_REVIEW.
3. Carry-forward: first production live at `v0.3.5.0`; system now fully on normal rules.
4. Session log + `bash scripts/build-log-index.sh`. **Plan close:** RG-R8 closing does **not** by itself complete the plan. RG-R0b/RG-R3/RG-R4 closed **Partial** with PO-owned items still open (repo-privacy, branch protection, deployment protection). Per §29 plan-level and the README **Plan-level status** section, the PO moves the plan to `completed/` **only** once those three Partial items are resolved **or** the PO explicitly accepts them as permanent/tracked debt. Do not archive the plan while any of the three remains an unaccepted open item.
