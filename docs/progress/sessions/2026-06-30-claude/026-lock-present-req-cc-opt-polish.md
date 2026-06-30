---
log: 026-lock-present-req-cc-opt-polish
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: mixed
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
---

# 026 — Lock REQ-PRESENT-001 (focus drill-in); fold font/spacing polish into CC-OPT

## Type: mixed (governed mutation + planning) — PO decisions from CC-7 review (log 025)

## PO decisions
1. **Focus/presentation = expand DESCENDANTS + centre** (drill-in). Leave ancestor/unrelated-collapse logic alone.
2. **Font + action spacing polish = fold into CC-OPT** (no dedicated sprint).

## Actions
- **Locked `REQ-PRESENT-001`** (governed; LDG-2026-06-30-create-node-REQ-PRESENT-001; req:validate PASS):
  focusing/presenting an object expands its DESCENDANT subtree (children+grandchildren) and centres it;
  corrects the current ancestors-only `enterPresentationMode`/`useStageExpansion` (StageProvider ~line 57)
  that collapses the subtree (the PO-observed "weird behavior"). Minimal: expand descendants + centre.
- **Wired into WM-5** (owns focus/selection/presentation): added REQ-PRESENT-001 to trace + a "FIX
  presentation/focus drill-in" scope bullet + a PO Web Check step (present a phase/action → descendants
  expand + centre, subtree not collapsed). The fix lands when WM-5 executes (not yet implemented).
- **CC-OPT** scope updated: opportunistic font-token harmonization (task card `text-dcx-3xs/2xs/2xs-plus/
  xs-plus` → consistent scale) + action spacing rhythm, only when a sprint already touches those files;
  impeccable optional (G-IMPECCABLE-gated).

## CC-7 status
PASS (per log 025) — no rework. The 3 observations are dispositioned: #1/#2 → CC-OPT; #3 → REQ-PRESENT-001 → WM-5.

## Gates
Governed graph + planning/doc. `req:validate` PASS (0 errors). **0 `src/` writes.**

## Carry / open
- Live-verify path still flaky (Preview wedged on chrome-error; Playwright can't reach the sandbox port) —
  fix before WM-5's presentation PO Web Check needs real-pointer proof.
- ≥3-action density still needs a seeded-data visual check (CC-7 caveat).
