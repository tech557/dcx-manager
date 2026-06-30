---
name: dcx-requirement-intake
description: Take a plain-English PO message and produce a candidate requirement proposal with contradiction/duplicate/supersession check, impact assessment, and structured proposal ready for PO sign-off. Use this skill when the PO says "we need…", "users should be able to…", "add a feature for…", or any product-intent message that could become a requirement. Also trigger when a user message in the session is classified as potential product intent (core.md §33 candidate-requirement assessment).
---

<!-- Claude adapter — canonical source: agent-skills/dcx-requirement-intake/SKILL.md -->
<!-- This file adds Claude-specific MCP and hook context. -->
<!-- To update this skill, edit agent-skills/dcx-requirement-intake/SKILL.md and run: bash scripts/agent/sync-skills.sh -->


# DCX Requirement Intake

This skill converts a plain-English PO message into a structured requirement
proposal. It runs the contradiction/duplicate/supersession check, derives
responsibilities and expected categories, and records the proposal ready for
PO sign-off. It reuses existing validators, reconciliation, and code-query.

## When to use

- PO says "we need X" or "users should be able to Y"
- A user message contains product intent that could become a requirement
- A change-triggered reconciliation (dcx-manifestation-reconcile) finds a
  manifesting behavior with no linked requirement — you need to propose one
- You are asked to "intake", "propose", or "register" a new requirement

## Step 1 — Classify the message

Read the PO's message and determine:

- **Type**: new feature / behavior refinement / bug fix / technical debt /
  migration / governance rule / supersession of existing requirement
- **Scope**: product / frontend / backend / devops / test-qa / data / security /
  operations / governance / agent-workflow
- **Urgency**: blocks other work / nice-to-have / deferred
- **Affected area**: which existing requirements, components, or features

If the message is a question or clarification (not product intent), do not
proceed — log it as a conversation and stop.

## Step 2 — Check for duplicates and conflicts

Run the existing graph to check for contradictions, duplicates, or supersessions:

```bash
# Check if this intent already exists
npm run req:query -- --scope <scope>
npm run req:query -- --feature <slug-of-concept>

# Check for duplicate or overlapping responsibility
npm run req:query -- --layer responsibility
```

Also check the decision ledger for prior discussions:
```bash
grep -i "<keyword>" docs/product/requirements/graph/ledger/decision-ledger.jsonl | tail -20
```

If a duplicate or conflict is found:
- Record the existing ID and its state
- Classify as: duplicate / contradiction / supersession candidate / refinement
- Include in the proposal metadata
- If superseding: mark the old requirement as `superseded_by` the new proposal

If nothing exists: proceed with a new proposal.

## Step 3 — Draft the candidate proposal

Create a proposal JSON in `docs/product/requirements/graph/proposals/<proposal-id>.json`.

Use this template:

```json
{
  "id": "PROP-<slug>-<timestamp>",
  "source_message": "<quoted PO message>",
  "proposal_type": "new | supersession | refinement",
  "proposed_node": {
    "id": "INT-<slug>",
    "type": "Intent",
    "statement": "<one-sentence intent>",
    "governance": "proposed",
    "maturity": "intent-captured",
    "delivery": "not-assessed",
    "scope": "<scope>",
    "source": "<session log ref or user message>"
  }
}
```

For supersessions, also include a `supersedes` field:
```json
{
  "proposal_type": "supersession",
  "supersedes": "REQ-<existing-id>",
  "reason": "<why the old requirement is being replaced>"
}
```

### Responsibilities & expected categories

Derive initial `SystemResponsibility` candidates from the intent:

| Category | Derived from |
|---|---|
| component | A visible product surface |
| interaction | A user action or gesture |
| hook/state | A state machine, derived data, or runtime signal |
| service | An external integration or computation |
| test | Verification of the behavior |
| rule | A business rule or validation |
| skill | An agent workflow automation |
| script | A deterministic CLI tool |
| validation | A gate or schema check |

Map each responsibility to expected manifestation categories using the
canonical set from RS-R0b.

## Step 4 — Run contradiction/impact check

Before presenting to the PO:

```bash
# Check if any existing locked requirement would conflict
npm run req:validate 2>&1 | grep -i conflict || true

# Check affected manifestations
npm run req:reconcile -- --mode changed -- --files <affected-source-paths>
```

Record any impact in the proposal:
- Dependencies on existing requirements
- Conflicts or contradictions
- Affected manifestations or code areas
- Which existing queues (missing manifestation, partial implementation) this
  proposal would resolve or create

## Step 5 — Present to PO for confirmation

Present to the PO in this format:

```
## Requirement Intake — <short title>

**Source message:** "<quoted PO message>"

### Proposed node
| Field | Value |
|---|---|
| ID | INT-<slug> |
| Type | Intent |
| Scope | <scope> |
| Statement | <one sentence> |
| Conflicts | none / <list of IDs> |
| Supersedes | none / <ID> |
| Dependencies | <existing requirements this depends on> |

### Derived responsibilities
<list of RSP- IDs and their types>

### Expected manifestation categories
<list of EMC- IDs>

### Recommended next steps
- [ ] PO confirms product truth → proposal becomes approved
- [ ] Maturation: adds rules, conditions, acceptance outcomes
- [ ] Reconciliation: links existing manifestations or opens queue
```

If the PO confirms:
1. Record sign-off in the ledger.
2. Run `npm run req:apply-after-signoff -- --proposal <id> --signoff <ledger-id>`.
3. Log the intake in the session log.

If the PO rejects or wants changes:
1. Update the proposal with changes.
2. Re-present.
3. If abandoned: move to `proposals/<id>.rejected.json` (do not delete).

## Output format

The proposal JSON in `docs/product/requirements/graph/proposals/` and a
structured summary in the session log entry.

## Verification

After intake, confirm:
- [ ] Proposal JSON is parseable (`python3 -c "import json; json.load(open('...'))"`)
- [ ] No duplicate ID exists in the graph
- [ ] Supersession targets exist and are referenced correctly
- [ ] Scope is from the canonical taxonomy
- [ ] `npm run req:validate` passes on the proposal (schema-valid, id-format-unique)

---
## Claude-specific additions

### MCP tools available
- **playwright** (global) — use for browser-verifiable acceptance criteria
- **chrome-devtools** (global) — use for runtime/console/network inspection
- **context7** (global) — use before writing code that depends on a versioned library
- **eslint** (.mcp.json) — use for interactive lint rule explanation and repair
- Storybook / Semgrep / SonarQube / Shadcn — see .mcp.json (disabled; setup required)

### Deferred tool loading
Use ToolSearch to load MCP tool schemas only when needed. Do not load all tools eagerly.
