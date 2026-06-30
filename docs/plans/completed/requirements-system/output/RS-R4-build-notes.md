---
output: RS-R4-build-notes
plan: requirements-system
sprint: RS-R4
agent: OpenCode (big-pickle)
date: 2026-06-29
status: completed
---

# RS-R4 — Skills + agent-rule wiring + planner/audit grounding + hooks/gates + skill-sync

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-GOV-TRACE-001, REQ-GOV-TRACE-001-AGENT, RS-R0b §8 (Requirement Trace format), RS-R0b §10 (Behavior-Sustaining Map) |
| Scope/type | governance, agent-workflow, devops/tooling |
| States | governance=approved, maturity=behavior-defined, delivery=implemented |
| Source/lock | RS-R0b-architecture.md §8 §10 (PO-signed 2026-06-29) |
| Acceptance outcomes | planner fails missing Requirement Trace; audit fails ungrounded traces; 9 skills synced to both dirs; mandatory rules in core.md §35; completion gate wired |
| Responsibilities | skill authoring, rule wiring, sync distribution, hook creation, enforcement testing |
| Expected manifestations | 3 new skills, 3 updated skills, core.md §35, AGENTS.md routing, hook script, smoke tests |
| Actual manifestations | see Built table |
| Evidence | smoke tests 33/33 pass; gates all pass (completion gate ⏭️ SKIPPED — pre-RS-R5) |
| Impact/dependencies | Feeds RS-R7 (initial reconciliation run), RS-R8 (verification evidence), RS-R9 (dogfood) |
| Coverage | complete; all acceptance criteria met |
| Gate result | PASS — typecheck clean, lint 0 errors, validate:architecture 0 violations, test 51/51, verify.sh pass, completion gate ⏭️ SKIPPED (pre-RS-R5), sync-skills.sh 9/9 |

## Built

| Concern | Path |
|---|---|
| Intake skill (new) | `agent-skills/dcx-requirement-intake/SKILL.md` |
| Maturation skill (new) | `agent-skills/dcx-requirement-maturation/SKILL.md` |
| Reconciliation skill (new) | `agent-skills/dcx-manifestation-reconcile/SKILL.md` |
| Planner updated | `agent-skills/dcx-sprint-planner/SKILL.md` |
| Audit updated | `agent-skills/dcx-plan-audit/SKILL.md` |
| Sprint close updated | `agent-skills/dcx-sprint-close/SKILL.md` |
| core.md §35 (6 rules) | `docs/agent-rules/core.md` |
| AGENTS.md routing | `AGENTS.md` |
| Sync script updated | `scripts/agent/sync-skills.sh` |
| Completion hook script | `scripts/agent/run-completion-hook.sh` |
| PostToolUse hook | `.claude/settings.json` |
| Smoke tests (33) | `scripts/requirements/__tests__/rs-r4-smoke-tests.sh` |

## Skill sync pre/post state

**Pre-state** (before sync): 6 skills in both `.claude/skills/` and `.agents/skills/`
- dcx-sprint-planner, dcx-frontend-refactor, dcx-frontend-verify, dcx-sprint-close, dcx-code-query, dcx-plan-audit

**Post-state** (after sync): all 9 dcx-* skills in both dirs
- +3: dcx-requirement-intake, dcx-requirement-maturation, dcx-manifestation-reconcile

## core.md §35 — Mandatory Requirements Governance Rules

| § | Rule | Enforced by |
|---|---|---|
| 35a | Graph-ID Grounding | planner (fails missing trace), audit (fails ungrounded claims) |
| 35b | Sign-Off Before Mutation | propose/apply-after-signoff workflow; no direct node edits |
| 35c | Validate + Reconcile Before Done | sprint-close gate #6; completion hook |
| 35d | No Silent Unlinked Manifestations | manifestation-reconcile skill; completion gate |
| 35e | System Is the Source of Truth | graph over plan; reconciliation explains code gaps |
| 35f | Skills Enforce These Rules | all 6 requirements skills wired |

## Gate Evidence

| Gate | Result |
|---|---|
| `npm run typecheck` | PASS (0 errors) |
| `npm run lint` | PASS (0 errors, 0 warnings) |
| `npm run validate:architecture` | PASS (0 violations) |
| `npm run test` | PASS (9 files, 51 tests) |
| `bash scripts/verify.sh` | PASS |
| `npm run req:validate` | PASS |
| `npm run req:completion-gate -- --changed <rs-r4-files>` | ⏭️ SKIPPED — pre-RS-R5 state (graph has no requirement nodes); see notes below |
| `bash scripts/agent/sync-skills.sh` | PASS (9 synced) |
| `bash scripts/requirements/__tests__/rs-r4-smoke-tests.sh` | PASS (33/33) |

### Completion gate notes

The `req:completion-gate` detected an empty requirements graph
(`docs/product/requirements/graph/nodes/` has only `.gitkeep` — no requirement
nodes populated yet). Per `dcx-sprint-close` §1: "If the requirements graph
does not yet exist (pre-RS-R5), skip gate #6." RS-R5 (source inventory) and
RS-R6 (seed graph data) will populate the graph; after that, the completion
gate will run against live nodes and produce PASS/BLOCKED verdicts.

The completion gate now includes explicit pre-RS-R5 detection: if the graph
has zero `Requirement`, `SystemResponsibility`, or `Intent` nodes, it returns
⏭️ SKIPPED with exit code 0 and a clear message.
