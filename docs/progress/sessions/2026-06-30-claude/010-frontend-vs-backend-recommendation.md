---
log: 010-frontend-vs-backend-recommendation
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: process-governance
version_context: v0.3.5
---

# 010 — Recommendation: finish frontend polish before backend discovery

## Type: process-governance (PO strategic question; recommendation only, no artifacts changed)
PO asked: complete frontend, or do backend discovery? Noted backend data-source uncertainty
(ClickUp MCP availability unknown; GAS endpoint as fallback).

## Grounding (verified in repo)
- `src/services/api-client.ts` unconditionally routes to `mockDispatch` → frontend runs 100% on mocks
  today; backend is fully decoupled behind one seam (`api-client → mock-dispatch → src/mock/*`).
- `src/services/clickup.service.ts` already exists → ClickUp integration is anticipated in code.
- Backend/data requirements in graph: 11 backend + 46 data = 57 (anchored by `REQ-SC-001`).
- ClickUp MCP (`mcp__911651c5…clickup_*`) and Supabase MCP (`mcp__38e91b2d…`) tool names present in
  toolset; **connectivity NOT tested** — must not be assumed working.

## Recommendation: FRONTEND FIRST
1. Decoupled by one seam → finishing frontend costs backend nothing and is not invalidated by it.
2. Frontend is de-risked/primed (FP-R5 cross-validated, 17 sprints, PO Web Checks); backend has an
   unresolved feasibility unknown (ClickUp vs Supabase vs GAS).
3. Frontend-first sharpens backend discovery: the mock shapes become the proven data contract.
4. Backend (57 reqs) deserves its own discovery, not a rushed pivot.

## Backend, when we get there
First step = data-source feasibility spike (live-test ClickUp MCP → Supabase MCP → GAS fallback), then a
`backend-discovery` plan grounded on the 57 backend/data graph reqs. Resolve the availability unknown with
evidence, not assumption (do not claim an MCP works without testing it — `AGENTS.md` integrity rules).

## Next (PO choice)
- Frontend: scaffold + audit `frontend-polish-implementation-v0.3.x` (from FP-R5's 17-sprint set, with the
  16→17 tally fix), execute WM-1 first.
- OR Backend: open `backend-discovery` with the feasibility spike as Sprint 0.

## Gates
Conversational/recommendation. No code, no graph mutation, 0 `src/` writes.
