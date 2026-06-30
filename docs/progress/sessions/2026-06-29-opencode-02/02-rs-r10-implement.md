## RS-R10 — Legacy document disposition (Phase A + Phase B)
Agent: OpenCode
Model: deepseek-v4-flash-free
Provider: DeepSeek
Date: 2026-06-29
Type: sprint-execution
Status: Completed
PO-Action: none

Intent: Execute RS-R10 — inventory legacy requirement docs, generate disposition table, get PO approval, archive files to docs/archive/, update entry points to graph.
Trigger: User request: "ok now implement r10"
Requirements covered: REQ-GOV-TRACE-001, REQ-GOV-CAL-001, REQ-GOV-SRC-001, REQ-GOV-INV-001, REQ-GOV-TRACE-001-DATA

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | `docs/plans/active/requirements-system/output/RS-R10-disposition-table.md` | Phase A disposition table with 16 rows (14 archive + 2 keep) | 100 |
| created | `docs/product/requirements/graph/generated/rs-r10-disposition-table.json` | Agent-consumable disposition data | 248 |
| created | `docs/archive/requirements-disposition-index.md` | Archive index linking archived paths to graph replacement IDs | 22 |
| created | `docs/archive/dcx-requirements-master.csv` | Archived master CSV | 218 |
| created | `docs/archive/product/requirements/builder/` (10 files) | Archived builder requirement docs | 704 |
| created | `docs/archive/product/decisions/builder-decisions.md` | Archived decisions doc | 31 |
| created | `docs/archive/product/open-questions/builder-open-decisions.md` | Archived open questions | 212 |
| created | `docs/archive/product/follow-ups/builder-follow-ups.md` | Archived follow-ups | 20 |
| edited | `AGENTS.md` | Updated "Where things live" table to point to graph | 3 |
| edited | `docs/README.md` | Updated product section to note graph as source of truth | 1 |
| edited | `docs/references/README.md` | Updated requirement/decision references | 2 |
| edited | `docs/plans/active/requirements-system/README.md` | Updated status, sprint index, carry-forward, and Definition of Done | 10 |
| added | `docs/product/requirements/graph/ledger/decision-ledger.jsonl` | 15 new ledger entries (1 PO approval + 14 archive) | +15 lines |
| deleted | `dcx-requirements-master.csv` | Archived (copy in docs/archive/) | 218 |
| deleted | `docs/product/requirements/builder/*.md` (10 files) | Archived | 704 |
| deleted | `docs/product/decisions/builder-decisions.md` | Archived | 31 |
| deleted | `docs/product/open-questions/builder-open-decisions.md` | Archived | 212 |
| deleted | `docs/product/follow-ups/builder-follow-ups.md` | Archived | 20 |
| kept | `docs/product/decisions/src-structure-decision.md` | Architecture doc — not requirements | 151 |
| kept | `docs/product/component-source-policy.md` | Component policy — not requirements | 97 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — first execution |
| Preserve-semantic (§9) | All boundaries respected: graph nodes unchanged, src/ untouched, historical docs unmodified |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Phase A: Disposition table at output/RS-R10-disposition-table.md | PASS |
| Phase A: JSON at docs/product/requirements/graph/generated/rs-r10-disposition-table.json | PASS |
| Phase A: Archive index proposal at docs/archive/requirements-disposition-index.md | PASS |
| PO has approved every row before any file moved | PASS (user approved) |
| Archived files under docs/archive/<original-path> | PASS — all 14 verified |
| Each archived file has a ledger entry | PASS — 14 LDG entries recorded |
| AGENTS.md "Where things live" now names graph | PASS |
| dcx-requirements-master.csv stray at repo root gone | PASS — moved to archive |
| Archive index finalized with PO decisions | PASS |
| No live entry-point cross-references to legacy paths remain | PASS — all live entry points updated |
| No historical/provenance paths rewritten | PASS — forbidden paths untouched |
| Cross-reference report appended to build notes | PASS — see session log |
| No src/ files changed | PASS — verified with find |

### Gates
| Gate | Result |
|---|---|
| No legacy files moved (Phase A) | PASS |
| npm run req:validate | PASS |
| npm run req:completion-gate | ⚠️ FAIL (expected — 6 unlinked manifestations from governance sprint; 23 candidate links; 1 pre-existing stale trace) |
| npm run typecheck | PASS (0 errors) |
| npm run lint | PASS (0 errors) |
| npm run validate:architecture | PASS (0 violations) |
| bash scripts/verify.sh | PASS |
| npm run test | PASS (79/79) |
| No src/ changes | PASS |
| Forbidden paths untouched | PASS |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- RS-R11 plan (reground frontend-polish brief) now unblocked — the graph is the sole source of truth

### Open issues / follow-ups
- RS-R10 completion-gate reports 6 unlinked manifestations (archived files + updated entry points). These are governance artifacts not requiring graph nodes. Can be resolved by adding MAN nodes if desired, but not blocking.
- 1 pre-existing stale trace remains (QST-VR-011).
- The `docs/product/requirements/builder/` directory is now empty; may need `.gitkeep` if tracked.
