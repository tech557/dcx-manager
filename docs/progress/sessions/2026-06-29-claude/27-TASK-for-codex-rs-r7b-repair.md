## TASK (for Codex) — RS-R7b: MAN dedupe + usage-based re-inference + confirm/exempt
Agent: Claude (author of the task) — EXECUTOR: Codex
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: user-request-planning
Status: Completed (task authored; Codex to execute)

> **Codex: this is your task brief. It is self-contained — act on it cold.** When you execute, write your
> OWN session log + `output/RS-R7b-build-notes.md`, and run `sprint-doctor` before handoff (core.md §36).

---

### Why (current state)
RS-R7 persisted 397 Manifestation (MAN) nodes + 362 candidate `implements` links, but it is **persisted,
NOT confirmed**. An audit (`output-review/RS-R7-persist-review.md`; ledger `LDG-2026-06-29-R7-CONFIRM-ANALYSIS`)
found the candidate data too low-precision to confirm:
1. **126 source files have DUPLICATE MAN nodes** (the inventory created one by component-name and one by
   src-path for the same file).
2. **All 362 candidate `implements` links carry a flat `0.85` confidence** — no real signal.
3. **Name-similarity false positives**: `Select.tsx` "implements" 23 requirements (incl. `FCS-002`
   focus-isolation — nonsense), `mock-store` 25, `types/api` 23.

Auto-confirming would cement wrong traces + duplicate nodes. RS-R7b fixes this so R7 can be confirmed and
**RS-R8 (verification) is unblocked**.

### Where things are (orientation)
- Graph store: `docs/product/requirements/graph/` → `nodes/<type>/…` (manifestations in `nodes/manifestation/<kind>/`), `trace-links/*.json`, `ledger/decision-ledger.jsonl`, `views/`, `generated/`.
- Tooling: `scripts/requirements/*.ts` via `npm run req:*` — `validate`, `propose`, `apply-after-signoff`, `generate-views`, `query`, `trace`, `justify`, `reconcile`, `completion-gate`, `folder-index`, `persist-rs-r7`.
- The mutation layer (`mutation.ts`) is now **validate-before-write** (build prospective graph → validate → commit; no partial writes). Use it / preserve that property.
- Reconcile engine: `scripts/requirements/reconciliation-engine.ts`; reuse `code-index/component-usages.json` + `components.json` (and `scripts/agent/code-query.sh`). **Do NOT build a new indexer.**
- Review queue + batches: `docs/product/requirements/graph/generated/rs-r7-review-queue.json`.

### Deliverables (option A)
1. **Dedupe MAN nodes by source path** — exactly one MAN node per `current_paths` file. Keep the most
   semantic/stable id; re-point any trace links from the dropped id → the kept id; record each merge in the
   ledger. (126 paths affected.)
2. **Re-infer manifestation→requirement/responsibility links from IMPORTS/USAGES** (reuse
   `code-index/component-usages.json` + import data), not name-similarity. Produce **real, varied
   confidence + evidence** (which usage/import justifies the link). Replace the 362 flat-0.85 candidates.
3. **Confirm + exempt:**
   - Auto-apply only links backed by real usage/import evidence above a justified threshold, each with a
     ledger audit entry (via the validate-before-write path).
   - Route the rest to the review queue (keep `needs_confirmation`).
   - **Exempt** clearly non-product manifestations with typed `EXM-` Exemption nodes: build-tooling/config
     (`package.json`, vite/ts config), generated/docs (`docs/**`, build-notes, README), mocks (`src/mock/**`,
     `src/services/mock/**`), telemetry, app entry (`src/main.tsx`). Also fix the mis-kinded ones
     (`package.json`/docs currently kind `function`).
4. **Recompute coverage** (delivery off `not-assessed` where real links exist); **regenerate** views +
   folder indexes (`npm run req:generate-views`).
5. **Close-out:** update RS-R7 sprint status + README carry-forward; write your session log +
   `output/RS-R7b-build-notes.md` with a Requirement Trace + gate evidence.

### HARD CONSTRAINTS (PO — "please make sure")
- **NEVER delete or modify product source files (`src/**`) or any non-graph file.** RS-R7b touches ONLY
  `docs/product/requirements/graph/**` (+ its own output/log). Prove it: `find src -newer …` shows no `src/` change.
- **No silent/partial writes** — use the validate-before-write mutation path; `req:validate` must stay 0-error throughout.
- **Reuse** `code-index` / `code-query.sh`; no new indexer.
- **Record every dedupe-merge, confirmation, and exemption in the append-only ledger.**
- **Run `bash scripts/agent/sprint-doctor.sh requirements-system RS-R7b codex` before handoff** and paste the output.

### PRAGMATIC SCOPE (PO wants to move on — do NOT gold-plate)
- Aim for **trustworthy family-level coverage**, not perfect per-link precision. "Good enough" is the bar.
- **Residual non-crucial deficiencies are ACCEPTABLE** — leave uncertain links in the review queue; the PO
  will validate real behavior during frontend-polish. Do **not** block on edge cases; queue them and move on.
- The goal is: **R7 confirmable + R8 unblocked**, quickly, without polluting traceability and without
  touching source code.

### Acceptance criteria
- [ ] One MAN node per source path (0 duplicate-path MAN nodes).
- [ ] Confirmed/candidate links carry **real, varied confidence + import/usage evidence** (not flat 0.85);
      obvious false positives gone (e.g. `Select.tsx` no longer linked to `FCS-002`).
- [ ] Infra/docs/mock/config/entry manifestations carry typed `EXM-` exemptions; mis-kinded ones corrected.
- [ ] `npm run req:validate` 0 errors; coverage recomputed; views + folder indexes regenerated.
- [ ] `npm run typecheck` · `npm run lint` · `npm run test` · `npm run validate:architecture` · `bash scripts/verify.sh` pass.
- [ ] `sprint-doctor` → READY; **no `src/` change** (path + mtime check).
- [ ] Ledger records dedupe-merges + confirmations + exemptions; RS-R7 status + carry-forward updated.

### Then
RS-R7 → confirmed/closeable; proceed to **RS-R8 (verification evidence)**. Any remaining ambiguous links
stay in the review queue as documented, accepted debt (non-crucial).
