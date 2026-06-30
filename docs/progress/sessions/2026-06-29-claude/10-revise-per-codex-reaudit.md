## requirements-system — revise per Codex re-audit (round 2)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: user-request-planning
Status: Completed

Intent: Apply Codex's re-audit (`audit/2026-06-29-codex-reaudit.md`, NOT READY, 5 blocking + 2 advisory) to
the drafted requirements-system plan. This is the Revise stage of the §34 loop after a NOT-READY re-audit.
Trigger: user — "now revise latest codex audit for your drafted requirements systems plan."

Codex re-audit confirmed round-1 fixes addressed; new target-fit blockers:
1. Cross-scope requirements object model (scope/type taxonomy: product/frontend/backend/devops/test/data/
   security/ops; product usually the LOCKED source from which technical/test requirements DERIVE;
   derives-from links, dependency direction, ownership, verification mode).
2. Lock as a first-class lifecycle state (draft/proposed/approved/locked/superseded/archived; lock owner+
   date; locked records immutable except via governed supersession).
3. Dogfood must include the requirements-system's OWN requirements across scopes (not only builder decisions).
4. Mandatory generated "Requirement Trace" section for every plan/sprint output (IDs, scope/type, source/
   locked, acceptance, affected files/functions/selectors, tests/gates, impact, status); planner/audit enforce.
5. Human edit/preview tooling eval (CSV/spreadsheet, SQLite admin, Obsidian-style, generated docs, agent
   query CLI) + LOW-TOKEN agent consumption (read small generated manifest/query-by-ID/scope, not whole store).
Advisories: RS-R0 "6 hard constraints" → "all README"; exact `npm run` gate commands everywhere.

Work: README constraints 10-13 + DoD; RS-R0 (object model, lock lifecycle, trace format, tooling/low-token
eval, sample records, 6→all fix); RS-R2a (scope/type/lock validators, exact gates); RS-R2b (low-token
query/views, exact gates); RS-R3 (classify into model); RS-R4 (cross-scope dogfood); RS-R5 (mandatory trace
format enforcement).
Gates: N/A — planning/docs only, no src/ change.
Follow-ups: re-audit again (§34 loop) before PO implements.
