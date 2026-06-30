---
audit-of: folder-structure-v2
auditor: codex
date: 2026-06-26
verdict: NOT READY
blocking-issues: 1
advisory-issues: 3
---

# Plan Audit: folder-structure-v2

## Verdict

NOT READY

**Reason:** The plan is an intentional stub — no sprint files exist and none can be written until all three discovery dependencies (ux-discovery-v2, frontend-discovery-v2, backend-discovery-v2) complete and produce their outputs, which they have not done yet. This is not a defect in the plan; it is the correct state for a plan that is waiting on upstream data.

---

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | All (P1–P4) | No sprint files exist and all three dependency plans have empty output/ directories — ux-discovery-v2, frontend-discovery-v2, and backend-discovery-v2 have not produced any outputs yet | `find docs/plans/drafted/*/output -name "*.md"` returns nothing; the plan README explicitly states "Sprint files will be written after all three discovery plans complete" | Run and complete all three discovery plans first, then draft the sprint files using their outputs |

---

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | P1 | Sprint goal says "Finish what src-structure-refactor P1 started" but the expired plan shows P1 was marked complete (`updated: 2026-06-26 (P1 complete; P2 active)`) — the scope of "finish" is ambiguous | `docs/plans/expired/src-structure-refactor/plan/README.md` header; no output files from expired P1 were verified in this plan's README | Before drafting the P1 sprint file, explicitly document which P1 deliverables from the expired plan were confirmed done and which were not — UX2-R1 will produce that delta |
| 2 | P2 | The expired plan found 35 safe-to-extract leaf atoms, but the plan README only says "Extract safe atoms" without re-confirming that number is still valid post-P1 | Expired FE-R1 finding: "35 leaf atoms safe to extract"; no confirmation that P1 moves did not reduce this count | FE2-R3 output will produce the current safe-extract list — P2 sprint must use that number, not the expired plan's 35 |
| 3 | All | The README references `expired/src-structure-audit` as prior art in the `frontend-discovery-v2` dependency, but `folder-structure-v2` only lists `expired/src-structure-refactor` and `expired/src-structure-audit` in its `prior-art:` frontmatter field — `src-structure-audit` is not mentioned in the "Before starting — read prior art" section | `folder-structure-v2/README.md` frontmatter vs body; `frontend-discovery-v2/README.md` references `expired/src-structure-audit` explicitly | Add `expired/src-structure-audit` to the "Before starting" reading list in the README body so sprint drafters know to read it |

---

## Prior art compliance

The expired plan is `src-structure-refactor`. The folder-structure-v2 README demonstrates strong prior art compliance:

- All six key decisions from the expired plan are explicitly re-stated and declared still valid (No CSS modules, StageContext partial split only, no mobile builder breakpoints, no AI feature backend, mapper strategy deferred, context-coupled components stay in place).
- The Challenges to Recommendations from the expired plan are implicitly honored — no recommendation that was rejected (e.g., CSS modules) is being re-introduced.
- The Before/After metrics table from the expired plan is reproduced and extended with TBD slots for v2 discoveries to fill, rather than reusing stale pre-P1 numbers. This is correct.
- One gap: the expired plan ASSUMPTIONS.md is referenced in the reading list but the folder-structure-v2 README does not state which assumptions were resolved by P1 execution and which are still open. When sprint files are drafted, the drafter must read ASSUMPTIONS.md and explicitly carry forward any still-open PO decisions.

---

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| P1 | Listed in README Execution rule | Listed | Listed | Listed | Listed | Sprint file not yet written — cannot verify gates are in the sprint steps |
| P2 | Listed in README Execution rule | Listed | Listed | Listed | Listed | Sprint file not yet written |
| P3 | Listed in README Execution rule | Listed | Listed | Listed | Listed | Sprint file not yet written |
| P4 | Listed in README Execution rule | Listed | Listed | Listed | Listed | Sprint file not yet written |

The README's Execution rule section correctly lists all five required gates. Whether individual sprint files will include an explicit gate step cannot be verified until those files are written. Flag this at sprint-draft time: each sprint file must include the gate commands as explicit steps, not rely on the reader knowing the README Execution rule.

---

## Handoff quality

No sprint files exist, so handoff chains cannot be audited yet. The dependency mapping in the README sprint table is correct and complete:

- P1 depends on UX2-R1, UX2-R2, UX2-R3
- P2 depends on FE2-R3, UX2-R3
- P3 depends on FE2-R1, FE2-R2
- P4 depends on BE2-R1, BE2-R2, BE2-R3

This mapping is consistent with what the three discovery plans declare in their `feeds-into:` frontmatter fields. No missing or mismatched dependencies detected.

When sprint files are drafted, each must include: the exact output file path from the relevant discovery sprint, the specific finding or table to consume, and the executor (Codex / opencode) named per sprint.

---

## Ready checklist

- [ ] All blocking issues resolved — discovery plans must complete first
- [x] Prior art findings incorporated — decisions from expired plan documented and re-affirmed
- [ ] Every sprint has executor named — no sprint files exist yet (README names "Codex / opencode" globally, which is sufficient as a placeholder)
- [ ] Every code-modifying sprint has gate coverage — gate rules defined at plan level; sprint-level verification deferred until files are written
- [ ] Session start steps present in each sprint — no sprint files exist yet to check
