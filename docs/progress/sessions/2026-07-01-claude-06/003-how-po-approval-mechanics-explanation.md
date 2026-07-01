## production-api-client-switch — explain PO-approval mechanics
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
Trigger: User request — "how is this PO work?"
Requirements covered: none.

### Answer given
Explained that "PO approval" is a process convention, not a technical gate: the agent asks in chat, the
user's answer becomes the approval, and the agent writes it into an `apply-approval-dev-*.md` record for
traceability. Nothing in tooling technically blocks `apply_migration` absent that file — it's governance
discipline, not enforcement. **This answer was later corrected by the user in the next message** (see
`004-po-communication-and-signoff-scope-rule.md`) — "PO" is not "whoever is in chat," it specifically means
the operator acting in a real Product Owner capacity, with implications for how agents should communicate
and when sign-off gates should exist.

### PO action required
None.
