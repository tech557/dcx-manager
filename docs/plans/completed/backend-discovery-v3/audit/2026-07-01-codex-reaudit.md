---
audit-of: backend-discovery-v3
auditor: codex
date: 2026-07-01
verdict: NEEDS REVISION
blocking-issues: 3
advisory-issues: 3
---

# Plan Audit: backend-discovery-v3

## Verdict

NEEDS REVISION

**Reason:** The revision resolves the first audit's structural problems, but three executable-gate/version issues still need tightening before activation.

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | Plan | `version_context` still does not match the current authoritative version, and the explanatory comment is itself stale. | `docs/VERSION.md` current is `v1.0.1.0`; README line 6 says `version_context: v0.5.0.0` and says `docs/VERSION.md current reads v1.0.0.2`. Core §26 says plan/log `version_context` must copy `docs/VERSION.md`; if mismatched, note and ask PO. | Before activation, PO should reconcile this explicitly: either update `docs/VERSION.md` to the PO-stated version or update the plan frontmatter/comment to the current `docs/VERSION.md` value. |
| 2 | BE3-R5a | The flag-off "sink uncalled" proof requires a test spy, but the sprint does not allow writing any test/assertion file that could implement it. | BE3-R5a allowed writes are only `src/telemetry/capture-sink.ts`, guarded `src/services/api-client.ts` tap, `scripts/backend/**`, and output (line 9). The verification plan requires "sink uncalled (assert via a test spy)" (line 72). | Add an allowed assertion artifact, e.g. `scripts/backend/assert-capture-flag-off.ts`, or allow a focused test file such as `src/telemetry/capture-sink.test.ts`. Name the exact command that proves the spy assertion. |
| 3 | BE3-R6 | The changed-file requirement gate command is still malformed for the repo scripts. | BE3-R6 line 67 sets `CF="$(git diff --name-only)"` and passes `$CF` to `--files`/`--changed`. `scripts/requirements/reconcile.ts` and `completion-gate.ts` expect comma-separated path lists; unquoted shell expansion will split on whitespace and the parser will read only the next arg. | Build a comma-separated value and quote it, e.g. `CF="$(git diff --name-only | paste -sd, -)"`; then run `npm run req:reconcile -- --mode changed --files "$CF"` and `npm run req:completion-gate -- --changed "$CF"`. |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | BE3-R0 | R0 still uses a formatting-dependent route count even though R1 introduces the deterministic extractor. | BE3-R0 lines 53 and 61 still use `grep -cE "pattern:"`. | Either accept this as a bootstrap baseline only, or move route-count verification to R1 and make R0 record "route count pending extractor." |
| 2 | BE3-R5a | The plan hard-codes "27 unit tests". | README lines 59 and 351; BE3-R5a lines 31 and 62. Test counts drift over time. | Say `npm run test PASS` and record the actual test count from the command output instead of baking the count into the acceptance criterion. |
| 3 | BE3-R5b/R6 | R5b may close Partial, while R6 depends on R5b; the plan is logically okay, but handoff wording could be clearer. | README lines 375-377 say R5b Partial does not stall the plan; R6 G5 still requires real captured previews. | Add one sentence: "R6 may run after R5b Partial only to emit FAIL for G5; it cannot PASS until live capture evidence exists." |

## Prior art compliance

The revision still incorporates the relevant prior art correctly: expired `backend-discovery` identified mapper survivability and localStorage/API-swap risks; `backend-discovery-v2` and `folder-structure-v2` established the current `apiClient -> mockDispatch` seam and the 22-route contract surface. The revised R5a/R5b split directly addresses the previous audit's concern that local instrumentation could be mistaken for live preview capture.

No prior-art recommendation is silently dropped. The remaining blockers are execution mechanics, not architecture.

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| BE3-R0 | N/A | N/A | N/A | N/A | N/A | Docs-only baseline; Supabase fallback now explicit. |
| BE3-R1 | Dedicated `tsc -p` | N/A | N/A | N/A | N/A | First audit blocker resolved; typecheck path is executable. |
| BE3-R2 | N/A | N/A | N/A | N/A | N/A | SQL syntax/read-only checks listed with fallback. |
| BE3-R3 | N/A | N/A | N/A | N/A | N/A | First audit blocker resolved via auth schema addendum. |
| BE3-R4 | N/A | N/A | N/A | N/A | N/A | Docs-only decision matrix. |
| BE3-R5a | Via `verify:frontend` | Via `verify:frontend` | Via `verify:frontend` | Listed | Listed/fallback | Needs a concrete allowed assertion file for the flag-off spy proof. |
| BE3-R5b | N/A | N/A | N/A | CI/live | Live preview | Split from R5; partial fallback is honest. |
| BE3-R6 | N/A | N/A | N/A | N/A | N/A | Requirement gate command needs comma-separated changed-file list. |

## Handoff quality

Handoff quality is much improved. R1 now owns the route extractor and contract typecheck, R3 no longer writes R2's schema output directly, and R5 is split into local substrate vs. live CI capture. Once the three blockers above are fixed, an executor can follow the plan without inventing major mechanics.

## Ready checklist

- [ ] All blocking issues resolved
- [x] Prior art findings incorporated
- [x] Every sprint has executor named
- [ ] Every code-modifying sprint has gate coverage that is executable and realistic
- [x] Session start steps present in each sprint
- [x] (2+ sprints) Carry-forward contract present; every sprint reads it (Step 0) and updates it (final step)
- [x] Tool-dependent criteria have a documented fallback (core.md §28)
