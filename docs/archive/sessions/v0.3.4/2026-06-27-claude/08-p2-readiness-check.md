## folder-structure-v2 — P2 readiness check + methodology fixes
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-27
Status: Completed

Intent: Confirm it is safe to start P2; fix any plan-methodology bugs in P2 against the post-P1 tree and the new core.md §27-§30 process.
Trigger: user request — "are we ready to start p2 now? please fix any plan methodology bugs and ensure we are ready to safely start p2."
Requirements covered: N/A — readiness audit + sprint-file fixes, no product source changed.

## Premise verification (live, post-P1) — all P2 assumptions hold
- 10 orphan files all still exist (LockBadge/ReadinessBadge/StatusBadge/FieldIndicator/DateInputTBD/DualInput/TextInputSmall/SearchableSelect/SearchableSelectIcons/DayCard).
- Atoms exist: src/ui/atoms/{Badge,Chip,Input,ToggleGroup}.tsx + index.ts.
- Barrels still re-export the orphans (inputs: DateInputTBD/DualInput/TextInputSmall; selects: SearchableSelect/SearchableSelectIcons).
- GlassSurface.tsx exists; ~8 glass consumers live.

## Green-base verification (P1 left a clean base)
- npm run typecheck: PASS (0 errors)
- npm run test: PASS (27/27, 6 files)
- npm run validate:architecture: PASS (276 modules, 559 deps, 0 violations)
- npm run build: PASS (5.77s); confirmed `text-dcx-*` utilities ARE generated in dist CSS → P1's CSS-partial split + @theme-in-partial works end-to-end.

## Methodology bugs found in P2 and fixed
1. Step 7 (Glass) did not reuse P1's new structure — risked re-hardcoding rgba literals. Added carry-forward guidance: reuse `--theme-*`/`--theme-component-surface-*` tokens from styles/tokens.css; edit global glass CSS in styles/components.css (NOT index.css); added a grep proving 0 new literals.
2. Step 8 browser gate had no §28 fallback — Playwright Chromium is missing in this env. Added the dev-smoke fallback (HTTP 200 + console), screenshot gate BLOCKED → PASS WITH DOCUMENTED DEBT.
3. No mandatory final continuity-wiring step (§27). Added Step 9 — update the README carry-forward contract with what P2 changed (P2 not closeable without it).
4. Acceptance criteria extended: glass-token reuse / 0 new literals; browser-fallback option; Step 9 carry-forward update. Softened the stale "9 files" glass count to "~9 (re-verify)".

## Files
Files edited:
  docs/plans/active/folder-structure-v2/sprints/P2-component-consolidation.md — Step 7 carry-forward/token reuse; Step 8 §28 fallback; new Step 9 continuity wiring; acceptance criteria
Files created:
  docs/progress/sessions/2026-06-27-claude/08-p2-readiness-check.md (this log)
Files deleted: None
Build artifact: dist/ created by the readiness build (standard output).

Churn — work reversed: None. P2 premises unchanged; fixes are methodology alignment.

Preserve-semantic check: P2 still reconciles onto existing atoms, barrel-safe deletion, no duplicate primitives. New guidance enforces reuse of P1's split CSS + tokens (core.md §7/§27).

Acceptance criteria:
  □ P2 premises verified against live tree: PASS
  □ Green base confirmed (typecheck/test/arch/build incl. text-dcx generation): PASS
  □ P2 methodology bugs fixed (glass token reuse, §28 fallback, §27 final step, acceptance): PASS
  □ Go/no-go delivered: GO

Gates (this session's base check):
  typecheck: PASS
  test: PASS (27/27)
  validate:architecture: PASS
  build: PASS (text-dcx-* present in dist CSS)
  browser manual check: N/A — readiness audit, no app behavior changed

Consumer updates required: None.

Verdict: READY to start P2.

Open issues / follow-ups:
  - When P2 runs: it must honor Step 0 (read carry-forward) and Step 9 (update carry-forward), and use the §28 fallback for the screenshot gate (Playwright Chromium missing).
  - Pre-existing: lint backlog (157, accepted per gate); sync-skills.sh plan-audit truncation; build-log-index.sh mislabel; P1b-color-tokens; production-api-client-switch; Quality-gates BLD ID.

index: hand-appended to docs/progress/index.csv (build-log-index.sh mislabels/duplicates — known tooling debt).
