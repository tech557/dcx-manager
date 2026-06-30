---
audit-of: cicd-release-governance
auditor: codex
date: 2026-06-30
verdict: NEEDS REVISION
blocking-issues: 1
advisory-issues: 2
---

# Plan Audit: cicd-release-governance

## Verdict

NEEDS REVISION

**Reason:** The executable sprint set is now structurally sound, but activation is still blocked because every `REQ-RG-*` / `GOV-RG-*` trace is proposed and not yet present in the canonical requirements graph.

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | Plan-wide | Requirement traces still cite proposed, non-canonical IDs. This is correctly disclosed as OD-RG-07, but it means the plan is not yet activation-ready under the mandatory Requirement Trace grounding rule. | `rg -n "REQ-RG-\|GOV-RG-\|AC-RG\|D-RG" docs/product/requirements/graph docs/product/requirements` returned no graph hits. Each sprint trace labels the IDs `Status: proposed — graph intake pending`. README §Executable-audit response also marks blocker #1 `OPEN — PO-gated`. | Run the requirement intake flow: `npm run req:propose` for the `REQ-RG-*` / `GOV-RG-*` set, get PO sign-off, apply after signoff, then update sprint traces to the resulting canonical graph IDs. Re-run this audit only after those IDs exist in `docs/product/requirements/graph/`. |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | README | The "Next step" order still lists final-approval audit before requirement intake, but a READY activation audit cannot pass before intake is complete. | README §Next step lists: 1 final-approval audit, 2 intake requirements, 4 executable READY + intake done. This audit is therefore necessarily a pre-intake structure audit, not a final READY audit. | Reorder the sequence to: intake/signoff first, then final activation audit; or label this audit stage explicitly as "pre-intake executable structure audit." |
| 2 | RG-R8 | The trace includes `D-RG-VER` beside proposed requirement IDs. That is understandable as a PO decision, but decisions and requirements need separate canonical homes after intake. | `RG-R8.md` Requirement Trace lists `REQ-RG-PROD-004, ... D-RG-VER` with the same pending graph-intake status. | After intake, keep requirement IDs in the Requirements row and link `D-RG-VER` through the decision ledger / decision reference field so validators do not treat it as a requirement node. |

## Prior art compliance

The plan incorporates the relevant prior art:

- `completed/requirements-system`: the plan uses the graph-governance model, labels proposed IDs honestly, routes intake through `req:propose` / signoff, and wires `req:validate`, `req:reconcile`, and `req:completion-gate` into every sprint close. The remaining blocker is exactly the prior-art rule doing its job: proposed traces are not canonical until intake applies them.
- `completed/folder-structure-v2`: the plan carries forward the no-`src/**` discipline, explicit carry-forward contract, no-recreate bias, output evidence paths, and real gate/fallback language. RG-R0a now has a pre-git `shasum` proof, and later sprints use `git diff --name-only`.

No matching expired CI/CD release-governance plan was found under `docs/plans/expired/`.

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| RG-R0a | N/A | N/A | N/A | N/A | N/A | Audit-only; has pre/post `src/**` hash proof, `sprint-doctor`, and requirement gates. |
| RG-R0b | N/A | N/A | N/A | N/A | Optional | PO-owned setup; no `src/**`; records git/Vercel evidence. |
| RG-R1 | N/A | N/A | N/A | N/A | N/A | Governance docs and index script; runs index integrity plus requirement gates. |
| RG-R2 | N/A | N/A | N/A | shell tests | N/A | Release scripts; runs shell tests and `verify.sh`; no `src/**`. |
| RG-R3 | CI gates | CI gates | CI gates | CI gates | YES | GitHub Actions sprint; fallback honestly blocks if Actions/browser unavailable. |
| RG-R4 | N/A | N/A | N/A | promote tests | YES | Vercel capability proof is gate-first; Pattern A fallback requires PO acceptance. |
| RG-R5 | N/A | N/A | N/A | migration-gate test | N/A | Supabase access fallback is explicit BLOCKED, not assumed. |
| RG-R6 | N/A | N/A | N/A | round-trip test | N/A | ClickUp/GAS fallback is explicit; registry remains canonical. |
| RG-R7 | CI gates | CI gates | CI gates | CI gates | YES | Dogfood proof now uses dedicated fixtures instead of product `src/**`. |
| RG-R8 | N/A | N/A | N/A | promotion gate | YES | First-production bootstrap is one-time and requires PO approval before alias move. |

Every sprint now calls `bash scripts/agent/sprint-doctor.sh cicd-release-governance <sprint> <agent>` and wires `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, and `npm run req:completion-gate -- --changed <changed-files>`.

## Handoff quality

Handoff quality is now good. Each sprint has:

- named executor and dependencies;
- explicit allowed/forbidden writes;
- Step 0 environment/carry-forward read;
- output file path and content contract;
- acceptance criteria with command/evidence hooks;
- fallbacks that say BLOCKED instead of pretending unavailable tools passed;
- final carry-forward update.

The plan also honors the PO's git decision: git/GitHub setup is approved only as governance/setup work, with `src/**` forbidden until the PO starts implementation. The first-production request is now handled by RG-R8 as a one-time bootstrap of `v0.3.5.0`, not as a normal automated version bump.

## Ready checklist

- [ ] All blocking issues resolved.
- [x] Prior art findings incorporated.
- [x] Every sprint has an executor named.
- [x] Every code/tooling-modifying sprint has gate coverage or an explicit N/A reason.
- [x] Session start steps present in every sprint.
- [x] Carry-forward contract present and every sprint reads/updates it.
- [x] Tool-dependent criteria have fallbacks.
- [x] Git setup boundary reflects PO approval and forbids `src/**`.
- [x] First-production bootstrap is explicitly modeled.
