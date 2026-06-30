## RS-R6 — Migrate sources → seed graph + ledger + code-true data model
Status: Completed (2026-06-29, Codex)

### Intent
Populate the graph from the RS-R5 reconciliation: canonical Intent/Requirement nodes with provenance,
classified into the chain layers and the three state dimensions; the append-only ledger seeded with
historical decisions; and a code-true data-model summary.

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R5 reconciliation + RS-R1/R2
tooling command names).

### Scope — in
- **Migrate via the governed workflow** (`propose` → sign-off → `apply`): each reconciled item becomes the
  right node (Intent / Requirement[scoped] / Behavior / OpenQuestion) with provenance + canonical ID,
  classified into the `scope/type` model with `derives-from` links, and assigned **all three states** —
  product source requirements default toward `approved`/`locked` (governance) per PO; maturity per how
  complete the source is (most start `intent-captured`/`logic-defined`, NOT `implementation-ready`);
  delivery `not-assessed`/`not-started` until RS-R7 reconciles code. **Respect progressive validation —
  do not fabricate implementation fields to force maturity.**
- **Seed the decision ledger** with historical confirmed decisions (dated, with `supersedes` links).
- **Build the data-model summary code-true from `src/types/`**; log requirement-vs-code drift as ledger
  entries to resolve.
- Run validators; resolve all relationship errors.

### Scope — out
- This session's NEW decisions (RS-R9 dogfood). Linking requirements to **code manifestations** is RS-R7
  (the reconciliation run). No agent-rule edits (done in RS-R4). No doc disposition (RS-R10).

### Acceptance criteria
- [x] (code-verifiable) `validate` passes (0 dangling/orphan/cycle/double-supersede).
- [x] (PO-verifiable) Every migrated node has provenance + chain classification + three-state assignment;
      no node was forced to a maturity it lacks fields for (spot-check drafts pass validation legitimately).
- [x] (PO-verifiable) Ledger seeded with historical decisions; supersessions linked.
- [x] (PO-verifiable) Data-model summary matches `src/types`; drift logged as ledger entries.
- [x] Gates & fallbacks: per README **Global sprint requirements** (validators + standard gates; §28).

### Close-out note
Codex seeded 307 graph nodes, 455 trace links, and 35 ledger entries. `npm run req:validate`
passes with 0 errors and 0 warnings. Delivery remains `not-assessed` by design until RS-R7 reconciles
code manifestations, except for 5 RS-R6 self-trace manifestations created for completion-gate coverage.

### Dependencies
RS-R2 (store + workflow) **and** RS-R5 (inventory). Feeds RS-R7.

### Executor
Claude or Codex.

### Final step
Carry-forward: counts (nodes migrated by type/scope, ledger entries, drift items); states assigned.
