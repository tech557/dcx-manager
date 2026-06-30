---
log: 011-fp-r4-coverage-readiness-check
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: audit-review
version_context: v0.3.5
plan: frontend-polish-v0.3.5
---

# 011 — Readiness check: do FP-R4/R5 cover the PO's concrete concerns? (block close)

## Type: audit-review
PO listed concrete concerns as a readiness test before closing discovery: color tokens vs brand,
font size, day-card inline new-task popup, selection island, scroll defect, drag-drop broken. Asked:
if covered → close + draft impl plan; implicitly, if not → fix first.

## Findings (mapped to graph + FP-R4/FP-R5)
| Concern | Verdict | Evidence |
|---|---|---|
| Color tokens vs brand | ✅ covered | FP-R4 L05; sprint CT-1; `REQ-FP-D08` |
| Selection island | ✅ covered | FP-R4 S01/S02/S08; WM-5 + CT-2 |
| Drag-and-drop broken | ✅ covered | FP-R4 D01–D06; WM-2; FP-R0 browser-confirmed `activeDrag` inert |
| **Day-card inline new-task popup** | ❌ **GAP (significant)** | Graph has `REQ-BC-007/008/009/010` (timeline day quick-create) + code (`DayGridCard`, `DayTaskCreator`); **FP-R4 Timeline T01–T05 never cite them**. Whole family missing. |
| Font size vs brand | ⚠️ partial | Only card-level `REQ-FP-D01`→CC-2; no app-wide typography/`text-dcx-*` token criterion |
| Scroll | ⚠️ partial | Stage/edge scroll covered (`REQ-STG-001/004`, `CMA-002/003`→K02/K04/D04); per-column internal scroll/bounded-height NOT explicit (legacy K01 dropped in rewrite); not live-confirmed |

## Verdict: NOT ready to close
3/6 solid, 3/6 gaps. The day-card quick-create gap is a real requirement family with live code, missing
from the finalize spec — the same class of miss that sank the original discovery. Closing now would
repeat it. Block the discovery close.

## Recommendation (bounded — all existing graph reqs, no new scope)
Patch FP-R4 before close:
1. Timeline day-card quick-create criteria citing `REQ-BC-007/008/009/010` → WM-6 (or new WM-7).
2. App-wide typography `change-token` criterion (brand `text-dcx-*`, no arbitrary font sizes) → CT-1.
3. Explicit stage/column scroll criterion (`REQ-STG-001` bounded height + internal scroll) → CC/WM.
Then update FP-R5 Implementation Coverage Ledger (+ family counts) and close + draft impl plan.
Optional: live-confirm scroll + drag-drop on dev server so new criteria carry browser evidence.

## Gates
Audit/doc-only. 0 `src/` writes. No graph mutation. Discovery close intentionally NOT performed.

## Next (PO choice)
Apply the FP-R4 patch now (then close + draft), or adjust which gaps are in scope first.
