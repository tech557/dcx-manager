---
log: 045-hv3-review-2-po-visual-fixes
session: 2026-06-30-claude
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: audit-review
PO-Action: pending
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: HV-3
---

# 045 — HV-3 round-2 review (PO visual fixes)

PO reviewed the live HV-3 Home build (glass foundation + token-bug fix landed — big improvement) and gave
4 visual fixes. Captured as actionable round-2 review:
`output-review/2026-06-30-claude-HV-3-review-2-po-visual-fixes.md`.

## The 4 fixes
1. **Background**: remove the builder ray (`<BuilderBg>` at `HomeDashboard.tsx:6,76`) from Home — keep
   rays builder-only. Replace with the **v0.1.4 mouse-glow** (Framer `motion/react` `useSpring` radial
   spotlight, ported from archive `components/Background.tsx`). New reusable `src/ui/MouseGlowBackground`
   (token-driven accent), also for HV-4.
2. **Remove the top nav bar** (`RootLayout.tsx` `<nav className="app-nav">`) — navigation is inline.
3. **Move hero title + subtitle above the search**; slim the top band to brand+user only; restore v0.1.4
   hero copy/scale (accent first word). Compact layout, v0.1.4 left-column order: hero → search → views → list.
4. **Workspace Analytics**: drop the verbose "Active = …" note; add **hierarchy** (one big primary stat +
   LIVE indicator → dashed divider → 2-col smaller secondaries) in a single **glass** panel, matching
   v0.1.4 `StatsOverview` (PO reference screenshot). Nudge Activity Log rows toward v0.1.4 `RecentlyOpened`
   shape (mono timestamp top-right + version badge).

All styling/layout only — no logic/query/store/router changes; no `src/builder/**` import (new bg in `src/ui`).

## Notes
- HV-3 sprint file still reads `Status: Drafted` though the work shipped (`output/HV-3-home-glass.md`
  exists) — process inconsistency for the PO to reconcile on close.
- Title/subtitle text in code ("Campaign Hub" / "Manage your DCX versions…") differs from the v0.1.4
  reference shown in the PO screenshot ("DCX Manager" + "Create and manage detailed communication
  experiences…"); flagged in the review.

## Gates
None run — review only, no code changed.

## PO-Action: pending
Apply the 4 fixes (HV-3 agent, or this session on request), then re-verify at 1440/768/375.
