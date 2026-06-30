## folder-structure-v2 — P1 output feedback + CSS-decomposition gap
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-27
Status: Completed

Intent: Review Codex's completed P1 output, write reviewer feedback, and answer the PO on whether breaking down index.css is planned.
Trigger: user request — "claude has completed P1 ... index file is too large and non broken down, some values inside the CSS still hold custom token values ... write your output feedback on P1 and let me know if we are planning breaking down the CSS later or that's it."
Requirements covered: N/A — review/planning, no product/source code changed.

## Findings (verified live against src/brand/index.css, 827 lines)
- P1 implementation is correct and gate-clean except lint: 11 `--text-*` variants → `text-dcx-*`; 272 arbitrary usages → 0; phantom font/shadow/radius confirmed 0; app-JSX hex → 0; 3 dead classes + 3 dead exports removed; 6 tokens added; 311 theme colors retained. typecheck/arch/test/build/dev-smoke PASS.
- Lint "blocker" is a status issue, not code: 157 problems are pre-existing repo-wide debt; P1 added 0 new. README execution gate allows `max-warnings 0 (or pre-existing documented)` → P1 is eligible for sign-off with the backlog documented.
- PO's two observations CONFIRMED and both OUT of scope for P1 and every sprint:
  1. index.css not broken down — one 827-line file mixing imports + `:root`/`.dark` tokens + `@theme` + ~57 global component CSS classes (lines ~340–752).
  2. ~49 raw hex/rgba literals INSIDE the component rules duplicate existing `--theme-*` tokens (e.g. `rgba(255,255,255,0.08)` vs `--theme-border-subtle`). P1 excluded index.css from hex cleanup by design.
- No sprint (P1–P5) splits index.css, migrates the 57 global classes inline, or tokenizes the in-rule literals. P2 only removes inline glass CSS from .tsx files. → genuine plan gap, not a P1 miss.

## Answer to PO
Breaking down index.css is NOT currently planned — "that's it" as the plan stands. Logged a new follow-up `P6-css-decomposition` in the README with a PO decision: split-into-@import-partials vs. migrate-global-classes-inline (the latter matches the inherited no-CSS-modules / single-owner-CSS-inline decision).

Files edited:
  docs/plans/active/folder-structure-v2/output/P1-token-system.md — appended "## Output feedback — Claude (reviewer)" section (acceptance verdict + scope answer)
  docs/plans/active/folder-structure-v2/README.md — added `P6-css-decomposition` follow-up entry

Files created:
  docs/progress/sessions/2026-06-27-claude/04-P1-output-feedback.md — this log

Files deleted: None

Churn — work reversed: None.

Preserve-semantic check: No code changed. Feedback respects inherited decisions (Tailwind-first, no CSS modules); the suggested inline-migration option is consistent with "single-owner CSS goes inline."

Acceptance criteria:
  □ P1 output reviewed and feedback written: PASS
  □ index.css size + in-rule literal debt confirmed against live file: PASS
  □ CSS-decomposition scheduling question answered (not planned; P6 follow-up logged): PASS

Gates:
  typecheck: N/A — no source code changed
  dev: N/A — no source code changed
  verify.sh: N/A — no source code changed
  browser manual check: N/A — review/docs only

Consumer updates required: None.

Open issues / follow-ups:
  - `P6-css-decomposition` (PO decision: partials vs inline migration) — newly logged, not drafted.
  - P1 sign-off: recommend PO accept the pre-existing lint backlog as documented and mark P1 Completed.
  - Pre-existing: `build-log-index.sh` mislabel; `P1b-color-tokens`; `production-api-client-switch`; Quality-gates BLD ID.

index: hand-appended to docs/progress/index.csv (build-log-index.sh mislabels/duplicates — known tooling debt).
