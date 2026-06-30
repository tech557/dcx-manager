---
log: 007-fp-redesign-codex-revision
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: mixed
version_context: v0.3.5
plan: frontend-polish-v0.3.5
---

# 007 — Check Codex audit of FP-R4/R5 redesign; apply all revisions

## Type: mixed (audit-review + user-request-planning / §34 Revise)
PO: check Codex audit, then (implied) revise. Codex verdict on the redesigned FP-R4/R5:
**NEEDS REVISION** — 4 blocking, 2 advisory (`audit/2026-06-30-codex.md`). All 6 applied.

## Codex findings → fixes applied
| # | Sev | Finding | Fix |
|---|---|---|---|
| 1 | Block | FP-R0–R3 ambiguous: "valid/not redone" yet still listed as runnable Drafted sprints w/o Requirement Trace | Sprint Index split: **executable = FP-R4 → FP-R5 only**; FP-R0–R3 = "completed prior outputs, read-only" table; added "✅ COMPLETED — HISTORICAL, NOT EXECUTABLE" banner to all 4 FP-R0–R3 sprint files |
| 2 | Block | FP-R5 didn't force PO-checkable web slices | FP-R5 scope #2 now mandates a **PO Web Check** block per drafted impl sprint (route, viewport, seed data, steps, expected visible result, evidence path, non-goals) + ≥1 independently PO-verifiable slice; acceptance criterion added |
| 3 | Block | Requirement-debt reduction not enforced as measurable output | FP-R5 scope #2 now mandates a **Requirement Debt Burn-down** per sprint (touched REQ/EMC/MAN/TRC, candidate-link confirm/correct/reject, before/after queue counts, `req:completion-gate`+`req:validate` evidence); acceptance criterion added |
| 4 | Block | "All frontend complete" not mechanically guaranteed | FP-R5 new output **Implementation Coverage Ledger** (every FP-R4 criterion + 3 surfaces + 2 new reqs → sprint or explicit `backend-deferred` w/ named dependency; no generic backend bucket); acceptance criterion added |
| A1 | Adv | G-IMPECCABLE framed as activation gate; docs conflict is `agent-skills.md`(enabled) vs `CLAUDE.md`(quarantined) | Reframed as **pre-implementation PO action, NOT a discovery-activation blocker**; named the exact doc conflict; fallback (no-impeccable) restated |
| A2 | Adv | Carry-forward has stale 2026-06-28 statements (moved-to-active, v0.1.4 missing, home/version parked) | Added **"⚠️ CURRENT OVERRIDE (2026-06-30)"** block atop the carry-forward that supersedes stale lines |

## Codex positives (kept)
Prior-art incorporated; executor/tool discipline on redesigned sprints; tool-dependent fallbacks present;
RS-R11 "0 delivery-confirmed ≠ 0 linked" distinction carried. FP-R4 called "a strong handoff."

## Gates
Planning/doc-only. **0 `src/` writes**. No graph mutation. No execution.

## Files edited
- `…/README.md` (Sprint Index split executable vs historical; G-IMPECCABLE reframe; carry-forward override block)
- `…/sprints/FP-R5-synthesis-metrics.md` (PO Web Check + Debt Burn-down per sprint; Coverage Ledger output; 3 new acceptance criteria)
- `…/sprints/FP-R0..R3-*.md` (historical/not-executable banners)

## Next
1. **Codex re-audits** the revised FP-R4/R5 (`core.md §34`: re-audit after a non-trivial revise). Expect
   the 4 blocking + 2 advisory to clear.
2. On **READY** → PO resolves G-IMPECCABLE (pre-implementation) + moves `drafted/ → active/`.
3. Execute FP-R4 → FP-R5 → graph-grounded discovery output (+ Coverage Ledger + Debt Burn-down) → draft
   implementation plan → implement token-first with PO Web Checks.
