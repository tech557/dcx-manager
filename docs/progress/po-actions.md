# PO Action Roll-up

> **Generated** by `scripts/build-po-actions.sh` (also run by `build-log-index.sh`). Do not hand-edit — flip the source log's `PO-Action:` header to `none` when an item is done. See `docs/agent-rules/log-format.md` §3.

_Last generated: 2026-07-01 — open items: 54_

## RS-R3-review — Output audit of RS-R3 + lint fix (OpenCode)
Source: [`sessions/2026-06-29-claude/19-rs-r3-output-audit.md`](sessions/2026-06-29-claude/19-rs-r3-output-audit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Hardening F-R3-2 + F-R2-1 (validate-before-write/rollback) still has no owning sprint | Auto-apply + mutation write to the store before validating, no rollback — risk grows once RS-R6 writes real nodes | Assign to RS-R6 prep or a small hardening task before RS-R6 |

## sprint-doctor — Pre-handoff gate + portability rule to stop re-audit churn
Source: [`sessions/2026-06-29-claude/20-sprint-doctor-and-portability-rule.md`](sessions/2026-06-29-claude/20-sprint-doctor-and-portability-rule.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| `.claude/settings.json` PostToolUse hook uses a hardcoded absolute path | Now flagged by §36b/sprint-doctor; breaks the hook for any other checkout/agent. It is local hook config, so I did not edit it | Have OpenCode (or you) change it to a `$CLAUDE_PROJECT_DIR`/relative path |

## RS-R7 persist audit + manifestation foldering + folder-index generator
Source: [`sessions/2026-06-29-claude/24-rs-r7-persist-audit-manifest-foldering-index.md`](sessions/2026-06-29-claude/24-rs-r7-persist-audit-manifest-foldering-index.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| RS-R7 confirmation gate: 812 candidate links + 302 unlinked manifestations | Sprint acceptance needs PO confirm/exempt; sets a confirmation policy | Confirm 6 batches (e.g. auto-accept ≥0.80 same-family + spot-check) + exempt build-tooling/doc manifestations; or narrow R7 and move to R8 |

## folder-index — CSV + summary + auto-refresh wiring
Source: [`sessions/2026-06-29-claude/25-folder-index-csv-autowire.md`](sessions/2026-06-29-claude/25-folder-index-csv-autowire.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| R7 confirmation gate still open (812 candidate links + 302 unlinked) | Blocks meaningful R8 verification (0% confirmed coverage) | Approve a confirmation policy (auto-accept ≥0.80 same-family + exempt build-tooling/docs + spot-check) to close R7 before R8 |

## (b) validate-before-write hardening + (a) R7 confirmation analysis
Source: [`sessions/2026-06-29-claude/26-mutation-hardening-and-r7-confirm-analysis.md`](sessions/2026-06-29-claude/26-mutation-hardening-and-r7-confirm-analysis.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| R7 cannot be closed by auto-confirm (low-precision inference + duplicate MAN nodes) | Rubber-stamping pollutes traceability | Approve: (1) dedupe MAN nodes by path, (2) re-infer links from imports/usages (reuse code-index/component-usages) or curate, THEN confirm. R8 stays gated. |

## RS-R7 — Persist pass
Source: [`sessions/2026-06-29-codex/27-rs-r7-persist-pass.md`](sessions/2026-06-29-codex/27-rs-r7-persist-pass.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| RS-R7 confirmation remains pending | Candidate links are now durable, but still provisional; 302 persisted manifestations still lack requirement/exemption links. | Review `rs-r7-review-queue.md` batches, confirm/redirect/reject candidates, and classify or exempt unlinked manifestations before claiming implementation coverage. |

## RS-R10 — Plan audit + amend (applying Codex findings)
Source: [`sessions/2026-06-29-opencode-02/01-rs-r10-plan-audit-amend.md`](sessions/2026-06-29-opencode-02/01-rs-r10-plan-audit-amend.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| RS-R10 draft amended | Audited and fixed per Codex findings. Plan needs PO review + approval before activation | Review the amended `RS-R10-doc-disposition.md` and approve if acceptable |

## RG-PLAN — Draft CI/CD & Release Governance plan
Source: [`sessions/2026-06-30-claude/025-cicd-release-governance-draft.md`](sessions/2026-06-30-claude/025-cicd-release-governance-draft.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Resolve `no .git` blocker | Working copy is not a git repo; blocks all CI/CD (RG-R0 precondition) | Initialize + connect git/GitHub before RG-R3 |
| 9 open decisions (OD-RG-01..09) | Version intro point, revision-reset, authority of registry vs ClickUp, Supabase env model, etc. | Review plan §9.2; confirm/adjust recommended defaults |
| 4-part scheme changes core.md §26 + VERSION.md | Reverses "agents never change version" → split ownership | Approve the rule change before any auto-assign tooling |
| Run dcx-plan-audit before activation | core.md §34 — never activate without READY | Audit, then move drafted/ → active/ if READY |

## RG-PLAN — Path 2 revision: fix Codex-audit defects, relabel as architecture brief
Source: [`sessions/2026-06-30-claude/026-cicd-rg-path2-defect-fixes.md`](sessions/2026-06-30-claude/026-cicd-rg-path2-defect-fixes.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Re-audit by Codex (as a brief) | PO stated intent to get Codex to re-audit | Run dcx-plan-audit judging architecture, not execution-readiness |
| OD-RG-01..09 still open | Needed before any Path-1 promotion | Decide when/if promoting to an executable plan |
| `no .git` blocker (G2) | PO-owned; gates RG-R3 | Init/connect git+GitHub when ready |

## RG-PLAN — Clarify audit status + correct versioning model (OD-RG-01 decided)
Source: [`sessions/2026-06-30-claude/027-cicd-rg-version-correction.md`](sessions/2026-06-30-claude/027-cicd-rg-version-correction.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Re-audit by Codex (as a brief) | PO intends Codex re-audit; brief now corrected | Run dcx-plan-audit judging architecture, not execution-readiness |
| OD-RG-02..09 still open | Needed before any Path-1 promotion | Decide when promoting to executable plan |
| `no .git` blocker (G2) | PO-owned; gates RG-R3 automation | Init/connect git+GitHub when ready (manual v0.3.5.0 bootstrap happens here) |

## RG-PLAN — Path 1 conversion: draft RG sprint files for final approval
Source: [`sessions/2026-06-30-claude/028-cicd-rg-path1-sprint-drafting.md`](sessions/2026-06-30-claude/028-cicd-rg-path1-sprint-drafting.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Final-approval (executable) audit | Path 1 sprints now exist; needs an executable-plan audit | Run dcx-plan-audit → `audit/2026-06-30-<auditor>-executable.md` |
| Requirement intake (OD-RG-07) | Activation precondition; traces are "proposed" | `req:propose` REQ-RG-*/GOV-RG-* + PO sign-off |
| OD-RG-02..09 | Needed before/within relevant sprints | Confirm defaults |
| Activation | Plan stays in drafted/ until moved | On executable READY + intake → move to active/ |

## RG-PLAN — Revise for executable re-audit (NEEDS REVISION → fix blockers #2/#3 + advisories)
Source: [`sessions/2026-06-30-claude/029-cicd-rg-executable-reaudit-revision.md`](sessions/2026-06-30-claude/029-cicd-rg-executable-reaudit-revision.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Blocker #1 — requirement intake (OD-RG-07) | Only remaining blocker; canonical graph mutation needs PO sign-off (§35b) | Authorize intake; I can draft node payloads + run `req:propose`, you sign off, then `apply-after-signoff` and traces cite canonical IDs |
| Re-audit after intake | Confirm executable-READY | Re-run dcx-plan-audit; expect READY once traces are canonical |
| OD-RG-02..09 | Confirm temporary defaults | Review §9.2 mapping |

## RG-PLAN — Domain model answer + fatal-decision hardening + lock open decisions
Source: [`sessions/2026-06-30-claude/030-cicd-rg-domains-decisions-hardening.md`](sessions/2026-06-30-claude/030-cicd-rg-domains-decisions-hardening.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Requirement intake sign-off (OD-RG-07) | Only remaining blocker for executable-READY; §35b PO gate | I draft proposals next; PO signs off, then apply + re-audit |
| Vercel Pro tier (if branded previews / deployment protection wanted) | D-RG-DOMAIN caveat | Confirm tier before RG-R4 |
| git init (RG-R0b) | Execution step 0; PO-owned | Run when ready to start sprints |

## RG-PLAN — Requirement intake draft (19 REQ-RG-* proposals, pending PO sign-off)
Source: [`sessions/2026-06-30-claude/031-cicd-rg-requirement-intake-draft.md`](sessions/2026-06-30-claude/031-cicd-rg-requirement-intake-draft.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| **Sign off the 19 REQ-RG-* proposals** | §35b — canonical mutation requires PO sign-off | Reply "approved" → I run `req:apply-after-signoff` for all 19, update sprint trace status to canonical, then re-audit |

## RS-R11 — Claude output audit + frontend-polish disposition
Source: [`sessions/2026-06-30-codex/001-rs-r11-output-audit.md`](sessions/2026-06-30-codex/001-rs-r11-output-audit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Frontend-polish lifecycle decision | RS-R11 is a valid hand-off, but the PO must choose whether to reactivate on-hold FP for bounded FP-R4/R5 redo or draft a replacement and expire the old on-hold plan | Prefer bounded reactivation for fastest path; replacement+expire for cleanest paper trail |
| Requirements-system plan close | Claude's RS-R11 sprint appears acceptable, but the overall plan still has close-out follow-ups | Run plan-level close only after RS-R8 header / stale DoD / `dcx-sprint-close` follow-ups are handled |

## Frontend Polish — Redesign Plan Audit
Source: [`sessions/2026-06-30-codex/002-frontend-polish-redesign-audit.md`](sessions/2026-06-30-codex/002-frontend-polish-redesign-audit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Frontend-polish plan revision | Audit verdict is NEEDS REVISION with 4 blockers before activation | Ask the planner to apply the four fixes, then re-audit |
| Impeccable gate | Docs conflict: `CLAUDE.md` says quarantined while `docs/agent-skills.md` says enabled brand-only | Resolve before any `change-token` implementation sprint uses impeccable |

## Frontend Polish — Redesign Re-Audit
Source: [`sessions/2026-06-30-codex/003-frontend-polish-redesign-reaudit.md`](sessions/2026-06-30-codex/003-frontend-polish-redesign-reaudit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Impeccable gate before implementation | Docs still conflict on whether impeccable is quarantined | Resolve before any `change-token` implementation sprint invokes impeccable |

## frontend-polish-implementation-v0.3.5 — Drafted plan audit
Source: [`sessions/2026-06-30-codex/006-frontend-polish-implementation-plan-audit.md`](sessions/2026-06-30-codex/006-frontend-polish-implementation-plan-audit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Drafted implementation plan audit verdict is NEEDS REVISION | The plan should not be activated until 3 blocking audit issues are patched | Have the planner/System Architect revise the sprint files, then re-audit before moving to active |

## MCP tooling setup for sprint execution
Source: [`sessions/2026-06-30-codex/007-mcp-tooling-setup.md`](sessions/2026-06-30-codex/007-mcp-tooling-setup.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Storybook MCP remains blocked | Component discovery sprints cannot rely on Storybook MCP yet | Approve a small tooling fix sprint to repair Storybook v10 CLI startup and verify `http://localhost:6006/mcp` |
| Semgrep scan remains blocked | Structural search MCP/CLI cannot be used as a gate while `semgrep-core` exits | Approve investigation into Semgrep runtime compatibility or replace the gate with a supported structural scanner |
| SonarQube remains blocked | Repository-wide duplication/quality MCP needs an external service | Provide SonarQube URL/token or keep SonarQube out of sprint gates |

## CICD-RG — Drafted CI/CD release governance plan audit
Source: [`sessions/2026-06-30-codex/011-cicd-release-governance-plan-audit.md`](sessions/2026-06-30-codex/011-cicd-release-governance-plan-audit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| `cicd-release-governance` is NOT READY for activation | The audit found 6 activation blockers, including missing sprint files, missing canonical graph requirements, no carry-forward contract, a 4-part/5-number version contradiction, and unresolved PO-owned git setup boundaries | Revise the draft, intake/sign off release-governance requirements, write executable sprint files, then request re-audit |

## CICD-RG — Token and mechanical-process audit addendum
Source: [`sessions/2026-06-30-codex/012-cicd-release-governance-token-assessment.md`](sessions/2026-06-30-codex/012-cicd-release-governance-token-assessment.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Decide whether the release-governance process cost is justified | The audit addendum estimates high one-time agent-token/process cost, justified only if release handling becomes mostly mechanical | If proceeding, revise the plan to maximize scripts/CI/validators and minimize recurring agent-read burden |

## CICD-RG — Architecture brief re-audit
Source: [`sessions/2026-06-30-codex/014-cicd-release-governance-architecture-reaudit.md`](sessions/2026-06-30-codex/014-cicd-release-governance-architecture-reaudit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Decide whether to accept the architecture brief | Re-audit verdict is READY for architecture direction, but not executable activation | Accept as Path 2 architecture brief, or ask Claude to apply the 3 advisories before Path 1 drafting |

## CICD-RG — Final re-audit with git approval and first-production check
Source: [`sessions/2026-06-30-codex/015-cicd-release-governance-final-reaudit-git-production.md`](sessions/2026-06-30-codex/015-cicd-release-governance-final-reaudit-git-production.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Record git setup approval in the plan | PO approved git/GitHub setup as long as it does not change `src/**` before implementation begins | Add a decision row / plan note with this boundary before RG-R0b |
| Add first-production bootstrap path | The plan handles version bootstrap but not a distinct first production release row/alias/approval flow | Add a first-production bootstrap section or sprint criterion before activation |

## CICD-RG — Executable plan re-audit
Source: [`sessions/2026-06-30-codex/016-cicd-release-governance-executable-reaudit.md`](sessions/2026-06-30-codex/016-cicd-release-governance-executable-reaudit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Do not activate yet | Audit found 3 blockers: proposed-only traces, bare `sprint-doctor.sh` command, missing requirement close gates | Have Claude apply the three fixes, perform requirement intake/sign-off, then request re-audit |

## cicd-release-governance — Executable Re-Audit 2
Source: [`sessions/2026-06-30-codex/017-cicd-release-governance-executable-reaudit-2.md`](sessions/2026-06-30-codex/017-cicd-release-governance-executable-reaudit-2.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Requirement intake/signoff for `REQ-RG-*` / `GOV-RG-*` | The plan cannot be activation-READY while sprint traces cite proposed IDs that do not exist in the canonical graph | Run/authorize `req:propose`, sign off, apply after signoff, update traces, then request final activation audit |

## HV Support Discovery — Home and Version Components
Source: [`sessions/2026-06-30-codex/018-hv-discovery-support.md`](sessions/2026-06-30-codex/018-hv-discovery-support.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Validate HV support recommendations | The artifact recommends what HV-1/HV-2 should create vs reuse before execution starts. | Review `output/HV-1-HV-2-component-discovery-support.md` and confirm or annotate before HV-1. |

## HV Discovery Output Review — Claude HV-1/HV-2 Specs
Source: [`sessions/2026-06-30-codex/019-hv-discovery-output-review.md`](sessions/2026-06-30-codex/019-hv-discovery-output-review.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Resolve HV discovery review blockers | The review found route, data-source, sign-off, graph-governance, and logging issues that can block HV-1/HV-2 execution. | Review `output-review/2026-06-30-codex-HV-1-HV-2-discovery-review.md`; revise/sign off before HV-1/HV-2 implementation. |

## cicd-release-governance — Output-review remediation + plan closeout
Source: [`sessions/2026-07-01-claude-02/001-cicd-release-governance-output-review-remediation.md`](sessions/2026-07-01-claude-02/001-cicd-release-governance-output-review-remediation.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Branch protection (RG-R3, AC-RG-3-1/4/5) | Needs repo admin; agent token is `admin:false` | GitHub → repo Settings → Branches: require PR review + status checks on `main`/`staging`/`integration`; enable "Require review from Code Owners" so `CODEOWNERS` activates |
| Production deployment protection (RG-R4, AC-RG-4-6) | Vercel dashboard only; no MCP/CLI path exists | Vercel → project `dcx-manager-gov` → Settings → Deployment Protection: decide + apply the production posture |
| Repo privacy + custom-domain DNS (RG-R0b/RG-R4) | Needs repo admin + DNS access to `dotment.com` | GitHub → make `tech557/dcx-manager` private + wire private-auth; add DNS for `dcx.dotment.com` / `staging.dcx.dotment.com` when granted |

## BE3-R5b — Live CI data capture
Source: [`sessions/2026-07-01-claude-03/007-BE3-R5b-live-capture.md`](sessions/2026-07-01-claude-03/007-BE3-R5b-live-capture.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| CI credentials for live capture | `backend-capture.yml` needs GitHub Actions `contents: write` + a source-change preview to fire on `deployment_status` | grant/confirm Actions write; push a source change to produce a preview |
| Registry capture-reference column | registry has no capture field; `notes` pre-filled by version-assign; sprint forbids adding a column; `patch-release-row.sh` won't overwrite non-empty | decide: add a `capture_ref` column (PO-approved schema change) vs. rely on `<version>` path as join key |

## BE3-R6 — Readiness synthesis & gate
Source: [`sessions/2026-07-01-claude-03/008-BE3-R6-readiness-gate.md`](sessions/2026-07-01-claude-03/008-BE3-R6-readiness-gate.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Requirement intake for 8 backend manifestations | req:completion-gate FAIL blocks G6/readiness; §35b forbids silent linking | run dcx-requirement-intake/req:propose → PO sign-off (capture-sink + scripts/backend/* → REQ-BE-*/REQ-GOV-TRACE-001-BACKEND) |
| Live capture (shared w/ R5b) | G5 FAIL until real payloads accumulate | grant CI creds; run R5b live to ≥3 payloads/route; then re-run R6 |

## Codex output-review remediation — backend-discovery-v3
Source: [`sessions/2026-07-01-claude-03/009-codex-output-review-remediation.md`](sessions/2026-07-01-claude-03/009-codex-output-review-remediation.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Concurrent UI edits in shared tree | 4 files (Input.tsx, CommunicationDateField.tsx, EditorViewerIsland/*) modified by a parallel frontend-polish process 2026-07-01 12:03–12:04 — not part of this plan | ensure they are attributed/committed to their own workstream, not backend-discovery-v3 |
| (Carried) live capture + requirement intake | G5/G6 still fail — gate remains NOT READY | run R5b live to ≥3 organic payloads/route; run requirement intake for the 8 backend manifestations |

## Endpoint & integration overview for PO review
Source: [`sessions/2026-07-01-claude-03/010-endpoint-integration-overview-for-po.md`](sessions/2026-07-01-claude-03/010-endpoint-integration-overview-for-po.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Confirm 4 product-model points | need PO intent to finalize the implementation sprint | review docs/backend/endpoint-integration-overview.md §"confirm at the implementation-sprint draft": (1) create-via-duplicate only? (2) workspace vs DCX-scoped access? (3) files/attachments in v1? (4) AI/ClickUp stay stubs? |

## Draft the production-api-client-switch implementation plan
Source: [`sessions/2026-07-01-claude-03/011-draft-production-api-client-switch.md`](sessions/2026-07-01-claude-03/011-draft-production-api-client-switch.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Audit + activate decision | drafted plan cannot execute until audited READY + PO activation, and only after backend-discovery-v3 = READY | run `dcx-plan-audit` on the drafted plan; activate when both conditions hold |
| Confirm 4 product-model points | drive PAC-R0/PAC-R2 scope | confirm at audit/activation: create-via-duplicate (OD-PAC-01), workspace-scoped access, files scope, ClickUp/AI stubs |

## Revise production-api-client-switch per Codex audit
Source: [`sessions/2026-07-01-claude-03/012-revise-pac-plan-per-codex-audit.md`](sessions/2026-07-01-claude-03/012-revise-pac-plan-per-codex-audit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Re-audit the revised plan | verdict was NEEDS REVISION; blockers now addressed | run `dcx-plan-audit` again → expect READY; then two-stage activation once backend-discovery-v3 = READY |

## PAC-R0 — Prerequisites, PO confirmations & switch architecture
Source: [`sessions/2026-07-01-claude-05/002-production-api-client-switch-PAC-R0.md`](sessions/2026-07-01-claude-05/002-production-api-client-switch-PAC-R0.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Sign off 3 queued `REQ-BE-*` proposals | ID-lock rule (audit blocking #1): PAC-R1..R6 carry placeholder Requirement Trace fields and legally cannot execute until these are PO-signed, minting real node IDs | Run `npm run req:apply-after-signoff -- --id <PRP-id> --signoff <ref>` for each of `PRP-2026-07-01-create-node-REQ-BE-{SCHEMA,AUTH,API}-001`, or direct the executing agent to do so once you approve |

## PAC-R4 — Route parity + dev data seed (real vs. contract)
Source: [`sessions/2026-07-01-claude-05/008-production-api-client-switch-PAC-R4.md`](sessions/2026-07-01-claude-05/008-production-api-client-switch-PAC-R4.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Finding #3: `channel_compositions_write` RLS policy is broken (raw `memberships` subquery, blocked by RLS — every insert rejected, even for real editors) | Needs a schema/RLS migration (`apply_migration`), which is a PO-gated action per this plan's governance — and out of PAC-R4's own tool scope | Approve a small follow-up migration rewriting the policy's `WITH CHECK` to call `app_user_can_edit(...)` like the other `_write` policies, before PAC-R6 or any real composition-create usage |
| Finding #2: `rationale.md` HYPOTHESIS-resolved note not yet written (outside PAC-R4's `allowed-writes`) | Doc-only, mechanical, but scope-gated | Low priority — approve a doc-only touch-up whenever convenient |

## skeleton-loading-v2 — Draft plan for app-wide skeleton loading fix
Source: [`sessions/2026-07-01-claude-07/001-skeleton-loading-v2-draft-plan.md`](sessions/2026-07-01-claude-07/001-skeleton-loading-v2-draft-plan.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Review and confirm scope of `docs/plans/drafted/skeleton-loading-v2/` | New drafted plan proposes 7 sprints (SKEL-R0..R6) touching Builder/Home/Version loading paths; needs `dcx-plan-audit` READY + PO activation before any agent may execute it | Read the plan README; if scope is right, request `dcx-plan-audit`; if not, redirect before audit |

## Activate cicd-release-governance plan + RG-R0a — Discovery & capability report
Source: [`sessions/2026-07-01-claude/002-cicd-release-governance-activate-RG-R0a.md`](sessions/2026-07-01-claude/002-cicd-release-governance-activate-RG-R0a.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| RG-R0b is explicitly **PO-owned** per the plan (first git/GitHub init — irreversible, external/shared-state action) | The plan's own README lists RG-R0b as "PO executes; agent writes the runbook." I stopped after RG-R0a rather than auto-running git init / GitHub setup on your behalf. | Confirm whether you want me to (a) write the RG-R0b runbook only and you execute it, or (b) execute RG-R0b directly (git init, first commit with secret scan, optional GitHub repo) under the already-approved D-RG-GIT boundary (no `src/**`). |
| `req:completion-gate` returns FAIL for docs-only governance changes (see Gates row above) | Not a defect in RG-R0a's work, but a gap in how the requirements graph models plan/process docs — every future docs-only RG sprint will likely hit the same FAIL. | Either accept this as expected/non-blocking for plan-housekeeping docs (recommended), or have a future sprint register plan README/output files as manifestations of REQ-RG-PLAT-018/REQ-RG-AUTO-019 in the graph. |
| Discrepancy found: `.github/workflows/ci.yml` and `.github/workflows/req-validate-on-graph-change.yml` already exist despite no `.git` | The plan's drafting-time assumption was "no `.github/`" — false. These are orphaned configs that predate any git history. | RG-R0b/RG-R3 will reconcile rather than overwrite; flagging now so it's not a surprise later. |

## RG-R0b — Repo + integration setup (executed directly per PO instruction)
Source: [`sessions/2026-07-01-claude/003-cicd-release-governance-RG-R0b.md`](sessions/2026-07-01-claude/003-cicd-release-governance-RG-R0b.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| GitHub repo creation, remote, push, branch push | No `gh` CLI installed in this environment; no GitHub credentials available to the agent | Install `gh` + `gh auth login`, or create the repo via the GitHub web UI, then either share the remote URL for me to `git remote add origin <url> && git push -u origin main staging integration`, or push it yourself |
| Vercel project link + domain config (`dcx.dotment.com`, `staging.dcx.dotment.com`) | Needs Vercel account access and DNS access to `dotment.com`; needs a GitHub remote first (Vercel's import flow links to a GitHub repo) | Do this after the GitHub remote exists; I can drive parts of it via the Vercel MCP once a remote/import target exists, if you want me to attempt it then |
| Platform secrets (GitHub/Vercel env vars) | Requires account access I don't have | Add via GitHub repo Settings → Secrets and Vercel project → Environment Variables |
| RG-R0b cannot close as Completed | 3 of 6 acceptance criteria are genuinely blocked on the above | Confirm whether to (a) leave RG-R0b open/Partial and proceed to RG-R1 (docs/tooling sprint, doesn't need the GitHub remote) in parallel, or (b) pause until GitHub/Vercel/DNS are set up |
| `req:completion-gate` FAIL pattern repeats for docs-only sprints | Same as flagged in RG-R0a's log | No new action needed — already an open item from the RG-R0a log |

## RG-R0b — GitHub remote added, main/staging/integration pushed
Source: [`sessions/2026-07-01-claude/006-cicd-release-governance-RG-R0b-remote-push.md`](sessions/2026-07-01-claude/006-cicd-release-governance-RG-R0b-remote-push.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Repo is temporarily public | PO stated this is "till we setup a private connection" | Set up a durable private-repo auth path (SSH deploy key, or a scoped PAT issued from the `tech557` account itself rather than relying on the `MahmoudSamaha2` collaborator grant), then flip the repo back to private |
| Vercel project link, domains, secrets | Needs Vercel account access and DNS access to `dotment.com` | As listed in the RG-R0b runbook's "Steps NOT executed" table |
| RG-R0b still not fully Completed | 2 of 6 AC remain BLOCKED (Vercel, domains) | Decide whether to proceed to RG-R3 now (it only needs the GitHub remote, which is done) while RG-R0b stays open for the Vercel/DNS pieces, or wait |

## RG-R3 — GitHub CI wiring
Source: [`sessions/2026-07-01-claude/007-cicd-release-governance-RG-R3.md`](sessions/2026-07-01-claude/007-cicd-release-governance-RG-R3.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Apply branch protection on `main`/`staging`/`integration` | Requires GitHub repo admin settings access | Exact settings table in `output/RG-R3-github-ci.md` ("Branch protection settings") — required PR + Code Owner review + status checks |
| Verify `@tech557` is the right CODEOWNERS identity | Agent assumed the repo owner is the PO; not confirmed | Edit `CODEOWNERS` if a different GitHub username should own these files |
| Real bug found + fixed during live testing: `version-assign.yml` needed explicit `permissions: contents: write` | Default `GITHUB_TOKEN` is read-only by default on this repo; the first live run failed | Already fixed and reverified green — no action needed, flagging for awareness |
| First real PR into `integration` (once branch protection is on) should serve as the retroactive AC-RG-3-1 evidence | A throwaway PR wasn't opened due to missing `gh`/API write credential | No immediate action; just don't expect a separate throwaway-PR log entry later — the first real PR covers it |

## RG-R3 — three live bugs found and fixed via real GitHub Actions runs
Source: [`sessions/2026-07-01-claude/008-cicd-release-governance-RG-R3-live-bugfixes.md`](sessions/2026-07-01-claude/008-cicd-release-governance-RG-R3-live-bugfixes.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Same as RG-R3's original log (007): branch protection + CODEOWNERS owner confirmation still pending | Unaffected by this session's bugfixes | See `007-cicd-release-governance-RG-R3.md` |

## RG-R4 — Vercel preview/promote wiring (exact-build promotion)
Source: [`sessions/2026-07-01-claude/009-cicd-release-governance-RG-R4.md`](sessions/2026-07-01-claude/009-cicd-release-governance-RG-R4.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Deployment protection on production (AC-RG-4-6) | No MCP/CLI exposes this Vercel setting | Check Project Settings → Deployment Protection in the Vercel dashboard for `dcx-manager-gov`; may need a plan-tier check |
| Custom domains (`dcx.dotment.com`, `staging.dcx.dotment.com`) | Needs DNS access to `dotment.com` | Add CNAME records; assign domains in Vercel; then set `PROMOTE_STAGING_DOMAIN`/`PROMOTE_PRODUCTION_DOMAIN` env vars (no script change) |
| The legacy `dcx-manager` Vercel project (pre-existing, untouched) | Still exists with its own domains/deployment — unclear current purpose | Decide whether to deprecate, repurpose, or leave it; out of this plan's scope unless you want it addressed |
| First real promotion-to-production, and a real second staging promotion (for genuine rollback evidence) | Both require a real PO approval, by design | Whenever you're ready for an actual release, not before |

## RG-R5 — Supabase environment separation
Source: [`sessions/2026-07-01-claude/010-cicd-release-governance-RG-R5.md`](sessions/2026-07-01-claude/010-cicd-release-governance-RG-R5.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Real production-migration test still pending | Needs an actual production approval + actual migration content, neither of which exists yet (app is still mocked) | No action needed now — will happen naturally with the first real backend release |
| Confirm `VITE_SUPABASE_*` naming convention | Agent chose the standard Vite convention since no existing convention was found in `src/` | None needed unless you want different names before backend code starts consuming them |

## RG-R8 — First-production bootstrap (one-time)
Source: [`sessions/2026-07-01-claude/014-cicd-release-governance-RG-R8.md`](sessions/2026-07-01-claude/014-cicd-release-governance-RG-R8.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| **Deployment protection on production is unconfirmed and now matters for real** | Production is live and public (plain `200`, no auth challenge observed); AC-RG-4-6 was never resolved (no MCP/CLI path exists) | Check Vercel dashboard → Project Settings → Deployment Protection for `dcx-manager-gov` |
| Branch protection (RG-R3) still not applied | Needs GitHub admin UI access | Apply the documented settings in `output/RG-R3-github-ci.md` |
| Repo still public (RG-R0b) | PO said this was temporary | Set up a durable private-auth path, then flip to private |
| **Plan should NOT move to `docs/plans/completed/` yet** | 3 sprints (RG-R0b, RG-R3, RG-R4) are Partial with the items above still open | Either resolve them or explicitly accept them as permanent debt before closing the plan |

## cicd-release-governance — Confirming Re-Audit
Source: [`sessions/2026-07-01-codex/001-cicd-release-governance-confirming-reaudit.md`](sessions/2026-07-01-codex/001-cicd-release-governance-confirming-reaudit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Activate `cicd-release-governance` when ready | Audit verdict is READY; activation is a PO lifecycle decision | Move `docs/plans/drafted/cicd-release-governance/` to `docs/plans/active/` when you want agents to begin RG-R0a → RG-R8 |

## BE3 — Backend Discovery v3 Plan Audit
Source: [`sessions/2026-07-01-codex/002-backend-discovery-v3-plan-audit.md`](sessions/2026-07-01-codex/002-backend-discovery-v3-plan-audit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| BE3 plan is not ready to activate | Audit found 5 blocking issues, including stale `version_context` and BE3-R5 executable-gate problems | Ask the plan author to revise, then request re-audit before moving to `active/` |

## cicd-release-governance — Output Review
Source: [`sessions/2026-07-01-codex/003-cicd-release-governance-output-review.md`](sessions/2026-07-01-codex/003-cicd-release-governance-output-review.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Plan output needs revision before close | Output review found stale version context, contradictory sprint statuses, missing stable promotion URLs in the registry, stale README baseline text, and tooling-state mismatches | Decide whether to have an agent apply the output-review fixes now; keep the plan active until RG-R0b/RG-R3/RG-R4 Partial items are resolved or accepted as debt |

## BE3 — Backend Discovery v3 Re-Audit
Source: [`sessions/2026-07-01-codex/004-backend-discovery-v3-reaudit.md`](sessions/2026-07-01-codex/004-backend-discovery-v3-reaudit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| BE3 plan still not ready to activate | Re-audit found 3 remaining blocking issues: version reconciliation, R5a flag-off assertion mechanics, and R6 changed-file gate syntax | Revise those three items, then request another re-audit before moving BE3 to `active/` |

## BE3 — Backend Discovery v3 Re-Audit 2
Source: [`sessions/2026-07-01-codex/005-backend-discovery-v3-reaudit-2.md`](sessions/2026-07-01-codex/005-backend-discovery-v3-reaudit-2.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| BE3 plan still not ready to activate | Re-audit found 1 remaining blocking issue: BE3-R5b requires patching `docs/releases/registry.csv`, but that file is not in BE3-R5b `allowed-writes` | Add `docs/releases/registry.csv` to BE3-R5b `allowed-writes` and "Files likely affected", limiting the change to the matching `version` row's capture reference; then request one more quick re-audit |

## BE3 — Backend discovery output review
Source: [`sessions/2026-07-01-codex/007-backend-discovery-v3-output-review.md`](sessions/2026-07-01-codex/007-backend-discovery-v3-output-review.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Backend discovery output findings | The scorecard is NOT READY and the review found stale/incorrect evidence that should be corrected before handoff | Fix the P1/P2 findings in `output-review/2026-07-01-codex-output-review.md`, then re-run BE3-R6 |

## BE3 — Backend discovery changed-output re-audit
Source: [`sessions/2026-07-01-codex/008-backend-discovery-v3-output-reaudit.md`](sessions/2026-07-01-codex/008-backend-discovery-v3-output-reaudit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Remaining BE3 readiness blockers | G5 live organic capture and G6 requirement intake still keep the plan NOT READY | Continue with live R5b capture and PO-gated requirement intake before re-running R6 |
| Minor R5b follow-up cleanup | R5b follow-up text still points to the old app-hook tuning idea, though the remaining missing route is specifically the status transition probe | Update the follow-up wording when doing the next BE3 cleanup pass |

## PAC — production-api-client-switch re-audit
Source: [`sessions/2026-07-01-codex/009-production-api-client-switch-reaudit.md`](sessions/2026-07-01-codex/009-production-api-client-switch-reaudit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| PAC activation decision | Re-audit verdict is READY, but activation is still PO-gated and backend-discovery-v3 must be READY first | Activate PAC-R0 only when ready; later activate PAC-R1..R6 after PAC-R0 produces signed IDs and BE3 is READY |
| Version metadata drift | Current `docs/VERSION.md` is v1.0.1.1 while `metadata.json` still names v1.0.1.0; PAC README also still has draft-time `version_context: v1.0.1.0` | Resolve/accept metadata drift and re-copy current version into PAC frontmatter at activation |

## Skeleton Loading v2 — Draft Plan Audit
Source: [`sessions/2026-07-01-codex/011-skeleton-loading-v2-plan-audit.md`](sessions/2026-07-01-codex/011-skeleton-loading-v2-plan-audit.md)

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Skeleton-loading-v2 verdict is `NOT READY` | The plan has activation blockers: stale `version_context`, incomplete code-sprint manifestation trace, unregistered preview tool names, weak browser fallbacks, and an unresolved SKEL-R1 PO sign-off model | Ask the plan author to revise the draft, then re-audit before moving it to `active/` |
| Third-party dependency decision | `phantom-ui` may help reduce handcrafted page skeleton drift, but it does not solve this plan's sequencing/theme/governance work and adds runtime/custom-element dependency risk | Treat it as an optional spike in SKEL-R1, not as a replacement for the current plan |

