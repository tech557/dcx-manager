---
log: 017-token-consumption-investigation-note
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: process-governance
version_context: v0.3.5
PO-Action: INVESTIGATE — token consumption rose after requirements-system; low-token was a stated requirement
---

# 017 — Investigation note: token consumption up after requirements-system (LOG ONLY, do not fix yet)

## Type: process-governance (PO observation logged for later investigation)
PO context: implementation plan **activated**; Codex ran **WM-1** (Status: Completed). PO flagged that
**token consumption has gone up sharply since the requirements-system plan**, even though **lowering
agent token consumption was an explicit requirement of that system.** Logging only — not investigating now.

## The contradiction (why this matters)
The requirements-system was built with low-token agent consumption as a **first-class goal**, not a nice-to-have:
- README **Hard constraint 11**: "Low-token agent consumption — agents read a small generated manifest /
  query result by id/scope/feature/layer, never the whole store."
- Core model §11 + RS-R2: low-token agent **query** surface (`req:query --by-id/--scope/--feature/--layer`,
  `req:trace`, `req:justify`) was supposed to replace reading the whole graph.
- Behavior-Sustaining Map concern "Generated context = narrow low-token slice auto-supplied to the agent."

Observed reality is the opposite: consumption **increased** after RS landed. That is a direct regression
against the system's own efficiency requirement and is worth a dedicated investigation.

## Signals captured now (not analysis — just data points)
- Graph size: **782 nodes, 907 trace-links** (each a JSON file).
- Large generated artifacts agents may be pulling whole: `generated/rs-r7-review-queue.json` **268K**,
  `query-index.json` **60K**, `rs-r7-identity-normalization.json` **32K**.
- Many large plan outputs now in play (FP-R5 synthesis ~41K, FP-R4 ~33K, RS-R11 brief, calibration-mode doc).
- Session-log volume itself grew (this session alone added ~17 logs).

## Candidate hypotheses to test later (unconfirmed)
1. Agents reading **whole node dirs / `index.csv` / large generated views** instead of the narrow
   `req:query` slices (constraint 11 not actually being used in practice).
2. `req:query`/`trace`/`justify` outputs themselves may be **larger than intended** (e.g. returning full
   node bodies rather than id+summary slices).
3. Per-task **carry-forward + Step 0 reads** (README carry-forward is large) loaded every sprint.
4. Reconciliation / completion-gate runs emitting large reports into context.
5. Skill files + AGENTS/core.md §35 additions increasing baseline per-session context.

## What a future investigation should produce
- Measure: tokens per task before vs after RS (sample sessions); which files dominate the read mix.
- Check constraint-11 compliance: are agents actually using `req:query` slices, or reading the store?
- Decide fixes: tighten `req:query` output to id+summary; a generated **low-token manifest**; cap/paginate
  review-queue JSON; trim carry-forward to a pointer; lazy-load big generated views.

## Status
**LOG ONLY.** No investigation, no fix this session. Tracked via the `PO-Action: INVESTIGATE` header so it
surfaces in `docs/progress/po-actions.md`. Candidate name for the work: `token-efficiency-audit` (could be
a small discovery or a requirements-system follow-up sprint, since it traces to RS Hard-constraint 11 /
`REQ-GOV-TRACE-001-AGENT` agent-workflow scope).
