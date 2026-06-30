---
sprint: RG-R3
plan: cicd-release-governance
date: 2026-07-01
agent: Claude (claude-sonnet-5, Anthropic)
status: complete (CI verified live); branch protection BLOCKED — PO applies in GitHub UI
---

# RG-R3 — GitHub CI wiring

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PREVIEW-001, REQ-RG-NOPREVIEW-002, REQ-RG-ITER-008, REQ-RG-REV-009, REQ-RG-OWN-007, REQ-RG-SEED-017, REQ-RG-CONC-014 — approved, canonical graph nodes, PO-locked 2026-06-30 |
| Acceptance IDs | AC-RG-3-1 … AC-RG-3-6 — see status table below |
| Verification (EVD) | live GitHub Actions runs on `tech557/dcx-manager` (public API, no auth needed) — run IDs and conclusions below |

## What was built

### `.github/workflows/ci.yml` (extended, not replaced — RG-R0a found this pre-existing)
- Trigger widened from `branches: [main]` to `branches: [main, staging, integration]` for both `push`
  and `pull_request`, so the gates run on the whole branch model, not just `main`.
- Added a `release registry validate` step (`bash scripts/release/validate-release-registry.sh`) to the
  `frontend` job, after `test`.
- Jobs unchanged otherwise: `requirements` (`req:validate`), `frontend` (typecheck/lint/verify/
  architecture/test/registry-validate), `build` (needs both).

### `.github/workflows/version-assign.yml` (new)
- Triggers on `push` to `integration` only.
- `concurrency: { group: version-assign-integration, cancel-in-progress: false }` — serializes so two
  queued pushes can never compute the same next number (plan §4.2).
- `permissions: contents: write` — **required fix found during live testing** (see "What broke" below).
- Steps: classify the push's diff (`classify-change.sh`) → compute next Iteration/Revision from the
  last registry row (or `docs/VERSION.md` if the registry is still empty) → `append-release-row.sh` →
  commit the updated `registry.csv` with `[skip ci]` (so the bot's own commit doesn't re-trigger).

### `CODEOWNERS` (new, repo root)
- `docs/VERSION.md`, `docs/releases/**`, `.github/workflows/**`, `CODEOWNERS` itself → `@tech557`.
- **Assumption flagged in the file itself:** `@tech557` (repo owner) is treated as the PO's GitHub
  identity; `@MahmoudSamaha2` (the credential cached in this environment) was only ever granted write
  *collaborator* access for pushing, never assumed to be the PO. Correct this in the file if wrong.

## Live verification (real GitHub Actions runs, not simulated)

```
$ curl -s https://api.github.com/repos/tech557/dcx-manager/actions/runs
28480531146  Version assign  integration  push  completed  success
28480531131  CI              integration  push  completed  success
28480421316  Version assign  integration  push  completed  FAILURE  ← first attempt, see below
28480421303  CI              integration  push  completed  success
28480227385  CI              main         push  completed  success
28480160476  CI              main         push  completed  success
```

### What broke, and the fix (real bug, not hypothetical)
The first `version-assign` run (`28480421316`) failed at its **"Commit registry update"** step: `git
push` was rejected because the default `GITHUB_TOKEN` only had read-only `contents` permission. Fixed by
adding an explicit `permissions: contents: write` block to the job — the modern, repo-setting-independent
fix (no need to change the org/repo-wide "Workflow permissions" default). Re-ran clean (`28480531146`):

```
$ git show origin/integration:docs/releases/registry.csv
version,change_class,commit_sha,branch,session_folder,clickup_task,deployment_id,preview_url,staging_url,production_url,status,approved_for,approved_by,approved_at,gates,notes
"v0.3.5.1","non-source","2ec9c440c7a3ec5186e1d295b1cffd6e30f7ddde","integration","ci","","","","","","verified","","","","","stamped by version-assign.yml"
```
`v0.3.5.0` (the RG-R1 bootstrap, non-source class) → `v0.3.5.1` (Revision +1, correct for a non-source
push) — confirms the mechanical increment rule (plan §3.2) is live and correct.

### Honest gap: PR-based test, not a literal PR
The sprint spec asked for "a throwaway test PR" to verify gates run on a PR. **This agent has no `gh`
CLI and no GitHub API write token** — only the git push credential (a collaborator grant for
`@MahmoudSamaha2`), which cannot create a PR via the API. Instead: pushed a feature branch
(`agent/2026-07-01-claude/rg-r3-ci-wiring`), then merged it directly into `integration` via git (push
access was sufficient since branch protection isn't applied yet) rather than via a GitHub PR object.
This verified the **push-triggered** path on `ci.yml`/`version-assign.yml` end-to-end, but did **not**
exercise the **pull_request-triggered** path or a required-status-check gate (there's nothing to gate
yet — branch protection isn't on). **This is a real fallback, not a simulated pass** — flagged here, not
silently upgraded to a full PASS. Once the PO applies branch protection (below) and review is required,
the *next* PR into `integration` will be the first real PR-gated test; recommend treating that as
confirming evidence for AC-RG-3-1 retroactively rather than re-doing a throwaway PR now.

### Process note: prior RG-R0a/RG-R0b/RG-R1/RG-R2 commits landed on `main`, not `integration`
Per the plan's branch model (§2.4), `main` is the production alias — "moved only on approval" — and
`integration` is the working/candidates branch. Before this sprint, RG-R0a–RG-R2 committed directly to
`main` because that was the only branch with content and the CI wiring didn't exist yet to make the
distinction matter. **From this sprint onward, sprint work lands on `integration`**, not `main`. `main`
currently sits at `e48adc7`/`471325a` (RG-R2 + the remote-push doc commit) and should be advanced only via
a future `promote.sh` (RG-R4) PO-approved promotion, not further direct commits. Flagging this so it
isn't silently inconsistent — no corrective action taken on the already-landed `main` commits since
rewriting pushed history is itself risky and out of scope.

### Second bug found, fixed, reverified: VERSION.md drift, then a registry-validator false positive

**Bug 2 — `docs/VERSION.md` drift.** `version-assign.yml` only updated `registry.csv`, not
`docs/VERSION.md`. After the first two live stamps (`v0.3.5.1`, `v0.3.5.2`), `VERSION.md` still read
`v0.3.5.0` — the file most docs/agents actually read as "the version" was stale. Fixed by adding a `sed`
step that syncs `docs/VERSION.md`'s `current` field in the same commit as the registry row (commit
`d2e34ce`).

**Bug 3 — registry validator false positive, caught by the fix above.** The `d2e34ce` push triggered
both workflows; `version-assign` succeeded (stamped `v0.3.5.3`), but `ci.yml`'s new "release registry
validate" step **failed** (run `28480885125`). Root cause: `validate-release-registry.sh`'s "no two
verified/approved rows for the same env" check used `approved_for` as the comparison key without
checking it was non-empty — so two real, legitimate version-assign rows (`v0.3.5.1`, `v0.3.5.2`, both
`status=verified`, both `approved_for=""`, i.e. unapproved candidate builds) were flagged as
"conflicting" with each other, which they are not: only rows that actually target an environment can
conflict. Fixed in `scripts/release/validate-release-registry.sh` (skip the check when `approved_for` is
empty) and added a regression test (`scripts/release/tests/run-tests.sh`, now 11/11) reproducing this
exact shape so it can't silently regress. Pushed as `5eaf1e8`; reverified fully green:

```
28481045127  CI              integration  push  success
28481045117  Version assign  integration  push  success
```

Current live state after all four real stamps:
```
$ git show origin/integration:docs/releases/registry.csv
v0.3.5.0 (RG-R1 bootstrap) → v0.3.5.1 → v0.3.5.2 → v0.3.5.3 → v0.3.5.4
$ git show origin/integration:docs/VERSION.md | grep '| current |'
| current | `v0.3.5.4` |
```
`registry.csv` and `VERSION.md` now agree — both real, both live, no manual edits after the fix.

**Pattern across all three bugs found this sprint:** every one was caught because the verification was
*live* (real Actions runs against a real public repo), not simulated. A claimed-PASS without this would
have shipped a read-only token, a stale VERSION.md, and a validator that breaks the very pipeline it's
meant to gate.

## Branch protection settings — PO applies in GitHub UI (not agent-executable)

For each of `main`, `staging`, `integration` (Settings → Branches → Add branch protection rule):

| Setting | Value |
|---|---|
| Require a pull request before merging | ✅ |
| Require approvals | 1 |
| Require review from Code Owners | ✅ (uses the new `CODEOWNERS` file) |
| Require status checks to pass before merging | ✅ — select: `Requirements graph`, `Frontend gates`, `Build` (and, for `integration` only, `Assign version + append registry row` once it has run at least once on a PR so GitHub offers it in the picker) |
| Require branches to be up to date before merging | ✅ |
| Include administrators | ✅ (recommended — no bypass even for repo admins) |
| Restrict who can push to matching branches | optional — redundant once "require PR" is on, but adds defense-in-depth |

## Acceptance criteria

| ID | Criterion | Verdict |
|---|---|---|
| AC-RG-3-1 | Gates run on a PR | **PARTIAL** — gates verified on push-triggered CI (real, live), not a literal PR (see "Honest gap" above); no `gh`/API write credential available |
| AC-RG-3-2 | Merge to integration assigns the next version (serialized) | **PASS** — `v0.3.5.0 → v0.3.5.1`, live registry row, real commit |
| AC-RG-3-3 | `concurrency:` serializes version-assign (no double-stamp) | **PASS by design, not load-tested** — `concurrency: { group: ..., cancel-in-progress: false }` guarantees GitHub Actions queues a second run rather than running both jobs in parallel; a genuine two-simultaneous-merge race was not staged live (would require deliberately racing two pushes, judged not worth the risk/cost for this sprint) |
| AC-RG-3-4 | CODEOWNERS protects PO-only files | **BLOCKED** — file exists and is correct in shape; takes effect only once branch protection's "Require review from Code Owners" is enabled (PO action, see table above) |
| AC-RG-3-5 | Branch protection blocks direct push to main/staging/integration | **BLOCKED** — documented exact settings above; PO must apply in GitHub UI, not agent-executable |
| AC-RG-3-6 | no `src/**` changed | **PASS** — `find src -type f -exec shasum` pre/post diff empty |

## Gates

| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| CI green on test (push, not PR) | PASS — final state: runs `28481045127`/`28481045117` both `success`, after 3 bugs found+fixed live (read-only token, VERSION.md drift, validator false positive) |
| browser | N/A for this evidence path — verification was via the public GitHub REST API (`curl`), not a browser; no PR UI existed to screenshot since no PR was opened (see "Honest gap") |
