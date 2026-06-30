## FP-RC — Requirements System design (proposal)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: user-request-planning
Status: Partial (design proposal written; awaiting PO confirmation of structure)

Intent: Verdict on whether the current plan meets its goal (NO), and design a dedicated requirements
cleanup/consolidation sprint (FP-RC) that builds a single grounded requirements SYSTEM — product +
technical decisions, decision ledger, data-model summary, user-friendly index, agent wiring — before
redoing FP-R4 + FP-R5.
Trigger: user — "reconsider the whole plan... your own verdict will the current plan achieve its goal...
design a specific sprint for requirement cleanup... structuring the requirements user-friendly, covers all
product decision (editable or log/ledger format), core technical decisions, summary of the data model,
everything in one requirements collecting/updating/grounded system... wiring to existing agents...
confirming it finally with me."

Decisions captured this turn:
- Refactor shape CONFIRMED: FP-RC (consolidation) first → redo FP-R4 → redo FP-R5. R1/R2/R3 + core-model stay.
- FP-RC lives as a new sprint in frontend-polish-v0.3.5; may edit docs/product/** but keep/merge/remove
  is PO-gated (no unilateral deletes).
- PO wants a full requirements SYSTEM (not just CSV-as-master): ledger-backed, data-model summary,
  user-friendly, agent-wired.

Files created: output/FP-RC-requirements-system-design.md (DRAFT proposal).
Gates: N/A — planning/docs only, no src/ change.
Follow-ups: PO confirms the design forks (scope, ID scheme, ledger shape, data-model source); then write
the FP-RC sprint file + re-sequence the plan.
