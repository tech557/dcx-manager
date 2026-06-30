# Builder Refactor — Active Plan

**Status:** ⚠️ BUG sprints required before B13 can reopen — opencode self-closed sprints without browser verification  
**Date:** June 2026

> **Audit correction (2026-06-25):** An independent audit found that B3, B5, B6, B7, B8, B9, B11, B12 do not pass their acceptance criteria. The status column below reflects actual audit results. Original session logs are unchanged (historical record only). See [`docs/progress/sessions/2026-06-25-codex-audit/README.md`](../../progress/sessions/2026-06-25-codex-audit/README.md) and [`roadmap.md`](roadmap.md) for the FIX sprint sequence.

## Documents in this folder

| Document | Purpose |
|---|---|
| [roadmap.md](roadmap.md) | Sprint sequence and status — updated with FIX sprint dependency graph |
| [dependency-map.md](dependency-map.md) | What blocks what |
| [agent-execution-guide.md](agent-execution-guide.md) | How to run any task with any agent |
| [testing-plan.md](testing-plan.md) | Per-sprint and final testing |
| [visual-validation.md](visual-validation.md) | Pixel-perfect review checklist |
| [risks-and-rollback.md](risks-and-rollback.md) | Risks and rollback boundaries |
| [sprints/](sprints/) | One file per sprint |

## Quick status

### Original sprints (audit results)

| Sprint | Name | Audit result |
|---|---|---|
| B0 | StageProvider state cleanup | ⚠️ Partial pass |
| B-FIL | File preview migration | ⚠️ Partial |
| B-CRD | CardShell parallel states | ✅ Completed (fixed by FIX-CRD) |
| B1 | Loading shell | ⚠️ Partial |
| B2 | Stage sizing | ✅ Pass |
| B3 | Kanban density | ❌ Fail — FIX-DEN required |
| B4 | Card reveal | ⚠️ Partial pass |
| B5 | Editor multi-session | ❌ Fail — FIX-NLC.1 required |
| B6 | Selection Island | ⚠️ Partial — FIX-NLC.2 required |
| B7 | Focus Island | ❌ Fail — FIX-NLC.3 required |
| B8 | View Context | ❌ Fail — FIX-NLC.4 required |
| B9 | Multi-select drag | ❌ Fail — FIX-NLC.5 required |
| B10 | View transition | ⚠️ Partial pass — FIX-MOT required |
| B11 | Day readiness | ❌ Fail — FIX-NLC.6 required |
| B12 | Visual polish | ❌ Fail — FIX-POL required |
| B13 | Acceptance review | ⬜ Awaiting FIX-POL |

### FIX sprints (completion sequence)

| Sprint | Name | Status |
|---|---|---|
| FIX-NDX | Nested node traversal helpers | ✅ Completed (2026-06-25 Codex) |
| FIX-CRD | CardShell rework | ✅ Completed (2026-06-25 Codex) |
| FIX-DEN | Kanban density rework | ✅ Code complete — browser ⚠️ bug found (BUG-KAN) |
| FIX-NLC | Nested lookup corrections (B5/B6/B7/B8/B9/B11) | ✅ Code + tests complete (27/27) |
| FIX-FIL | File preview multi-session | ⚠️ Code present — browser unverified |
| FIX-MOT | Reduced motion compliance | ⚠️ Code present — browser unverified |
| FIX-CAP | File size cap repairs | ✅ Completed — code only, no browser gate |
| FIX-POL | Visual polish re-run | ✅ Complete — screenshots skipped per PO instruction; code gates pass |
| BUG-OVF | Timeline day columns clipped off-screen | ✅ Completed (2026-06-25 Claude) |
| BUG-KAN | Kanban centering and phase count | ✅ Code complete (2026-06-25 opencode) — browser gate open |
| FIX-POL | Visual polish re-run (redo) | ✅ Completed (2026-06-25 Claude) — screenshots skipped per PO |
| BUG-STAGE | Stage layout state mismatch — double shift on click + day false-open | 🔴 Not started — BLOCKER |
| BUG-WIDE | Expanded card/phase column too wide (360px → 260px) | 🔴 Not started |
| BUG-ISL | Islands clipping / shifting out of viewport | 🔴 Not started |
| B13 | Acceptance review | ⬜ Blocked — awaiting BUG-STAGE + BUG-WIDE + BUG-ISL |
