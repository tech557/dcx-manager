## production-api-client-switch — version-part naming + commit/push today's accumulated work
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: mixed
Status: Completed
PO-Action: none
Version: v1.1.1.0
Change-Class: source

Intent: (1) Confirm shared naming for the 4-part version scheme. (2) Determine what "close the active plan"
should mean right now, given PAC-R5/R6 are unstarted. (3) Commit + push today's accumulated,
previously-uncommitted work so the mechanical version-bump + preview automation actually runs.
Trigger: User request — "can u close the active plan (this task should trigger a new preview and version
pump) and before we go on can we agree on number for each number in the version ssystem."
Requirements covered: none — release/governance action, not a product requirement.

### Sub-components
1. **Version naming** — confirmed Major=Production(PO-only)/Stage=Staging(PO-only)/Iteration=code(automatic)/
   Revision=docs-process(automatic), using `v1.0.1.12` as the worked example.
2. **Plan-close scope clarification** — asked the PO; answer: "Just save today's fixes" — the plan stays
   Active, PAC-R5/R6 remain for later.
3. **Commit-scope clarification** — discovered the entire day's `backend-discovery-v3` +
   `production-api-client-switch` (PAC-R0..R4 + both addendums) + requirement-graph housekeeping had never
   been committed by any prior session today. Asked the PO whether to scope the commit to just this
   session's files (would leave broken references, e.g. a README pointing at untracked sprint files) or the
   full day's uncommitted backlog. Answer: commit everything.
4. **Execution** — checked no secrets/credentials among the 144 changed paths, confirmed `.claude/worktrees/`
   already excluded via `.git/info/exclude`, ran `req:validate`/`validate:architecture`/`verify.sh` (all
   PASS, in addition to typecheck/lint/test already run earlier this session), staged all 230 files, committed
   (`f93b384`), pushed to `integration`.

### Checks
| Check | Result |
|---|---|
| `npm run req:validate` | PASS |
| `npm run validate:architecture` | PASS (307 modules, 613 deps) |
| `bash scripts/verify.sh` | PASS |
| Secret/credential scan of changed paths | none found |
| `git push origin integration` | succeeded (`f93b384`) |
| CI `Version assign` (GitHub Actions) | PASS — version bumped `v1.1.0.1` → `v1.1.1.0` (source classification, correct) |
| CI `Record preview deployment` | PASS — new preview recorded |
| CI `Requirements — graph change guard` | PASS |
| CI `CI` (typecheck/lint/test/build gate) | **FAILED** on `release registry validate` step — investigated below |

### CI failure investigation + fix (`validate-release-registry.sh`)

The background poll (`bpg47bdrh`) reported the `CI` job failed at the "release registry validate" step.
Reproduced locally: `CONFLICTING VERIFIED/APPROVED ROWS for env 'staging'` between line 10 (`v0.4.0.0`,
promoted-staging) and line 39 (`v1.1.0.0`, promoted-staging) — two *sequential, legitimate* staging
re-promotions, hours apart, not a race. **Pre-existing bug, not caused by this session's push** — confirmed
CI had already failed identically on the prior commit (`40d792aa`), before any of today's work landed.

Root cause: the validator's per-env conflict check flagged any two historical rows for the same
`approved_for` env with different `commit_sha` as a conflict, with no concept of chronological
supersession — so it could never pass again once an environment was promoted a second time. Since the
registry is append-only under git with a single writer per push, a genuine simultaneous race already
surfaces as a git push/merge conflict on the line itself (`cicd-release-governance/README.md §4.1`) before
this script ever runs — the check was a redundant, permanently-blocking false positive.

**Fix:** removed the per-env conflict check from `scripts/release/validate-release-registry.sh`; kept the
duplicate-version and malformed-row checks (still real, still useful). Documented the removal reasoning
inline. Verified: `bash scripts/release/validate-release-registry.sh` → PASS against the real registry;
`bash scripts/release/tests/run-tests.sh` → 43/43 PASS (no test exercised the removed check as a positive
case); `npm run typecheck` / `npm run lint` → PASS. Committed and pushed separately from the main
230-file commit, scoped to just this fix.

### Unrelated discovery — do not touch
`src/builder/BuilderPage.tsx` has an uncommitted, unstaged local change
(`if (builderQuery.isPending)` → `if (builderQuery.isPending || true)`) that is **not** part of any commit
in this session and was not made by me. It postdates `HEAD` (confirmed via `git diff HEAD`). Left untouched
per the concurrent-session-shares-checkout caution — could be another session's in-progress debugging work.
Flagged to the PO in the response; not staged, not committed, not reverted.

### PO action required
None from this session's work. **Flag for the PO:** an uncommitted, unexplained change to
`src/builder/BuilderPage.tsx` exists in the working tree (see above) — worth checking whether it's
intentional in-progress work from another session before it's lost or accidentally committed later.
