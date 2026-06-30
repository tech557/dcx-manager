---
review: CT-1 + CT-2 output/code audit + responsiveness analysis
sprints: CT-1, CT-2
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
verdict: PASS within scope — but surfaces a responsiveness SCOPE-GAP needing a PO decision
---

# CT-1 + CT-2 — Audit + the "still so many px" question

## CT-1 (brand tokens + L06 typography): ✅ PASS
- Pure-white offenders fixed (5→0: `--theme-surface-void`, `--theme-dropdown-bg`, shadcn `--background/--card/--popover`); `--theme-text-secondary` added (both themes); main-blue-on-light fixed (`--theme-accent-text` #006080 light / #75E2FF dark; `.eyebrow` + placeholder text re-pointed); 1 arbitrary font size removed (`button.tsx` `text-[0.8rem]`→`text-dcx-md-plus`) → 0 arbitrary font sizes outside `src/brand`.
- G-IMPECCABLE handled correctly: contradiction confirmed, **direct brand-contract route** chosen + logged (didn't invoke the quarantined skill).
- Gates green (82 tests, real Playwright pointer proof at 1440+390, computed-value evidence); debt burn-down 2→0 lacking-req, completion-gate FAIL→PASS. Honest §28 fallback (Preview MCP port held → Playwright MCP).

## CT-2 (structural dimension tokens): ✅ PASS within scope
- 6 structural dims tokenized at **same values** (`--dim-phase-collapsed 4.5rem`, `--dim-phase-expanded 260px`, `--dim-editor-width 25rem`, `--dim-builder-header 64px`, `--dim-builder-footer 76px`, `--dim-selection-max-width 420px`); 5 components moved to `var(--dim-*)`; "no value changed" (D-12 + §10 frozen layout). Gates green; token-sourced computed values proven live.

## Your concern: "still so many px — but we want responsiveness across viewports"

**Measured:** 125 arbitrary px literals (`[..px]`) remain in `src` components (top: CardShellContent 20, TaskProperties 9, MetadataFilesPopup 7, KanbanBuilderIsland 7, FocusIsland 5…); 52 px in `src/brand/styles` token defs (single source).

**Why they're still there — three honest reasons, none a CT-1/CT-2 bug:**
1. **CT-1/CT-2 never had that scope.** CT-2 tokenized only the **6 named structural dims** (D-12); CT-1 was brand color + 1 font size. The other 125 are component-internal sizing (padding/gap/fixed widths) — explicitly **out of both sprints' scope**.
2. **FP-R2/FP-R5 deliberately deferred bulk token migration** ("do not schedule broad token deletion from FP-R2 alone … down only where touched"). So scattered px shrink only as sprints touch their files — by design.
3. **`px` ≠ non-responsive, and tokenizing ≠ responsive.** CT-2 centralizes a value; it does not make it fluid. Real responsiveness needs responsive units (rem/%/clamp/vw), breakpoints, container queries, or the responsive Task card (CC-2).

**The real finding (PO decision needed): the plan does NOT make the builder responsive across viewports.**
- The **builder canvas is intentionally FROZEN at the 1440px target** (`core.md §10` layout frozen, `§21` viewport-planning). It is a fixed-canvas workspace, not a fluid-responsive layout.
- The only responsiveness scoped in the 17 sprints: **CC-2** (responsive Task card, REQ-FP-D01), **L06** typography (text-dcx-*), and **HV-1/HV-2** Home/Version pages built responsive from v0.1.4.
- So if the expectation is "the whole builder adapts to small/large viewports," that is a **scope expansion** not covered by the current plan/discovery. It would need a new requirement + sprint (e.g., responsive-builder), and would brush against the §10/§21 frozen-layout decision — a PO call, not an executor one.

**Recommendation:** decide explicitly — (a) accept fixed-1440 builder + responsive Task card/typography/pages (current plan, no change), or (b) add a responsiveness requirement + sprint (revisits §10/§21). Either way, "px in code" is not the right signal for responsiveness; if we proceed with the plan, the px count drops opportunistically as CC-2/CC sprints touch files (CC-OPT), not via CT.

## Minor notes
- CT-2 status header still says `Drafted` (work is done — output + code + gates exist); SK-1 same. **Stale labels → flip to Completed.**
- CT-2 left `min-w-[240px]`/`max-w-[300px]` in KanbanView (board container, distinct from the tokenized phase column) — verify intended; minor.

## Verdict
CT-1 and CT-2 are correct and complete **for what they were scoped to do**. No rework needed. The px/responsiveness question is a **scope/expectation gap**, not a CT defect — routed to the PO.
