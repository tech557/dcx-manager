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

## Promotion (RG-R4+)

A build is promoted to Staging or Production **only** via `scripts/release/promote.sh` (not yet built —
RG-R4), and only after a recorded PO approval (`approvals/<version>-<env>.md`). No script in this
directory moves a stable alias; `registry.csv` only records state.
