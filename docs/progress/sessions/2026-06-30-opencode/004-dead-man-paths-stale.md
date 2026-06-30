## DEAD-MAN-PATHS — 9 manifestation nodes marked stale
Agent: opencode
Model: deepseek-v4-flash-free
Provider: opencode
Date: 2026-06-30
Type: process-governance
Status: Completed
PO-Action: none

Intent: Mark manifestation nodes stale where current_paths point to files that no longer exist on disk.
Trigger: PO-approved sweep — session 2026-06-30 dead-path audit (dead: 9)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | docs/product/requirements/graph/nodes/manifestation/function/MAN-function-docs-plans-active-requirements-system-output-rs-r6-build-notes.json | Added stale_state + stale_reason | 25 (was 23) |
| edited | docs/product/requirements/graph/nodes/manifestation/function/MAN-function-docs-plans-active-requirements-system-output-rs-r7-persist-pass.json | Added stale_state + stale_reason | 25 (was 23) |
| edited | docs/product/requirements/graph/nodes/manifestation/function/MAN-function-docs-plans-active-requirements-system-output-rs-r7-reconciliation-report.json | Added stale_state + stale_reason | 25 (was 23) |
| edited | docs/product/requirements/graph/nodes/manifestation/function/MAN-function-docs-plans-active-requirements-system-output-rs-rollout-calibration-mode.json | Added stale_state + stale_reason | 25 (was 23) |
| edited | docs/product/requirements/graph/nodes/manifestation/function/MAN-function-docs-plans-active-requirements-system-readme.json | Added stale_state + stale_reason | 25 (was 23) |
| edited | docs/product/requirements/graph/nodes/manifestation/function/MAN-function-docs-plans-active-requirements-system-sprints-rs-r6-migrate-seed-datamodel.json | Added stale_state + stale_reason | 25 (was 23) |
| edited | docs/product/requirements/graph/nodes/manifestation/skill/MAN-skill-dcx-manifestation-reconcile.json | Added stale_state + stale_reason | 23 (was 21) |
| edited | docs/product/requirements/graph/nodes/manifestation/skill/MAN-skill-dcx-requirement-intake.json | Added stale_state + stale_reason | 23 (was 21) |
| edited | docs/product/requirements/graph/nodes/manifestation/skill/MAN-skill-dcx-requirement-maturation.json | Added stale_state + stale_reason | 23 (was 21) |

### Evidence table
| Dead path | Owning node | PRE stale_state | POST stale_state | ls check | req:validate |
|---|---|---|---|---|---|
| docs/plans/active/requirements-system/output/RS-R6-build-notes.md | MAN-function-…-rs-r6-build-notes | null | "stale" | No such file | pass: true |
| docs/plans/active/requirements-system/output/RS-R7-persist-pass.md | MAN-function-…-rs-r7-persist-pass | null | "stale" | No such file | pass: true |
| docs/plans/active/requirements-system/output/RS-R7-reconciliation-report.md | MAN-function-…-rs-r7-reconciliation-report | null | "stale" | No such file | pass: true |
| docs/plans/active/requirements-system/output/RS-rollout-calibration-mode.md | MAN-function-…-rs-rollout-calibration-mode | null | "stale" | No such file | pass: true |
| docs/plans/active/requirements-system/README.md | MAN-function-…-readme | null | "stale" | No such file | pass: true |
| docs/plans/active/requirements-system/sprints/RS-R6-migrate-seed-datamodel.md | MAN-function-…-rs-r6-migrate-seed-datamodel | null | "stale" | No such file | pass: true |
| .agents/skills/dcx-manifestation-reconcile/SKILL.md | MAN-skill-dcx-manifestation-reconcile | null | "stale" | No such file | pass: true |
| .agents/skills/dcx-requirement-intake/SKILL.md | MAN-skill-dcx-requirement-intake | null | "stale" | No such file | pass: true |
| .agents/skills/dcx-requirement-maturation/SKILL.md | MAN-skill-dcx-requirement-maturation | null | "stale" | No such file | pass: true |

### Final gates
| Gate | Result |
|---|---|
| req:folder-index | 798 nodes indexed |
| req:validate (final) | pass: true |
| Disk confirm (none of 9 paths exist) | PASS |
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no code changes |
