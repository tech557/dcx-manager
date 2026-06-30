---
log: 006-fp-r4-r5-redesign
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: user-request-planning
version_context: v0.3.5
plan: frontend-polish-v0.3.5
---

# 006 — Redesign affected FP sprints (FP-R4, FP-R5) graph-grounded, for Codex audit

## Type: user-request-planning (§34 Plan/Revise stage)
PO directed: re-design the affected sprint tasks (the ones RS-R11/Codex invalidated), bake in the
polish-discovery targets + skill/impeccable/tool-access assignment discipline, so Codex can audit and,
on pass, we implement. No code; no execution.

## Lifecycle move
- `frontend-polish-v0.3.5` moved `on-hold/ → drafted/` (blocker `requirements-system` is COMPLETED).
  Chose `drafted/` (not `active/`) because the redesign is non-trivial and must pass Codex re-audit
  before activation (`core.md §34`: never activate without passing audit). Same plan = honors the PO's
  earlier "fastest / reactivate existing" choice (not a new replacement plan).

## What I redesigned
### Plan README
- Frontmatter: `status: drafted`; off-hold note; prior-art now includes `completed/requirements-system`.
- Status banner: off-hold rationale; what was redone (FP-R4/R5 graph-grounded) vs still-valid (FP-R0–R3,
  core-interaction-model, brand-ui-interpretation); next = Codex re-audit → PO activate.
- **NEW "Executor assignment discipline" section** (the PO's key ask): a capability matrix (impeccable =
  Claude-only; Playwright/Preview = Claude/opencode, NOT Codex; dcx skills; graph tooling), a
  family→skill/tool→eligible-executor table, and rules (impeccable Claude-only + quarantine gate; no
  browser criterion on a Codex-only run; strict sprints behind Sprint Doctor; mandatory Requirement Trace).

### FP-R4 (finalize spec) — `sprints/FP-R4-behavior-finalize-spec.md`
Rewritten graph-grounded: every criterion cites canonical graph REQ IDs (RS-R11 §2 map), not `BLD-*`/
`OD-*`; per-area coverage-gap tables (delivery + verification + expected `EMC-*` + RS-R7 candidate links,
treated as review-input-not-proof); **homepage + version now unblocked** (D-07 resolved; v0.1.4 ref at
`docs/archive/dcx-manager-v0.1.4/src/pages/*`); the 2 new reqs (`REQ-SBT-COPY-001`, `REQ-LOAD-SKEL-001`)
in scope. Carries a Requirement Trace + executor assignment (Claude/opencode — browser-capable).

### FP-R5 (synthesis/matrix) — `sprints/FP-R5-synthesis-metrics.md`
Rewritten graph-grounded: three-family matrix with each gap's graph REQ ID; each drafted implementation
sprint carries a Requirement Trace + executor + **required skill + required tool access** (per the
discipline), and acceptance expressed as graph-state transitions (confirm RS-R7 links → cover `EMC-*` →
`implemented` → evidence → `verified`; implemented≠verified). Homepage/version + the 2 new-req sprints
draftable. Metrics baseline adds per-surface coverage.

## Key context baked in (PO asked me to remember)
- Polish-discovery targets: 11 builder areas + version page + homepage; three-family model
  (`change-token`/`change-component`/`wire-mockup-data`); token-first execution order.
- Skills/impeccable: impeccable is **Claude-only**, brand-only; **G-IMPECCABLE gate** flagged — root
  `CLAUDE.md` says QUARANTINED while the FP carry-forward says PO un-quarantined it 2026-06-28; PO must
  reconcile before any impeccable use. Fallback: Claude applies brand-ui-interpretation directly.
- Tool access: browser/visual criteria require Playwright/Preview (Codex lacks it) — assignment discipline
  routes them to Claude/opencode or a §29a handoff.

## Gates
Planning/doc-only. **0 `src/` writes** (find -newermt → 0). No graph mutation. No execution.

## Files created / edited
- `docs/plans/drafted/frontend-polish-v0.3.5/` (moved from on-hold/)
- `…/README.md` (frontmatter, status banner, Executor assignment discipline, open gates)
- `…/sprints/FP-R4-behavior-finalize-spec.md` (rewritten, graph-grounded)
- `…/sprints/FP-R5-synthesis-metrics.md` (rewritten, graph-grounded)
- `docs/plans/active/README.md` (fixed stale FP path → drafted/)

## Next
1. **Codex re-audits** the redesigned FP-R4/R5 (`dcx-plan-audit`) — confirm graph-grounding, the
   assignment discipline, and that it covers the polish-discovery targets.
2. On **READY** → PO resolves G-IMPECCABLE + moves `drafted/ → active/`.
3. Execute FP-R4 then FP-R5 → graph-grounded discovery output → draft implementation plan → implement.
