## folder-structure-v2 — P4 output audit + P5 readiness verdict
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-28
Status: Completed

Intent: Audit Codex+opencode's P4 output against the live tree; verdict on P5 readiness.
Trigger: user request — "both codex and opencode has completed the P4 sprint with its test ... audit the output and give your verdict about p5 readiness."
Requirements covered: N/A — audit + P5 methodology hardening; no product src changed.

## Verdict: P4 ACCEPT (complete & gate-clean). P5 READY (methodology hardened here). P5 is the LAST sprint → its close = plan close.

## P4 verified live
- 0 services use readMockJson/writeMockJson/localStorage (all 7 wired to apiClient); api-client.ts cleaned; safe-storage.ts deleted.
- Recursion fix: handlers moved to src/services/mock/* (access/builder/channels/logs/subtasks/versions + store.ts); mock-dispatch is now a dispatcher.
- attachVersionFile persists (→ attachVersionFileToMock), not a no-op.
- Completeness matrix: 9 domains; clickup+ai labelled pure stubs. mock-dispatch + src/mock/* retained.
- Gates: typecheck PASS; test 27/27; validate:architecture PASS (264 modules, 0 violations); lint 119 (114 err/5 warn) — down from 125 at P3.
- Browser evidence captured by opencode (Playwright MCP, 0 console errors, 3 screenshots) AND LOGGED this time: docs/progress/sessions/2026-06-28-opencode/01-P4-browser-evidence.md → §29a handoff-logging rule worked.

## Nuance flagged (PO, not a blocker)
- localStorage now only in mock/store.ts (behind the seam, correct) and the NEW browser-storage.helpers.ts (UI prefs + editor draft + day-notes via preference.helpers.ts / useEditorState.ts). Services are clean, but browser-storage.helpers is a non-seam local path. If day-notes/editor-draft are app data, that's a hidden domain the matrix didn't cover — confirm it's intended UI-local or schedule for the seam in the production follow-up.

## P5 readiness + hardening applied
- Premises hold: shadcn installed (components.json, src/ui/shadcn/button.tsx); atoms + text-dcx/--theme token language; reads P1-P4 outputs.
- P5 was missing methodology (only the Step 0 carry-forward binding). Added:
  - Scope guards in Step 0: inventory CURRENT/post-P4 tree; do NOT use the quarantined impeccable skill (use P5's own visual spec); preserve structure / keep pre-P5 scaffolding.
  - §28 tooling fallback on the screenshot/polish gate (Step 7) + §29a handoff (visual baseline is mandatory).
  - §27 explicit final continuity step (Step 8) that also feeds the plan-level close.
  - Realistic lint acceptance (0 NEW; 119 pre-existing documented).
  - Acceptance criteria: no-impeccable + structure-preserved; browser fallback; Step 8.

## Files
Files created:
  docs/plans/active/folder-structure-v2/output-review/P4-backend-readiness-review.md (verdict)
  docs/progress/sessions/2026-06-27-claude/13-P4-audit-P5-readiness.md (this log)
Files edited:
  docs/plans/active/folder-structure-v2/sprints/P5-frontend-readiness.md — Step 0 scope guards; Step 7 §28 fallback; new Step 8 (§27 + plan-close); acceptance criteria
Files deleted: None

Churn — work reversed: None. P4 code untouched (verified sound). P5 hardened to match P2-P4.

Preserve-semantic check: No code changed. P4 seam preserved; P5 guards forbid structural change + impeccable use.

Acceptance criteria:
  □ P4 audited live incl. gates re-run: PASS
  □ P4 claims verified true; recursion fix + attachVersionFile confirmed: PASS
  □ Browser evidence logged this time (§29a): PASS
  □ P5 premises verified + methodology hardened: PASS
  □ Verdict delivered: P4 ACCEPT, P5 READY (and P5 close = plan close)

Gates (this session): typecheck PASS; test 27/27; validate:architecture PASS (264 modules); lint 119 documented debt.
  browser manual check: N/A — audit; P4 browser evidence already captured + logged.

Consumer updates required: None.

Open issues / follow-ups (PO):
  - Confirm day-note/editor-draft localStorage intent (browser-storage.helpers.ts).
  - P5 is the LAST sprint — plan-level close after it (README → completed → move per §24).
  - Residual: 42 no-explicit-any; lint 119; build-log-index.sh mislabel; sync-skills.sh plan-audit truncation; src-structure-decision.md refresh; "more tests" reconciliation; production-api-client-switch follow-up.

index: hand-appended to docs/progress/index.csv (build-log-index.sh mislabels/duplicates — known tooling debt).
