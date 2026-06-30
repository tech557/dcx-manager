## RG-R3 — GitHub CI wiring
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Partial
PO-Action: pending
Version: v0.3.5.0
Change-Class: non-source

Intent: Continue the cicd-release-governance plan, sprint RG-R3 — wire the mechanical gates (CI on
PR/push, version-assign on merge to integration, CODEOWNERS), now that RG-R0b's GitHub remote exists.
Trigger: PO instruction to execute the plan one sprint at a time; RG-R3 follows RG-R2 in dependency order
and the GitHub remote pushed earlier this session.
Requirements covered: REQ-RG-PREVIEW-001, REQ-RG-NOPREVIEW-002, REQ-RG-ITER-008, REQ-RG-REV-009, REQ-RG-OWN-007, REQ-RG-SEED-017, REQ-RG-CONC-014.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | `.github/workflows/ci.yml` | widened triggers to `main`/`staging`/`integration`; added registry-validate step | +6 (was 56) |
| created | `.github/workflows/version-assign.yml` | merge-to-integration version stamping, serialized | 75 |
| created | `CODEOWNERS` | PO-only file protection (assumes `@tech557` is PO) | 13 |
| created | `docs/plans/active/cicd-release-governance/output/RG-R3-github-ci.md` | sprint deliverable incl. real CI run evidence | 100 |
| edited | `docs/plans/active/cicd-release-governance/README.md` | carry-forward appended; process note on main-vs-integration | +22 |
| edited | `docs/plans/active/cicd-release-governance/sprints/RG-R3.md` | status → Partial | 2 |
| edited | `.gitignore` | added `.claude/scheduled_tasks.lock` (harness-generated, not project) | +1 |
| git (on `integration`, not `main` — see process note) | 4 commits | CI wiring, the GITHUB_TOKEN permission fix, and the bot's own `[skip ci]` version-stamp commit | — |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no `src/**` touched |
| Open decisions used (⏱) | None — CODEOWNERS owner assumption (`@tech557`) flagged explicitly in the file and output doc for PO correction, not silently decided |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-RG-3-1 — gates run on a PR | PARTIAL — verified live via push trigger, not an actual PR (no `gh`/API write credential available) |
| AC-RG-3-2 — merge to integration assigns next version (serialized) | **PASS** — live: `v0.3.5.0 → v0.3.5.1` |
| AC-RG-3-3 — concurrency serializes version-assign | PASS by design (not load-tested with a real race) |
| AC-RG-3-4 — CODEOWNERS protects PO-only files | BLOCKED — needs branch protection's Code-Owner-review setting, PO-only |
| AC-RG-3-5 — branch protection blocks direct push | BLOCKED — PO applies in GitHub UI; exact settings documented |
| AC-RG-3-6 — no `src/**` changed | **PASS** |

### Gates
| Gate | Result |
|---|---|
| typecheck / lint / validate:architecture / test | N/A — no source changed; `bash scripts/verify.sh` run as extra sanity, "verify passed" |
| no-`src/**` proof | PASS |
| CI green on real push (GitHub Actions, public API, no auth) | PASS — runs `28480531131` (CI) and `28480531146` (version-assign) both `success` on `integration` |
| `sprint-doctor.sh cicd-release-governance RG-R3 claude` | ❌ NOT READY — "sprint status is 'Partial' (expected Completed)". Correct and expected: 2 of 6 AC are genuinely PO-blocked (branch protection settings require GitHub admin UI access this agent doesn't have). Not forcing a false Completed. |
| `npm run req:validate` | PASS — 0 errors, 0 warnings |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Apply branch protection on `main`/`staging`/`integration` | Requires GitHub repo admin settings access | Exact settings table in `output/RG-R3-github-ci.md` ("Branch protection settings") — required PR + Code Owner review + status checks |
| Verify `@tech557` is the right CODEOWNERS identity | Agent assumed the repo owner is the PO; not confirmed | Edit `CODEOWNERS` if a different GitHub username should own these files |
| Real bug found + fixed during live testing: `version-assign.yml` needed explicit `permissions: contents: write` | Default `GITHUB_TOKEN` is read-only by default on this repo; the first live run failed | Already fixed and reverified green — no action needed, flagging for awareness |
| First real PR into `integration` (once branch protection is on) should serve as the retroactive AC-RG-3-1 evidence | A throwaway PR wasn't opened due to missing `gh`/API write credential | No immediate action; just don't expect a separate throwaway-PR log entry later — the first real PR covers it |

### Consumer updates required
None.

### Open issues / follow-ups
- **Process correction:** starting this sprint, work lands on `integration`, not `main` (see carry-forward
  process note) — `main` only advances via a future PO-approved promotion (RG-R4).
- Next sprint in order: **RG-R4** (Vercel preview/promote wiring) — needs Vercel account access/credentials,
  which I don't have. Will check Vercel MCP tool availability and report what's agent-executable vs.
  PO-blocked before starting, same pattern as this sprint.
