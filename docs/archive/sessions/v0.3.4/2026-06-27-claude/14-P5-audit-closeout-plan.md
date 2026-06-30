## folder-structure-v2 — P5 audit + closeout decision + P6 cleanup sprint
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-28
Status: Completed

Intent: Audit P5; before plan close, check for code debts / missed steps that could cause errors or misinform the next 4 plans; take PO decisions; draft a final cleanup/closeout sprint.
Trigger: user request — "audit them and before marking them as closed ... check if we have any code debts or missed steps ... take decisions now and maybe plan a final clean up sprint ... after this plan we will do 4 more plans only (FE final discovery+impl, BE final discovery+impl) ... make sure any missing steps about cleaning and improving the docs and agents so we avoid any misinformation."
Requirements covered: N/A — audit + planning + doc updates; no product src changed.

## P5 verdict: governance + visual baseline ACCEPT. Editor "blocker" = FALSE ALARM, not a regression.
- component-source-policy.md created; 24-component inventory; adapter seam on PopoverShell; 0 feature imports of @/ui/shadcn/*; impeccable correctly not used (hard-blocked); 6 viewport screenshots (1440/1920/2560 dark+light), 0 console errors. Gates: typecheck/test(27/27)/arch PASS; lint 119 debt.
- Editor blocker root cause: EditorViewerIsland.tsx:121 "Open Editor" button is hardcoded disabled (title "Drag task here to edit") — a DROP HINT. Editor expands via isExpanded (active focused node + draftData), opened by drag-drop (onDrop=handleDrop) or long-press. P3 ALREADY captured it (p3-editor-open.png). P5 agent used the wrong interaction (clicked the disabled hint). No regression.

## Close-out debt sweep (risks to the next 4 plans)
- Lint 114 errors: unused-vars 51, no-explicit-any 42, react-hooks 24 (set-state-in-effect 13, exhaustive-deps 5, static-components 4, refs 2) — react-hooks ones are potential real bugs.
- STALE v2 discovery (ux/fe/be-discovery-v2 in completed/) describe the pre-refactor tree → #1 misinformation risk for the next FE/BE final-discovery plans.
- Carry-forward "current structural truth" lives in the plan README → archives with the plan; next 4 plans lose it.
- src-structure-decision.md stale (describes deleted src/components/); VERSION.md v0.3.4 vs metadata.json v0.3.3; code-index stale ~36h; impeccable not in CLAUDE.md/AGENTS.md; day-note localStorage (browser-storage.helpers.ts) non-seam; build warnings (versions.service.ts/main.tsx dynamic+static import, chunk >500KB).

## PO decisions (AskUserQuestion, 2026-06-28)
- Lint: BOUNDED cleanup in P6 (remove 51 unused-vars + fix the ~24 react-hooks bugs; defer 42 any to a named typed-any-cleanup follow-up).
- Sequencing: run P6 closeout, THEN archive (keep plan active until truth is durable + discovery superseded).

## Deliverables
- Drafted sprints/P6-closeout-coherence.md: Step 0 env; Step 1 resolve editor false-alarm (+optional re-capture via drag); Step 2 bounded lint; Step 3 promote structural truth into src-structure-decision.md + regen code-index; Step 4 SUPERSEDED banners on v2 discovery; Step 5 version reconcile + day-note decision; Step 6 agent-doc coherence (impeccable in CLAUDE.md/AGENTS.md + durable follow-ups doc); Step 7 full gates + plan-level close + move to completed/.
- Wrote output-review/P5-frontend-readiness-review.md (verdict + debt table + decisions).
- README: added P6 row to sprint table; status updated (editor false-alarm, P6-before-archive).

## Files
Files created:
  docs/plans/active/folder-structure-v2/sprints/P6-closeout-coherence.md
  docs/plans/active/folder-structure-v2/output-review/P5-frontend-readiness-review.md
  docs/progress/sessions/2026-06-27-claude/14-P5-audit-closeout-plan.md (this log)
Files edited:
  docs/plans/active/folder-structure-v2/README.md — P6 sprint row + status
Files deleted: None

Churn — work reversed: None. P5 code untouched (verified sound). Plan close deferred to P6 (PO-approved).

Preserve-semantic check: No code changed. Editor confirmed working (not a regression). P6 forbids structural change + impeccable use.

Acceptance criteria:
  □ P5 audited; governance + baseline accepted: PASS
  □ Editor "blocker" root-caused as false-alarm (not regression): PASS
  □ Full close-out debt sweep done; misinformation risks to next 4 plans identified: PASS
  □ PO decisions taken (bounded lint; closeout-then-archive): PASS
  □ P6 closeout sprint drafted incl. doc/agent coherence + plan close: PASS

Gates (this session): typecheck PASS; test 27/27; validate:architecture PASS (264 modules); lint 119 (114 err/5 warn) documented.
  browser manual check: N/A — audit; editor-open already evidenced in P3.

Consumer updates required: None.

Open issues / follow-ups:
  - Execute P6 (Codex), then plan-level close + move to completed/.
  - PO: version reconcile (VERSION.md vs metadata.json); day-note localStorage intent.
  - Named follow-ups for after this plan: typed-any-cleanup, production-api-client-switch, P1b-color-tokens, build-log-index.sh fix, sync-skills.sh plan-audit truncation, Quality-gates BLD ID.
  - Next 4 plans only: FE-final-discovery, FE-final-implementation, BE-final-discovery, BE-final-implementation — must read the refreshed src-structure-decision.md, NOT the superseded v2 discovery.

index: hand-appended to docs/progress/index.csv (build-log-index.sh mislabels/duplicates — known tooling debt).
