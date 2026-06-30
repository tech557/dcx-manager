## frontend-polish-v0.3.5 — re-audit (round 3) response: 2 blocking + 2 advisory resolved
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-28
Status: Completed

Intent: Resolve the round-3 re-audit's 2 blocking + 2 advisory issues so frontend-polish-v0.3.5 is activation-ready.
Trigger: user request (PO) — "Re-audit complete ... NEEDS REVISION with 2 blocking issues and 2 advisory issues." Audit at `docs/plans/drafted/frontend-polish-v0.3.5/audit/2026-06-28-codex-reaudit.md`.
Requirements covered: N/A — planning revision; no product src changed.

## Re-audit confirmed prior rounds resolved
The round-3 re-audit (fresh file `audit/2026-06-28-codex-reaudit.md`, distinct from the round-1/2
`2026-06-28-codex.md`) confirmed all prior scope/decision/three-family/live-builder/brand-UI blockers
are resolved, and raised 2 new blocking + 2 advisory — all legitimate and precise.

## Resolutions
**Blocker 1 — `output/evidence/**` vs allowed-writes.** FP-R0 requires screenshots under
`output/evidence/` but the write-gate listed only `output/*.md` + README carry-forward + audit + log.
Added `output/evidence/**` to the README hard-scope allowed-writes AND to every sprint's no-source-change
acceptance row (FP-R0..R5). Forbidden boundary unchanged: "no `src/` write".

**Blocker 2 — `impeccable` two conflicting meanings.** README said impeccable = brand-system-only, but
FP-R0 used it for live-builder visual assessment. Split into two explicit modes (README hard-scope +
`docs/agent-skills.md`):
- `impeccable-brand-audit` (FP-R1 + future change-token): inspects/recommends `src/brand/` only;
  markdown in discovery, `src/brand/**` edits only in a change-token sprint.
- `impeccable-visual-review` (FP-R0): Claude-only, inspects the RUNNING UI (screenshots) read-only,
  writes markdown findings only, ZERO source edits (no brand/component/token changes).
Clarified inspect-vs-edit so the standing `agent-skills.md` brand-only rule stays coherent.

**Advisory 1 — FP-R5 intent.** Changed "Combine FP-R1…R4" → "Combine FP-R0…R4".
**Advisory 2 — README audit-response.** Restructured into a "Current status" line pointing to the
round-3 re-audit + verdict, with rounds 1–2 history collapsed into a `<details>` block.

Files created:
  docs/progress/sessions/2026-06-28-claude-02/04-fe-polish-reaudit-response.md — this log
Files edited:
  docs/plans/drafted/frontend-polish-v0.3.5/README.md — evidence in allowed-writes; impeccable two-mode split; audit-response restructure
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R0-live-builder-inventory.md — impeccable-visual-review mode; evidence in write-gate
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R1-brandbook-reconciliation.md — impeccable-brand-audit mode; evidence in write-gate
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R2-token-audit-metrics.md — evidence in write-gate
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R3-modularization-audit.md — evidence in write-gate
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R4-behavior-finalize-spec.md — evidence in write-gate
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R5-synthesis-metrics.md — intent FP-R0…R4; evidence in write-gate
  docs/agent-skills.md — impeccable two-mode governance (edit brand-only; visual-review read-only)
Files deleted: None

Churn — work reversed: None.

Preserve-semantic check: No product code changed. No token/CSS/component/hook/service/rule edited.
Plan remains DRAFTED, discovery-only, 6 sprints (FP-R0..R5).

Open decisions used: None silently. v0.1.4 reference remains a `PO decision required` register item.

Gates:
  typecheck: N/A — no source changed
  dev: N/A — no source changed
  verify.sh: N/A — no source changed
  browser manual check: N/A — docs/planning only

Consumer updates required: None.

## Status / next step
Round-3's 2 blocking + 2 advisory all resolved. Verified: every sprint write-gate includes
`output/evidence/**`; impeccable modes consistent across README/FP-R0/FP-R1/agent-skills.md; FP-R5
intent fixed. Recommend a confirming re-audit, or activation (move to `docs/plans/active/`).
Still pending PO: supply or waive the v0.1.4 homepage/version reference before those page sprints draft.

## Carried debt (unchanged)
- `metadata.json` stale boilerplate (v0.3.3 / "DSP" app) — PO decision pending.
- `build-log-index.sh` folder-only-key bug — index hand-maintained; separate fix task spawned.
