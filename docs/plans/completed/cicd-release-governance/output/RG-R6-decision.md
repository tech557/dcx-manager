---
sprint: RG-R6
plan: cicd-release-governance
date: 2026-07-01
agent: Claude (claude-sonnet-5, Anthropic)
status: skipped — premise corrected by PO
---

# RG-R6 — ClickUp release board + GAS sink (skipped)

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-APPROVAL-005, REQ-RG-PLAT-018, REQ-RG-CSV-012, REQ-RG-MD-013 — approved, canonical graph nodes, PO-locked 2026-06-30. **Satisfied by a different mechanism than originally planned:** REQ-RG-APPROVAL-005 (approval gate) is met by `promote.sh`/`gate-prod-migration.sh`'s existing approval-record check (built in RG-R4/RG-R5), not by anything built in this sprint. |
| Acceptance IDs | AC-RG-6-1 … AC-RG-6-5 — all N/A, sprint skipped by PO decision (see below) |
| Verification (EVD) | N/A — no mechanism built |

## What happened

Before writing anything, checked ClickUp MCP availability for read-only discovery
(`clickup_get_workspace_hierarchy`) — confirmed connected, workspace has two spaces ("Clients",
"Internal"), both currently with no folders/lists under them. Then checked which ClickUp MCP write tools
exist: `clickup_create_list`, `clickup_create_list_in_folder`, `clickup_create_task`,
`clickup_create_document`, etc. — but **no tool to create custom fields, custom statuses, or
webhooks/automations.** Even taking the sprint's premise at face value, AC-RG-6-3 ("a ClickUp approval
flip → CI writes the approvals/ record") could not have been fully built without ClickUp UI
configuration this agent has no path to (a webhook/automation rule is not exposed via any available
tool).

**Before creating any real ClickUp resources**, asked the PO where the "Releases" list should live. The
PO's answer corrected the sprint's entire premise:

> "no u misunderstood the requirement. clickup is our current task management system. We use it to
> initiate DCX tasks where it allows u to add a version but it has nothing to do with production or
> CI/CD tasks or logs."

Asked how RG-R6 should change given that. PO's answer:

> "release approval shall stay manual. when asked by PO in chat."

## Decision

**Release approval is, and remains, a manual chat-based decision.** The PO tells the executing agent
"approve `<version>` for `<environment>`" in conversation; the agent records that as
`docs/releases/approvals/<version>-<env>.md` (the same file format `promote.sh`/`gate-prod-migration.sh`
already read). **This is not a new mechanism — it is exactly what happened for the real RG-R4 staging
promotion** (`v0.3.5.7-staging.md`). RG-R6 formalizes it as the permanent design rather than a stopgap
awaiting ClickUp automation.

**ClickUp and GAS are not part of release governance at all.** No list, task, custom field, or webhook
was created. `OD-RG-06` (canonical approval authority) and `OD-RG-09` (how the PO signs an approval) are
revised in the plan README to reflect this — both now simply say "git registry + `approvals/*.md` files,
PO approves in chat." `mirror-clickup.sh` and the GAS sink were never built; there is nothing for them to
mirror or sink, since there is no separate "release tracking" surface outside the git registry.

## Why this isn't a loss of functionality

- The approval gate (`promote.sh`, `gate-prod-migration.sh`) already enforces the four-layer check
  (verified status, built on integration, artifact present, approval record exists) regardless of *how*
  the approval file gets written. Manual chat-recorded approval satisfies that contract exactly as well
  as an automated ClickUp-flip would have.
- A second "release board" in ClickUp — a tool the PO confirmed is for unrelated task initiation — would
  have been a second source of truth the plan's own design principle (§3.5, OD-RG-06 as originally
  drafted) explicitly tried to avoid creating.

## Acceptance criteria

All AC-RG-6-* are **N/A — sprint skipped by PO decision**, not failed or blocked. No criterion was
attempted against a different mechanism; the entire premise (ClickUp as release surface) was withdrawn.

## Gates

| Gate | Result |
|---|---|
| no-`src/**` proof | PASS (trivially — nothing was written) |
| round-trip test | N/A — no mechanism built to round-trip |
