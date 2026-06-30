---
log: 025-review-cc7-and-presentation-bug
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: audit-review
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: CC-7
---

# 025 — Review CC-7; diagnose focus/presentation "weird behavior"; 3 PO observations

## CC-7 review: ✅ PASS
- Reduced collapsed action footprint (padding/gap) → density math: 3×130px + 2×6px = 402px < 510px avail
  at 14" → 3 collapsed actions fit ✅. Gates green (typecheck/lint/test82/architecture/req:validate/completion-gate).
- **Bonus:** resolved the OA-1 `black/40 → var(--theme-glass-bg)` debt AND back-filled the OA-1 output doc.
- **Caveat (Codex-flagged, valid):** PO Web Check PARTIAL — mock has max 2 actions/phase, so ≥3-action
  density not VISUALLY confirmed; math only. Needs seeded data or PO manual check.

## PO's 3 observations
1. **Task card font/size tokens "can be better."** Code uses a mix of tiny tokens (`text-dcx-3xs`,
   `text-dcx-2xs`, `text-dcx-2xs-plus`, `text-dcx-xs-plus`) — inconsistent scale. → polish (typography rhythm).
2. **Action card spacing (expanded/collapsed).** CC-7 just compacted it; PO wants further refinement. → polish.
3. **Focus/presentation "weird behavior" — DIAGNOSED (code).** `StageProvider.enterPresentationMode` (line 57)
   sets `expandedNodeIds = [...ancestors(target), target]` and `useStageExpansion` also only expands
   **ancestors**. So presenting a card **collapses everything else and does NOT expand the target's
   descendants** — the opposite of the PO's expectation ("expand all its children + grandchildren + present").
   For a leaf-ish target this looks like the subtree collapsing = the "weird behavior." This is **WM-5 scope**
   (focus/selection/presentation wiring — not yet implemented) + a **presentation-semantics clarification**,
   NOT a CC-7 regression.

## Live-repro limitation (honest, §28)
Could NOT get a clean live reproduction this session: Preview MCP browser wedged on `chrome-error` after an
explicit-origin navigation, and Playwright MCP's browser cannot reach the Preview's sandboxed port
(net::ERR_CONNECTION_REFUSED — different network context). Diagnosis above is **code-based** (strong:
`StageProvider.tsx:57`), not browser-confirmed. Flag: revisit a reliable live-verify path (e.g., Bash
`npm run dev` + Playwright on a shared port) for future PO Web Checks.

## Decisions pending (asked PO this turn)
- **Presentation/focus semantics** (issue 3): expand DESCENDANTS (children+grandchildren) + collapse unrelated
  + centre [drill-in], vs ancestors-only (current), vs BOTH. Then lock as a requirement + assign to WM-5.
- **Font + spacing polish** (issues 1+2): schedule a typography/spacing refinement pass (impeccable candidate,
  G-IMPECCABLE-gated) vs fold into CC-OPT.

## Gates
Audit/doc-only. 0 `src/` writes. No graph mutation yet (pending PO semantics answer).
