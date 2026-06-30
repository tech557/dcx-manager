---
review: FP-R5 parallel cross-check (peer notes, not a gate)
sprint: FP-R5
plan: frontend-polish-v0.3.5
author: Claude (claude-opus-4-8)
date: 2026-06-30
mode: parallel cross-check — I independently re-derived the checkable FP-R5 artifacts from FP-R4 + the graph and compared to Codex's output. Collaborative notes, not an audit verdict.
result: strong agreement; 1 trivial tally nit
---

# FP-R5 Cross-Check — Claude ↔ Codex (parallel notes)

I re-ran the mechanical parts of FP-R5 myself (counts from FP-R4, ledger coverage, family split, graph
IDs) and compared. Where we match, I say so; where we differ, I show the number.

## Where we agree (independently reproduced)

| Artifact | Codex | My independent derivation | Match |
|---|---|---|---|
| FP-R4 explicit criterion rows | 84 | 84 (E8+C11+R5+K7+T5+D6+S8+F7+L5+M2 = 64 builder; +9 home +11 version) | ✅ |
| Codex's 99→84 normalization | flagged FP-R4 prose "99" as a bad count; used 84 | confirmed — FP-R4's "Implementation Matrix Input" said builder 79, but only 64 builder criterion rows exist | ✅ correct catch |
| Family split (84 rows) | 49 wire / 29 component / 6 token | 49 / 29 / 6 (counted from FP-R4 family column) | ✅ exact |
| Coverage Ledger completeness (B4) | every criterion assigned | 84 distinct criterion IDs, 84 ledger rows → no dup, no gap | ✅ |
| change-token criteria → token sprints | — | the 6 token criteria (C03,S08,L04,L05,H09,V11) all map to CT-1/CT-2 | ✅ consistent |
| Metrics provenance | 108 arbitrary / 0 hex / 297 retained / 1 over-cap / 2 pure-white | all trace to FP-R2/FP-R3/RS-R11 (already validated in FP-R4 check) | ✅ |
| Requirement debt carried (B3) | per-sprint burn-down | mis-targeted links flagged in FP-R4 are carried: WM-4 "reject generic Select", WM-6 "correct REQ-STG-001", WM-5 "correct keyboard links" | ✅ |
| PO Web Check (B2) | every impl sprint | present on all sprints (route/viewport/seed/steps/expected/evidence/non-goal) | ✅ |
| Assignment discipline | impeccable→CT only (G-IMPECCABLE fallback); CC-1 Codex-eligible (no browser); browser sprints→Claude/opencode | consistent throughout | ✅ |
| Gate hygiene | — | FP-R5 session log present + indexed; 0 `src/` writes; `req:validate` PASS (0 errors) | ✅ |

**Bottom line: my parallel run produces the same numbers Codex reported.** The 84-row normalization is
the most important shared result, and Codex was right to override FP-R4's prose "99."

## Where we differ (1 trivial nit — cosmetic, not blocking)

| Item | Codex says | Actual (my count) | Note |
|---|---|---|---|
| Drafted implementation sprint headline count | "Implementation sprints drafted: **16** + CC-OPT" (metrics-baseline §Drafted Implementation Plan Metrics) | **17 named** (WM-1..6=6, CT-1/2=2, SK-1=1, CC-1..6=6, HV-1/2=2) **+ CC-OPT = 18 headers** | The headline "16" omits **SK-1** from the total (SK-1 is also double-listed inside the "component 7" breakdown). Cosmetic; the sprint set itself is complete and correct. Fix the metrics tally to "17 + CC-OPT". |

## Notes / observations (not defects)
- SK-1 (app-wide skeleton) as its own sprint is a good call — it makes `REQ-LOAD-SKEL-001` first-class
  and sequences it before the broad async surfaces (HV-1/HV-2). Matches the PO's skeleton requirement.
- "No row is `backend-deferred`" is acceptable under B4 (assign-to-sprint OR backend-deferred); Codex
  assigned every criterion to a frontend sprint with a PO-visible check. No vague backend bucket. ✅
- The execution order (WM-1 theme toggle first → tokens → SK-1 → components → wiring → HV) is sound:
  light-theme token proof depends on a working toggle, and skeletons land before async-heavy pages.

## Recommendation
FP-R5 is solid and cross-validated. Proceed to plan close + create the drafted implementation plan
`frontend-polish-implementation-v0.3.x` from this sprint set, with the trivial "16→17" tally fix applied.
The implementation plan must be audited before activation (per FP-R5's own recommendation), and
G-IMPECCABLE resolved before the first `change-token` sprint (CT-1).
