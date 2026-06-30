---
audit-of: requirements-system
auditor: codex
date: 2026-06-29
verdict: NEEDS REVISION
blocking-issues: 2
advisory-issues: 2
---

# Plan Audit: requirements-system Round 3

## Verdict

NEEDS REVISION

**Reason:** The round-2 structural blockers are substantially fixed, but RS-R4 and RS-R5 still have acceptance/gate wording gaps that could let an executor skip required evidence.

## Blocking Issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | RS-R4 | Cross-scope dogfood is in scope but not in acceptance criteria. | RS-R4 lines 21-25 require modeling the requirements-system's own product/frontend/backend/devops/test/agent-workflow requirements, but RS-R4 acceptance lines 31-34 only checks "listed decisions", D-02 supersession, PO sign-off, and gates. An executor could satisfy the acceptance list while skipping the new dogfood proof. | Add an explicit RS-R4 acceptance criterion: requirements-system product requirement plus derived frontend/backend/devops/test/agent-workflow requirements are present, linked with `derives-from`, lifecycle/lock states, and technical traces where applicable. |
| 2 | RS-R5 | Gate commands are still partially shorthand despite the plan's exact-command rule. | README lines 105-107 requires exact commands. RS-R5 line 35 still says `lint` · `validate:architecture` · `test` instead of `npm run lint` · `npm run validate:architecture` · `npm run test`. | Replace the RS-R5 gate list with exact commands: `npm run typecheck`, `npm run lint`, `npm run validate:architecture`, `npm run test`, `bash scripts/verify.sh`, and `bash scripts/build-log-index.sh` if session logs changed. |

## Advisory Issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | README | Revision metadata still says "round 1" even after round-2 revision. | README line 6 says `revised: 2026-06-29 (audit round 1...)`; Claude log `10-revise-per-codex-reaudit.md` says it applied round-2 findings. | Update the revision note to mention round 2 / Codex re-audit applied. |
| 2 | RS-R0 / RS-R2a | `test/QA` as a literal scope value may be awkward in CLI filters and filenames. | README lines 60-62 and RS-R0 lines 48-49 list `test/QA` / `test-QA` variants. | Normalize to one machine-safe value, e.g. `test-qa`, everywhere. |

## Prior Art Compliance

The prior-art and source-corpus concerns are now handled. The README and RS-R1 include session logs, `docs/progress/index.csv`, on-hold outputs, audits/output-reviews, CSV, product docs, decisions, open questions, and the v0.1.4 archive as first-class inputs.

The round-2 target-fit concerns are also materially handled:
- Cross-scope taxonomy appears in README constraint 10 and RS-R0/RS-R2a/RS-R3.
- Lock lifecycle appears in README constraint 11, RS-R0, and RS-R2a.
- Mandatory Requirement Trace appears in README constraint 12, RS-R0, and RS-R5.
- Human edit/preview plus low-token query appears in README constraint 13, RS-R0, and RS-R2b.
- Requirements-system dogfood appears in RS-R4 scope, but needs acceptance coverage.

## Gate Coverage Summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| RS-R0 | N/A | N/A | N/A | N/A | N/A | Design-only; PO sign-off gate present. |
| RS-R1 | N/A | N/A | N/A | N/A | N/A | Discovery/map; manifest and no-`src` check present. |
| RS-R2a | Exact | Exact | Exact | Exact | N/A | Good. |
| RS-R2b | Exact | Exact | Exact | Exact | N/A | Good. |
| RS-R3 | Global | Global | Global | Global | N/A | Acceptable via global sprint requirements. |
| RS-R4 | Global | Global | Global | Global | N/A | Needs cross-scope dogfood acceptance criterion. |
| RS-R5 | Exact for typecheck/verify only | Shorthand | Shorthand | Shorthand | N/A | Fix exact command wording. |
| RS-R6 | N/A | N/A | N/A | N/A | N/A | Brief-only; no on-hold execution. |

## Handoff Quality

Handoff quality is now good enough after the two blocking wording fixes. RS-R0 is constrained to produce concrete sample records, RS-R2a/RS-R2b are split, validators and query surfaces are named, and RS-R6 is a clean handoff brief. The remaining risk is not architecture; it is acceptance-list drift where scope is present but not enforceable.

## Ready Checklist

- [ ] All blocking issues resolved
- [x] Prior art findings incorporated
- [x] Every sprint has executor named
- [x] Every code-modifying sprint has gate coverage after RS-R5 wording fix
- [x] Session start steps present in each sprint via global requirements
- [x] Carry-forward contract present; every sprint reads it and updates it via global/final steps
- [x] Tool-dependent criteria have documented fallback requirement
- [x] Requirement taxonomy covers product/frontend/backend/devops/test and derived requirement relationships
- [x] Locked requirement lifecycle is modeled and validator-backed
- [x] Plan-output trace format is mandatory and enforceable
- [x] Human edit/preview tooling and low-token agent query surfaces are evaluated in RS-R0
