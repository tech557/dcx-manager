## RG-R3 — three live bugs found and fixed via real GitHub Actions runs
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: pending
Version: v0.3.5.4
Change-Class: non-source

Intent: Continue verifying RG-R3 (GitHub CI wiring) live rather than declaring it done after the first
green run — kept testing the actual mechanical pipeline (version-assign + VERSION.md sync + registry
validator) until it held up under its own real output, surfacing and fixing real bugs along the way.
Trigger: continuation of RG-R3 closeout; live CI feedback drove each fix in this session.
Requirements covered: REQ-RG-ITER-008, REQ-RG-REV-009, REQ-RG-CSV-012 (registry integrity).

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | `.github/workflows/version-assign.yml` | added a step to sync `docs/VERSION.md`'s `current` field in the same commit as the registry stamp (bug 2: VERSION.md was drifting) | +5 |
| edited | `docs/VERSION.md` | corrected the drifted `current` field locally before the CI fix landed | 1 |
| edited | `scripts/release/validate-release-registry.sh` | fixed false-positive "conflicting verified rows" check — only applies once `approved_for` is non-empty (bug 3, found by real CI failure on run `28480885125`) | +3 |
| edited | `scripts/release/tests/run-tests.sh` | added a regression test reproducing the exact false-positive shape (two unapproved `verified` rows) | +7 |
| edited | `docs/plans/active/cicd-release-governance/output/RG-R3-github-ci.md` | documented both bugs, the fixes, and the final green state | +30 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no `src/**` touched |
| Open decisions used (⏱) | None |

### Acceptance criteria
No new AC introduced; these fixes close the gap between RG-R3's "live-verified" claim and reality — see
the updated `output/RG-R3-github-ci.md` AC table (unchanged verdicts, now backed by a clean final run).

### Gates
| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| `scripts/release/tests/run-tests.sh` | PASS — 11/11 (was 10/10; added the regression test) |
| `npm run req:validate` | PASS — 0 errors, 0 warnings |
| Live GitHub Actions, final state | PASS — `28481045127` (CI) and `28481045117` (version-assign) both `success` on commit `5eaf1e8` |
| `bash scripts/verify.sh` | PASS |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Same as RG-R3's original log (007): branch protection + CODEOWNERS owner confirmation still pending | Unaffected by this session's bugfixes | See `007-cicd-release-governance-RG-R3.md` |

### Consumer updates required
None.

### Open issues / follow-ups
- The registry now has 4 real stamped rows (`v0.3.5.1`..`v0.3.5.4`), all `non-source`/`verified`,
  none `approved_for` any environment yet — expected, since no promotion (RG-R4) has happened.
- Next: RG-R4 (Vercel preview/promote wiring) — checking Vercel MCP tool availability for read-only
  discovery before attempting anything, per the same pattern used for RG-R3's GitHub work.
