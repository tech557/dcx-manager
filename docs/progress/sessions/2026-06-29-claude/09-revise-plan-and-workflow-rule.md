## requirements-system revision + Plan→Audit→Revise→Decision workflow rule
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: mixed (user-request-planning + process-governance)
Status: Completed

Intent: (1) Apply the combined Codex+Claude audit findings to the requirements-system plan; (2) add a
streamlined plan lifecycle loop to the agent rules — Plan → Audit → Revise → (Re-audit | Implement |
Archive) — and map user message types (incl. custom asks) onto it.
Trigger: user — "apply the revision, and can we also streamline (teach agent in different user message
types + custom where i ask different things) this. Plan > Audit > Revise > (decision: Re-audit ||
Implement || Archive)."

Work:
- core.md §34 added: the Plan→Audit→Revise→Decision loop + message-type→stage mapping + custom/off-loop
  handling; ties §24/§25/§29/§33 together.
- Plan revised: README (carry-forward contract populated; Global sprint requirements [gates/fallbacks/
  carry-forward/source-corpus]; new hard constraints — intake-via-§33, skills wiring, code-index reuse,
  skill-sync; recommended executors; sprint index R2→R2a/R2b, R6 reframed); RS-R0 (intake target model +
  skills/code-index/skill-sync/disposition + stack); RS-R1 (deterministic inventory + full source corpus
  incl. session logs/index.csv/archives/audits); RS-R2a/R2b split; RS-R5 (§32 misref fixed →
  disposition policy; planner/audit ID-grounding + skill-sync); RS-R6 (pure re-grounding brief).

Files edited: docs/agent-rules/core.md (§34); docs/plans/drafted/requirements-system/README.md + sprints/*.
Gates: N/A — docs/governance/planning only, no src/ change.
Follow-ups: re-audit the revised plan (per the new loop, NEEDS-REVISION → Re-audit) before PO implements.
