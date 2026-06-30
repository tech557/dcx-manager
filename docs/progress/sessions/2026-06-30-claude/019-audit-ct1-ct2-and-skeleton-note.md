---
log: 019-audit-ct1-ct2-and-skeleton-note
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: mixed
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
PO-Action: DECISION — confirm whether the builder must be viewport-responsive (scope expansion vs current fixed-1440 plan); + skeleton re-alignment follow-up
---

# 019 — Audit CT-1/CT-2; responsiveness scope finding; skeleton re-alignment note

## Type: mixed (audit-review + process-governance log)
PO: audit CT-1/CT-2 output; concern about remaining `px` vs responsiveness; log that Home/Version
skeletons are fine now but must be re-aligned to the final pages when real components exist.

## CT-1 / CT-2 audit: ✅ PASS within scope
Full review: `output-review/2026-06-30-claude-CT-1-CT-2-review.md`.
- CT-1: pure-white 5→0, --theme-text-secondary added, main-blue-on-light fixed, 1 arbitrary font removed;
  G-IMPECCABLE direct-route logged; gates green; real Playwright proof.
- CT-2: 6 structural dims tokenized at same values; 5 components → var(--dim-*); gates green.
- Both correct/complete for their defined scope. No rework.

## The `px` / responsiveness finding (PO DECISION)
- Measured: **125 arbitrary `[..px]` literals remain** in src components (CardShellContent 20, TaskProperties
  9, MetadataFilesPopup 7, …); 52 px in brand token defs.
- **Not a CT defect:** CT-2 only scoped the 6 named structural dims; CT-1 was brand color + 1 font. The 125
  are component-internal sizing, explicitly out of scope; FP-R2/FP-R5 deferred bulk migration ("down only
  where touched").
- **Key point:** `px` ≠ non-responsive; tokenizing ≠ responsive. The **builder canvas is intentionally
  FROZEN at 1440px** (`core.md §10`/`§21`). Responsiveness in the plan is narrow: CC-2 (responsive Task
  card), L06 typography, HV-1/HV-2 pages (from v0.1.4). **A fully viewport-responsive builder is NOT in
  scope** — it would be a scope expansion that revisits §10/§21.
- **PO decision:** (a) keep fixed-1440 builder + responsive card/typography/pages, OR (b) add a
  responsiveness requirement + sprint. Executor cannot decide (touches frozen-layout contract).

## Skeleton re-alignment follow-up (PO-requested log)
SK-1 built `HomeLoadingSkeleton.tsx` + `VersionLoadingSkeleton.tsx` (wired into HomePage/VersionPage).
**They are fine now** (match the anticipated v0.1.4 layout), BUT Home/Version pages are still placeholders
(**HV-1/HV-2 not yet executed**). **When HV-1/HV-2 build the real components, the skeletons MUST be
re-aligned to the final page geometry** (skeleton must match final layout to avoid layout shift —
REQ-LOAD-SKEL-001). Tracked as a follow-up tied to HV-1/HV-2.

## Doc-integrity (minor)
- CT-2 + SK-1 sprint headers still say `Status: Drafted` though both executed (outputs + code + gates exist).
  Flip to Completed (stale labels).
- CT-2 left `min-w-[240px]`/`max-w-[300px]` in KanbanView (board container ≠ tokenized phase column) — verify.

## Gates
Audit/doc-only. **0 `src/` writes by me.** No graph mutation.

## Next (PO)
1. Decide builder responsiveness (a vs b above).
2. Acknowledge skeleton re-alignment is owed at HV-1/HV-2.
3. Flip CT-2/SK-1 status labels; then proceed to SK-1/CC sprints per order.
