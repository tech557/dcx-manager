# docs/releases/

The **operational record of truth** for releases. Markdown (this file, session logs, plan READMEs)
stays the human narrative; `registry.csv` is the machine record CI and `scripts/release/*` read and write
— the same relationship `docs/progress/index.csv` has to session logs.

## Files

| Path | Role | Writer |
|---|---|---|
| `registry.csv` | One row per build/version event. Append-only. | `scripts/release/append-release-row.sh` (the only writer) |
| `approvals/<version>-<env>.md` | The promotion-gate artifact: a recorded PO approval. Never edited after sign-off — a correction is a new file. | written when the PO approves a version for an environment (RG-R6/RG-R8) |

## `registry.csv` schema

```
version, change_class, commit_sha, branch, session_folder, clickup_task,
deployment_id, preview_url, staging_url, production_url,
status, approved_for, approved_by, approved_at, gates, notes
```

| Column | Meaning |
|---|---|
| `version` | 4-part version this row stamps |
| `change_class` | `source` / `non-source` (classifier) |
| `commit_sha` | exact commit (immutable build identity) |
| `branch` / `session_folder` | provenance — ties to the owning session |
| `clickup_task` | linked ClickUp release task id |
| `deployment_id` | Vercel deployment id (the promotable artifact) |
| `preview_url` / `staging_url` / `production_url` | link map; staging/prod filled only on approval |
| `status` | `reserved` → `building` → `verified` → `failed` → `promoted-staging` → `promoted-prod` |
| `approved_for` / `approved_by` / `approved_at` | the recorded PO approval (the gate) |
| `gates` | `typecheck=PASS;lint=PASS;...` snapshot |
| `notes` | free text / related work |

Each log entry links to its registry row by `version` — the join key between human logs and the
operational record.

## Scripts (`scripts/release/`)

| Script | Contract |
|---|---|
| `classify-change.sh <base> <head>` | Reads the diff between two refs; emits `source` or `non-source` to stdout per the path-set rule below. Exit 0 always (classification, not validation). |
| `append-release-row.sh <csv-fields...>` | Appends one row to `registry.csv`. **Refuses** (exit 1, no write) if `version` already exists in the file — corrections are a new superseding row, never an edit. |
| `build-release-views.sh` | Regenerates a derived, disposable summary view from `registry.csv` (not authoritative; safe to delete/regenerate). |
| `validate-release-registry.sh [csv-path]` | Fails (exit 1) on: duplicate `version`, two `verified`/`approved` rows for the same `approved_for` env at different `commit_sha`, or a malformed row (wrong column count). |
| `claim-version.sh <version>` | Fallback version reservation for pre-CI / local use: appends a `reserved` row optimistically. The shared CSV makes a double-claim a git conflict (first commit wins; loser re-claims). Superseded once RG-R3 CI merge-time assignment exists. |

### Source vs non-source classification (path-set, authoritative — not the `Type:` log label)

```
A change is SOURCE  ⟺ the diff touches any of:
    src/**, index.html, vite.config.ts, tsconfig*.json, package.json,
    package-lock.json, components.json, eslint.config.js, .dependency-cruiser.cjs
A change is NON-SOURCE ⟺ the diff touches ONLY:
    docs/**, *.md, scripts/**, semgrep/**, .storybook/**, test fixtures, agent config
```

Source → Iteration bump + preview deployment. Non-source → Revision bump + no preview.

### Dogfood fixtures (RG-R7 only)

`dogfood/source-probe.txt` is an explicit allowlist entry the classifier treats as `source` (without
touching real product `src/**`); `dogfood/doc-probe.txt` stays `non-source`. These exist solely so RG-R7
can exercise both classification paths end-to-end. Do not treat either file as product code.

## Vercel deploy skipping (RG-R7)

`vercel.json`'s `ignoreCommand` runs `scripts/release/vercel-ignore-build.sh` on every push: a
non-source change (per the same path-set above) genuinely produces **no Vercel deployment** — not just
no `preview_url` in the registry. Classification uses `HEAD~1` (the immediate parent commit), never
Vercel's own `VERCEL_GIT_PREVIOUS_SHA` — that value tracks Vercel's last *successful* deploy per branch,
which can lag behind the actual git history after an intermediate build fails or is canceled, causing the
two classifiers to disagree (a real bug found live 2026-07-01). `HEAD~1` matches
`version-assign.yml`'s `github.event.before` semantics exactly, so both systems agree by construction.

## Friendly per-version alias (RG-R8)

Each version gets a human-readable Vercel alias, e.g. `dcx-manager-gov-v0-4-1-0.vercel.app`, pointing at
that version's exact `preview_url` — so the version number is visible directly in the Vercel
dashboard/URL bar, not only by cross-referencing `registry.csv`.

- **Automatic**: `.github/workflows/record-preview.yml` creates the alias right after patching
  `preview_url`, using a `VERCEL_TOKEN` repository secret (PO-added — no MCP/CLI path exists to mint a
  CI-scoped token; the PO's own classic personal access token is used directly). If the secret is
  absent, this step logs and skips without failing the job.
- **Manual/backfill**: `scripts/release/alias-preview.sh <version>` does the same thing using an
  already-authenticated local Vercel CLI session — use this to backfill versions stamped before the
  secret existed, or when running locally.

## Promotion (RG-R4+)

A build is promoted to Staging or Production **only** via `scripts/release/promote.sh` (not yet built —
RG-R4), and only after a recorded PO approval (`approvals/<version>-<env>.md`). No script in this
directory moves a stable alias; `registry.csv` only records state.
