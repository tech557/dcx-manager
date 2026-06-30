## folder-structure-v2 — Institute the carry-forward / reuse-don't-recreate fact rule
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-27
Status: Completed

Intent: Guarantee that every later sprint builds on the actual post-P1 structure (split CSS in src/brand/styles/*, existing --theme-* tokens incl. the new --theme-component-* family, text-dcx-* utilities, existing atoms) and never recreates raw tokens/classes/primitives.
Trigger: user question/instruction — "are we sure codex or any other agent will keep using the current structure in the next sprints? ... we dont create new raw tokens or classes and keep the use to the already existing file as fact rule now."
Requirements covered: N/A — planning/process, no product/source code changed.

## Answer given
No — not guaranteed as previously written. P2–P5 had ZERO references to the new CSS structure (styles/tokens.css, styles/theme.css, styles/components.css); the "already exists / don't create" language was component-specific (Badge/Input/Chip only); Step 0 only checked that the prior output existed (didn't require absorbing it); and Codex's P1 added a ~34-token --theme-component-* family that nothing told later agents about.

## Verified live (post-P1, Codex)
- src/brand/index.css = 10-line entry (imports + @source). Partials: styles/theme.css (@theme/@theme inline utilities), styles/tokens.css (ONLY home of the 136 --theme-* values + --text-* + shadcn vars + @font-face), styles/components.css (global classes, 0 raw color literals, 60 var(--theme-*) refs).
- --theme-* defined only in styles/tokens.css; text-dcx-/color-dcx- registered only in styles/theme.css.
- New --theme-component-* family present (surfaces/borders/fills/text).

## Change made — binding fact rule
- README: added `## Carry-forward contract — current structural state (READ BEFORE EVERY SPRINT)` — a living fact sheet (canonical homes table + post-P1 facts + retained-by-policy + documented debt) and a hard REUSE-don't-RECREATE rule. Instructs each sprint to update it at end.
- P2/P3/P4/P5 Step 0: added a MANDATORY "Carry-forward contract" block requiring the agent to read the README contract + prior output(s) and obey reuse-don't-recreate, with sprint-specific pointers (P2: components.css + --theme-component-* + existing atoms; P3: existing hooks/useEditorState; P4: existing apiClient/mockDispatch seam; P5: judge against real post-P1 token language).

## Files
Files edited:
  docs/plans/active/folder-structure-v2/README.md — new Carry-forward contract section
  docs/plans/active/folder-structure-v2/sprints/P2-component-consolidation.md — Step 0 contract binding
  docs/plans/active/folder-structure-v2/sprints/P3-structure-quality.md — Step 0 contract binding
  docs/plans/active/folder-structure-v2/sprints/P4-backend-readiness.md — Step 0 contract binding
  docs/plans/active/folder-structure-v2/sprints/P5-frontend-readiness.md — Step 0 contract binding
Files created:
  docs/progress/sessions/2026-06-27-claude/06-carry-forward-contract.md — this log
Files deleted: None

Churn — work reversed: None. Additive process guardrail.

Preserve-semantic check: No code changed. The contract encodes inherited decisions (no CSS modules, single-owner CSS inline → P2/P3) and the post-P1 facts as binding.

Open decisions used: None new.

Acceptance criteria:
  □ Honest answer given (not guaranteed → now made binding): PASS
  □ README carry-forward contract present with canonical-homes table + post-P1 facts: PASS
  □ P2–P5 Step 0 each bind to the contract (verified 1 each): PASS

Gates:
  typecheck: N/A — no source code changed
  dev: N/A — no source code changed
  verify.sh: N/A — no source code changed
  browser manual check: N/A — process/docs only

Consumer updates required: None.

Open issues / follow-ups:
  - P2 is the first real test of the contract — confirm its output updates the README carry-forward block.
  - Pre-existing: build-log-index.sh mislabel; P1b-color-tokens; production-api-client-switch; Quality-gates BLD ID; repo-wide lint backlog; Playwright Chromium binary missing.

index: hand-appended to docs/progress/index.csv (build-log-index.sh mislabels/duplicates — known tooling debt).
