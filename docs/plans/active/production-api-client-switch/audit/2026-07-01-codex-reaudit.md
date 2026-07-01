---
audit-of: production-api-client-switch
auditor: codex
date: 2026-07-01
verdict: READY
blocking-issues: 0
advisory-issues: 2
---

# Plan Audit: production-api-client-switch

## Verdict

READY

**Reason:** The revised draft resolves the prior executor-facing blockers: wildcard requirement traces are
locked behind PAC-R0, PAC-R2 now preserves the `Api*` service boundary, and code/apply/browser sprints now
have gate and fallback instructions.

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| None | — | — | — | — |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | README | `version_context` is stale relative to the current authoritative version. | `docs/VERSION.md` current = `v1.0.1.1`; plan README `version_context: v1.0.1.0`. The README already says to re-copy at activation. | Before PO activation, re-copy the current `docs/VERSION.md` value into the plan frontmatter and activation log. |
| 2 | Repo state | The session-start snapshot reports `metadata.json=v1.0.1.0` while `docs/VERSION.md=v1.0.1.1`. | `build-current-state.sh` reports a documentation contradiction. | Resolve or explicitly accept this metadata drift before using version metadata for release/promote work. |

## Prior art compliance

The plan now incorporates the relevant prior art:

- `backend-discovery-v3`: consumes the frozen 22-route contract, schema/RLS proposals, integration decisions,
  capture workflow, and readiness gate; it still refuses activation until BE3 is READY.
- `backend-discovery-v2`: keeps the mapper layer as the reusable seam and focuses service replacement behind
  `apiClient`.
- `folder-structure-v2/P4`: correctly treats `apiClient → mockDispatch` as the seam to swap.
- `cicd-release-governance`: reuses approvals, registry, `promote.sh`, no-auto-promotion, and production
  promotion constraints.

The previous mapper-boundary ambiguity is fixed: PAC-R2 now says `realDispatch` returns contract-valid `Api*`
responses and does not call `api-mappers.ts`; existing queries keep mapping `Api* → domain`.

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| PAC-R0 | N/A | N/A | N/A | N/A | N/A | Planning/governance; first-only activation is explicit |
| PAC-R1 | Required where applicable | N/A/advisory | N/A/advisory | N/A/advisory | N/A | Schema apply + generated types; Supabase fallback/BLOCKED path added |
| PAC-R2 | Required | Required | Required | Required | N/A | Full source gates + mapper-boundary checks listed |
| PAC-R3 | Required | Required | Required | Required | N/A | Full source gates + RLS unavailable fallback listed |
| PAC-R4 | Required | Required | Required | Required | N/A | Full test/seed gates + Supabase fallback listed |
| PAC-R5 | Required | Required | Required | Required | Required | Browser/preview fallback and cleanup/evidence path listed |
| PAC-R6 | N/A | N/A | N/A | N/A | Required | Production apply/promotion blocks if Supabase/Vercel/advisors unavailable |

## Handoff quality

The handoff is now strong enough for activation once the PO chooses to proceed. The two-stage activation model
is clear: activate PAC-R0 first to collect PO confirmations and signed backend requirement IDs, then activate
PAC-R1..R6 only after those IDs replace wildcard traces. The carry-forward contract, Step 0 reads, and final
carry-forward updates are present across the plan.

## Ready checklist

- [x] All blocking issues resolved
- [x] Prior art findings incorporated
- [x] Every sprint has executor named
- [x] Every code-modifying sprint has gate coverage
- [x] Session start steps present in each sprint
- [x] (2+ sprints) Carry-forward contract present; every sprint reads it (Step 0) and updates it (final step)
- [x] Tool-dependent criteria have a documented fallback (core.md §28)
