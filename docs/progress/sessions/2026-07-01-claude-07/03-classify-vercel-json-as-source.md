## Add vercel.json to release classifier's source allowlist
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
Status: Completed
PO-Action: none
Version: v1.1.1.2
Change-Class: non-source

Intent: Close a release-governance gap discovered while chasing why the prior vercel.json SPA-rewrite fix (see `01-user-request-404-on-refresh.md`) never produced a Vercel preview.
Trigger: User — "it didnt show up and u should have accexs to vercel" → investigated via Vercel MCP `list_deployments`, found the build for commit `716031c` was auto-CANCELED by `vercel.json`'s own `ignoreCommand` (`scripts/release/vercel-ignore-build.sh`), because `classify-change.sh` classified a `vercel.json`-only diff as `non-source`. User then confirmed: "ok add it to clasifer".
Requirements covered: None (release-governance script fix, not tied to a tracked requirement ID)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | scripts/release/classify-change.sh | Added `vercel\.json$` to `SOURCE_PATTERN` so any future vercel.json-only change (routing/rewrites/headers — production-behavior-affecting) is classified `source` and triggers a real Vercel build instead of being silently skipped | 1 (was 1) |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | Additive-only regex alternation; no existing pattern branch changed |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| vercel.json changes now classify as `source` | PASS |
| No existing classify-change.sh / vercel-ignore-build.sh test broken | PASS |

### Gates
| Gate | Result |
|---|---|
| typecheck | N/A (bash script only) |
| verify.sh | N/A |
| validate:architecture | N/A |
| test | N/A (no npm unit test covers this path) |
| release script tests | `bash scripts/release/tests/run-tests.sh` → PASS: 43, FAIL: 0 |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None — `vercel-ignore-build.sh` and `promote.sh`/CI already consume `classify-change.sh`'s output generically; no caller special-cases the pattern contents.

### Open issues / follow-ups
- Because this fix commit itself only touches `scripts/release/classify-change.sh` (not on the source allowlist), it will not itself trigger a Vercel build. The prior `01-user-request-404-on-refresh.md` SPA-rewrite fix (already merged into `integration` HEAD) remains un-built until the next commit that touches an allowlisted source path — at that point it will build automatically along with everything else in the tree. No further action needed for that to happen.
