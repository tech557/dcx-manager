## BE3-R5b — Live CI data capture
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Partial
PO-Action: pending
Version: v1.0.1.0
Change-Class: non-source

Intent: Wire the BE3-R5a substrate into the preview pipeline so every preview snapshots the contract + records payloads into the readiness dataset.
Trigger: backend-discovery-v3 execution (BE3-R5b). may-close-partial: yes.
Requirements covered: REQ-GOV-TRACE-001-BACKEND / RSP-GOV-TRACE-BACKEND (REQ-RG-PLAT-018/AUTO-019 proposed, supporting-only)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | .github/workflows/backend-capture.yml | CI capture on deployment_status (drift + coverage + prod-guard + commit + registry patch) | 157 |
| edited | .gitignore | ignore raw captures; commit only summaries | +4 |
| created | docs/plans/active/backend-discovery-v3/output/BE3-R5b-live-capture.md | sprint output (Partial) | 55 |
| edited | docs/plans/active/backend-discovery-v3/README.md | carry-forward: R5b facts + blocking creds + PO decision | +11 |
| edited | docs/backend/README.md | dataset index: captured → PARTIAL | ~1 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no src; reuses RG registry (no parallel), single registry.csv |
| Open decisions used (⏱) | None new (surfaced registry-column decision as a PO item, not silently defaulted) |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-BE3-5b-1 — workflow runs on real preview + commits summary | PARTIAL — CI trigger PO/credential-blocked; local fallback ran (summary produced); no CI run faked |
| AC-BE3-5b-2 — referenced by version in registry; no parallel registry | PARTIAL — patch best-effort (see PO item); single registry, no parallel |
| AC-BE3-5b-3 — seeded walk exercises every route; coverage gate reports | PARTIAL — coverage gate works (6/22 local); full 22 needs live walk |
| AC-BE3-5b-4 — contract-drift gate fails mutated, passes clean | PASS |
| AC-BE3-5b-5 — no src/** changed | PASS (R5b added no src) |

### Gates
| Gate | Result |
|---|---|
| workflow YAML valid | PASS (10 steps, no tabs, parsed) |
| contract-drift gate | PASS (clean/mutated) |
| capture-coverage gate mechanism | PASS (reports per-route; 6/22 local) |
| live CI capture | BLOCKED — GitHub Actions write + preview creds unavailable in-session (§28) |
| no-src diff | PASS |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| CI credentials for live capture | `backend-capture.yml` needs GitHub Actions `contents: write` + a source-change preview to fire on `deployment_status` | grant/confirm Actions write; push a source change to produce a preview |
| Registry capture-reference column | registry has no capture field; `notes` pre-filled by version-assign; sprint forbids adding a column; `patch-release-row.sh` won't overwrite non-empty | decide: add a `capture_ref` column (PO-approved schema change) vs. rely on `<version>` path as join key |

### Consumer updates required
- None.

### Open issues / follow-ups
- Tune seeded journey to hit all 22 routes when CI creds land.
- BE3-R6 will record G5 = FAIL until live capture evidence exists in docs/backend/captured/**.
