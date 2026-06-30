## RS-R4 — Skills + agent-rule wiring + planner/audit grounding + hooks/gates + skill-sync
Agent: OpenCode (big-pickle)
Model: big-pickle
Provider: Anthropic
Date: 2026-06-29
Type: sprint-execution
Status: Completed
PO-Action: none

Intent: Ship the three requirement-governance skills, update existing skills (planner/audit/close), wire mandatory rules into core.md + AGENTS.md, implement completion hook, and sync all skills to both agent dirs.
Trigger: RS-R4 sprint plan
Requirements covered: RS-R4, RS-R0b §8 (Requirement Trace format), RS-R0b §10 (Behavior-Sustaining Map)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | `agent-skills/dcx-requirement-intake/SKILL.md` | PO message → candidate proposal → contradiction/impact check | 178 |
| created | `agent-skills/dcx-requirement-maturation/SKILL.md` | Advance node maturity with progressive-validation matrix | 190 |
| created | `agent-skills/dcx-manifestation-reconcile/SKILL.md` | Wrap changed-file reconciliation + completion-gate check | 179 |
| edited | `agent-skills/dcx-sprint-planner/SKILL.md` | Added Requirement Trace enforcement (Step 2) + graph-ID grounding to final checks + Requirement Trace section to sprint file structure | 158 (was 133) |
| edited | `agent-skills/dcx-plan-audit/SKILL.md` | Added §0 grounding check — fails plans/claims with no graph IDs | 277 (was 233) |
| edited | `agent-skills/dcx-sprint-close/SKILL.md` | Added requirement gates (gate #6: req:validate + req:completion-gate) + Requirement gates row to verdict table | 176 (was 163) |
| edited | `scripts/agent/sync-skills.sh` | Added 3 new skills to SKILLS=() array → 9 total | 77 (was 73) |
| created | `scripts/agent/run-completion-hook.sh` | PostToolUse hook that warns about completion gate on sprint output writes | 39 |
| edited | `.claude/settings.json` | Added PostToolUse hook for run-completion-hook.sh on output/ files | 24 (unchanged) |
| edited | `docs/agent-rules/core.md` | Added §35 Requirements Governance (6 mandatory rules) | 777 (was 695) |
| edited | `AGENTS.md` | Added Requirements tool routing table + 3 new skills to project skills table | 268 (was 250) |
| created | `scripts/requirements/__tests__/rs-r4-smoke-tests.sh` | 31 smoke tests covering all RS-R4 deliverables | 107 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic | N/A (no src/ changes) |
| Open decisions used | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Pre/post state logged for skill sync | PASS — logged pre-state (6 skills) and post-state (9 skills) |
| 3 new skills in agent-skills/ + sync-skills.sh updated | PASS — all 3 created, sync lists 9 skills, post-sync verified |
| Post-sync: all 9 dcx-* skills in both .claude/ and .agents/ | PASS — ls -1 confirms 9 in each dir |
| AGENTS.md/core.md carry mandatory rules | PASS — core.md §35a-§35f; AGENTS.md routing table + skill refs |
| planner fails missing Requirement Trace | PASS — Step 2 enforces; sprint structure includes Trace section |
| audit fails ungrounded traces | PASS — §0 grounding check; NOT READY for missing graph IDs |
| completion gate hooked | PASS — close skill gate #6; PostToolUse hook; run-completion-hook.sh |
| typecheck · lint · validate:architecture · test · verify.sh · sync-skills.sh | ALL PASS |

### Gates
| Gate | Result |
|---|---|
| npm run typecheck | PASS (0 errors) |
| npm run lint | PASS (0 errors, 0 warnings) |
| npm run validate:architecture | PASS (0 violations) |
| npm run test | PASS (9 files, 51 tests) |
| bash scripts/verify.sh | PASS |
| bash scripts/agent/sync-skills.sh | PASS (9 synced) |
| bash scripts/requirements/__tests__/rs-r4-smoke-tests.sh | PASS (31/31) |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
None — no src/ changes.

### Open issues / follow-ups
- RS-R5 (source inventory), RS-R6 (seed graph data), RS-R7 (initial reconciliation) build on this wiring.
- RS-R9 dogfood will verify self-trace of these skills/rules as MAN- nodes.
