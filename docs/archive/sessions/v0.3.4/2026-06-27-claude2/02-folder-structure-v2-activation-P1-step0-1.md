## folder-structure-v2 — Activation + P1 Steps 0–1 (real execution)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-27
Status: Partial

Intent: Move folder-structure-v2 from drafted to active and execute P1 Steps 0–1 (audit, no code) as the official sprint start.
Trigger: User request quoted — "now u need to move the plan to active and actually do steps 0 and 1 in the code".
Requirements covered: none (activation + audit/discovery only — no BLD-* implemented)

Files created:
  docs/progress/sessions/2026-06-27-claude2/02-folder-structure-v2-activation-P1-step0-1.md — this log

Files edited:
  docs/plans/active/folder-structure-v2/README.md — frontmatter status drafted→active, added activated: 2026-06-27, status line updated, sprint path drafted→active
  docs/plans/active/folder-structure-v2/sprints/P1-token-system.md — frontmatter status not-started→in-progress, added progress note, output path drafted→active
  docs/plans/active/folder-structure-v2/output/P1-token-system.md — scope note reframed from "example/seed run (drafted)" to active execution; activation confirmation noted

Files moved:
  docs/plans/drafted/folder-structure-v2/ → docs/plans/active/folder-structure-v2/ (whole folder: README, audit/, output/, sprints/)

Files deleted:    none

Note on "in the code": P1 Steps 0 and 1 are read-only — Step 0 records the session
environment (scripts) and Step 1 audits CSS var names via grep. Neither edits src/.
Step 2 ("Register CSS vars as @theme utilities in index.css") is the first code-editing
step and was NOT started, per the user's explicit "steps 0 and 1" boundary.

Churn — work reversed:
  None. Activation is a forward move; no prior work undone. No src/ file changed.

Preserve-semantic check (§9):
  N/A — no code changed. brand/index.css read-only (grep). No action/readiness/theme/mapper boundary touched.

Open decisions used:
  None. (Typography-only scope correction for Steps 2/3 is FLAGGED for PO, not silently applied.)

Plan lifecycle (§24):
  Plan moved drafted→active at explicit PO instruction. Now in active/ — agents may execute sprints.
  Sprint frontmatter executor is still "Codex"; Claude executed only the Steps 0–1 audit as the
  activation seed. Step 2+ code work remains assigned to Codex unless the PO reassigns.

Step 0 result (Session Environment):
  - version_context v0.3.4 == docs/VERSION.md current v0.3.4 ✓
  - build-current-state now lists folder-structure-v2 in active_plans ✓ (confirms activation)
  - Operational MCP: eslint only. Pre-existing doc contradiction: metadata.json v0.3.3 vs VERSION.md v0.3.4.

Step 1 result (Audit) — unchanged from first run, re-confirmed in active context:
  - @theme block at index.css:168 holds only --font-sans; @theme inline at :752.
  - 11 --text-* vars to register (incl. half-steps 3xs-plus/2xs-plus/xs-plus/md-plus).
  - Arbitrary usage: text-[var(--text-*)]=275; font-[var(--font-*)]=0; shadow-[var(--shadow-*)]=0; rounded-[var(--radius-*)]=0.
  - => Steps 2/3 are typography-only; no font/shadow/radius arbitrary migration exists.

Acceptance criteria (P1 Step 1):
  □ Step 1 output lists every CSS var name that will get a utility registration: PASS (11 --text-* vars tabulated in output file)

Gates:
  typecheck: N/A — no code changed
  dev: N/A — no code changed
  verify.sh: N/A — no code changed
  browser manual check: N/A — deferred to Step 2+ code-writing run

Consumer updates required:
  None — no exports changed.

Open issues / follow-ups:
  - PO decision needed before Step 2: confirm typography-only scope correction (drop the
    non-existent font/shadow/radius migrations from the sprint's example blocks).
  - Sprint executor field still "Codex" — confirm who runs Step 2+ (code-editing).
  - code_index stale — run `npm run generate:code-index` before Step 2.
  - index: pending — running scripts/build-log-index.sh as final step.
