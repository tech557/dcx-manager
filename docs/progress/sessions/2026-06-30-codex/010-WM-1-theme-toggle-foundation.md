## WM-1 — Theme toggle foundation
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-30
Type: mixed
Status: Completed
PO-Action: none

Intent: Move the frontend polish implementation plan to active and execute first sprint WM-1 in sprint order.
Trigger: User request: "move the plan to active and start working on the first sprint as per sptints order WM-1"
Requirements covered: REQ-FP-D05; REQ-UP-009; REQ-UP-010; REQ-UP-019

### Session Environment
| Item | Result |
|---|---|
| `build-current-state.sh` | PASS; repo version `v0.3.5`; initial active plans `[]`; after activation active plan `frontend-polish-implementation-v0.3.5`; MCP operational `[eslint, shadcn, playwright]`; MCP awaiting `[storybook, semgrep, sonarqube]`; code-index stale at start |
| `verify-tooling-state.sh` | PASS; `verify.sh` pass; semgrep `1.37.0` available; Playwright MCP `0.0.77` available; e2e had no tests; code-index stale |
| Version gate | PASS; `docs/VERSION.md` matched `v0.3.5` |
| Code index | Refreshed with `npm run generate:code-index` |
| Skills invoked | Project `dcx-plan-audit` had already produced READY reaudit before activation; no additional project skill invocation was needed for WM-1 execution |

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| moved | `docs/plans/drafted/frontend-polish-implementation-v0.3.5/` -> `docs/plans/active/frontend-polish-implementation-v0.3.5/` | Activated READY plan at PO direction | — |
| edited | `docs/plans/active/frontend-polish-implementation-v0.3.5/README.md` | Set active lifecycle, Codex/Playwright eligibility, WM-1 carry-forward | 124 |
| edited | `docs/plans/active/frontend-polish-implementation-v0.3.5/sprints/WM-1.md` | Marked WM-1 completed and filled actual manifestations/gate result | 42 |
| created | `docs/plans/active/frontend-polish-implementation-v0.3.5/output/WM-1-theme-toggle.md` | Sprint output, gates, evidence, debt burn-down | 74 |
| created | `docs/plans/active/frontend-polish-implementation-v0.3.5/output/evidence/WM-1-theme-toggle/desktop-light-persisted.png` | Desktop browser proof screenshot | — |
| created | `docs/plans/active/frontend-polish-implementation-v0.3.5/output/evidence/WM-1-theme-toggle/mobile-dark-persisted.png` | Mobile browser proof screenshot | — |
| edited | `src/hooks/useTheme.ts` | Added document theme application helpers and scoped local preference hydrate/persist behavior | 71 |
| created | `src/hooks/theme.test.ts` | Unit coverage for document theme application, scoped persistence, invalid stored fallback | 44 |
| edited | `src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx` | Passed version-scoped theme preference scope and restored pointer-active island root | 161 |
| edited | `src/builder/BuilderPage.tsx` | Made header row pointer-transparent so header island controls receive real pointer clicks | 183 |
| created | `docs/product/requirements/graph/nodes/manifestation/test/MAN-test-src-hooks-theme-test.json` | Registered WM-1 test manifestation | 21 |
| created/edited | `docs/product/requirements/graph/trace-links/TRC-WM1-*.json` | Added WM-1 requirement and verification links for changed manifestations | 156 total |
| edited | `docs/product/requirements/graph/ledger/decision-ledger.jsonl` | Recorded WM-1 trace decisions and verification-engine stale event | 75 |
| regenerated | `docs/product/requirements/graph/**/README.md`, `docs/product/requirements/graph/**/index.csv` | `npm run req:folder-index` regenerated graph folder indexes | generated |
| regenerated | `code-index/` | `npm run generate:code-index` refreshed stale code index | generated |
| edited | `docs/generated/CURRENT_STATE.json` | Updated by current-state script after activation | 83 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | Theme state remains in app store/hook; UI action remains in HeaderUserIsland; builder layout hitbox changed only to permit header island interaction |
| Open decisions used (⏱) | Existing `QST-VR-011` warning remains unrelated; no new open decision applied |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Move READY plan from drafted to active | PASS |
| WM-1 theme toggle switches `dataset.theme` and `classList.dark` | PASS |
| Theme preference is scoped by user/dcx/version and persists reload | PASS |
| No backend write for theme preference | PASS; uses local preference helper only |
| Real pointer browser proof at 1440x900 and 390x844 | PASS; screenshots saved under WM-1 evidence folder |
| Requirement debt burn-down recorded | PASS; changed-scope unlinked manifestations 3 -> 0 |

### Gates
| Gate | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run test -- src/hooks/theme.test.ts` | PASS; 3 tests |
| `npm run lint` | PASS |
| `npm run test` | PASS; 11 files, 82 tests |
| `npm run validate:architecture` | PASS |
| `bash scripts/verify.sh` | PASS |
| Browser / Playwright | PASS; normal pointer click toggled theme and reload persisted on desktop/mobile |
| `npm run req:folder-index` | PASS |
| `npm run req:validate` | PASS with existing warning `QST-VR-011` |
| `npm run req:reconcile -- --mode changed -- --files ...` | PASS; final changed-scope detectors had 0 unlinked manifestations and 0 disconnected tests |
| `npm run req:completion-gate -- --changed src/hooks/useTheme.ts,src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx,src/builder/BuilderPage.tsx` | PASS |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- `HeaderUserIsland` now calls `useTheme(themePreferenceScope)`.
- Existing unscoped `useTheme()` consumers, if added later, will still only apply store theme and will not hydrate/persist local preferences.

### Open issues / follow-ups
- `req:completion-gate` marks a changed test manifestation's own `verifies` links stale when the test file is included in `--changed`; WM-1 used the product-file completion gate after running the focused test and recording verification evidence.
- Reconciler still queues a non-blocking `BuilderPage` -> `REQ-VR-001` candidate from route-name similarity; not accepted for WM-1 because the sprint change is the header hitbox for `REQ-FP-D05`.
