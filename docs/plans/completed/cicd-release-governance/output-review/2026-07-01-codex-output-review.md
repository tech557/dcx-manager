# cicd-release-governance — Output Review

Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-07-01
Type: audit-review
Verdict: NEEDS REVISION before plan close

## Scope

Reviewed the active plan outputs for `cicd-release-governance` after RG-R0a through RG-R8 execution.
This is an output audit under `core.md §30`, not a pre-activation plan audit. No source code was changed.

## Findings

| Severity | Finding | Evidence | Impact | Required fix |
|---|---|---|---|---|
| P1 | Promotion registry rows do not record the stable environment URL in the dedicated columns. | `docs/releases/registry.csv:10` (`promoted-staging`) and `docs/releases/registry.csv:21` (`promoted-prod`) have `staging_url` and `production_url` empty. `scripts/release/promote.sh:160-164` appends promotion rows with only `preview_url` populated, even though the target domain is known at `scripts/release/promote.sh:42`. | The registry is syntactically valid, but it does not satisfy the plan's own operational-record claim that CSV tracks preview/staging/prod links. Consumers cannot query the registry to answer "what stable URL did this promotion move?" without parsing notes or logs. | Update `promote.sh` so staging promotions fill `staging_url=$TARGET_DOMAIN` and production promotions fill `production_url=$TARGET_DOMAIN`; backfill the existing promotion rows by append-only correction/supersession, not silent mutation, unless the PO explicitly approves a direct registry repair. Add a regression test. |
| P1 | Plan frontmatter `version_context` is stale and contradicts `docs/VERSION.md`. | `README.md:8` says `version_context: v0.3.5` and comments "current per docs/VERSION.md"; `docs/VERSION.md:5` says `current` is `v1.0.1.0`. `core.md §26` says mismatches must be noted and not auto-corrected without PO direction. | Agents starting from the plan get the wrong current version and may write stale session logs or block incorrectly on version-context checks. | Ask the PO whether the plan frontmatter should be updated to the current version or frozen as historical; then revise the frontmatter/comment accordingly. |
| P1 | RG-R3 and RG-R4 output frontmatter says `status: complete` while their own acceptance criteria and sprint files remain Partial/BLOCKED. | `output/RG-R3-github-ci.md:6` says complete, but `output/RG-R3-github-ci.md:148,151-152` are PARTIAL/BLOCKED and `sprints/RG-R3.md:11-12` is Partial. `output/RG-R4-vercel.md:6` says complete, but `output/RG-R4-vercel.md:142` is BLOCKED and `sprints/RG-R4.md:11-12` is Partial. README plan-level status correctly lists both as Partial at `README.md:310-317`. | Automated readers or future agents may treat these sprint outputs as closed despite open acceptance criteria. This weakens the "never claim a gate passed without running it" rule. | Change the output frontmatter status for RG-R3/RG-R4 to Partial, preserving the live-verified subclaims in body text. |
| P2 | The README still contains pre-execution "current gap" and risk sections that are now false in the active executed state. | `README.md:336-348` says no `.git`, no workflows, no `vercel.json`, no release registry, no promotion path, and no source-change wiring. The carry-forward section above it records the opposite for RG-R0b/RG-R2/RG-R3/RG-R4/RG-R8. `README.md:732` repeats "No local git repo" as a current risk. | The carry-forward contract is accurate, but the same README later reintroduces obsolete baseline claims. This increases the chance that a future agent rediscovers or rebuilds completed work. | Move the old gap summary into a clearly labeled "Original baseline before RG execution" section or rewrite it as current state. Update risk rows to distinguish resolved risks from open risks. |
| P2 | RG-R8 close instructions say the plan can move to completed when RG-R8 closes, contradicting the actual Partial sprint state. | `sprints/RG-R8.md:74` says "when RG-R8 closes, all sprints are done -> PO moves the plan to completed"; README correctly says not to move to completed until RG-R0b/RG-R3/RG-R4 Partial items are resolved or accepted as permanent debt at `README.md:310-321`. | A future closer could follow the sprint file and archive the plan prematurely. | Revise RG-R8 close instructions to defer plan close until the three Partial items are resolved or explicitly accepted by PO. |
| P2 | Session/tooling state still reports version and plan-shape contradictions. | `build-current-state.sh` output in this review reported `repository_version v1.0.1`, `metadata_version v0.3.5`, and `docs/VERSION.md=v1.0.1 vs metadata.json=v0.3.5`; direct `docs/VERSION.md` read shows `v1.0.1.0`. `verify-plan-state.sh` warns "Active plan has no sprint files" even though `sprints/RG-R0a.md` ... `sprints/RG-R8.md` exist. | The session-start evidence that agents must log is stale or lossy for the new 4-part version and nested sprint folder convention. This can create bad logs even when the plan outputs are otherwise correct. | Update the agent state scripts to parse four-part versions and discover `sprints/*.md` under active plans, or explicitly document these as known tooling debt in the plan README. |

## Positive Checks

| Check | Result |
|---|---|
| `bash scripts/release/validate-release-registry.sh docs/releases/registry.csv` | PASS — registry is syntactically valid |
| `bash scripts/release/tests/run-tests.sh` | PASS — 42/42 |
| `bash scripts/verify.sh` | PASS — verify passed |
| `bash scripts/agent/verify-plan-state.sh` | FAIL/WARN — unrelated completed-plan mismatch plus active-plan sprint-discovery warning |
| Active sprint files present on disk | PASS — 10 files under `docs/plans/active/cicd-release-governance/sprints/` |

## Close Verdict

The plan should remain active. The core release scripts are in good shape, but the output set is not
ready for plan close because the operational registry omits stable promotion URLs and the plan contains
status/version contradictions that can mislead future agents.

---

## Resolution — 2026-07-01 (Claude, claude-opus-4-8; PO-directed closeout)

All six findings resolved before plan close. Session log:
`docs/progress/sessions/2026-07-01-claude-02/001-cicd-release-governance-output-review-remediation.md`.

| # | Sev | Resolution |
|---|---|---|
| 1 | P1 | **Fixed forward + backfilled.** `promote.sh` now fills `staging_url`/`production_url` with the stable target domain per env; regression test added (`tests/run-tests.sh`, now 43/43). The two historical rows backfilled by **PO-approved direct in-place repair** with evidence-confirmed URLs (`v0.4.0.0`→`https://dcx-manager-gov-staging.vercel.app` from RG-R4; `v1.0.0.0`→`https://dcx-manager-gov.vercel.app` from RG-R8/approval). Registry validator PASS. |
| 2 | P1 | **Frozen (PO decision).** `version_context: v0.3.5` kept as the authoring-time (2026-06-30) context with an explicit inline note pointing to live `v1.0.1.0`; not auto-tracked (core.md §26). |
| 3 | P1 | **Fixed.** RG-R3 and RG-R4 output frontmatter `status` changed `complete` → `Partial`, preserving the live-verified subclaims and naming the BLOCKED acceptance criteria. |
| 4 | P2 | **Fixed.** README §1 relabeled "Original baseline before RG execution (HISTORICAL, superseded)" with a resolved-gaps banner; §9.1 risk table gained a Status column marking resolved vs open risks. |
| 5 | P2 | **Fixed.** RG-R8 sprint close instructions revised to defer plan close until the three Partial items are resolved **or** PO-accepted as permanent debt. |
| 6 | P2 | **Fixed.** `build-current-state.sh` now parses 4-part versions; `verify-plan-state.sh` discovers `sprints/*.md`; `metadata.json` label reconciled to `v1.0.1.0` (PO decision) — `documentation_contradictions` now empty. |

**Close status:** With all findings resolved and the PO explicitly accepting the three PO-owned items
(repo-privacy, branch protection, deployment protection) as permanent tracked debt, the plan was moved
to `docs/plans/completed/cicd-release-governance/` on 2026-07-01.
