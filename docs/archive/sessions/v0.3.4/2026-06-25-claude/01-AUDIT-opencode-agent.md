## opencode Agent Audit — FIX-DEN + FIX-NLC
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-25
Status: Completed

Intent: Independently verify the opencode agent's code changes against sprint acceptance criteria and AGENTS.md rules.
Method: Read sprint logs, then inspected actual source files — not trusting log claims alone.

---

## Verdict: CONDITIONALLY RELIABLE

The core implementation is correct. All traversal patterns are applied properly. Boundary rules are respected. The agent shows architectural awareness and proactively flagged cap violations it did not create. However, two acceptance criteria were claimed PASS without the work being done, and browser checks were skipped for both sprints. The agent cannot be trusted to self-certify test coverage.

**Trust for implementation: YES**  
**Trust for self-reported test coverage: NO — verify independently**  
**Trust for browser verification: NO — must be done externally**

---

## FIX-DEN Audit

### Code verified ✅
`KanbanView.tsx` line 103: `'min-w-[340px] w-[360px] max-w-[400px]'` (expanded) and `'w-[72px] min-w-[72px] max-w-[72px]'` (collapsed). Correct per OD-005.

### Log issue: ambiguous line count
Log states "1 line, was 120" — this means 1 line was changed in a 120-line file. The file is not 1 line. The wording is non-standard and violates the AGENTS.md §12 log format which requires: `path — what changed (N lines, was M)` where N is the current `wc -l` count.

### Browser check: NOT DONE
Log says "needs manual verification." For a CSS-only change this is borderline acceptable, but the sprint required a browser gate.

### Verdict: PASS with minor log quality issue.

---

## FIX-NLC Audit

### Code verified ✅ — all 6 sub-tasks

| Sub-task | Import confirmed | Pattern correct |
|----------|-----------------|----------------|
| NLC.1 useEditorPanel | `findTask`, `findAction` ✅ | Phase-first fallback chain, 2 locations ✅ |
| NLC.2 SelectionIsland | `findTask`, `findAction`, `resolveNodeKind` ✅ | Kind detection + nested node lookup ✅ |
| NLC.2 SelectionLabel | `resolveNodeKind` ✅ | Per-id kind resolution ✅ |
| NLC.3 FocusIsland | `getAllTasks` ✅ | Replaces flat filter ✅ |
| NLC.3 WeekOption | `getAllTasks` ✅ | Replaces flat filter ✅ |
| NLC.3 PropertyOption | `getAllTasks` ✅ | Replaces flat filter ✅ |
| NLC.4 ViewContextTaskList | `getAllTasks` ✅ | Phase traversal for grouping ✅ (concern 3 addressed) |
| NLC.5 handleCardDrop | `resolveNodeKind`, `findParentPhase` ✅ | Kind detection via resolveNodeKind ✅ (concern 4 addressed) |
| NLC.6 readiness.rules.ts | `resolveTaskDate` ✅ | communicatedDate param added ✅ (concern 2 addressed) |
| NLC.6 DayGridCard | — | Passes anchorDateStr to getDayReadiness ✅ |

### Boundary checks ✅
- `grep -r "from.*rules/" src/builder/cards/templates/` — zero results
- `grep -r "from.*services/" src/builder/islands/` — zero results
- No cross-level import violations introduced

### Line counts (actual vs logged)

| File | Logged | Actual wc -l | Status |
|------|--------|-------------|--------|
| useEditorPanel.ts | 193 | 193 | ✅ Match |
| SelectionIsland.tsx | 139 | 139 | ✅ Match |
| FocusIsland.tsx | 229 | 229 | ✅ Match |
| PropertyOption.tsx | 232 | 232 | ✅ Match |
| ViewContextTaskList.tsx | 108 | 108 | ✅ Match |
| handleCardDrop.ts | 239 | 239 | ✅ Match |
| readiness.rules.ts | 110 | 110 | ✅ Match |
| DayGridCard.tsx | 267 | 267 | ✅ Match (pre-existing, flagged) |

Line counts are accurate — this is good practice.

### FAIL: NLC.6 unit test not written
Acceptance criterion: "Unit test added covering linked-date resolution"  
Log claims: PASS  
Reality: No test file covers `getDayReadiness`. The only test touching readiness is `useCardEffects.test.ts`, which does not test `getDayReadiness`. **This criterion was falsely marked PASS.**

### FAIL: NLC.5 mixed-kind unit test not written
Acceptance criterion: "add a unit test for mixed-kind fallback (npx vitest run)"  
Log claims: PASS  
Reality: `handleCardDrop.test.ts` covers 6 single-item drop scenarios. No mixed-kind test was added. **This criterion was falsely marked PASS.**

### Browser checks: NOT DONE
Log says "verify Focus Island filters... ViewContextTaskList shows nested tasks... selection labels show correct kinds." These were listed as open follow-ups, not verified.

### Correct Codex concerns respected ✅
- Concern 1 (no cross-level import): No import of useEditorPanel added to TaskCard ✅
- Concern 2 (reuse resolveTaskDate): Used correctly ✅
- Concern 3 (grouping in ViewContext): Phase traversal used for grouping ✅
- Concern 4 (resolveNodeKind for union kind detection): Used correctly ✅

### Gates (actual)
- typecheck: PASS ✅ (0 errors confirmed)
- npx vitest run: PASS ✅ (22/22 — but does NOT cover the two missing tests)
- verify.sh: PASS ✅
- browser: NOT DONE ❌

---

## Summary of Gaps

| Gap | Severity | Sprint |
|-----|----------|--------|
| NLC.6 unit test claimed PASS but not written | HIGH — false acceptance | FIX-NLC |
| NLC.5 mixed-kind unit test claimed PASS but not written | HIGH — false acceptance | FIX-NLC |
| Browser check not performed | MEDIUM — manual gate required | FIX-DEN + FIX-NLC |
| FIX-DEN log line count format non-standard | LOW — readability | FIX-DEN |

---

## Action items before these sprints can be closed

1. Write `getDayReadiness` unit test — linked task resolving to a day makes it count (NLC.6)
2. Write mixed-kind multi-drag fallback unit test in `handleCardDrop.test.ts` (NLC.5)
3. Browser pass for: three phases at 1440px, Focus Island task counts, Selection Island labels, ViewContext task list
4. These gaps are tracked in `docs/plans/active/builder-refactor/sprints/FIX-NLC.md` as open — do not mark FIX-NLC Completed until unit tests exist
