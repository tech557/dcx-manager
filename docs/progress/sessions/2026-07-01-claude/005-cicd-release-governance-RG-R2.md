## RG-R2 — Release registry + scripts
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v0.3.5.0
Change-Class: non-source

Intent: Continue the cicd-release-governance plan, sprint RG-R2 — build the operational record
(`registry.csv`) and the scripts that read/write/validate it.
Trigger: PO instruction to execute the plan one sprint at a time; RG-R2 follows RG-R1 in dependency order.
Requirements covered: REQ-RG-CSV-012, REQ-RG-MD-013, REQ-RG-MAP-016, REQ-RG-ITER-008, REQ-RG-REV-009, REQ-RG-AUTO-019.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | `docs/releases/registry.csv` | schema-only header row (§3.6) | 1 |
| created | `docs/releases/README.md` | schema docs, script contracts, classifier rule, promotion note | 70 |
| created | `docs/releases/approvals/.gitkeep` | placeholder dir for future approval artifacts | 0 |
| created | `scripts/release/classify-change.sh` | source/non-source classifier from diff path-set | 25 |
| created | `scripts/release/append-release-row.sh` | append-only registry writer, refuses duplicate version | 39 |
| created | `scripts/release/build-release-views.sh` | disposable derived summary view generator | 28 |
| created | `scripts/release/validate-release-registry.sh` | duplicate/conflict/malformed-row validator | 48 |
| created | `scripts/release/claim-version.sh` | pre-CI version reservation fallback | 13 |
| created | `scripts/release/tests/run-tests.sh` | plain-bash test harness (bats not installed — fallback, core.md §28) | 145 |
| created | `dogfood/source-probe.txt`, `dogfood/doc-probe.txt` | RG-R7-only classifier fixtures, not product code | 2/2 |
| created | `docs/plans/active/cicd-release-governance/output/RG-R2-registry.md` | sprint deliverable | 89 |
| edited | `docs/plans/active/cicd-release-governance/README.md` | carry-forward appended with RG-R2 facts | +20 |
| edited | `docs/plans/active/cicd-release-governance/sprints/RG-R2.md` | status → Completed | 2 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no `src/**` touched |
| Open decisions used (⏱) | None — schema/path-set were already PO-decided in the plan README §3.3/§3.6 |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-RG-2-1 — registry.csv has the exact §3.6 columns | PASS |
| AC-RG-2-2 — classifier source/non-source both cases | PASS |
| AC-RG-2-3 — append-only writer adds + refuses edit | PASS |
| AC-RG-2-4 — validator rejects seeded duplicate | PASS |
| AC-RG-2-5 — no absolute/home paths | PASS |
| AC-RG-2-6 — scripts idempotent | PASS |
| AC-RG-2-7 — no `src/**` changed | PASS |

### Gates
| Gate | Result |
|---|---|
| no-`src/**` proof | PASS — shasum diff empty |
| shell tests | PASS — `scripts/release/tests/run-tests.sh` 10/10, exit 0 |
| validate:architecture/typecheck | N/A — no TS source changed |
| `bash scripts/verify.sh` | PASS |
| `sprint-doctor.sh cicd-release-governance RG-R2 claude` | ❌→✅ — first run flagged a tooling-portability false-positive (my own test file's grep pattern literally contained the string it was scanning for); fixed by splitting the pattern (`/User[s]/`), reran clean: ✅ READY TO HAND OFF |
| `npm run req:validate` | PASS — 0 errors, 0 warnings |
| `npm run req:completion-gate -- --changed <14 files>` | FAIL — same structural gap as prior RG sprints (plan/tooling manifestations not modeled in the requirements graph); not a new issue |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None for this sprint | RG-R2 closed clean (Completed, all 7 AC pass, 10/10 tests) | — |

### Consumer updates required
None — these are new files; nothing existing imports/calls them yet (RG-R3/RG-R4 wire them up).

### Open issues / follow-ups
- A real bug was found and fixed in this session: `classify-change.sh` originally hardcoded `cd` into
  its own script's repo, breaking when tested against a disposable repo. Now operates on the caller's
  cwd — noted in the plan carry-forward for whoever wires RG-R3 CI to call it.
- Known limitation: naive comma-split in the validator/writer would miscount columns if a field (e.g.
  `notes`) ever contains a literal comma — flagged in `output/RG-R2-registry.md`, not yet an issue since
  no row exists.
- Next sprint in order: **RG-R3** (GitHub Actions / branch protection) — this one genuinely needs the
  GitHub remote that RG-R0b is still blocked on (PO credentials). RG-R4 (Vercel) is similarly blocked.
  RG-R5 (Supabase) and RG-R6 (ClickUp) also need live account access. I'll flag this clearly before
  attempting RG-R3.
