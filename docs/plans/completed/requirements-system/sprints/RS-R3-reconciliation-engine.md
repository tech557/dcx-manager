## RS-R3 — Manifestation discovery + reconciliation engine + change-trigger
Status: Completed

### Intent
Build the **reconciliation engine**: it inventories meaningful manifestations from existing code (without
changing product code), proposes confidence-scored candidate trace links, auto-applies only high-confidence
technical links (with an audit record), routes ambiguity to the review queue, and runs **automatically
before work is marked done**. **Reuse `code-index/` + `scripts/agent/code-query.sh` — do not build a
competing indexer.**

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R0b + RS-R1/R2). Re-read
`code-query.sh` commands (`component`, `consumers`, `imports`, `labels`, `affected`, `unresolved`) and the
`code-index/*.json` shape so the engine consumes them.

### Scope — in
- **Manifestation inventory pass (read-only over `src/**` + `code-index/`):** enumerate manifestations at
  the RS-R0a "smallest meaningful" boundary; assign durable, **non-path** identity; record kind + lifecycle
  state. **No product-code change.**
- **Candidate-mapping inference:** propose `Manifestation ↔ Requirement/Responsibility` trace links using
  names, imports, usages, selectors, labels, tests, plans, diffs, existing links, and graph context. Every
  inference carries **confidence · evidence · reason · needs-confirmation**.
- **Detectors (the existing-code checks, README Core model §9):** manifestations with no requirement link;
  requirements with no manifestation; partial implementation (expected categories not all covered);
  stale/broken/deleted/moved/renamed/replaced traces; **superseded requirements still manifested in code**;
  **tests disconnected from active acceptance outcomes**. Results feed the RS-R2 queues.
- **Auto-apply vs review queue:** high-confidence **technical** links may auto-apply **only** under the
  RS-R0b rule **and with an audit-record ledger entry**; ambiguous/product-truth-affecting mappings enter
  the review queue. **Never silently approve ambiguity; never auto-modify product truth.**
- **Change-triggered reconciliation (`§9` questions):** a check that, for new/materially-changed
  manifestations, runs **before work can be marked done** and asks: which requirement/responsibility does
  this serve? already linked? new candidate requirement? exempt work? did it invalidate trace/verification?
  did coverage improve/regress/go stale? Wire it as a runnable command/hook (the agent-rule + completion
  gate that *requires* it is RS-R4).
- **Code-index refresh hook:** integrate `npm run generate:code-index` so the engine works against a fresh
  index; document staleness handling.
- **Unit tests** for inventory, inference confidence/evidence, each detector, auto-apply-with-audit vs
  queue routing, and the change-triggered check.

### Scope — out
- No agent rules / skills / completion-gate *enforcement* wiring (RS-R4 makes it mandatory). No full
  codebase reconciliation **run** (RS-R7). No requirement migration (RS-R6).

### Acceptance criteria
- [ ] (code-verifiable) `reconcile` (and the change-triggered check) exist with exact names; declared in
      carry-forward. The engine **consumes `code-index`/`code-query.sh`** (no new indexer) — shown in code.
- [ ] (code-verifiable) Inventory runs read-only (no `src/` product change — path + mtime check).
- [ ] (code-verifiable) Every candidate link carries confidence + evidence + reason + needs-confirmation
      (tested).
- [ ] (code-verifiable) Each detector returns the right set on fixtures, incl. superseded-still-in-code and
      tests-disconnected.
- [ ] (code-verifiable) Auto-apply only fires for high-confidence technical links and writes an audit
      ledger entry; ambiguous mappings go to the review queue (both tested).
- [ ] Gates: `npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test`.
      §28 fallbacks named.

### Dependencies
RS-R1 + RS-R2. Feeds RS-R4/R7/R8.

### Executor
Codex (tooling) + Claude (boundary/heuristic review).

### Final step
Carry-forward: exact `reconcile` + change-trigger command names; how the engine calls `code-query.sh`;
refresh-hook command; auto-apply threshold chosen.
