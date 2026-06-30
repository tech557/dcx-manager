# Session: FP-R4 Output Revision — Fixing fabricated IDs & counts

**Agent:** opencode  
**Date:** 2026-06-28  
**Plan:** `frontend-polish-v0.3.5`  
**Trigger:** Claude output audit (verdict: REOPEN)  
**Status:** Completed

---

## What happened

The user asked me to check "what did we do so far" regarding FP-R4. While summarizing, I mentioned needing to check Claude's output audit. The user clarified they wanted to see Claude's audit. I found `output-review/2026-06-28-claude-FP-R4-output-audit.md` — verdict: REOPEN with 2 blocking issues.

### Blocking #1: Fabricated BLD-* IDs

~20 requirement IDs referencing areas without formal numbered IDs (drag-and-drop, islands, kanban, readiness, stage, timeline) — these IDs do not exist in any requirements or decisions doc.

**Root cause:** I invented BLD-DND-NNN, BLD-ISL-NNN, BLD-KAN-NNN, BLD-RDY-NNN, BLD-STG-NNN, BLD-TML-NNN, BLD-VCX-002, BLD-CRD-SPC-NNN prefixes that were never formalized.

**Fix:** Replaced every fabricated ID with the source file name (e.g., `drag-and-drop.md`, `kanban.md`, `stage.md`, `readiness.md`, `timeline.md`, `islands.md`) in the Requirement column. Real IDs (BLD-EDT-001/002, BLD-CRD-INT-002–006, BLD-VCX-001, BLD-FOC-001, BLD-SLC-001/002, BLD-OVR-001, BLD-RED-001, BLD-MOT-001) were preserved because they exist in `builder-decisions.md` and/or requirements docs.

Files modified:
- `output/FP-R4-finalize-spec.md` — E04, K01–K07, T01–T07, D01–D08, R01–R02, C07, C09, S01–S07, L01

### Blocking #2: Wrong family counts

The §1.12 summary claimed 44/17/9=70 but the actual tagged count is 45/21/10=76. The area breakdown was also inconsistent with itself.

**Root cause:** I hand-counted without verifying against the actual criteria table. The totals didn't match the sum of areas.

**Fix:** Recounted every criterion row in the table. Updated §1.12 summary table and area breakdown to 45/21/10 with 3 confirmed-working (79 total).

### Advisory: CRD-INT-* vs BLD-CRD-INT-* prefix

Claude flagged that `CRD-INT-002` (without BLD-) is the canonical form. Investigation found that **both forms exist**: `BLD-CRD-INT-002` in `builder-decisions.md` and `CRD-INT-002` in inline requirement text in `builder-open-decisions.md`. The decision doc uses `BLD-` prefix consistently. No fix needed — both are valid but `BLD-CRD-INT-*` is the more precise form.

### Advisory: X-series bare ❓

Added D-12 row to `decision-register.md` and updated X01–X03 to reference `❓ — see D-12`.

### Advisory: README carry-forward counts

Updated `README.md` carry-forward table to 45/21/10=76 with +3 confirmed annotation.

---

## Files modified

| File | Change |
|---|---|
| `output/FP-R4-finalize-spec.md` | ~20 fabricated IDs replaced with source file refs; family counts corrected to 45/21/10/76; area breakdown corrected |
| `output/decision-register.md` | Added D-12 row for structural-token decision |
| `README.md` | Carry-forward counts updated to 45/21/10/76 |

---

## Gates

| Gate | Status | Evidence |
|---|---|---|
| Fabricated IDs eliminated | ✅ | grep shows no BLD-DND/ISL/KAN/RDY/STG/TML/VCX-002/CRD-SPC in finalize-spec |
| Family counts match reality | ✅ | 45 wire + 21 comp + 10 token = 76 tagged, 3 confirmed = 79 total |
| Decision register complete | ✅ | D-01 through D-12 |
| Session log written | ✅ | This file |

---

## Follow-up

None. FP-R4 output is now ready for FP-R5 consumption.
