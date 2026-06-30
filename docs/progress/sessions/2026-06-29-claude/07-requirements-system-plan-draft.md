## Requirements System — new plan draft + On-hold state
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: mixed (user-request-planning + process-governance)
Status: Completed

Intent: Per PO course-correction — stop premature design; (1) add a new "On hold" plan lifecycle state and
move frontend-polish-v0.3.5 to it; (2) draft a proper plan for a requirements SYSTEM that is human+agent
readable/editable, mechanically wired with automation (not agent-maintained markdown), with sign-off
required before adding/superseding any entry and relationship-checking; (3) seed it with THIS session's
decisions as the first usage. Draft only, up to audit-ready.
Trigger: user — "premature since i didn't approve the methodology... i dont wanna an md based system for
agents only... readable and editable for both with mechanical wiring and automation... agent requesting
sign off before adding any entry to the csv specially suppressing another one and a way to check the
relation... move the front end polish to On hold state (new state to prevent agent confusion)... draft a
new plan for the requirements system... document this as the first usage of the system... draft the plan
till audit."

PO constraints captured (do NOT pre-design beyond these):
- Dual-surface: readable + editable by humans AND agents (not markdown-for-agents-only).
- Mechanical wiring + automation (tooling/scripts), not manual agent doc maintenance.
- Governed mutations: agent must REQUEST sign-off before adding an entry, ESPECIALLY before
  superseding/suppressing an existing one.
- Relationship checking (validate related/supersedes/deps; no dangling/double-supersession).
- First usage = ingest this session's decisions (D-01..D-12, 4 core-model alignments, FCS-002, recovered
  v0.1.4/CSV requirements, reconciliation) — dogfood.
- Methodology itself is NOT yet approved — the plan's first sprint designs it for PO sign-off.

Work (this turn): core.md §24 + AGENTS.md updated with On-hold state; moved plan folder; drafted plan
docs/plans/drafted/requirements-system/ (README + sprint index) to audit-ready.
Gates: N/A — docs/governance/planning only, no src/ change.
Follow-ups: dcx-plan-audit the drafted plan; PO approves methodology in RS sprint 0 before any build.
