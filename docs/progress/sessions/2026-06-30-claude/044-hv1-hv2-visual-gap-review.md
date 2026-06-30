---
log: 044-hv1-hv2-visual-gap-review
session: 2026-06-30-claude
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: audit-review
PO-Action: pending
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: HV-1, HV-2
---

# 044 — HV-1 / HV-2 visual fidelity review vs v0.1.4 + recommended sprint

PO request: review HV-1 (Home) and HV-2 (Version) output, compare to v0.1.4, confirm whether the gap is
styling-only, and recommend a new sprint to close it (reuse the builder mouse-light bg; use/expand the
brand system to hit the v0.1.4 look). Deliverable written to:
`output-review/2026-06-30-claude-HV-1-HV-2-visual-fidelity-sprint.md`.

## Method
3 parallel read-only Explore agents: (A) v0.1.4 reference design (archive), (B) current HV-1/HV-2
implementation, (C) current brand system + builder mouse-light. Plus direct grep verification of the
token bug.

## Findings
- **PO hypothesis confirmed**: components are the right ones and are wired; the gap is **styling only**.
  Structural cause: both HV specs run `dcx-frontend-refactor` + **"no impeccable"**; FP-R5 scoped them as
  *operational* (not visual) parity.
- **Real bug**: `--theme-surface-raised` (26 uses) and `--theme-border` (37 uses) are referenced across
  every HV page but **defined nowhere** in `src/` → transparent surfaces + currentColor borders = the
  flat look. High-leverage, low-effort fix (alias to existing tokens).
- **Reusable, §13-safe**: `src/ui/BuilderBg/BuilderBg.tsx` (canvas LightRays mouse-light) is in `src/ui`,
  not `src/builder` → can render on Home/Version. Brand system already has `.glass*` classes + accent
  scale + component depth tokens, currently unused by HV pages.
- **Brand gaps to expand**: named box-shadow/elevation presets, glow-accent, status-token set, glass
  page-surface/field/button classes, mouse-glow util, blur/duration CSS vars.

## Recommendation (in the review doc)
Styling-only refactor, split into **HV-3** (brand glass foundation + shared ambient bg + Home restyle)
and **HV-4** (Version restyle + motion). No component-tree/logic/wiring/graph changes; impeccable allowed
in `src/brand/` only; no `src/builder/**` import; browser proof at desktop/tablet/mobile (REQ-RESP-001).
Full per-surface gap map, token additions (with values), and per-component restyle plan are in the doc.

## Gates
None run — review/planning only, no code changed.

## Drafted sprints created (PO chose HV-3 → HV-4 split)
- `sprints/HV-3.md` (Status: Drafted, Order 18) — brand glass foundation + token-bug fix + ambient bg + Home restyle.
- `sprints/HV-4.md` (Status: Drafted, Order 19) — Version restyle + motion; depends on HV-3 foundation.

## PO-Action: pending
PO to audit (`/dcx-plan-audit`) + activate HV-3, then HV-4. No requirement-graph change anticipated
(pure presentation). README sprint index not yet updated — do at activation.
