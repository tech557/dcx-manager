## SUPERSEDED-MAN-STALE — 121 superseded manifestation nodes marked stale
Agent: opencode
Model: deepseek-v4-flash-free
Provider: opencode
Date: 2026-06-30
Type: process-governance
Status: Completed
PO-Action: none

Intent: Set stale_state: "stale" on all 121 MAN nodes with governance: "superseded". For each, verify the superseded_by canonical node exists on disk and flag those where it does not.
Trigger: PO-approved sweep — session 2026-06-30 Task H

### PRE-FIX counts
| Metric | Count |
|---|---|
| Superseded nodes with stale_state: null (before) | 121 |
| Superseded nodes with stale_state already set | 0 |

### Sweep report summary
| Action | Count |
|---|---|
| STALE-CANONICAL-OK (canonical found) | 121 |
| STALE-MISSING-CANONICAL (canonical not found) | 0 |
| STALE-NO-CANONICAL (no superseded_by field) | 0 |

### Missing canonical nodes (if any)
None — all 121 canonical replacements found on disk.

### POST-FIX
| Metric | Count |
|---|---|
| stale_state: null remaining | 0 |
| stale_state: "stale" set | 121 |
| stale_reason present (unexpected) | 0 |

### Final gates
| Gate | Result |
|---|---|
| req:folder-index | 815 nodes indexed |
| req:validate (final) | pass: true |
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no code changes |
