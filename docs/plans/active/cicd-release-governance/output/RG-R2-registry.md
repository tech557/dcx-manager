---
sprint: RG-R2
plan: cicd-release-governance
date: 2026-07-01
agent: Claude (claude-sonnet-5, Anthropic)
status: complete
---

# RG-R2 — Release registry + scripts

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-CSV-012, REQ-RG-MD-013, REQ-RG-MAP-016, REQ-RG-ITER-008, REQ-RG-REV-009, REQ-RG-AUTO-019 — approved, canonical graph nodes, PO-locked 2026-06-30 |
| Acceptance IDs | AC-RG-2-1 … AC-RG-2-7 — all PASS (see below) |
| Verification (EVD) | `scripts/release/tests/run-tests.sh` — 10/10 PASS (counts from script output, not hand-typed) |

## Schema recap (`docs/releases/registry.csv`)
```
version, change_class, commit_sha, branch, session_folder, clickup_task,
deployment_id, preview_url, staging_url, production_url,
status, approved_for, approved_by, approved_at, gates, notes
```
Full column meanings: `docs/releases/README.md`.

## Script contracts

| Script | Input | Output | Exit codes |
|---|---|---|---|
| `classify-change.sh <base> <head>` | two git refs | `source` or `non-source` on stdout | always 0 (classification, not validation) |
| `append-release-row.sh <16 positional fields>` | exact registry column values | appends one CSV row | 0 = appended; 1 = refused (duplicate version) or usage error |
| `build-release-views.sh` | none (reads `registry.csv`) | writes `docs/releases/registry-view.md` | 0 = wrote view; 1 = registry missing |
| `validate-release-registry.sh [csv-path]` | optional path (defaults to `docs/releases/registry.csv`) | prints PASS/FAIL + each issue | 0 = valid; 1 = duplicate version / conflicting verified rows / malformed row |
| `claim-version.sh <version>` | a version string | thin wrapper appending a `reserved` row via `append-release-row.sh` | same as `append-release-row.sh` |

## Test results (fallback harness — `bats` not installed, core.md §28)

```
$ bash scripts/release/tests/run-tests.sh
=== classify-change.sh ===
  PASS: src/ diff classifies as source
  PASS: docs/ diff classifies as non-source

=== append-release-row.sh / validate-release-registry.sh ===
  PASS: happy-path append succeeds (exit 0)
  PASS: exactly one data row after happy-path append
  PASS: duplicate-version append is refused (exit 1)
  PASS: row count unchanged after refused duplicate
  PASS: validator passes a clean registry (exit 0)
  PASS: validator rejects a seeded duplicate version (exit 1)

=== idempotence (core.md §36b) ===
  PASS: build-release-views.sh is idempotent on an unchanged registry

=== no absolute/home paths (AC-RG-2-5) ===
  PASS: no absolute/home paths in scripts/release/*.sh

=== Summary ===
PASS: 10
FAIL: 0
```

All test fixtures use disposable `mktemp -d` scratch repos/CSVs — none touch the real
`docs/releases/registry.csv` or product `src/**`.

## Notable design decisions / limitations

- **CSV quoting:** `append-release-row.sh` double-quotes every field (escaping embedded `"` as `""`).
  The header row itself is unquoted plain text. `validate-release-registry.sh` and
  `build-release-views.sh` strip surrounding quotes when reading. **Known limitation:** the column-count
  check in `validate-release-registry.sh` splits naively on `,`, so a quoted field containing a literal
  comma would miscount columns — acceptable for this v0 (no script-generated field currently contains a
  comma); flagged here for RG-R3/RG-R4 if `notes`/free-text fields start containing commas in practice.
- **`classify-change.sh` runs in the caller's cwd**, not its own script location's repo — this was a bug
  found and fixed during this sprint's own test run (it originally forced `cd` into the dcx-manager repo
  root, which broke when tests pointed it at a disposable throwaway git repo). Fixed before close; see
  Files touched.
- `dogfood/source-probe.txt` and `dogfood/doc-probe.txt` created per the sprint spec, for RG-R7's
  exclusive use — not exercised by this sprint's own tests (those use synthetic `src/`/`docs/` files in a
  disposable repo instead, to avoid creating noise commits in the real repo before RG-R7).

## Acceptance criteria

| ID | Criterion | Verification | Verdict |
|---|---|---|---|
| AC-RG-2-1 | `registry.csv` exists with the exact §3.6 columns | `head -1 docs/releases/registry.csv` matches schema | PASS |
| AC-RG-2-2 | classifier returns `source` for `src/` diff, `non-source` for `docs/` diff | test harness, both cases | PASS |
| AC-RG-2-3 | append-only writer adds a row, refuses to edit existing | test harness asserts refusal + unchanged row count | PASS |
| AC-RG-2-4 | validator rejects a seeded duplicate version | test harness, exit 1 | PASS |
| AC-RG-2-5 | no absolute/home paths in any script | `grep -rn '/Users/\|/home/' scripts/release` → empty | PASS |
| AC-RG-2-6 | scripts idempotent (re-run = no-op/clean) | `build-release-views.sh` run twice, identical output | PASS |
| AC-RG-2-7 | no `src/**` changed | `find src -type f -exec shasum` pre/post diff empty | PASS |

## Gates

| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| shell tests | PASS — `scripts/release/tests/run-tests.sh` exits 0, 10/10 |
| validate:architecture/typecheck | N/A — no TS source changed |
| `bash scripts/verify.sh` | PASS — "verify passed" |
