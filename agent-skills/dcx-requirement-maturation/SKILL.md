---
name: dcx-requirement-maturation
description: >
  Advance a requirement node through the maturity dimension — from intent-captured
  to behavior-defined, rules-specified, conditions-mapped, acceptance-specified,
  and evidence-bound — while respecting the progressive-validation matrix. Use this
  skill after a requirement has been intaken (dcx-requirement-intake) and confirmed
  by the PO, before implementation planning begins.
---

# DCX Requirement Maturation

This skill advances a requirement node along the maturity dimension. It
progressively adds rules, conditions, exceptions, acceptance outcomes,
responsibilities, and expected categories. Each step validates that required
fields for the target maturity state are present, and that no impossible
governance/maturity combination is created.

## When to use

- After a requirement is intaken and PO-confirmed (INT → REQ)
- Before a sprint plans implementation for a requirement (needs behavior-defined
  or rules-specified)
- When a requirement needs acceptance outcomes for verification binding
- When a requirement is ready to be locked and is fully specified

## Maturity dimension reference

| State | Required fields | Optional/emerging fields |
|---|---|---|
| `intent-captured` | id, type, statement, governance, maturity, delivery, source, scope | aliases, tags |
| `behavior-defined` | Above + behavior_rules, relationships (decomposes-into, conflicts-with) | conditions, exceptions |
| `rules-specified` | Above + rules/exceptions, locks if governance=locked, evidence notes | test scenarios |
| `conditions-mapped` | Above + edge cases, conditions matrix, exclusions | performance constraints |
| `acceptance-specified` | Above + acceptance outcomes (AC-), expected categories (EMC-), responsibilities (RSP-) | verification notes |
| `evidence-bound` | Above + evidence links (EVD-), test bindings, manual verification notes | automation notes |

## Step 1 — Read the current node state

```bash
npm run req:query -- --by-id <requirement-id>
```

Read the node's current maturity, governance, and delivery states. Also read
any existing TraceLinks, responsibilities, and expected categories.

If the node is `locked`, only proceed if the PO explicitly authorizes
maturation (maturation of a locked node requires a sign-off ledger entry).

## Step 2 — Determine the target maturity

Ask the PO or derive from context:

| Context | Target maturity |
|---|---|
| Just intaken, PO wants to plan implementation | behavior-defined |
| Implementation planning is starting | rules-specified |
| Sprint that implements this req is active | acceptance-specified |
| Sprint closed, verification begins | evidence-bound |

If the PO has not specified, default to advancing one step from current
maturity. Do not skip states — each builds on the prior.

## Step 3 — Add maturity-specific content

### To behavior-defined

Add:
- `BehaviorRule` nodes for each distinct behavior the requirement governs
- `decomposes-into` relationships from the requirement to responsibilities
- `conflicts-with` relationships if any known conflicts exist

```bash
# Check code-index for existing components/hooks/services that likely implement this
bash scripts/agent/code-query.sh labels "<keyword>"
bash scripts/agent/code-query.sh component <related-name>
```

### To rules-specified

Add:
- Explicit conditions and constraints on each behavior rule
- Exceptions and exemption eligibility
- Edge cases the implementation must handle
- Business rules in structured format

Run the progressive-fields validator:
```bash
npm run req:validate
```
This catches missing required fields. Fix all violations before proceeding.

### To conditions-mapped

Add:
- Conditions matrix: which UI states, data states, and actor roles apply
- Exclusion ranges: what is explicitly NOT in scope
- Performance constraints if any

### To acceptance-specified

Add:
- `AcceptanceOutcome` nodes (AC-) — each a verifiable statement
- `ExpectedManifestationCategory` nodes (EMC-) — which categories must manifest
- `SystemResponsibility` nodes (RSP-) — what the system must do

```bash
# Verify acceptance outcomes cover the behavior rules
npm run req:validate | grep -i "acceptance\|coverage"
```

### To evidence-bound

Add:
- `Evidence` nodes (EVD-) linking tests or manual verification to AC nodes
- Test bindings: which tests verify which acceptance outcomes
- If tests do not exist yet: create queue entries for missing evidence

## Step 4 — Validate the transition

Run validation after each maturation step:

```bash
npm run req:validate
```

Check specifically:
- `progressive-fields`: required fields for target maturity are present
- `state-combination-policy`: the new maturity + governance + delivery
  combination is valid
- `expected-category-canonical`: responsibility types use canonical categories
- `derivation-integrity`: technical/test requirements derive from approved source

If validation fails, fix the violations and re-validate. Do not advance to
the next maturity state with failing validators.

## Step 5 — Record the maturation

Write a ledger entry:

```
event_type: maturation
actor: <agent>
source: <session log ref>
affected_node: <requirement-id>
previous_maturity: <state>
new_maturity: <state>
reason: <why this maturation step was taken>
```

Generate updated views:
```bash
npm run req:generate-views
```

## Step 6 — Present to PO

For lock-worthy requirements (fully specified, ready for implementation):

```
## Maturation Complete — <requirement-id>

| Field | Value |
|---|---|
| Current maturity | acceptance-specified |
| Next maturity target | evidence-bound (after implementation) |
| Validation result | PASS |
| Acceptance outcomes | <count> |
| Responsibilities | <count> |
| Expected categories | <count> |

**Ready for PO to lock** if fully specified.
```

## Output format

Updated graph node(s) + new responsibility/acceptance/evidence nodes +
new TraceLinks + ledger entry + session log summary.

## Verification

- [ ] `npm run req:validate` passes with 0 violations
- [ ] All maturity-required fields are present
- [ ] Governance state is valid with current maturity
- [ ] Acceptance outcomes are individually verifiable
- [ ] Expected categories use canonical set (no custom categories without
  ledger reason)
- [ ] Ledger entry written for the transition
- [ ] `npm run req:generate-views` completes without error
