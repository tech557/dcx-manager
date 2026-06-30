## Planning Session — Audit Review and FIX Sprint Creation
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-25
Status: Completed

Intent: Analyse the 2026-06-25-codex-audit findings, derive root causes, create FIX sprints to restore all failing requirements, and update AGENTS.md with guardrails to prevent recurrence.
Trigger: User request to check the audit and create completion sprints.
Requirements covered: BLD-CRD-INT-002, BLD-CRD-INT-004, BLD-CRD-INT-006, BLD-FIL-001, BLD-FIL-002, BLD-CRD-INT-005, BLD-MOT-001, BLD-FOC-001, BLD-VCX-001, BLD-SLC-002, BLD-RED-001

---

## Audit Summary

| Sprint | Audit result |
|--------|-------------|
| B0     | PARTIAL PASS |
| B-FIL  | PARTIAL |
| B-CRD  | FAIL |
| B1     | PARTIAL |
| B2     | PASS ✅ |
| B3     | FAIL |
| B4     | PARTIAL PASS |
| B5     | FAIL |
| B6     | PARTIAL |
| B7     | FAIL |
| B8     | FAIL |
| B9     | FAIL |
| B10    | PARTIAL PASS |
| B11    | FAIL |
| B12    | FAIL |
| B13    | NOT COMPLETE |

---

## Root Causes Identified

### RC-1 — Nested node traversal defect (affects B5, B6, B7, B8, B9, B11)
Runtime `nodes: BuilderNode[]` contains only PhaseNodes. Actions are at `node.data.actionCards`; Tasks are at `action.tasks`. Six sprints called `nodes.find(n => n.kind === 'task')` which always returns undefined. This single defect caused six sprints to produce empty or incorrect results despite appearing to render correctly.

### RC-2 — Long press wired to console.log stub (affects B-CRD, B5, B0 verification)
`TaskCard` passes `onLongPress={() => console.log('open editor', id)}`. Because the editor entry point never fires, B5 (editor multi-session) cannot be verified and B0's editor-width path is blocked.

### RC-3 — TaskReadOnlyPopup exceeds size limit and is a modal, not a popover (affects B-CRD)
The file is 243 lines (sprint required ≤100). The popup is centered on screen with a backdrop — contradicting OD-004 which requires an anchored 280–360px responsive popup beside the card.

### RC-4 — Phase width prevents 3-column layout (affects B3)
Phases are fixed at 400px × 3 + 48px gaps = 1248px in a 1200px viewport. OD-005 specifies preferred 360–400px (min 340px). Three 360px phases = 1128px, which fits.

### RC-5 — No reduced-motion handling (affects B10)
OD-006 / BLD-MOT-001 requires prefers-reduced-motion support. None exists.

### RC-6 — Single-session file preview (affects B-FIL)
`useFilePreview` holds one session. BLD-FIL-002 requires multiple persistent sessions with minimize/restore pills.

### RC-7 — File size cap violations (affects B12)
`EditorViewerIsland.tsx` is 311 lines; `DayGridCard.tsx` is 267 lines; both exceed the 250-line hard cap.

### RC-8 — B12 polish sprint changed interaction logic (affects B12)
A visual polish sprint must not touch hooks or state. B12 changed `useCardEffects.ts` (hook), contradicting the sprint's own constraints. This introduced the wrong edited-state duration (1000ms vs OD-009's 2000ms).

---

## Files Created

- `docs/plans/active/builder-refactor/sprints/FIX-NDX.md` — Nested node traversal helpers (prerequisite)
- `docs/plans/active/builder-refactor/sprints/FIX-CRD.md` — CardShell rework (popup, long press, timing, pulse)
- `docs/plans/active/builder-refactor/sprints/FIX-DEN.md` — Kanban phase density (width adjustment)
- `docs/plans/active/builder-refactor/sprints/FIX-NLC.md` — Nested lookup corrections for B5,B6,B7,B8,B9,B11
- `docs/plans/active/builder-refactor/sprints/FIX-FIL.md` — File preview multi-session
- `docs/plans/active/builder-refactor/sprints/FIX-MOT.md` — Reduced motion compliance
- `docs/plans/active/builder-refactor/sprints/FIX-CAP.md` — File size cap repairs
- `docs/plans/active/builder-refactor/sprints/FIX-POL.md` — Visual polish re-run (B12 replacement)

## Files Edited

- `docs/plans/active/builder-refactor/roadmap.md` — Added audit status table, FIX sprint sequence, dependency graph
- `docs/plans/active/builder-refactor/sprints/B13.md` — Updated precondition from B12 to FIX-POL
- `AGENTS.md` — Added §16–§21 (nested node rule, stub ≠ complete, popup ≠ modal, wc -l gate, polish-sprint CSS-only rule, reduced motion requirement); version bumped to v0.2.16

## Files Deleted

None

---

## Churn — work reversed

None. No code changed in this session.

---

## Preserve-semantic check

No code was written this session. All changes are documentation and sprint plan files.

---

## Open decisions used

None.

---

## Acceptance criteria

N/A — planning session, no code sprint acceptance criteria.

---

## Gates

typecheck: N/A (no code changes)
dev: N/A
verify.sh: N/A
browser manual check: N/A

---

## What the next agent should start with

1. Read AGENTS.md §16 (nested node rule) before touching any file that searches for Actions or Tasks.
2. Run `FIX-NDX` first — it is the prerequisite for FIX-CRD and FIX-NLC.
3. FIX-DEN, FIX-FIL, FIX-MOT can run in parallel with FIX-NDX (they are independent).
4. After FIX-NDX is done, run FIX-CRD and FIX-NLC.
5. Run FIX-CAP after FIX-NLC (editor panel changes may affect line count).
6. Run FIX-POL only after all FIX-* sprints pass.
7. Run B13 after FIX-POL.

## Open issues / follow-ups

- B4 (card reveal) has no automated test. A unit or integration test should be added in FIX-POL or B13 prep.
- B1 (loading shell) skeleton dimensions need updating after FIX-DEN changes the phase column width to 360px. This is tracked in FIX-POL.1.
- `EditorViewerIsland.tsx` at 311 lines may shrink after FIX-NLC changes (useEditorPanel); re-measure before splitting in FIX-CAP.
