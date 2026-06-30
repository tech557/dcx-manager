## frontend-polish-v0.3.5 — audit response (Codex NEEDS REVISION → resolved)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-28
Status: Completed

Intent: Resolve the 4 blocking + 1 advisory issues in Codex's plan audit so frontend-polish-v0.3.5 is activation-ready.
Trigger: user request (PO) — "codex has completed the plan audit and marked it as not ready"; audit at `docs/plans/drafted/frontend-polish-v0.3.5/audit/2026-06-28-codex.md` (verdict NEEDS REVISION, 4 blocking, 1 advisory).
Requirements covered: N/A — planning revision; no product src changed.

## Classification (core.md §25)
User-initiated PLANNING (audit response). Docs only; no source changed. Continuation of session
`2026-06-28-claude-02` → this is log `02` in the same folder (§31: same run continuing → same folder).

## Audit verified first
Read Codex's audit + its session log. The blockers are legitimate and surface two new PO clarifications
(captured by Codex): (a) success = three task families `change-token` / `change-component` /
`wire-mockup-data` with `impeccable` routed to Claude only; (b) a live-builder interaction inventory is
required. Verified the advisory against the live tree: `src/components/` does NOT exist; shared deps are
`src/ui/**`, `src/hooks/**`, `src/builder/ui/**`. Enumerated 13 builder islands and the `src/mock/*.mock.ts`
data home for the wire-mockup-data family. Confirmed Playwright test + dev server available for FP-R0 evidence.

## Resolutions (each blocker → fix)
1. **Write-scope contradiction (all sprints).** README hard-scope rule rewritten: allowed writes =
   `output/*.md` + README carry-forward + `audit/*` + progress log; gate = "no `src/` write" (path +
   mtime), not "only output/". Updated the acceptance criterion + verification row in FP-R1..FP-R5.
2. **Decision closure (FP-R4/R5).** Added mandatory `output/decision-register.md`: FP-R4 opens it
   (every ❓ a row with status), FP-R5 closes it. FP-R5 may NOT draft an executable sprint for any
   `PO decision required` item — those are parked. Added to README DoD + both sprints' criteria.
3. **Three task families + agent routing (FP-R5).** Added the PO success condition to README Goal
   (three-family table, impeccable = Claude-only). FP-R5 scope rewritten to output a three-family
   agent/task matrix (`change-token` Claude+impeccable brand-only / `change-component`
   dcx-frontend-refactor / `wire-mockup-data` vs `src/mock/*`), each drafted sprint naming executor,
   skill, scope, source data, gates.
4. **Live-builder interaction inventory (new FP-R0).** Created `sprints/FP-R0-live-builder-inventory.md`
   — browser-backed (Playwright MCP, dev-smoke §28 fallback) inventory of every island + core card
   flow: drag/drop, editor inputs, text styles, w/h/radius/font-size token drift, island open/close,
   popups, confirmations, reduced-motion; each gap classified into a family or `PO decision`. Added to
   README sprint index, execution diagram (R0–R4 parallel → R5), DoD, and carry-forward facts.
- **Advisory (src/components):** removed stale refs in README + FP-R3; replaced with the live shared-dep
  homes.

Files created:
  docs/progress/sessions/2026-06-28-claude-02/02-fe-polish-audit-response.md — this log
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R0-live-builder-inventory.md — new sprint
Files edited:
  docs/plans/drafted/frontend-polish-v0.3.5/README.md — audit-response section, success condition,
    write-scope rule, FP-R0 in index/diagram/DoD, decision-register in DoD, carry-forward facts, src/components fix
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R1-brandbook-reconciliation.md — write-scope criterion + row
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R2-token-audit-metrics.md — write-scope criterion + row
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R3-modularization-audit.md — write-scope + src/components fix
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R4-behavior-finalize-spec.md — decision register + family tag + write-scope
  docs/plans/drafted/frontend-polish-v0.3.5/sprints/FP-R5-synthesis-metrics.md — three-family matrix + decision close + write-scope
Files deleted: None

Churn — work reversed: None. This refines the same draft Codex audited (no prior work undone).

Preserve-semantic check: No product code changed. No token/CSS/component/hook/service/rule edited.
Plan remains DRAFTED (read-only) and discovery-only. impeccable governance unchanged (brand-only, Claude-only).

Open decisions used: None silently. The plan now routes all open questions to a decision register
rather than defaulting them.

Gates:
  typecheck: N/A — no source changed
  dev: N/A — no source changed
  verify.sh: N/A — no source changed
  browser manual check: N/A — docs/planning only

Consumer updates required: None.

## Status / next step
All 4 blocking + 1 advisory issues resolved; plan README carries the audit-response table. Plan is now
6 sprints (FP-R0..R5), still DRAFTED. Recommend PO either re-run the Codex `dcx-plan-audit` to confirm
READY, or activate by moving `docs/plans/drafted/frontend-polish-v0.3.5/` → `docs/plans/active/`.
FP-R0 (live builder) + FP-R1–R4 then run in parallel; FP-R5 last. First impeccable use = FP-R1 (Claude).

## Carried debt (unchanged)
- `metadata.json` stale boilerplate (v0.3.3 / "DSP" app) — PO decision pending.
- `build-log-index.sh` dup bug — index hand-corrected this cycle; Codex hit the same and removed its dup.
