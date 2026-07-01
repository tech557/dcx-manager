## cicd-release-governance — Output-review remediation + plan closeout
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: mixed
PO-Action: pending
Version: v1.0.1.0
Change-Class: non-source

Intent: Resolve every finding in the `2026-07-01-codex` output review of `cicd-release-governance`,
then close the plan. Sub-tasks: (a) `user-request-code` — fix `promote.sh` + release tests + agent
state scripts; (b) `user-request-planning` — freeze/relabel README, correct sprint statuses; (c)
`process-governance` — move the plan `active/` → `completed/` under the PO's accepted-debt decision.
Trigger: PO message "check the active plan output review, close any related plan debt and proceed with
plan closeout."

Requirements covered: output-review findings P1-#1..#3, P2-#4..#6 (cicd-release-governance).

### PO decisions taken this session (4 questions, 2 rounds)
| Decision | PO answer |
|---|---|
| version_context (P1-#2) | Freeze as historical `v0.3.5` + note pointing to live `v1.0.1.0` |
| Resolve the 3 PO-owned open items myself? | "resolve unless it affects the customer, else ask" — **confirmed unresolvable**: GitHub token is non-admin (`admin:false`), Vercel MCP has no deployment-protection tool → genuinely PO-owned |
| Registry historical backfill (P1-#1) | Approve **direct in-place repair** of the 2 rows with evidence-confirmed URLs |
| metadata.json label (P2-#6) | Update `DCX Manager v0.3.5` → `v1.0.1.0` |
| Final closeout | **Accept 3 items as permanent tracked debt → move plan to `completed/`** |

### Capability probe (why the 3 items are PO-owned, not agent-doable)
| Item | Probe | Result |
|---|---|---|
| Branch protection (RG-R3) | `git credential fill` → GitHub API `repos/tech557/dcx-manager` | token `admin:false`; branch-protection API needs repo admin → cannot |
| Repo privacy (RG-R0b) | same token | needs admin → cannot |
| Deployment protection (RG-R4) | searched Vercel MCP toolset | no protection-config tool exists (only deploy/get/fetch) → cannot |

### Files touched
| Action | Path | What & why | Finding |
|---|---|---|---|
| edited | `scripts/release/promote.sh` | staging promotions now fill `staging_url`, production fill `production_url` (`https://$TARGET_DOMAIN`) | P1-#1 |
| edited | `scripts/release/tests/run-tests.sh` | regression test asserts the staging promotion fills `staging_url`, leaves `production_url` empty; suite 42→43, all PASS | P1-#1 |
| edited | `docs/releases/registry.csv` | PO-approved direct in-place repair: `v0.4.0.0` staging_url + `v1.0.0.0` production_url backfilled from RG-R4/RG-R8 evidence; validator PASS | P1-#1 |
| edited | `metadata.json` | `name` → `DCX Manager v1.0.1.0`; clears `build-current-state` contradiction | P2-#6 |
| edited | `scripts/agent/build-current-state.sh` | version regex now captures optional 4th segment (`v1.0.1.0` no longer truncated) | P2-#6 |
| edited | `scripts/agent/verify-plan-state.sh` | active-plan sprint discovery now also reads `sprints/` subdir (no more false "no sprint files" warn) | P2-#6 |
| edited | `…/cicd-release-governance/output/RG-R3-github-ci.md` | frontmatter `status` complete → Partial (BLOCKED ACs named) | P1-#3 |
| edited | `…/cicd-release-governance/output/RG-R4-vercel.md` | frontmatter `status` complete → Partial (BLOCKED ACs named) | P1-#3 |
| edited | `…/cicd-release-governance/sprints/RG-R8.md` | close instructions defer plan-close until 3 Partial items resolved/accepted | P2-#5 |
| edited | `…/cicd-release-governance/README.md` | version_context frozen+noted (P1-#2); §1 relabeled historical-baseline (P2-#4); §9.1 risk Status column (P2-#4); tooling-debt note; frontmatter status→completed; plan-level accepted-debt banner | P1-#2, P2-#4, close |
| edited | `…/cicd-release-governance/output-review/2026-07-01-codex-output-review.md` | Resolution addendum table (all 6 findings) | all |
| moved | `docs/plans/active/cicd-release-governance` → `docs/plans/completed/cicd-release-governance` | plan close (git mv, history preserved) | close |
| edited | `docs/plans/active/README.md` | removed cicd from active; noted completed + accepted-debt | close |

### Gates
| Gate | Result |
|---|---|
| `scripts/release/tests/run-tests.sh` | PASS — 43/43 (was 42; +1 regression) |
| `scripts/release/validate-release-registry.sh` | PASS — registry valid after repair |
| `scripts/verify.sh` | PASS |
| `build-current-state.sh` contradictions | `[]` (was `docs/VERSION.md=v1.0.1 vs metadata.json=v0.3.5`) |
| `verify-plan-state.sh` cicd sprint warning | gone (only an unrelated `completed/builder-refactor` parse quirk remains, out of scope) |

### Carry-forward
- `cicd-release-governance` is **completed** in `docs/plans/completed/`. `active/` now holds only its README.
- **Accepted permanent debt (PO-owned, standing checklist in `po-actions.md`):** (1) branch protection —
  GitHub UI; (2) production deployment protection — Vercel dashboard; (3) repo privacy + custom-domain
  DNS — GitHub/DNS admin. Agent cannot perform these (non-admin token; no Vercel protection MCP tool).
- All future promotions record stable env URLs automatically (`promote.sh` fixed). No `src/**` touched.

### 🔔 PO action required
_Accepted as permanent tracked debt at plan close — not blocking; the plan is complete. Do when convenient._

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Branch protection (RG-R3, AC-RG-3-1/4/5) | Needs repo admin; agent token is `admin:false` | GitHub → repo Settings → Branches: require PR review + status checks on `main`/`staging`/`integration`; enable "Require review from Code Owners" so `CODEOWNERS` activates |
| Production deployment protection (RG-R4, AC-RG-4-6) | Vercel dashboard only; no MCP/CLI path exists | Vercel → project `dcx-manager-gov` → Settings → Deployment Protection: decide + apply the production posture |
| Repo privacy + custom-domain DNS (RG-R0b/RG-R4) | Needs repo admin + DNS access to `dotment.com` | GitHub → make `tech557/dcx-manager` private + wire private-auth; add DNS for `dcx.dotment.com` / `staging.dcx.dotment.com` when granted |
