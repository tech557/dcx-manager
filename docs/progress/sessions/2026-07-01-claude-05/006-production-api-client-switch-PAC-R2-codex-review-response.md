## PAC-R2 — response to Codex output-review (P1 bug fix)
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: audit-review
Status: Completed
PO-Action: none
Version: v1.0.3.0
Change-Class: source

Intent: Review Codex's output-review of PAC-R2 (`output-review/2026-07-01-codex-PAC-R2-risk-review.md`, ACCEPT WITH RISKS) and act on its findings.
Trigger: User request — "can u check codex review of your plan output"
Requirements covered: REQ-BE-API-001

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | src/services/real-dispatch.ts | Added `remapBuilderTreeIds()`; `duplicateVersion` now generates fresh phase/action/task/subtask IDs instead of reusing the source version's (PK-violating) IDs | +34 |
| created | docs/plans/active/production-api-client-switch/output/PAC-R2-codex-review-response.md | Disposition of all 4 Codex findings (1 fixed, 2 carried forward by design/scope, 1 not this sprint's to fix) | 47 |
| edited | docs/plans/active/production-api-client-switch/README.md | Carry-forward — Codex review outcome + P1 fix + P2 carried-forward risks appended | +7 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | Fix is additive (new function + one call-site change); no other behavior altered |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Codex P1 (duplicate builder-tree PK violation) | FIXED — `remapBuilderTreeIds()` generates fresh IDs top-down, rewrites parent refs |
| Codex P2 (non-transactional builder save) | Carried forward — fixing requires `apply_migration` (forbidden in PAC-R2 scope); must block PAC-R6 promotion until resolved |
| Codex P2 (type-level-only parity) | As-designed, confirmed correctly deferred to PAC-R4 — no action |
| Codex P3 (VERSION.md/metadata.json drift) | Not this sprint's — pre-existing, unrelated to PAC-R2's changed files, PO-maintained file |

### Gates
| Gate | Result |
|---|---|
| typecheck | PASS |
| lint | PASS |
| test | PASS (92/92, unchanged) |
| validate:architecture | PASS (305 modules) |
| verify.sh | PASS |
| req:validate | PASS |
| req:completion-gate (`src/services/real-dispatch.ts`) | PASS |
| contract-drift | PASS |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| `docs/VERSION.md` (v1.0.4.0) vs `metadata.json` (v1.0.1.0) drift (Codex P3) | Pre-existing, unrelated to this sprint, but the PO owns `VERSION.md` by hand per its own file header | Reconcile when convenient — not blocking any current sprint |

### Consumer updates required
- None

### Open issues / follow-ups
- P2 (non-transactional builder-tree write) remains open — must be resolved before PAC-R6 (prod promotion). Whoever executes PAC-R4/PAC-R5 should treat this as a standing blocker on enabling the real backend against real user workflows, not just a style note.
