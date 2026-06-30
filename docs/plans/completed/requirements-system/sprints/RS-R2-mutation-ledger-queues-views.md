## RS-R2 — Governed mutation/sign-off + ledger + queues + views + low-token query
Status: Completed with documented debt

### Intent
Build the **governed-mutation workflow**, the **append-only ledger**, the **reconciliation/governance
queues**, the **generated human views**, and the **low-token agent query/trace/justify** surfaces — on top
of RS-R1's store + validators.

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R0b + RS-R1).

### Scope — in
- **Governed mutation:** `propose` (staging) → PO sign-off → `apply-after-signoff` (commit). Supersession
  records the suppressed node + by/when/why. **No silent write.** Locked nodes change only by supersession.
  Exact command names declared.
- **Append-only decision ledger:** every governed mutation emits an immutable `DecisionLedgerEntry`
  (date, actor, action, supersedes, source, affected node IDs). Past entries are never edited.
- **Reconciliation/governance queues (README Core model §11):** as queries over the graph — requirements
  needing classification/decomposition/expected-categories; lacking manifestations; partially implemented;
  implemented-but-unverified; manifestations lacking requirements; candidate links awaiting confirmation;
  stale/broken traces; moved/deleted/replaced manifestations; superseded-still-in-code; tests disconnected
  from active acceptance outcomes; verification gone stale; exemptions awaiting review. (The *engine* that
  populates link/manifestation data is RS-R3; RS-R2 ships the queue queries + empty/fixture behavior.)
- **Generated human view(s):** the human-editable/preview surface (per RS-R0b) derived from the single
  canonical graph (`generate-views`). Trees-as-views over the graph.
- **Low-token agent query/trace/justify:** `query --by-id/--scope/--feature/--layer`; **top-down**
  `trace --from <intent>` (→ requirements → behaviors → responsibilities → expected vs actual
  manifestations → evidence, with coverage gaps); **bottom-up** `justify --manifestation <id>` (→ the
  approved intent/requirement, or the exemption). Returns a **small slice**, never the whole store.
- **Unit tests** for the supersession/sign-off path, ledger append-only behavior, each queue query, and the
  trace/justify slices.

### Scope — out
- The reconciliation **engine** (manifestation inventory + candidate inference + change-trigger) is RS-R3.
  No requirement DATA migrated beyond fixtures (RS-R6). No agent-rule edits / skills (RS-R4).

### Acceptance criteria
- [ ] (code-verifiable) `propose` / `apply-after-signoff` / `generate-views` / `query` / `trace` /
      `justify` exist with exact names; declared in carry-forward.
- [ ] (PO-verifiable) A write without sign-off is blocked; a supersession records the suppressed node +
      reason; the ledger entry is appended and past entries are immutable.
- [ ] (code-verifiable) Each queue query returns the correct set on fixtures (incl. empty-graph behavior).
- [ ] (code-verifiable) `trace --from` (top-down, with coverage gaps) and `justify --manifestation`
      (bottom-up) both return small slices on fixtures — **bidirectionality demonstrated**.
- [ ] Gates: `npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test`.
      §28 fallbacks named.

### Dependencies
RS-R1. Feeds RS-R3/R6/R7/R8/R9.

### Executor
Codex (tooling).

### Final step
Carry-forward: workflow + query/trace/justify command names; ledger location; queue query names.
