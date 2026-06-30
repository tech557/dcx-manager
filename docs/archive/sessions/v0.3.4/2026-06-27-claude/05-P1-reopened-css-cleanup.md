## folder-structure-v2 — Re-open P1 for index.css token hygiene + decomposition
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-27
Status: Completed

Intent: Per PO, fold the index.css CSS-cleanup gap into P1 (not a deferred P6), write a detailed P1 review in a dedicated review folder, and re-open the P1 sprint with new steps so Codex finishes it acknowledging the plan gap.
Trigger: user request — "i dont like the current implementation plan, dont wait for P6. create an output review folder then log your detailed feedback on P1. and adjust the sprint adding more steps marking it incomplete so i will ask codex to read the review next and finish the sprint acknowledging that was plan gap."
Requirements covered: N/A — review/planning, no product/source code changed.

## Decision (reviewer's call, per PO delegation)
Chose: tokenize the ~49 in-rule literals + decompose index.css into @import partials (low-risk, zero behavior change, fixes both PO complaints now). Deeper inline-migration of single-owner global classes into components is delegated to P2/P3 as they touch components — NOT a new deferred sprint.

## Actions
- Created review folder `output-review/` with `P1-token-system-review.md` — detailed review: P1 migration ACCEPTED (verified live), lint "blocker" is documented pre-existing debt (0 introduced), the index.css plan gap confirmed (827-line monolith; ~49 raw hex/rgba inside ~57 global rules duplicating existing --theme-* tokens), and the hand-off instructions for Codex.
- Replaced the long feedback I had appended to `output/P1-token-system.md` with a short pointer to the review folder (keeps Codex's execution artifact clean).
- Re-opened `sprints/P1-token-system.md`:
  - frontmatter status → `incomplete-reopened-css-cleanup`
  - red STATUS banner + gap acknowledgment; marked Steps 0–7 done (do not redo)
  - Goal extended with deliverables 5 (tokenize literals) + 6 (decompose)
  - NEW Step 8 (tokenize in-rule literals → existing --theme-* tokens; target 0 raw literals in rules section, lines ≥340)
  - NEW Step 9 (split index.css → src/brand/styles/{tokens,theme,components}.css, imports-only entry, preserve cascade, verify Tailwind still generates text-dcx-*)
  - renumbered gate step to Step 10; fixed the Step-0 "Step 8 browser gate" reference → Step 10
  - output template + acceptance criteria updated (CSS hygiene/decomposition rows; lint debt accepted per README gate)
- README: replaced the `P6-css-decomposition` follow-up with "folded into P1 (re-opened)"; updated P1 sprint-table row.

## Files
Files created:
  docs/plans/active/folder-structure-v2/output-review/P1-token-system-review.md — detailed P1 review (~118 lines)
  docs/progress/sessions/2026-06-27-claude/05-P1-reopened-css-cleanup.md — this log
Files edited:
  docs/plans/active/folder-structure-v2/sprints/P1-token-system.md — re-opened; Steps 8–9 added, gate→Step 10; goal/banner/acceptance/output-template
  docs/plans/active/folder-structure-v2/output/P1-token-system.md — long appended feedback → short pointer to review folder
  docs/plans/active/folder-structure-v2/README.md — P6 follow-up reframed as folded-into-P1; P1 row updated
Files deleted: None

Churn — work reversed:
  Reverses my own session-04 framing (P6-as-separate-follow-up → folded into P1) and moves the appended output-file feedback into the review folder. P1's Steps 0–7 source work is explicitly preserved (not redone).

Preserve-semantic check:
  Inherited "no CSS modules / single-owner CSS goes inline" respected — partials are global cascade (not CSS modules); inline migration noted as the P2/P3 direction. P1 typography/hex/token/dead-code results untouched.

Open decisions used:
  ⏱ Tokenize-literals + partials chosen over full inline-migration for P1 (PO said "choose whatever option").
  ⏱ Partials path `src/brand/styles/` with a Tailwind-`@theme`-in-import fallback documented (keep theme inline if the import doesn't generate utilities).

Acceptance criteria:
  □ Review folder created + detailed P1 feedback logged: PASS
  □ P1 sprint marked incomplete/re-opened with new steps acknowledging the gap: PASS
  □ Steps renumber cleanly 0–10, no stale references: PASS
  □ README + output-file pointers consistent with the review folder: PASS

Gates:
  typecheck: N/A — no source code changed
  dev: N/A — no source code changed
  verify.sh: N/A — no source code changed
  browser manual check: N/A — review/docs only

Consumer updates required: None.

Open issues / follow-ups:
  - Codex to execute P1 Steps 8–10 after reading `output-review/P1-token-system-review.md`.
  - Inline-migration of single-owner global classes → P2/P3.
  - Pre-existing: build-log-index.sh mislabel; P1b-color-tokens; production-api-client-switch; Quality-gates BLD ID.

index: hand-appended to docs/progress/index.csv (build-log-index.sh mislabels/duplicates — known tooling debt).
