## RG-R4 — Vercel preview/promote wiring (exact-build promotion)
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Partial
PO-Action: pending
Version: v0.4.0.0
Change-Class: non-source

Intent: Continue the cicd-release-governance plan, sprint RG-R4 — wire Vercel preview-per-commit and
exact-build promotion (Pattern A), gated on a recorded PO approval.
Trigger: PO instruction to execute the plan one sprint at a time; RG-R4 follows RG-R3. Before writing
anything, scoped Vercel MCP availability and found a pre-existing "dcx-manager" project unrelated to this
new repo — paused and asked the PO how to proceed rather than assuming reuse.
Requirements covered: REQ-RG-PREVIEW-001, REQ-RG-STAGING-003, REQ-RG-PROD-004, REQ-RG-APPROVAL-005, REQ-RG-RESET-010, REQ-RG-MAP-016.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | `vercel.json` | minimal config; framework hint | 4 |
| created (CLI side effect, not direct edit) | `.vercel/project.json`, `.env.local` | local Vercel project link + OIDC token; both git-ignored | — |
| edited | `.gitignore` | covers `.vercel`/`.env*` (the Vercel CLI added these itself on `vercel link`) | +2 |
| created | `scripts/release/patch-release-row.sh` | fills an empty registry field, refuses to overwrite a set one | 38 |
| created | `.github/workflows/record-preview.yml` | captures `preview_url` via GitHub's native `deployment_status` event, no Vercel token needed | 50 |
| created | `scripts/release/promote.sh` | the only path that moves a stable alias; enforces all 4 §2.3 gates; `--rollback` | 141 |
| edited | `scripts/release/tests/run-tests.sh` | added patch-release-row.sh + promote.sh coverage (8 + promote tests) | +60 |
| created | `docs/releases/approvals/v0.3.5.7-staging.md` | **PO-approved in-session**, recorded here, not fabricated | 13 |
| created | `docs/plans/active/cicd-release-governance/output/RG-R4-vercel.md` | sprint deliverable | 110 |
| edited | `docs/plans/active/cicd-release-governance/README.md` | carry-forward appended | +28 |
| edited | `docs/plans/active/cicd-release-governance/sprints/RG-R4.md` | status → Partial | 2 |
| (real, via `promote.sh`, not a direct edit) | `docs/releases/registry.csv` | appended `v0.4.0.0` (`promoted-staging`) row | +1 |
| (real, via `promote.sh`'s VERSION sync) | `docs/VERSION.md` | `current` → `v0.4.0.0` | 1 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no `src/**` touched |
| Open decisions used (⏱) | None — "create fresh project, don't reuse legacy `dcx-manager`" and "approve v0.3.5.7 for staging" were both explicit PO decisions in-session, not agent-assumed |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-RG-4-1 — capability proof | PASS — Pattern A confirmed live (immutable deploy + exact-build alias) |
| AC-RG-4-2 — preview URL+id in registry | PASS (URL only, by design — see output doc) |
| AC-RG-4-3 — non-source → no preview | N/A this sprint (see output doc) |
| AC-RG-4-4 — exact-deployment promotion, no rebuild | **PASS** — live-verified via Vercel API |
| AC-RG-4-5 — refuse without approval | **PASS** — live-verified |
| AC-RG-4-6 — prod deployment protection | BLOCKED — no MCP/CLI path; PO dashboard action |
| AC-RG-4-7 — rollback | PASS by mechanism (live degenerate case + full stubbed-suite coverage) |
| AC-RG-4-8 — no `src/**` changed | PASS |

### Gates
| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| `scripts/release/tests/run-tests.sh` | PASS — 23/23 |
| `npm run req:validate` | PASS — 0 errors, 0 warnings |
| `sprint-doctor.sh cicd-release-governance RG-R4 claude` | ❌ NOT READY — "status 'Partial' (expected Completed)". Correct: AC-RG-4-6 genuinely PO-blocked. |
| Live Vercel API confirmation of exact-build promotion | PASS — `get_deployment` on the new alias matches the source row's commit SHA and original build timestamps |
| `bash scripts/verify.sh` | PASS |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Deployment protection on production (AC-RG-4-6) | No MCP/CLI exposes this Vercel setting | Check Project Settings → Deployment Protection in the Vercel dashboard for `dcx-manager-gov`; may need a plan-tier check |
| Custom domains (`dcx.dotment.com`, `staging.dcx.dotment.com`) | Needs DNS access to `dotment.com` | Add CNAME records; assign domains in Vercel; then set `PROMOTE_STAGING_DOMAIN`/`PROMOTE_PRODUCTION_DOMAIN` env vars (no script change) |
| The legacy `dcx-manager` Vercel project (pre-existing, untouched) | Still exists with its own domains/deployment — unclear current purpose | Decide whether to deprecate, repurpose, or leave it; out of this plan's scope unless you want it addressed |
| First real promotion-to-production, and a real second staging promotion (for genuine rollback evidence) | Both require a real PO approval, by design | Whenever you're ready for an actual release, not before |

### Consumer updates required
None.

### Open issues / follow-ups
- Next sprint in order is **RG-R5** (Supabase environment separation) — will check Supabase MCP
  availability and scope what's agent-executable vs. PO-blocked before starting, same pattern as RG-R3/RG-R4.
