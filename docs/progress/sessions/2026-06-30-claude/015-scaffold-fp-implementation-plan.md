---
log: 015-scaffold-fp-implementation-plan
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: user-request-planning
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
---

# 015 — Scaffold drafted frontend-polish-implementation plan

## Type: user-request-planning
PO: "create frontend-polish-implementation draft. no version changes."

## Created
`docs/plans/drafted/frontend-polish-implementation-v0.3.5/`
- **README.md** — status drafted; Executor assignment discipline (impeccable=Claude-only; browser→
  Playwright/opencode/Claude; real pointer/drag for PO Web Checks); sprint index + token-first order;
  DoD; carry-forward (live-confirmed facts, mock seam, pointer-driven caveat, open real-pointer items).
- **sprints/** — 18 files: WM-1..6, CT-1/2, SK-1, CC-1..6, HV-1/2, CC-OPT. Each carries Requirement
  Trace (graph IDs + FP-R5 source ref), family, executor/skill/tool, scope in/out, acceptance as
  graph-state transitions (confirm links → cover EMC → implemented → evidence → verified), PO Web Check
  (REAL pointer/drag), Requirement Debt Burn-down, gates, carry-forward final step.
- Updated `docs/plans/drafted/README.md` index (replaced the completed discovery row).

## Version
**No version change** (`core.md §26`): `version_context: v0.3.5`; folder `…-v0.3.5`. No bump/suggestion.

## Source of truth (not duplicated)
Sprint spec authoritative source = `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md`
(+ FP-R5 PATCH) + FP-R4 finalize spec (+ PATCH, 88 criteria). Sprint files cite the FP-R5 §section for
exhaustive route/viewport/seed detail rather than re-deriving (avoids drift).

## Patched criteria carried in
T06/T07 (timeline day-card create, REQ-BC-007..010) + K08 (column scroll) → WM-6; L06 (app-wide
typography) → CT-1. Drag/editor live-confirmed → WM-2/WM-3 are refinement.

## Gates
Planning/doc-only. 0 `src/` writes. No graph mutation. Plan is drafted (not executable).

## Next (PO)
1. `dcx-plan-audit` on this plan → READY.
2. Resolve G-IMPECCABLE (CLAUDE.md ↔ agent-skills.md) before CT-1.
3. PO moves `drafted/ → active/`; execute WM-1 first; PO Web Checks use real pointer/drag + data-testid hooks.
