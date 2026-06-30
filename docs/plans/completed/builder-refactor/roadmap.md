# Builder Refactor — Sprint Roadmap

## Status after audit (2026-06-25)

An independent audit (Codex, 2026-06-25) found that the B0–B12 session logs claimed completion but several sprints fail their acceptance criteria. The primary root cause is a **nested node traversal defect**: runtime `nodes` contains only PhaseNodes; Actions and Tasks are nested within them. Any code that called `nodes.find(n => n.kind === 'task')` returned nothing. Six sprints (B5, B6, B7, B8, B9, B11) share this defect.

A set of FIX sprints must be completed before B13 can run.

## Original Sprint Sequence (B0–B12 claimed complete; audit result in brackets)

```
B0     StageProvider state cleanup       [PARTIAL PASS]
B-FIL  File preview migration            [PARTIAL]
B-CRD  CardShell parallel states         [FAIL]
B1     Loading shell                     [PARTIAL]
B2     Stage sizing                      [PASS ✅]
B3     Kanban density                    [FAIL]
B4     Card reveal                       [PARTIAL PASS]
B5     Editor multi-session              [FAIL]
B6     Selection Island                  [PARTIAL]
B7     Focus Island                      [FAIL]
B8     View Context                      [FAIL]
B9     Multi-select drag                 [FAIL]
B10    View transition animation         [PARTIAL PASS]
B11    Day readiness                     [FAIL]
B12    Visual polish                     [FAIL — preconditions unmet]
B13    Acceptance review                 [NOT COMPLETE]
```

## FIX Sprint Sequence (must run before B13)

```
FIX-NDX   Nested node traversal helpers    PREREQUISITE for FIX-NLC, FIX-CRD
FIX-CRD   CardShell rework                 After FIX-NDX
FIX-DEN   Kanban density rework            Independent
FIX-NLC   Nested lookup corrections        After FIX-NDX  (fixes B5,B6,B7,B8,B9,B11)
FIX-FIL   File preview multi-session       Independent
FIX-MOT   Reduced motion compliance        Independent
FIX-CAP   File size cap repairs            After FIX-NLC
FIX-POL   Visual polish re-run             After ALL above
B13        Acceptance review               After FIX-POL
```

## Dependency Graph (FIX sprints)

```
FIX-NDX ────────────────────────────────────► FIX-NLC, FIX-CRD
FIX-DEN ────────────────────────────────────► (independent, run in parallel)
FIX-FIL ────────────────────────────────────► (independent, run in parallel)
FIX-MOT ────────────────────────────────────► (independent, run in parallel)
FIX-NLC ────────────────────────────────────► FIX-CAP
FIX-NDX + FIX-CRD + FIX-DEN + FIX-NLC + FIX-FIL + FIX-MOT + FIX-CAP ► FIX-POL ► BUG-OVF + BUG-KAN ► BUG-WIDE + BUG-ISL ► B13
```

## BUG Sprints (added 2026-06-25 — post-browser-review findings)

```
BUG-OVF   Timeline day columns left-clipped   ✅ Completed (Claude)
BUG-KAN   Kanban phase centering logic         ✅ Code complete (opencode) — browser gate open
BUG-WIDE  Expanded card width 360px → 260px   🔴 Not started — MUST run before B13
BUG-ISL   Islands clipping / shifting          🔴 Not started — MUST run before B13
```

### BUG sprint dependency graph

```
BUG-OVF   ─── (no dep) ────────────────────────────────────────► DONE
BUG-KAN   ─── after BUG-OVF ────────────────────────────────────► Code done
BUG-STAGE ─── BLOCKER — fixes state mismatch, run first ─────────► 🔴
BUG-WIDE  ─── after BUG-STAGE (shouldCenter also uses isEditorOpen)► 🔴
BUG-ISL   ─── after BUG-WIDE (verifies no new clip) ────────────► 🔴
B13       ─── after BUG-STAGE + BUG-WIDE + BUG-ISL ─────────────► ⬜
```

## V1 Coverage Confirmation

Every confirmed V1 requirement maps to a sprint or is already implemented:

| Area | Sprint(s) | Notes |
|---|---|---|
| File preview migration BLD-FIL-001 | B-FIL | |
| Card parallel states BLD-CRD-INT-002 | B-CRD | |
| Loading skeleton | B1 | |
| Stage sizing | B2 | |
| Kanban density | B3 | |
| Card reveal / newly created | B4 | |
| Newly edited state | B-CRD | |
| Receiving-child state | B-CRD | |
| Editor multi-session | B5 | |
| Presentation mode | B6 | |
| Delete confirmation | B6 | |
| Focus applied badge + AND/OR | B7 | |
| View Context (unassigned + disabled) | B8 | |
| Multi-select drag | B9 | |
| View transition | B10 | |
| Day readiness | B11 | |
| Visual polish | B12 | |
| User Island | ✅ Implemented | |
| Timeline Builder sync | ✅ Implemented | |
| Weekly/Monthly views | ✅ Implemented | |
| Edge auto-scroll | ✅ Implemented | |
| Task/Action/Phase readiness | ✅ Implemented | |
| Import/export | ✅ Implemented | |
| Autosave | ✅ Implemented | |
| AI creation / templates | 🔮 V2 deferred | BLD-OVR-001 |
