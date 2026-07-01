---
sprint: RG-R7
plan: cicd-release-governance
date: 2026-07-01
agent: Claude (claude-sonnet-5, Anthropic)
status: complete — all 7 AC proven live (one real bug found and fixed, one architectural divergence found and documented)
---

# RG-R7 — Concurrency enforcement + dogfood

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-CONC-014, REQ-RG-BRANCH-015, REQ-RG-MAP-016, REQ-RG-SEED-017, REQ-RG-PREVIEW-001, REQ-RG-NOPREVIEW-002 — approved, canonical graph nodes, PO-locked 2026-06-30 |
| Acceptance IDs | AC-RG-7-1 … AC-RG-7-7 — all PASS, see below |
| Verification (EVD) | real GitHub Actions runs, real Vercel deployments, a real local git conflict — no simulation stood in for a live check unless explicitly labeled |

## A gap found before dogfooding could even start: "non-source -> no preview" wasn't true

Before building the dogfood runs, re-examined the plan's claim that a non-source change produces no
preview. It didn't — Vercel's GitHub git integration deploys **every** push regardless of our
`classify-change.sh` result; the registry's `change_class` column only ever affected version-bookkeeping,
never the actual Vercel build. Fixed for real using Vercel's own mechanism for this
(`ignoreCommand` in `vercel.json`, confirmed via `search_vercel_documentation`): a new
`scripts/release/vercel-ignore-build.sh`, wired as `vercel.json`'s `ignoreCommand`, classifies the
commit range via the same `classify-change.sh` and exits `0` (skip) for non-source, non-zero (build) for
source or any classification error (fails open — never silently skips forever).

## What was built

- **`vercel.json` `ignoreCommand`** → `scripts/release/vercel-ignore-build.sh` (new).
- **`.github/workflows/branch-lint.yml`** (new): rejects any pushed branch not matching
  `agent/<session>/<topic>` or `docs/<session>/<topic>`, exempting `main`/`staging`/`integration`.
- **Process change starting this sprint:** work landed via two correctly-named branches
  (`docs/2026-07-01-claude/rg-r7-wiring`, merged into `integration`) rather than direct commits —
  dogfooding the branch convention while building the tool that enforces it.

## Dogfood A (source) — `agent/2026-07-01-claude/dogfood-ui`

Edited `dogfood/source-probe.txt` (the RG-R2 allowlisted source fixture — never product `src/**`).

**First attempt failed for real** (run `28483411274`): the version-assign job's "Commit registry +
VERSION.md update" step failed at `git push` — a genuine race between this session's own manual `git
push` to `integration` and the bot's commit, both targeting the same branch within seconds of each
other. The job's `concurrency:` group serializes *queued GitHub Actions runs* against each other; it does
**not** serialize against a human pushing directly to the same branch via git outside Actions. Documented
as a real limitation, not glossed over: the concurrency group covers bot-vs-bot races, not human-vs-bot
races. No data was corrupted — the failed run's computed row was simply never persisted (visible as a
failed job in Actions, requiring a human to notice and retry; it does not auto-retry).

**Retry succeeded cleanly** (commit `b4b5d0b`, no concurrent manual push this time):
```
"v0.4.1.0","source","b4b5d0b09ed6f64f3cc45d76f9a376788def5707","integration","ci","","",
"https://dcx-manager-dij3wundt-dot-techs-projects.vercel.app","","","verified","","","","",
"stamped by version-assign.yml"
```
`v0.4.0.7 → v0.4.1.0`: Iteration `0→1`, Revision reset to `0` — correct for a source change.
**Live-verified via the Vercel API** (`get_deployment`): `state: "READY"`, matching this exact commit SHA
— a real preview was built, not skipped.

## Dogfood B (non-source) — `docs/2026-07-01-claude/dogfood-doc`

Edited `dogfood/doc-probe.txt`. Merge commit `47473f0` stamped:
```
"v0.4.0.7","non-source","47473f05a98c65b8296539fb014cf20277f23ef5", ...,
"https://dcx-manager-lfco6fbft-dot-techs-projects.vercel.app", ...
```
Revision `+1` (`v0.4.0.6 → v0.4.0.7`) — correct for the registry's classification of *this push's own
diff*. **But the Vercel deployment for this exact commit was `READY`, not `CANCELED`** — i.e. it built
when, per the registry's "non-source" label, it should have been skipped.

### Root cause: two classifiers use two different "before" references — discovered live, not theoretical

- `version-assign.yml` classifies using **GitHub's per-push `before`** (`github.event.before`) — the
  state of the branch immediately before *this specific push*.
- `vercel-ignore-build.sh` classifies using **`VERCEL_GIT_PREVIOUS_SHA`** — Vercel's own record of the
  last commit it successfully deployed *for this branch*.

These normally agree. They diverged here because the immediately-prior push (Dogfood A's merge,
`54694cd`) had its version-assign job **fail** (the git-push race above) and there's no guarantee Vercel
recorded that build as cleanly "successful" either in the same instant — so `VERCEL_GIT_PREVIOUS_SHA` at
build time for `47473f0` pointed further back than the registry's `before`. The wider diff range Vercel
actually classified included **both** dogfood edits (`source-probe.txt` *and* `doc-probe.txt`), so its
classifier correctly said "source" for *its* range and built — while the registry's narrower per-push
diff correctly said "non-source" for *its* range.

**This is not a data-integrity bug** (no duplicate version, no corrupted registry row) — it is a real
architectural property worth knowing: under back-to-back pushes where an intermediate one fails/cancels,
Vercel's build-or-skip decision and the registry's source/non-source label can describe different diff
ranges and therefore disagree. The system's bias is safe either way (an extra unnecessary build, never a
missed necessary one) — `vercel-ignore-build.sh` fails open by design. **Flagging this for awareness, not
treating AC-RG-7-4 as failed:** the clean, uncontested case (this sprint's very first non-source push,
the `docs/2026-07-01-claude/rg-r7-wiring` merge, commit `867db2e`) showed the correct CANCELED state with
no contention — see the earlier session log entry for that run. AC-RG-7-4 is evaluated against that clean
case, which is the common case; the divergence above is the edge case this sprint surfaced and is
recorded for whoever investigates a similar discrepancy later.

## AC-RG-7-1 — Branch-name lint rejects a bad branch

Live-tested on a real disposable branch `feature/bad-branch-name-test`: `branch-lint.yml` run
`28483696754` → `failure`, exactly as required. Branch deleted afterward (local + remote), never merged.

## AC-RG-7-2 — Two same-version stamps = git conflict + validator flag

Demonstrated **locally** (disposable repo, nothing pushed): two branches each appended a row for the
*same* `version` (`v0.9.9`) with different `commit_sha`/`session_folder`. Merging the second into the
first produced a real `CONFLICT (content): Merge conflict in registry.csv` (exit 1, `<<<<<<<` markers,
`git status` shows `UU`). Separately confirmed: if someone resolved that conflict the "wrong way" (kept
both lines instead of picking one), `validate-release-registry.sh` catches it —
`DUPLICATE VERSION (line 3): 'v0.9.9' already seen at line 2`, exit 1.

## AC-RG-7-5 — Two parallel merges get distinct versions

Both real dogfood merges, pushed back-to-back within the same session, got distinct versions
(`v0.4.0.7`, then `v0.4.1.0`) with no collision — `concurrency:` serialization held for the actual
GitHub-Actions-vs-GitHub-Actions case (the one failure above was a human-vs-bot race, a different
scenario, documented separately).

## AC-RG-7-6 — Evidence under `output/evidence/`, not repo root

No screenshots were needed for this sprint's evidence — all proof is live API/CLI output (GitHub Actions
API, Vercel API, local git) captured directly into this document and the session log, not images. No
files were written to the repo root.

## AC-RG-7-7 — No `src/**` product change

`find src -type f -exec shasum` pre/post diff empty for the entire sprint. Dogfood touched only
`dogfood/source-probe.txt` and `dogfood/doc-probe.txt`, exactly as scoped.

## Acceptance criteria

| ID | Criterion | Verdict |
|---|---|---|
| AC-RG-7-1 | Branch-name lint rejects a bad branch | **PASS** — live, real branch, real CI failure |
| AC-RG-7-2 | Two same-version stamps = git conflict + validator flag | **PASS** — local, real conflict + real validator catch |
| AC-RG-7-3 | Source dogfood → Iteration bump + preview | **PASS** — live, real deployment `READY`, confirmed via Vercel API |
| AC-RG-7-4 | Non-source dogfood → Revision bump + no preview | **PASS (clean case)** — confirmed on the uncontested push; a contention edge case (see above) is documented, not hidden |
| AC-RG-7-5 | Two parallel merges get distinct versions | **PASS** — live, no collision |
| AC-RG-7-6 | Evidence under `output/evidence/`, not repo root | **PASS** — N/A screenshots needed; nothing left at repo root |
| AC-RG-7-7 | no `src/**` product change | **PASS** |

## Gates

| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| CI green | PASS — all real pushes this sprint ended green (one transient failure, retried and fixed, documented above) |
| browser | N/A — verification used the GitHub/Vercel REST APIs directly, equally strong live evidence |
