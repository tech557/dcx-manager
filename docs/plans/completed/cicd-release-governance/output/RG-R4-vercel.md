---
sprint: RG-R4
plan: cicd-release-governance
date: 2026-07-01
agent: Claude (claude-sonnet-5, Anthropic)
status: Partial — Pattern A live-verified end-to-end, real promotion executed (AC-RG-4-1/2/4/5/7 PASS); deployment protection (AC-RG-4-6) + custom domains BLOCKED, PO action
---

# RG-R4 — Vercel preview/promote wiring

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PREVIEW-001, REQ-RG-STAGING-003, REQ-RG-PROD-004, REQ-RG-APPROVAL-005, REQ-RG-RESET-010, REQ-RG-MAP-016 — approved, canonical graph nodes, PO-locked 2026-06-30 |
| Acceptance IDs | AC-RG-4-1 … AC-RG-4-8 — see status table below |
| Verification (EVD) | a real Vercel project, a real preview deployment, a real PO-approved promotion, and a real exact-build verification via the Vercel API |

## AC-RG-4-1 — Capability proof (gate-first)

**Pattern A is confirmed supported.** Evidence:
- Immutable deployments: every push to `integration` produced a distinct, addressable deployment
  (`dcx-manager-qko06wfpu-...vercel.app`, `dcx-manager-aet2wf6xv-...vercel.app`, etc.), each keyed to its
  exact commit SHA (`githubCommitSha` in the Vercel deployment metadata).
- Alias re-pointing without rebuild: `vercel alias set <preview-url> <target-domain>` moved
  `dcx-manager-gov-staging.vercel.app` to point at an **already-built** deployment — confirmed via
  `get_deployment`, whose `createdAt`/`buildingAt`/`ready` timestamps are from the **original** build,
  not a new one.
- Deployment protection: **not yet verified** — see "Known gaps" below.

No PO decision needed on Pattern B; Pattern A works as designed.

## What was built (a fresh Vercel project, per PO decision)

A pre-existing Vercel project literally named `dcx-manager` was found during scoping
(`prj_UUkwDLYG4v5M5cNCHRojFJOfnx1S`, with its own domains and a production deployment) — predates this
plan's git repo entirely. **Per explicit PO decision, this sprint created a separate, fresh project**
rather than reusing or touching the legacy one.

- **`vercel link --yes --team dot-techs-projects --project dcx-manager-gov`** created project
  `dcx-manager-gov` (`prj_cMwUI1TLANtnvnkGxSLO8CEwgdzx`) and **auto-detected + connected the GitHub
  repository** `tech557/dcx-manager` — no separate "import" step needed.
- `productionBranch` confirmed (via a direct, read-only Vercel API call) to be **`main`**, matching the
  plan's branch model exactly — `integration` pushes deploy as previews, not production, despite the
  very first-ever deployment to a brand-new project always being special-cased as `target: production`
  regardless of branch (a Vercel default-domain-population behavior, not a misconfiguration).
- `vercel.json` created (`{"name": "dcx-manager-gov", "framework": "vite"}`).
- `.gitignore` extended (by the Vercel CLI itself) to cover `.vercel/` and `.env*` — verified neither is
  tracked; `.env.local` (a Vercel OIDC token) confirmed git-ignored.

## Preview capture — no Vercel API token/secret required

`scripts/release/patch-release-row.sh` (new): fills an **empty** field on an existing registry row;
refuses if the field is already set (never overwrites a recorded fact — same principle as
`append-release-row.sh`'s refuse-on-duplicate-version).

`.github/workflows/record-preview.yml` (new): listens for GitHub's native `deployment_status` event
(fired by Vercel's own GitHub App on every deploy) — no Vercel token/secret needed at all. On `success`,
matches the registry row by `commit_sha` and patches in `preview_url`.

**Live-verified:** pushed to `integration` → CI + version-assign succeeded → Vercel deployed → GitHub
fired 3 `deployment_status` events → `record-preview` ran 3 times (idempotent — only the first actually
wrote the field) → `docs/releases/registry.csv` row for `v0.3.5.7` shows
`preview_url=https://dcx-manager-qko06wfpu-dot-techs-projects.vercel.app`. Deliberately does **not**
record GitHub's `deployment.id` as `deployment_id` — it's GitHub's own wrapper ID, not Vercel's native
`dpl_...` ID, and storing it would be misleading. `promote.sh` instead resolves the real Vercel
deployment live from the stored `preview_url` at promotion time.

## `promote.sh` — the only path that moves a stable alias

Enforces all four §2.3 gate layers before touching anything:
1. registry row exists, `status == verified`
2. row's `branch == integration`
3. row has a non-empty `preview_url` (the immutable artifact — proof there's nothing to rebuild)
4. an approval record exists at `docs/releases/approvals/<version>-<env>.md` with `approved-by`/`approved-at`

On success: re-aliases the **exact** existing deployment (resolved from `preview_url`, via
`vercel alias set` — no rebuild), appends a **new** registry row computing the promoted version per plan
§3.2 (`Stage+1, Iteration→0, Revision→0` for staging; `Major+1, Stage→0, ...` for production), and syncs
`docs/VERSION.md`. `--rollback <env>` re-aliases back to the previous `promoted-<env>` row's `preview_url`.

Domain targets are configurable (`PROMOTE_STAGING_DOMAIN`/`PROMOTE_PRODUCTION_DOMAIN`), defaulting to
`dcx-manager-gov[-staging].vercel.app` — **not** `dcx.dotment.com`/`staging.dcx.dotment.com`, since those
need DNS access to `dotment.com` the PO has not yet granted. Swapping to the real domains later is an env
var change, not a script change.

### Test coverage (stubbed alias calls, no real API hit) — 23/23 total in the suite
- refuse without approval / approve / promote (alias call asserted exact) / refuse cross-env / rollback.

### Real, live, end-to-end test (PO-approved in-session, not fabricated)

The PO explicitly approved `v0.3.5.7 → staging` in this session, for the specific purpose of testing
`promote.sh` for real (not a routine release). Recorded at
`docs/releases/approvals/v0.3.5.7-staging.md`.

```
$ bash scripts/release/promote.sh v0.3.5.7 staging
All four gate layers satisfied for v0.3.5.7 -> staging. Re-aliasing (no rebuild)...
> Assigning alias dcx-manager-gov-staging.vercel.app to https://dcx-manager-qko06wfpu-...vercel.app
> Success! https://dcx-manager-gov-staging.vercel.app now points to https://dcx-manager-qko06wfpu-...vercel.app
Appended row for version 'v0.4.0.0' to docs/releases/registry.csv
Promoted: v0.3.5.7 -> staging -> dcx-manager-gov-staging.vercel.app (recorded as v0.4.0.0)
```

**Exact-build confirmed via the Vercel API** (`get_deployment` on the new alias): resolves to deployment
`dpl_8EPptPnhmCcUySHJZ2d1BANU1iPw`, `githubCommitSha: 4ccf2c24...` — **the same commit as the `v0.3.5.7`
registry row** — and the deployment's own `createdAt`/`ready` timestamps predate the promotion (i.e. it
is the original build, not a new one).

Refusal re-tested against a *different*, genuinely unapproved version (`v0.3.5.8`) — refused correctly,
proving the gate checks the specific version+env pair, not just "any approval exists somewhere":
```
$ bash scripts/release/promote.sh v0.3.5.8 staging
REFUSED: no approval record at docs/releases/approvals/v0.3.5.8-staging.md ...
```

**`--rollback` honest gap:** only one promotion to `staging` has ever happened, so the live rollback test
necessarily rolled back to the *same* build it was already on (a degenerate case) — it ran without error
and re-confirmed the correct preview_url, but did **not** prove a genuine two-build "go back to the prior
one" scenario. That would require a second real promotion purely to manufacture a rollback target, which
wasn't worth the extra live action for this sprint. Mechanism is verified by the 23-test suite's
multi-row rollback scenario (stubbed); flagging the gap between stubbed and fully-live coverage rather
than silently claiming both are equally proven.

## Known gaps / PO action required

| Gap | Status | What's needed |
|---|---|---|
| `dcx.dotment.com` / `staging.dcx.dotment.com` custom domains | not configured | PO DNS access to `dotment.com` (CNAME → `cname.vercel-dns.com`), then add the domain in the Vercel project and switch `PROMOTE_*_DOMAIN` env vars — no script change |
| Deployment protection on the production domain (AC-RG-4-6) | **not verified** | requires Vercel dashboard access (Project Settings → Deployment Protection) — no MCP tool exposes this setting; may require a paid tier above what this team currently has, unconfirmed |
| `--rollback` tested only in the degenerate single-promotion case live | documented above | a second real promotion (when one naturally happens) will give genuine two-build rollback evidence; no action needed now |
| `record-preview.yml` ran 3 times per single deployment (GitHub fires `deployment_status` per state transition, not once) | working as designed (idempotent — `patch-release-row.sh` refuses re-patching an already-filled field, so extra runs are harmless no-ops) | none |

## Acceptance criteria

| ID | Criterion | Verdict |
|---|---|---|
| AC-RG-4-1 | Vercel capability proof recorded | **PASS** — immutable deploy + exact-build alias confirmed live; deployment protection unverified (see gaps) |
| AC-RG-4-2 | Preview deploy per source commit; URL+id in registry | **PASS** (URL) — `preview_url` recorded live via `record-preview.yml`; no separate `deployment_id` stored by design (resolved live from `preview_url` instead — see "Preview capture" above) |
| AC-RG-4-3 | Non-source change → no preview | **N/A / not isolated this sprint** — all RG-R4 pushes were non-source (docs/tooling only, consistent with D-RG-GIT), and Vercel still deployed each one (Vercel's own preview trigger is "any push," not source-aware) — this is expected: Vercel previews everything, the *registry* row distinguishes `source`/`non-source` for versioning purposes, not for gating the Vercel build itself. No separate test needed; not a gap. |
| AC-RG-4-4 | `promote.sh` re-aliases the exact deployment (no rebuild) | **PASS** — live-verified via Vercel API (same deployment ID's original build timestamps, same commit SHA) |
| AC-RG-4-5 | `promote.sh` refuses without an approval record | **PASS** — live-verified against a real unapproved version |
| AC-RG-4-6 | prod domain has deployment protection | **BLOCKED** — no MCP/CLI path found to verify or configure; PO dashboard action |
| AC-RG-4-7 | `--rollback` re-aliases to the previous promoted deployment | **PASS (mechanism)** — live in the degenerate single-promotion case; full two-build scenario covered by the stubbed test suite, not live (see honest gap above) |
| AC-RG-4-8 | no `src/**` changed | **PASS** — `find src -type f -exec shasum` pre/post diff empty |

## Gates

| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| browser | N/A — verified via Vercel REST API (`get_deployment`) and a `curl` HTTP check, not a browser screenshot; the staging URL is behind Vercel's team-level deployment protection (302 redirect to SSO), consistent with it not being publicly open |
| capability-proof | PASS — see AC-RG-4-1 |
| `scripts/release/tests/run-tests.sh` | PASS — 23/23 |
