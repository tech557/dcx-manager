---
audit-of: frontend-polish-v0.3.5
auditor: codex-reaudit
date: 2026-06-28
verdict: NEEDS REVISION
blocking-issues: 2
advisory-issues: 2
---

# Plan Audit: frontend-polish-v0.3.5

## Verdict

NEEDS REVISION

**Reason:** The current draft resolves the prior scope, decision, three-family, live-builder, and brand/UI blockers, but FP-R0 still contradicts the allowed-write rule for screenshot evidence and the plan gives two incompatible meanings to `impeccable`.

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | README / FP-R0 | FP-R0 requires screenshot artifacts under `output/evidence/`, but the hard scope and sprint write gates allow only `output/*.md`, README carry-forward, `audit/*`, and progress logs. An executor following the plan literally cannot both capture screenshot evidence and pass the allowed-write gate. | README lines 104-107 define allowed writes and omit `output/evidence/*`; FP-R0 lines 23-24 require screenshots in `output/evidence/`; FP-R0 lines 34 and 53-55 require/list `output/evidence/*`; FP-R1/FP-R5 write gates still say `output/*.md` only. | Add `output/evidence/*` or `output/evidence/**` to the hard scope allowed writes and to every no-source-change acceptance/verification row. Keep the forbidden boundary as "no `src/` write." |
| 2 | README / FP-R0 / FP-R1 / FP-R5 | `impeccable` routing is internally inconsistent. The README says `impeccable` is "brand-system only" and the three-family table allows it only for `change-token`, but FP-R0 also requires `impeccable` for live-builder visual assessment. That will confuse Claude/opencode/Codex about whether `impeccable` may inspect builder screenshots or only inspect `src/brand/`. | README lines 92 and 96-97 define `impeccable` as Claude-only brand-system only; README lines 108-110 say it must not touch `src/ui` or `src/builder`; README line 125 lists FP-R0 as using `impeccable` visual assessment; FP-R0 lines 23-29 require `impeccable` for live builder look/feel gaps while saying it does not edit brand files. | Split governance into explicit modes: `impeccable-brand-audit` for FP-R1 and future `change-token` sprints, allowed to inspect/write only brand-token recommendations; `impeccable-visual-review` for FP-R0, Claude-only, allowed to inspect screenshots/running UI and write markdown findings only, with zero source edits and no component/token changes. Or remove `impeccable` from FP-R0. |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | FP-R5 | FP-R5's intent still says it combines `FP-R1…R4`, omitting FP-R0, even though Step 0 and the rest of the sprint correctly consume R0. | FP-R5 lines 4-5 say "Combine FP-R1…R4"; FP-R5 lines 8-11 read `output/FP-R0..FP-R4`. | Change intent to "Combine FP-R0…R4". |
| 2 | README | The audit-response section now says Codex's round-two audit scored a stale snapshot and that prior issues were resolved. That historical note is less useful after this re-audit and may make readers ignore the current audit folder. | README lines 21-26 describe the prior re-audit as stale; a fresh re-audit now exists at `audit/2026-06-28-codex-reaudit.md`. | Add one line under the audit response section pointing to the current re-audit and its verdict, or move the stale-snapshot note below a dated history subsection. |

## Prior art compliance

Prior art compliance is now acceptable. The README keeps `prior-art:` entries for expired UI/UX and frontend discovery plus completed v2/folder-structure plans. The carry-forward contract correctly states that v2 outputs must be re-verified against live `v0.3.5`, not copied as current counts. It also reflects the post-folder-structure source homes and removes stale `src/components/**` as current-state guidance.

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| FP-R0 | N/A | N/A | N/A | N/A | Playwright/dev-smoke | Discovery sprint; browser evidence required. Needs allowed-write fix for screenshots. |
| FP-R1 | N/A | N/A | N/A | N/A | N/A | Discovery sprint; Claude + `impeccable` brand audit. Needs `impeccable` mode wording clarified against FP-R0. |
| FP-R2 | N/A | N/A | N/A | N/A | N/A | Discovery sprint; `code-query.sh hardcoded-tokens` exists. |
| FP-R3 | N/A | N/A | N/A | N/A | N/A | Discovery sprint; `wc -l` and code-query/manual grep fallback are sufficient. |
| FP-R4 | N/A | N/A | N/A | N/A | N/A | Spec sprint; v0.1.4 gate and decision register are explicit. |
| FP-R5 | N/A | N/A | N/A | N/A | N/A | Synthesis sprint; three-family matrix and decision-register blocking rules are explicit. |

## Handoff quality

Handoff quality is mostly strong now. FP-R0 supplies live evidence and family classification, FP-R1 supplies brand/token interpretation, FP-R2 supplies token metrics, FP-R3 supplies split candidates, FP-R4 supplies finalize specs and decisions, and FP-R5 consumes all of them into a three-family implementation matrix.

The main handoff risk is `impeccable` ambiguity: without explicit "visual review only" vs "brand audit" modes, the FP-R0 output may be either skipped or over-scoped.

## Ready checklist

- [ ] All blocking issues resolved
- [x] Prior art findings incorporated
- [x] Every sprint has executor named
- [x] Every code-modifying sprint has gate coverage
- [x] Session start steps present in each sprint
- [x] (2+ sprints) Carry-forward contract present; every sprint reads it (Step 0) and updates it (final step)
- [x] Tool-dependent criteria have a documented fallback (core.md §28)
