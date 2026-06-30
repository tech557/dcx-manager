## FE-R3 — Duplication + Consolidation Map
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-26
Status: Completed

Intent: Cross-reference FE-R1 (component tree) and FE-R2 (state flow) against UX-R2 (visual dupe groups) to catalogue overlapped components, hooks, and extraction candidates.

Trigger: User request: "yes" — proceed to FE-R3
Requirements covered: FE-R3 AC 1-6

Files created:
  - docs/plans/drafted/frontend-discovery/output/FE-R3-duplication-map.md — full duplication + consolidation map (10 groups, 5 hook sets, 25 ranked atoms, 48 dead CSS)

Files edited: none
Files deleted: none

Churn — work reversed:
  None

Preserve-semantic check:
  No source files changed. Analysis based on FE-R1, FE-R2, and UX-R2 outputs.

Open decisions used:
  Group 3 (GlassSurface consolidation) → CONSOLIDATE LATER direction matches UX-R3 P2 priority
  Hook Overlap 1/2 (useActiveNode + useEditorDraft merge) — uses FE-R2's finding about StageContext overlap

Acceptance criteria:
  □ Every UX-R2 duplicate pattern group addressed — PASS (6 groups, each with consolidate/keep/delete recommendation)
  □ Hook duplication covers all overlapping context reads — PASS (5 overlap sets identified)
  □ Atom extraction list ranked and prioritised — PASS (25 candidates ranked, Tier 1 extracted)
  □ Deletion candidates cross-referenced with FE-R1 and UX-R2 — PASS (48 dead CSS, 0 orphaned files)
  □ PO decision checklist complete and specific — PASS (10 items)
  □ No source file changed — PASS

Gates:
  typecheck: N/A — data sprint
  dev: N/A — data sprint
  verify.sh: N/A — data sprint
  browser manual check: N/A — data sprint

Consumer updates required:
  None — data sprint only. All recommendations are for P2.

Open issues / follow-ups:
  - This completes the frontend-discovery plan. Move to docs/plans/completed/.
  - Next: P2 (Polish) sprint can begin — extraction priorities are now defined.
