---
log: 038-requirements-backlog-inventory
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: process-governance
PO-Action: none
version_context: v0.3.5
plan: (cross-cutting — requirements graph backlog)
---

# 038 — Requirements graph open-item inventory (read-only)

## Status: ✅ Inventory captured (no mutations) — baseline for the opencode burn-down prompt

PO asked to pre-run Step 1 of the opencode requirements burn-down so the initiation prompt carries real
counts. Read-only: `req:validate`, `req:reconcile --mode inventory`, node-state counts, generated reports.

## Baseline snapshot (2026-06-30)
- **req:validate:** PASS — 0 errors, **1 warning** (`QST-VR-011`: approved + intent-captured → needs-maturation queue).
- **Requirements:** 258 total — **245 `not-assessed`**, **13 `implemented`**, **0 `verified`**.
- **Graph:** 791 nodes · 916 trace-links · 79 ledger entries.
- **reconcile --mode inventory (live):**
  - manifestationsLackingRequirements: **~323–325** (§35d unlinked) — largest bucket.
  - candidateLinksAwaitingConfirmation (RS-R7): **686**.
  - requirementsLackingManifestations: **112**.
  - needsDecomposition: **250** · implementedUnverified: **13** · testsDisconnected: **4** · staleBrokenTraces: **1**.
  - clean: supersededStillInCode 0 · verificationStale 0 · exemptionsAwaitingReview 0 · needsClassification 0 · missingManifestations 0.
- **rs-r8 (generated snapshot):** acceptanceOutcomesWithoutEvidence: **21** · boundEvidence: 3.
- **Families (size):** VL 31 · BC 31 · DM 24 · UP 23 · RV 21 · PR 19 · FP 16 · SC 14 · GOV 12 · VR 10 · CR 10 · SBC 7 …

Note: live reconcile vs the saved generated reports differ by ±2 (snapshots are older); live numbers govern.

## Disposition
No graph mutations. Numbers handed to PO + baked into the opencode initiation prompt (delivered in chat).
Burn-down execution itself is delegated to opencode under the governance gates (`§35b/§35c`).
