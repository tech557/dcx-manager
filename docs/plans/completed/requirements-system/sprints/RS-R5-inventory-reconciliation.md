## RS-R5 — Source & intent inventory + reconciliation map
Status: Completed (2026-06-29, Codex close-out fix applied)

### Intent
Inventory every requirement/intent/decision source and produce a timeline-based reconciliation map
(provenance + contradictions), **pre-classified into the chain layers** as far as each source allows — the
dataset RS-R6 migrates. No migration, no graph writes yet. (This only reads sources, so it may run any time
after the RS-R0b sign-off, in parallel with the build sprints.)

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R0a/RS-R0b design). Read the full
source corpus.

### Scope — in
- **Source manifest first (deterministic):** enumerate the FULL corpus with commands + counts, emitting
  included/excluded paths + reasons:
  - `dcx-requirements-master.csv` (217 rows; `wc -l` = 218 with header),
  - `docs/product/{requirements,decisions,open-questions,follow-ups}/**` (`rg --files`),
  - `docs/archive/dcx-manager-v0.1.4/**` (incl. `src/` lost behaviors — `rg --files`),
  - on-hold FP `output/` + that plan's `audit/` & `output-review/`,
  - **`docs/progress/sessions/**` + `docs/progress/index.csv`** (decisions buried in session logs were the
    original failure — first-class sources here).
- For each item: provenance (source + date); current-vs-superseded (timeline; newer wins); related/depends
  links; contradiction flag; and a **provisional chain classification** — is this an Intent, a Requirement
  (which scope), a Behavior/decision, or an OpenQuestion? (Best-effort; RS-R6 finalizes via the workflow.)
- Contradiction list (start: FCS-002 vs D-02 — resolved to highlight + opt-in isolation).
- Map old IDs (`BLD-/OD-`) → canonical IDs (per RS-R0a scheme).

### Scope — out
- No writes into the graph; no doc deletion. A manifest + map/dataset only. Manifestation discovery (from
  code) is RS-R3/R7, not here — this is the *intent/requirement* side.

### Acceptance criteria
- [x] (PO-verifiable) `output/RS-R5-reconciliation.md` opens with a **source manifest** (paths, counts,
      included/excluded + reasons) proving completeness — no "read all sources" without it.
- [x] (PO-verifiable) Every source item listed with provenance + status + provisional chain classification.
- [x] (PO-verifiable) Contradiction list complete, each with a proposed resolution.
- [x] Gates & fallbacks: per README **Global sprint requirements**. No `src/` change (path + mtime check).

### Close-out note
Codex close-out on 2026-06-29 fixed the re-audit blocker by regenerating
`output/RS-R5-itemized-dataset.csv` so `chain_layer` matches the documented
family mapping and special seed statuses. The close-out also corrected stale
decision/session/count labels in the companion markdown and log.

### Dependencies
RS-R0b (sign-off). Feeds RS-R6.

### Executor
Codex or Claude.

### Final step
Carry-forward: reconciliation location + contradiction count + provisional-classification counts for PO.
