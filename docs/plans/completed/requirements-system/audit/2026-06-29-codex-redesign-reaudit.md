---
audit-of: requirements-system
auditor: codex
date: 2026-06-29
verdict: NEEDS REVISION
blocking-issues: 2
advisory-issues: 1
---

# Plan Audit: requirements-system

## Verdict

NEEDS REVISION

**Reason:** The graph redesign now fits the product target, but two stale internal references can misdirect executing agents before the plan is activated.

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | README / RS-R4 | The carry-forward contract says skill distribution is currently working in both `.agents/skills/` and `.claude/skills/`, but the actual tree does not match that claim. This is risky because RS-R4 depends on the current sync state before adding the new requirement skills. | `README.md` says both agent skill dirs contain the six `dcx-*` skills. In-session discovery showed only `.agents/skills/impeccable/SKILL.md` plus canonical `agent-skills/dcx-*`; no `.claude/skills/dcx-*` or `.agents/skills/dcx-*` files appeared. | Either run/fix `scripts/agent/sync-skills.sh` now and verify both dirs, or revise the carry-forward to state the true current condition: canonical skills exist in `agent-skills/`, local distribution is not verified/currently absent, and RS-R4 must repair and prove sync. Add the discovery command and expected output to RS-R4 acceptance. |
| 2 | README / global sprint requirements | The mandatory Requirement Trace transition points at the wrong sprint. | `README.md` says every output must carry Requirement Trace "once RS-R5 ships the format"; the redesigned sprint index makes RS-R5 the source inventory sprint. The trace format is designed in RS-R0b and enforced/wired in RS-R4. | Replace the RS-R5 reference with the actual transition rule, for example: "After RS-R0b defines the format, early sprints cite RS-R0 graph design IDs; after RS-R4 ships planner/audit enforcement, every plan/sprint output must carry the mandatory Requirement Trace." |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | RS-R0b | RS-R0b is doing a very large amount of architecture design at once. It is acceptable as a sign-off sprint, but it is the highest-risk handoff. | RS-R0b covers storage, validators, mutation workflow, reconciliation design, queues, query/trace commands, skill/rule wiring, self-governance, sample records, worked examples, and disposition policy. | Keep RS-R0b, but make its output template strict: required headings, sample record count, command-name table, validator catalog table, and PO sign-off checklist. |

## Prior art compliance

The plan explicitly treats the previous flat-model READY verdict as stale and archives the old sprint set under `sprints/_superseded-2026-06-29-flat-model/`. It preserves the prior audit fixes: session logs are first-class source material, source reads require deterministic manifests, carry-forward is mandatory, fallbacks are named, the on-hold frontend-polish boundary is protected, and requirement traceability is now modeled as a bidirectional product-to-code graph rather than a flat registry.

This satisfies the prior-art requirement. The two blockers above are not conceptual regressions; they are current-state and sequencing mismatches introduced during the redesign.

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| RS-R0a | N/A | N/A | N/A | N/A | N/A | Design-only conceptual model; PO sign-off paired with RS-R0b. |
| RS-R0b | N/A | N/A | N/A | N/A | N/A | Design-only enforcement architecture; must produce exact command names and templates. |
| RS-R1 | Required | Required | Required | Required | N/A | Graph store/schema/validators. |
| RS-R2 | Required | Required | Required | Required | N/A | Mutation workflow, ledger, queues, generated views, low-token query. |
| RS-R3 | Required | Required | Required | Required | N/A | Reconciliation engine and change-triggered checks. |
| RS-R4 | Required | Required | Required | Required | N/A | Skills, rules, planner/audit grounding, hooks, skill-sync. |
| RS-R5 | N/A | N/A | N/A | N/A | N/A | Discovery/inventory only; requires source manifest and no-`src/`-change proof. |
| RS-R6 | Required | Required | Required | Required | N/A | Migration to populated graph and ledger. |
| RS-R7 | Required | Required | Required | Required | N/A | Initial code reconciliation and PO-confirmed mappings. |
| RS-R8 | Required | Required | Required | Required | N/A | Verification evidence and stale/invalidated evidence behavior. |
| RS-R9 | Required | Required | Required | Required | N/A | Dogfood/self-trace with PO sign-off. |
| RS-R10 | Required | Required | Required | Required | N/A | Legacy disposition; PO-gated archive-not-destroy. |
| RS-R11 | N/A | N/A | N/A | N/A | N/A | Brief-only re-grounding; no on-hold execution. |

## Handoff quality

Handoff quality is now strong. The redesigned README defines the graph chain, node families, lifecycle states, progressive maturation, manifestation identity, expected-vs-actual manifestation layers, evidence model, exemptions, queues, and self-governance. The dependency sequence is also coherent: RS-R0a/R0b define the model, RS-R1-R4 build the engine and wiring, RS-R5 inventories source intent, RS-R6 migrates, RS-R7 reconciles code, and RS-R8-RS-R11 harden evidence, dogfood, disposition, and frontend-polish re-grounding.

After the two blockers are fixed, the plan should be activatable without another conceptual redesign.

## Ready checklist

- [ ] All blocking issues resolved
- [x] Prior art findings incorporated
- [x] Every sprint has executor named
- [x] Every code-modifying sprint has gate coverage
- [x] Session start steps present in each sprint via global sprint requirements
- [x] Carry-forward contract present; every sprint is governed by global Step 0 and final-step requirements
- [x] Tool-dependent criteria have documented fallback rules
