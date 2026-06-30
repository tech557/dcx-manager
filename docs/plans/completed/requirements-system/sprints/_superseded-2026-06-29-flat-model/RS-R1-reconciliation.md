## RS-R1 — Source inventory & reconciliation map
Status: Drafted

### Intent
Inventory every requirement source and produce a timeline-based reconciliation map (provenance +
contradictions) — the dataset RS-R3 migrates. No migration, no system writes yet.

### Step 0
Env + log. Read RS-R0 design (approved). Read all sources.

### Scope — in
- **Source manifest first (deterministic — Codex #1/#2).** Enumerate the FULL corpus with commands and
  counts, emitting included/excluded paths + reasons:
  - `dcx-requirements-master.csv` (217 — `wc -l`),
  - `docs/product/{requirements,decisions,open-questions}/**` (`rg --files`),
  - `docs/archive/dcx-manager-v0.1.4/**` (incl. `src/` lost behaviors — `rg --files`),
  - on-hold FP outputs + that plan's `audit/` & `output-review/`,
  - **`docs/progress/sessions/**` + `docs/progress/index.csv`** (decisions buried in session logs were the
    original failure — they are first-class sources here).
- For each requirement: provenance (source + date), current-vs-superseded (timeline; newer wins),
  related/depends links, contradiction flag.
- Contradiction list (start: FCS-002 vs D-02 — resolved to highlight + opt-in isolation).
- Map old IDs (BLD-/OD-) → canonical IDs (per RS-R0 scheme).

### Scope — out
- No writes into the new system; no doc deletion. A manifest + map/dataset only.

### Acceptance criteria
- [ ] (PO-verifiable) `output/RS-R1-reconciliation.md` opens with a **source manifest** (paths, counts,
      included/excluded + reasons) proving completeness — no "read all sources" without it.
- [ ] (PO-verifiable) Every source requirement listed with provenance + status.
- [ ] (PO-verifiable) Contradiction list complete, each with a proposed resolution.
- [ ] Gates & fallbacks: per README **Global sprint requirements**. No `src/` change (path + mtime check).

### Dependencies
RS-R0 approved. Feeds RS-R3.

### Executor
Codex or Claude.

### Final step
Carry-forward: reconciliation location + contradiction count for PO.
