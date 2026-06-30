---
audit-of: frontend-polish-implementation-v0.3.5
auditor: codex
date: 2026-06-30
verdict: READY
blocking-issues: 0
advisory-issues: 3
---

# Plan Audit: frontend-polish-implementation-v0.3.5

## Verdict

READY

**Reason:** The previous activation blockers are resolved: every sprint now has Step 0/session continuity, RS-R0b-shaped Requirement Trace fields, explicit tool fallback handling, gates, debt burn-down, and carry-forward updates.

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| — | — | None | Mechanical check across all 18 sprint files found Step 0, Requirement Trace fields, §28 fallback, gates, debt burn-down, and final carry-forward update present. | — |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | README / browser sprints | Executor routing still treats Codex as unable to own browser/visual criteria even though Playwright MCP is now installed and active. This does not block activation, but it conflicts with the PO's intent to let Codex execute more sprints. | `verify-tooling-state.sh` reports `playwright_mcp: available 0.0.77`; `build-current-state.sh` reports MCP operational `[eslint, shadcn, playwright]`. README still says "No browser/visual criterion on a Codex-only run" and limits Codex to non-browser splits or §29a handoff. | Update executor discipline to say Codex may execute browser/visual gates when `playwright_mcp` is active and the sprint's required skill is available; keep §29a only for missing tools or missing skills. |
| 2 | README / CT-1 / CT-2 | G-IMPECCABLE handling is acceptable but still slightly ambiguous: the README says resolve the gate before CT-1, while CT-1/CT-2 say choose direct brand-contract mode if unresolved. | README lifecycle gate names G-IMPECCABLE before CT-1; CT-1/CT-2 add a stop-task that chooses direct route if unresolved. Root `CLAUDE.md` and `AGENTS.md` still say quarantined; `docs/agent-skills.md` says enabled brand-only. | Define "resolved" in the README as either "guard permits brand-only impeccable" or "direct brand-contract route selected and logged." |
| 3 | ALL | Repo-wide plan-state verification has an unrelated pre-existing failure outside this plan. This should not block this draft, but it can distract sprint agents during Step 0. | `bash scripts/agent/verify-plan-state.sh` reports `MISMATCH: Plan in completed/ but README says status=column — docs/plans/completed/builder-refactor/`. | Fix or suppress the unrelated completed-plan mismatch before activation so Step 0 logs stay clean. |

## Prior art compliance

The plan remains compliant with its named prior art. It cites `completed/frontend-polish-v0.3.5` and `completed/requirements-system`, and the sprint set follows the authoritative FP-R5 synthesis plus FP-R4 patch:

- FP-R5's token-first implementation order is preserved: WM-1, CT-1, CT-2, then skeleton/component/behavior work.
- FP-R4 patch rows are absorbed by the right sprints: T06/T07/K08 into WM-6 and L06 into CT-1.
- RS-R11's "0 frontend requirements delivery-confirmed implemented / verified" finding is carried into the sprint debt burn-down model.
- The three-family routing (`change-token`, `change-component`, `wire-mockup-data`) is preserved, with `impeccable` constrained to brand/token work or bypassed via direct brand-contract execution.

No expired prior-art replacement issue remains for activation because this implementation plan is based on completed discovery outputs that already consumed the expired discovery/refactor plans.

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| WM-1 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Theme toggle + local preference foundation |
| CT-1 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Includes G-IMPECCABLE stop-task and L06 |
| CT-2 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Structural dimension token no-diff proof |
| SK-1 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Skeleton + reduced-motion proof |
| CC-1 | Listed | Listed | Listed | Listed with target/no-target fallback | Smoke with §28 fallback | Codex-safe non-browser split, browser smoke if available |
| CC-2 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Design checkpoint artifact now defined |
| CC-3 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Editor selection/routing proof |
| CC-4 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | A11y tool/assertion named |
| CC-5 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Reduced-motion emulation named |
| CC-6 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Light surface proof |
| WM-2 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Real drag proof critical |
| WM-3 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Real pointer/long-press proof |
| WM-4 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Copy/paste behavior proof |
| WM-5 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Keyboard/readiness behavior proof |
| WM-6 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | T06/T07/K08 covered |
| HV-1 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Home route workflow proof |
| HV-2 | Listed | Listed | Listed | Listed with target/no-target fallback | Required with §28 fallback | Version route workflow proof |
| CC-OPT | Listed | Listed | Listed | Listed with target/no-target fallback | Inherits owner sprint | Opportunistic only |

## Handoff quality

Handoff quality is now activation-ready. The README has a single carry-forward contract, every sprint reads it in Step 0, and every sprint's final step updates it with files touched, REQ/EMC/MAN/TRC touched, debt counts, gate results, and evidence path. The sprint files now carry enough local context that an executor does not need to rediscover the prior audit's missing pieces before beginning.

The only handoff caveat is executor routing: if the PO wants Codex to execute most browser-backed sprints, the README and sprint headers should be updated to reflect the now-active Playwright MCP.

## Ready checklist

- [x] All blocking issues resolved
- [x] Prior art findings incorporated
- [x] Every sprint has executor named
- [x] Every code-modifying sprint has gate coverage
- [x] Session start steps present in each sprint
- [x] (2+ sprints) Carry-forward contract present; every sprint reads it (Step 0) and updates it (final step)
- [x] Tool-dependent criteria have a documented fallback (core.md §28)
