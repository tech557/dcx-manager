## RG-R1 — Versioning model + rule changes
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v0.3.5.0
Change-Class: non-source

Intent: Continue the cicd-release-governance plan, sprint RG-R1 — encode the 4-part `Major.Stage.Iteration.Revision`
versioning scheme and split ownership into the canonical rule docs, before any auto-assignment tooling exists.
Trigger: PO instruction to execute the plan one sprint at a time; RG-R1 follows RG-R0a/RG-R0b in dependency order.
Requirements covered: REQ-RG-VER-006, REQ-RG-OWN-007, REQ-RG-ITER-008, REQ-RG-REV-009, REQ-RG-RESET-010, REQ-RG-LOG-011.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | `docs/VERSION.md` | 4-part scheme + split ownership + migration note `v0.3.5→v0.3.5.0`; legacy table retained | 65 (was 37) |
| edited | `docs/agent-rules/core.md` | §26 rewritten (4-part split ownership); new §26a Release Governance | +29 |
| edited | `docs/agent-rules/log-format.md` | §0/§1 gain `Version:`/`Change-Class:` fields, additive | +10 |
| edited | `scripts/build-log-index.sh` | `version`/`change_class` columns: awk extraction, printf output, one-time header migration for existing `index.csv` | +14 |
| created | `docs/plans/active/cicd-release-governance/output/RG-R1-version-model.md` | sprint deliverable — before/after + evidence | 95 |
| edited | `docs/plans/active/cicd-release-governance/README.md` | carry-forward appended with RG-R1 facts (incl. a note on the header-migration gotcha for future script edits) | +17 |
| edited | `docs/plans/active/cicd-release-governance/sprints/RG-R1.md` | status → Completed | 2 |
| edited (regenerated) | `docs/progress/index.csv` | header migrated to add `version,change_class` columns; **all pre-existing data rows verified byte-identical** (diffed row 2 before/after) | header only |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no `src/**` touched; `core.md §26` semantics changed *intentionally* per this PO-approved sprint, not a regression |
| Open decisions used (⏱) | None — D-RG-VER (4-part scheme, bootstrap `v0.3.5.0`) was already PO-decided in the plan README |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-RG-1-1 — VERSION.md documents 4-part scheme + split ownership | PASS |
| AC-RG-1-2 — migration note `v0.3.5 → v0.3.5.0` present | PASS |
| AC-RG-1-3 — core.md §26 rewritten (old phrase gone) | PASS — `grep "agents never change the version"` empty |
| AC-RG-1-4 — log-format §0 has `Version:`+`Change-Class:` | PASS |
| AC-RG-1-5 — index builder adds columns + runs clean; old logs untouched | PASS — ran twice clean, idempotent; pre-existing row diffed identical; synthetic test log confirmed columns populate, then removed |
| AC-RG-1-6 — no `src/**` changed | PASS — shasum diff empty |

### Gates
| Gate | Result |
|---|---|
| typecheck / lint / validate:architecture / test | N/A — no source changed (`bash scripts/verify.sh` → "verify passed", run as an extra sanity check since this sprint touches a script) |
| no-`src/**` proof | PASS |
| index integrity | PASS — `build-log-index.sh` exits 0; 196 lines stable; idempotent on rerun |
| `sprint-doctor.sh cicd-release-governance RG-R1 claude` | ✅ READY TO HAND OFF (2 informational determinism-reminder warnings, eyeballed) |
| `npm run req:validate` | PASS — 0 errors, 0 warnings |
| `npm run req:completion-gate -- --changed <8 files>` | FAIL — same structural gap as RG-R0a/RG-R0b (plan/rule-doc manifestations not modeled in the requirements graph); surfaced 110 fuzzy "candidate link" suggestions for `core.md`/`VERSION.md` against pre-existing unrelated requirement nodes (none confirmed/applied) — pre-existing repo-wide state, not introduced by this sprint |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None for this sprint | RG-R1 closed clean (Completed, all AC pass) | — |

### Consumer updates required
- Any future sprint/script that parses `docs/progress/index.csv` by fixed column count should account for
  the new trailing `version,change_class` columns (old rows have fewer fields — ragged CSV by design).
- `build-log-index.sh` consumers (the `PostToolUse` hook per `CLAUDE.md`) — verified the hook's normal
  invocation path (running the script) still exits 0 and produces a valid index.

### Open issues / follow-ups
- RG-R0b remains open/Partial (separate item, logged in `003-cicd-release-governance-RG-R0b.md`) —
  unaffected by this sprint.
- Next sprint in order: **RG-R2** (release registry + scripts, `docs/releases/registry.csv` +
  `scripts/release/*`) — docs/tooling only, does not require the GitHub remote.
