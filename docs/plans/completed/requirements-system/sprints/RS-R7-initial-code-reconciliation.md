## RS-R7 — Initial code reconciliation pass (bottom-up bootstrap)
Status: Completed with documented mapping debt

### Intent
Run the RS-R3 reconciliation engine across the **real existing codebase** to produce the first full
coverage picture: link existing manifestations to migrated requirements/responsibilities, classify exempt
technical work, and populate the queues with everything unlinked, partial, stale, or superseded-still-in-
code. This is the **bottom-up bootstrap** — it does not change product code; it builds the trace graph for
what already exists. **PO confirms the ambiguous mappings.**

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R3 engine command names + RS-R6
populated graph). Refresh the code index (`npm run generate:code-index`) and log freshness.

### Scope — in
- **Run the manifestation inventory + candidate inference** over `src/**` via the engine (reusing
  `code-index`/`code-query.sh`). No product-code change.
- **Auto-apply** high-confidence technical links (with audit ledger entries, per RS-R3 rule); route
  everything ambiguous or product-truth-affecting to the **review queue**.
- **Classify exempt work** (typed: infrastructure/refactoring/generated/build-tooling/internal-tooling/
  observability/security-hardening/defect-correction/dependency-maintenance/migration) — so unlinked never
  silently becomes ignored.
- **Produce a coverage report** (`output/RS-R7-reconciliation-report.md`): requirements with full/partial/
  no manifestation coverage; manifestations with no requirement; superseded requirements still in code;
  tests disconnected from active acceptance outcomes; stale/broken/moved traces; exemptions.
- **PO confirmation / deferred cleanup:** present the review-queue batches. Per PO close-out direction on
  2026-06-29, ambiguous/weak/provisional mappings may remain pending if they are visible, auditable,
  reversible, and included in the deferred cleanup queue. Confirmation is planning context only and never
  authorizes product source changes.

### Scope — out
- No product-code change. No NEW requirements from this session's decisions (RS-R9). Verification evidence
  is RS-R8. Do not "fix" partial coverage by writing product code — that is downstream feature work.

### Acceptance criteria
- [x] (code-verifiable) Inventory + inference ran read-only over `src/**` (path + mtime check); engine
      consumed `code-index`/`code-query.sh`.
- [x] (PO-verifiable) Coverage report present with all detector outputs (orphans, partials, superseded-in-
      code, disconnected tests, stale traces, exemptions).
- [x] (PO-verifiable) Auto-applied links each have an audit ledger entry; ambiguous mappings sit in the
      review queue with confidence/evidence/reason.
- [x] **(GATE) PO confirms the ambiguous-mapping batches**; decisions recorded in the ledger.
      Close-out disposition: PO explicitly directed that imperfect mappings must not block progress when
      unresolved items are visible, auditable, reversible, and queued. Open items are recorded in
      `docs/product/requirements/graph/views/rs-r7-deferred-cleanup-queue.md`; no ambiguous mappings were
      bulk-confirmed.
- [x] (code-verifiable) `reconcile` + `validate` pass after confirmed mappings applied.
      Close-out disposition: no ambiguous mappings were confirmed/applied; normalized canonical candidates
      validate and remain pending.
- [x] Gates & fallbacks: per README **Global sprint requirements** (§28 fallbacks named).

### Dependencies
RS-R3 (engine) **and** RS-R6 (populated graph). RS-R4 (gates/skills) should be live so the queues/grounding
are real. Feeds RS-R8/R9.

### Executor
Codex (engine run) + Claude (mapping review/curation). PO confirms.

### Final step
Carry-forward: counts (manifestations inventoried, links auto-applied, queued, confirmed; exemptions;
coverage gaps) and the report location.
