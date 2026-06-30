## Strict logging rule + session-log backfill
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: process-governance
Status: Completed

Intent: Make it a STRICT rule that every user message is indexed as one typed task in the session log, and
backfill the recent FP-R5 / core-model / requirements-recovery chat that was performed but never logged.
Trigger: user — "add this task in your session logs... all summary of our recent chat... was never logged.
And it should have been a strict rule that all user messages shall be indexed as a task... with type:...
solidify the logic of agents behavior before moving on."

Work:
- core.md: added §33 — every user message = one indexed, typed task log; types: sprint-execution /
  user-request-code / user-request-planning / audit-review / process-governance / mixed; session not
  closeable while any message lacks its typed entry.
- log-format.md: added `Type:` to the §0 identity block (mandatory) and a new §2 (the strict rule +
  taxonomy aligned with core.md §25).
- Backfilled this session's unlogged tasks: 02 (FP-R4 re-audit), 03 (core model + live verify), 04
  (requirements recovery + reconciliation), and this entry (05).

Note on prior gap: the 2026-06-28 FP-R2/R3/R4 audits produced output-review/*.md (a record exists) but
were not session-logged at the time — the gap §33 now prevents. Not retroactively backfilling 06-28 here;
output-review/ stands as their record.

Files edited: docs/agent-rules/core.md (§33), docs/agent-rules/log-format.md (§0 + §2).
Files created: sessions/2026-06-29-claude/02..05 (this).
Gates: N/A — docs/governance only, no src/ change.
Follow-ups: run scripts/build-log-index.sh to index 02–05; then resume with the PO's additional requirements.
