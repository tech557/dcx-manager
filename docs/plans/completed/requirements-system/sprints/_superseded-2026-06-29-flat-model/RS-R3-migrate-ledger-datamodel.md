## RS-R3 — Migrate sources + build ledger + data-model summary
Status: Drafted

### Intent
Populate the system from the RS-R1 reconciliation: canonical requirements with provenance, the append-only
decision ledger seeded with historical decisions, and a code-true data-model summary.

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R1 reconciliation + RS-R2a/R2b tooling).

### Scope — in
- Migrate reconciled requirements into the store (via the workflow), each with provenance + canonical ID,
  **classified into the scope/type model** (constraint 10: product/frontend/backend/devops/test/…) with
  derivation links and an initial lifecycle state (constraint 11) — product source reqs default toward
  `approved`/`locked` per PO; technical/test reqs `derives-from` them.
- Seed the decision ledger with the historical confirmed decisions (dated, with supersedes links).
- Build the data-model summary **code-true from `src/types/`**; log requirement-vs-code drift as ledger
  entries to resolve.
- Run validators; resolve all relationship errors.

### Scope — out
- Not this session's NEW decisions (that's RS-R4, the dogfood). No agent wiring (RS-R5).

### Acceptance criteria
- [ ] (code-verifiable) `validate` passes (0 dangling/orphan/cycle/double-supersede).
- [ ] (PO-verifiable) Every migrated requirement has provenance; ledger seeded.
- [ ] (PO-verifiable) Data-model summary matches `src/types`; drift logged as ledger entries.
- [ ] Gates & fallbacks: per README **Global sprint requirements** (validators + standard gates; §28 fallbacks).

### Dependencies
RS-R2. Feeds RS-R4.

### Executor
Claude or Codex.

### Final step
Carry-forward: counts (requirements migrated, ledger entries, drift items).
