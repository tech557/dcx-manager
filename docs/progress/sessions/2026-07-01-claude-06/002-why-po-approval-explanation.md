## production-api-client-switch — explain why PO approval was sought for the RLS fix
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: audit-review
Status: Completed
PO-Action: none
Version: v1.1.0.1
Change-Class: non-source

Intent: Answer a conversational question, no file changes.
Trigger: User request — "what do u need PO approval for?"
Requirements covered: none.

### Answer given
Explained two reasons: (1) this plan's own governance (`production-api-client-switch/README.md`) requires
a recorded PO approval before every `apply_migration`, matching the existing `apply-approval-dev-*.md`
pattern; (2) schema/RLS changes on a live database are a hard-to-reverse, shared-system action under general
agent instructions regardless of project-specific rules.

### PO action required
None.
