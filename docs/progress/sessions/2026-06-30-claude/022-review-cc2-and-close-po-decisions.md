---
log: 022-review-cc2-and-close-po-decisions
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: mixed
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: CC-2
---

# 022 — Review Sonnet's CC-2 design checkpoint; close 4 PO decisions; spin out OA-1

## Type: mixed (audit-review + user-request-planning / PO decisions)
PO: review Sonnet (claude-sonnet-4-6) CC-2 output (Sonnet self-reviewed → free to disagree); close required
PO decisions one by one.

## Review verdict (disagreements with Sonnet, explicit)
CC-2 was at the **design-checkpoint stage** (no code yet — `useScrollEdge` absent, status Drafted;
`REQ-COG-AWARE-001` not in graph). Sonnet's design *thinking* is good (the "no mental work on top of real
work" principle, overflow-awareness), but:
1. **Over-scoped CC-2** → 10 files incl. overflow fades + SkeletonBlock state/tiered loading — much overlaps
   the **already-shipped SK-1** or is net-new (a new requirement).
2. **"PO sign-off RECEIVED — all 6" was premature** — the accompanying audit brief's own Q1–Q5 were never
   answered; corrected.
3. **Missed the actual phase/day card-height question** (the PO's concern) — not among its 6 items.
Full audit + answered Q1–Q5: `output-review/2026-06-30-claude-CC-2-design-checkpoint-review.md`.

## PO decisions closed (one by one, 2026-06-30)
1. **CC-2 scope = tighten + spin out.** CC-2 → responsive cards + unified card-height model ONLY.
   Overflow-awareness gradient fades → **new sprint `OA-1`**; skeleton `state`/tiered → **SK-1 follow-up**.
2. **Card height (NEW PO rule):** PhaseCard AND DayGridCard at **~80% of stage height, centered with ~10%
   top + ~10% bottom margin** (replaces phase `h-full` + day fixed). Margins reduce island-popup content
   occlusion. Responsive; preserves §10 structure + §21 density. Traces to REQ-RESP-001 + REQ-SBC-003.
3. **`REQ-COG-AWARE-001` folded** into REQ-FP-CMA-003 + readiness family — **no new node**.
4. **Overflow signal = gradient fade only** (no arrow buttons in cards; arrows/snap → CC-6/WM-6).

## Actions taken
- `sprints/CC-2.md` — scope tightened; added the 80%/10% unified height model + REQ-RESP-001 trace; PO Web
  Check now checks 80%/10% + popup overlap at 1280/1512/2560.
- `sprints/OA-1.md` — **new** overflow/spatial-awareness sprint (gradient fades phase→action + action→task,
  `useScrollEdge`; stage-level deferred to CC-6/WM-6; folds the principle into FP-CMA-003 + readiness).
- `output/CC-2-design-checkpoint.md` — RESOLVED header with the 4 decisions; corrected premature sign-off.
- `output-review/...CC-2-design-checkpoint-review.md` — corrected sign-off claim; appended auditor verdict (Q1–Q5).
- Plan README — execution order + index add OA-1 (6.5); CC-2 retitled; note on scope tightening.

## Gates
Planning/doc-only. **0 `src/` writes.** No graph mutation (REQ-COG-AWARE-001 intentionally NOT created).
CC-2 remains pre-code; ready to implement against the tightened scope.

## Next
- Implement **CC-2** (responsive cards + 80%/10% height) — design checkpoint now resolved, can proceed.
- Then **OA-1** (gradient fades). SK-1 follow-up (skeleton state/tiered) tracked separately.
- Note (carry): the 80%/10% height rule is a PO design decision traced to REQ-RESP-001/REQ-SBC-003; record a
  ledger entry when CC-2 executes if a graph trace is wanted.
