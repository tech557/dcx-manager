## folder-structure-v2 — Revert to drafted + complete plan audit
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-27
Status: Completed

Intent: Move the plan back to drafted and run a complete plan audit against the live codebase, the v2 discovery outputs, and docs/product.
Trigger: User request quoted — "first move plan back to draft . then run a complete plan audit refrencing the Discoveries and the product needs docs/product".
Requirements covered: none (planning/audit only — no code changed)

Files created:
  docs/plans/drafted/folder-structure-v2/audit/2026-06-27-claude.md — plan audit, verdict NEEDS REVISION, 4 blocking + 4 advisory
  docs/progress/sessions/2026-06-27-claude2/03-folder-structure-v2-revert-and-audit.md — this log

Files edited:
  docs/plans/drafted/folder-structure-v2/README.md — frontmatter status active→drafted, removed activated field, status line notes revert + audit
  docs/plans/drafted/folder-structure-v2/sprints/P1-token-system.md — frontmatter status in-progress→not-started, removed progress note, output path active→drafted

Files moved:
  docs/plans/active/folder-structure-v2/ → docs/plans/drafted/folder-structure-v2/ (reverts the earlier activation)

Files deleted:    none

Churn — work reversed:
  Reverted my own 2026-06-27 activation (log 02 in this session). Plan returned to drafted at PO instruction after the token-scope gap was found. Logged here per core.md §4.4.

Preserve-semantic check (§9):
  N/A — no src/ code changed. Audit used read-only grep/ls against src/; brand files read only.

Method:
  Followed dcx-plan-audit skill (agent-skills/dcx-plan-audit/SKILL.md). Ran the plan's own
  grep/ls commands against the live v0.3.4 tree and cross-checked UX2-R1/R2/R3, FE2-R1/R3,
  BE2 (via P4), and docs/product/decisions/src-structure-decision.md.

Audit verdict: NEEDS REVISION (4 blocking, 4 advisory). Headlines:
  B1 — P1 Steps 2/3 migrate font-weight/shadow/radius syntax with 0 occurrences and no source
       CSS vars; only text-[var(--text-*)] (275) is real. Primary deliverable overstates scope.
  B2 — 287 color arbitrary usages (largest group) neither migrated nor declared out-of-scope;
       metrics table has no color row. (This is the PO's flagged concern.)
  B3 — P2 instructs creating atoms that already exist (atoms/Badge,Chip,Input,ToggleGroup from
       2026-06-25); P2 Step 4 would create a duplicate forms/inputs/TextInput.tsx.
  B4 — P2 orphan deletions break barrel exports (forms/inputs|selects/index.ts) and trip P2
       Step 1's own halt rule; FieldIndicator name-collides with an interface in card.types.ts.
  Prior codex audit (2026-06-27, READY) checked plan vs discovery docs but not vs live code —
  hence the different verdict.

Open decisions used:
  None — surfaced for PO; not silently resolved.

Acceptance criteria (audit task):
  □ Audit written to audit/YYYY-MM-DD-<agent>.md in skill format: PASS
  □ References discoveries (UX2/FE2/BE2) and docs/product: PASS
  □ Each finding names file + command + failure mode: PASS

Gates:
  typecheck: N/A — no code changed
  dev: N/A
  verify.sh: N/A
  browser manual check: N/A

Consumer updates required:
  None.

Open issues / follow-ups:
  - PO to decide Blocking #2: declare color arbitrary usages intentional (theme-reactive) vs add a color-migration sprint (P1b).
  - P2 needs the largest rewrite (reconcile onto existing atoms + barrel-safe orphan deletion).
  - Stale discovery baseline (v0.3.2) — counts drifted; re-baseline at execution.
  - index: pending — running scripts/build-log-index.sh as final step.
