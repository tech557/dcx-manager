## Standalone fix — quote-aware CSV parsing across scripts/release/*
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: mixed
Status: Completed
PO-Action: none
Version: v0.4.0.3
Change-Class: non-source

Intent: Fix a real, live production CI failure (not part of a named RG sprint — found mid-session
while checking on the RG-R5 close-out push) before continuing to RG-R6, since a broken `integration`
branch blocks every subsequent sprint's CI evidence.
Trigger: GitHub Actions run `28482563902` ("CI" on `integration`) failed at the "release registry
validate" step. Root cause: `validate-release-registry.sh`'s naive `awk -F','` split miscounted columns
on the `v0.4.0.0` row, whose `approved_by` field (`"PO (Mahmoud, tech@dotment.com)"`, recorded during the
RG-R4 promotion test) contains a literal comma. This exact risk was flagged — but not fixed — as a known
limitation in RG-R2's output doc.
Requirements covered: REQ-RG-CSV-012 (registry integrity).

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | `scripts/release/validate-release-registry.sh` | replaced `-F','` with a quote-aware `csv_split()` awk function | full rewrite, ~70 |
| edited | `scripts/release/build-release-views.sh` | same fix | full rewrite, ~40 |
| edited | `scripts/release/append-release-row.sh` | duplicate-version check now quote-aware | full rewrite, ~65 |
| edited | `scripts/release/patch-release-row.sh` | quote-aware read+rewrite of the matched row | full rewrite, ~70 |
| edited | `scripts/release/promote.sh` | `field()`/`row_for_version()`/rollback-lookup now quote-aware (shared `CSV_SPLIT_FN` string) | ~40 changed |
| edited | `scripts/release/tests/run-tests.sh` | 9 new regression tests covering commas in `approved_by`/`notes` across append, validate, patch, and view-generation | +35 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — this corrects a latent bug, not prior intentional work |
| Preserve-semantic (§9) | N/A — no `src/**` touched |
| Open decisions used (⏱) | None |

### Acceptance criteria
N/A — not a sprint task; a defect fix. Verification is the gates below.

### Gates
| Gate | Result |
|---|---|
| no-`src/**` proof | PASS — `find src -type f -exec shasum` pre/post diff empty |
| `scripts/release/tests/run-tests.sh` | PASS — 35/35 (was 26/26) |
| Real registry re-validated | PASS — `bash scripts/release/validate-release-registry.sh docs/releases/registry.csv` → "PASS: registry is valid." (was FAIL before this fix) |
| `promote.sh` refusal path against real data | PASS — re-tested against `v0.3.5.8` (unapproved), correctly refused, after the rewrite |
| Live GitHub Actions | PASS — `28482795961` (CI) and `28482795964` (version-assign) both `success` on the fix commit `bc18e4b`; registry continued stamping correctly afterward (`v0.4.0.1` → `v0.4.0.3`) |
| `bash scripts/verify.sh` | PASS |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | Fully fixed and live-verified | — |

### Consumer updates required
None — all consumers of these scripts (CI workflows, `promote.sh` callers) get the fix automatically;
no call-site changes needed.

### Open issues / follow-ups
- Returning to RG-R6 (ClickUp release board + GAS sink) next.
