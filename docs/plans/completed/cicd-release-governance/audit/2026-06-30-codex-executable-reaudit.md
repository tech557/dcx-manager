---
audit-of: cicd-release-governance
auditor: codex
date: 2026-06-30
verdict: NEEDS REVISION
blocking-issues: 3
advisory-issues: 3
---

# Plan Audit: cicd-release-governance

## Verdict

NEEDS REVISION

**Reason:** The executable sprint structure is now present and substantially sound, but activation is blocked by non-canonical requirement traces and incomplete close-gate wiring.

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | Plan-wide | Requirement traces cite proposed IDs that do not exist in the requirements graph. | `rg -n "REQ-RG-|GOV-RG-|AC-RG|D-RG" docs/product/requirements/graph docs/product/requirements` returns no canonical graph hits. Every RG sprint says `Status: proposed — graph intake pending (OD-RG-07)`. `dcx-plan-audit` requires graph-backed trace grounding before activation. | Run `dcx-requirement-intake` / `npm run req:propose`, get PO sign-off, apply canonical graph nodes, then update every RG sprint trace to cite real graph IDs. |
| 2 | RG-R1..RG-R8 | Close steps call a command that is not a real repo-root command. | Sprint close steps repeatedly say `sprint-doctor.sh cicd-release-governance RG-R* <agent>`. The actual script is `scripts/agent/sprint-doctor.sh`; `find scripts/agent -maxdepth 2 -type f` confirms that path. RG-R0a/RG-R0b use the correct `bash scripts/agent/sprint-doctor.sh` form, but later sprints do not. | Replace every bare `sprint-doctor.sh ...` with `bash scripts/agent/sprint-doctor.sh cicd-release-governance <sprint-id> <agent>`. |
| 3 | Plan-wide | Requirement governance close gates are not wired into each sprint close. | Core §35c requires `npm run req:validate`, changed-file reconciliation, and `npm run req:completion-gate` before completion. The sprint Close sections mostly require sprint-doctor + carry-forward + log index, but do not explicitly require `dcx-sprint-close` or the requirement gates. | Add a close-gate step to every sprint: run `dcx-sprint-close` or explicitly run `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, and `npm run req:completion-gate -- --changed <changed-files>`, with exact changed-file derivation recorded in output. |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | RG-R0a | The no-`src/**` proof is weak before git exists. | RG-R0a says `find src -newer <report> -type f` returns nothing. If a source file changed before the report was written, this would not catch it. | Use a pre/post manifest: `find src -type f -print0 | xargs -0 stat ...` before and after, or activate RG-R0a only after git exists and use `git diff --name-only`. |
| 2 | RG-R7 | Source dogfood path is underspecified. | RG-R7 says use "a comment in a build-config file the classifier counts as source, or a temporary throwaway" while preserving no `src/**`. That leaves judgment to the executor. | Name the exact path to use for the source-classified dogfood change, or create a dedicated disposable fixture path in RG-R2/RG-R7 and teach the classifier to count it as source. |
| 3 | Plan-wide | Some external-account decisions remain open but are correctly surfaced. | OD-RG-02..09 remain open, including source/non-source boundaries, Supabase model, approval authority, integration branch, and approval signature. These do not block the sprint structure but will block the relevant sprint execution if undecided. | Resolve each OD before the sprint that consumes it, or add explicit temporary defaults and PO gates in the relevant sprint files. |

## Prior art compliance

The plan now incorporates the cited prior art well:

- `completed/folder-structure-v2`: the no-`src/**` boundary is explicit in README decisions and every sprint, and the plan avoids disrupting active frontend polish.
- `completed/requirements-system`: the README and sprint files use Requirement Trace sections, graph-intake language, append-only/supersession patterns, sprint-doctor close hygiene, carry-forward continuity, and no silent canonical mutation.

The remaining gap is not conceptual prior-art handling; it is enforcement wiring. The proposed `REQ-RG-*` IDs must become canonical graph nodes before activation, and the requirement close gates must be explicit in each sprint.

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| RG-R0a | N/A | N/A | N/A | N/A | N/A | Discovery-only; needs stronger no-`src/**` proof. |
| RG-R0b | N/A | N/A | N/A | N/A | Optional | PO-owned git setup; no-`src/**` proof present. |
| RG-R1 | N/A | N/A | N/A | N/A | N/A | Docs/script-index work; index gate present, requirement gates missing. |
| RG-R2 | N/A | N/A | N/A | Required shell tests | N/A | Registry/script tests and `verify.sh` listed; requirement gates missing. |
| RG-R3 | Via CI | Via CI | Via CI | Via CI | Required | Good CI/browser coverage; requirement gates missing. |
| RG-R4 | External/config | External/config | External/config | External/config | Required | Vercel capability proof and fallback are strong; requirement gates missing. |
| RG-R5 | N/A | N/A | N/A | Migration-gate test | Optional | Supabase fallback is honest; requirement gates missing. |
| RG-R6 | N/A | N/A | N/A | Round-trip test | N/A | ClickUp/GAS fallbacks are honest; requirement gates missing. |
| RG-R7 | CI green | CI green | CI green | CI green | Required | Dogfood proof included; source dogfood path needs precision. |
| RG-R8 | N/A | N/A | N/A | Promotion gate test | Required | First-production bootstrap is now explicitly handled. |

## Handoff quality

Handoff quality is now generally good. Every sprint has an executor, scope, output path, acceptance criteria, gates, fallbacks, and carry-forward close step. RG-R8 correctly treats first production as a one-time bootstrap rather than an ordinary recurring promotion.

The plan should not be activated until the three blockers are resolved. Once the traces are canonical and the close gates are mechanically wired, the remaining advisories can be handled during sprint execution.

## Ready checklist

- [ ] All blocking issues resolved
- [x] Prior art findings incorporated
- [x] Every sprint has executor named
- [x] Every code-modifying sprint has gate coverage
- [x] Session start steps present in each sprint
- [x] (2+ sprints) Carry-forward contract present; every sprint reads it (Step 0) and updates it (final step)
- [x] Tool-dependent criteria have a documented fallback (core.md §28)
