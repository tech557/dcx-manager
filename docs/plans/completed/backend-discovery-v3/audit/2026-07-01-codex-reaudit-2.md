---
audit-of: backend-discovery-v3
auditor: codex
date: 2026-07-01
verdict: NEEDS REVISION
blocking-issues: 1
advisory-issues: 1
---

# Plan Audit: backend-discovery-v3

## Verdict

NEEDS REVISION

**Reason:** The second revision resolves all three blockers from `2026-07-01-codex-reaudit.md`, but one remaining scope contradiction makes BE3-R5b impossible to execute without writing outside its own allowed boundary.

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | BE3-R5b | The sprint requires patching the release registry, but `docs/releases/registry.csv` is not in `allowed-writes` or "Files likely affected." | BE3-R5b says the workflow will "patch a capture reference into the matching `registry.csv` row by `version`" and AC-BE3-5b-2 requires the summary be referenced in `docs/releases/registry.csv`; however BE3-R5b frontmatter only allows `.github/workflows/backend-capture.yml`, `.gitignore`, `docs/backend/captured/**`, and output. | Add `docs/releases/registry.csv` to BE3-R5b `allowed-writes` and "Files likely affected", with a note that the only allowed change is adding/updating the capture reference for the matching `version` row. |

## Previously blocking issues now resolved

| Prior blocker | Status | Evidence |
|---|---|---|
| Plan `version_context` mismatch | Resolved | README line 6 now copies `docs/VERSION.md` exactly: `v1.0.1.0`, with an activation-time recopy note. |
| BE3-R5a flag-off spy had no writable assertion file | Resolved | BE3-R5a now allows `src/telemetry/capture-sink.test.ts` and names `npm run test -- src/telemetry/capture-sink.test.ts` as the spy proof. |
| BE3-R6 changed-file requirement gate used whitespace-split paths | Resolved | BE3-R6 now builds a comma-separated, quoted `CF` value and passes it to `req:reconcile --files "$CF"` and `req:completion-gate --changed "$CF"`. |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | Plan | README frontmatter still says "not yet audited" even after this audit exists. | README line 5 says `stage: Drafted — not yet audited, not yet activated`. The plan can still stay Drafted, but the audit state is now different. | When applying the blocker fix, change this to something like `Drafted — audited, awaiting PO activation` if the audit verdict becomes READY. |

## Prior art compliance

Prior art is incorporated correctly. The plan still carries the expired `backend-discovery` finding that mappers survive same-shape APIs but field-shape changes need explicit handling; it carries `backend-discovery-v2`'s post-refactor `apiClient -> mockDispatch` seam and 22-route contract surface; and it reuses the `folder-structure-v2` P4 backend state rather than rediscovering the old localStorage-only architecture.

No prior-art recommendation is silently dropped. The remaining blocker is a sprint scope/allowed-writes mismatch, not an architecture gap.

## Gate coverage summary

| Sprint | Gate posture | Notes |
|---|---|---|
| BE3-R0 | Executable | Bootstrap route count is now explicitly approximate; authoritative route extraction is deferred to R1. |
| BE3-R1 | Executable | Dedicated contract extractor and `tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` path are concrete. |
| BE3-R2 | Executable | Proposal-only schema work keeps Supabase checks read-only with documented MCP fallback. |
| BE3-R3 | Executable | Auth schema additions live under `docs/backend/auth/`; R6 owns the later merge. |
| BE3-R4 | Executable | Decision-matrix scope is clear and docs-only. |
| BE3-R5a | Executable | The local capture substrate has concrete no-harm, spy, bundle, scrub, and prod-guard checks. |
| BE3-R5b | Not yet executable | Needs `docs/releases/registry.csv` in `allowed-writes` because registry patching is an acceptance criterion. |
| BE3-R6 | Executable after R5b | Requirement gate command is now comma-separated and quoted; R6 correctly cannot PASS after a Partial R5b unless live capture evidence exists. |

## Ready checklist

- [ ] All blocking issues resolved
- [x] Prior art findings incorporated
- [x] Every sprint has executor named
- [ ] Every code-modifying sprint has gate coverage and allowed-write scope that are executable and realistic
- [x] Session start steps present in each sprint
- [x] (2+ sprints) Carry-forward contract present; every sprint reads it (Step 0) and updates it (final step)
- [x] Tool-dependent criteria have a documented fallback (core.md §28)
