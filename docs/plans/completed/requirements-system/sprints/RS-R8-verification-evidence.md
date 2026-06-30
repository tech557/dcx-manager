## RS-R8 — Verification evidence layer
Status: Completed (2026-06-29, Claude) — verification.ts + evidence binding + change-triggered staleness; gates green (79 tests). See README RS-R8 carry-forward (§871–892). [Header label corrected 2026-06-30 — work was complete; status was stale.]

### Intent
Make `implemented` and `verified` genuinely separate and operational: bind **evidence to specific
acceptance outcomes**, support partial/stale/invalidated verification, and prove that a material change to
a linked manifestation can mark related verification **stale / recheck-required**. Implement the mechanics
not already shipped in RS-R1 (schema) / RS-R3 (change-trigger), then prove them on migrated + reconciled
data.

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R6 populated graph + RS-R7
coverage). Confirm the verification fields/states from RS-R1 and the change-trigger from RS-R3.

### Scope — in
- **Evidence binding:** `Evidence` nodes attach to **specific AcceptanceOutcome** nodes (not to a
  requirement in general), each with provenance (test id / screenshot / log / gate run), date, and result.
- **Implemented ≠ verified:** the delivery state computes `implemented` from manifestation **coverage of
  expected categories**, and `verified` only from **evidence proving acceptance outcomes**. A
  `locked + implemented-but-unverified` node is representable and queryable.
- **Partial / stale / invalidated verification:** support partially-verified requirements, unverified
  conditions, missing edge-case evidence, stale verification, invalidated verification, and **evidence that
  remains valid after a change with a recorded reason**.
- **Change-triggered staleness:** wire (with RS-R3) so a material change to a linked manifestation marks
  the dependent verification stale / recheck-required and surfaces it in the "verification gone stale"
  queue.
- **Prove on real data:** attach evidence to a sample of migrated/reconciled acceptance outcomes; then
  simulate a manifestation change and show the dependent verification flips to stale.
- **Unit tests** for the implemented-vs-verified computation, partial/stale/invalidated states, and
  change-triggered staleness.

### Scope — out
- Not the full re-verification of the whole codebase (that is ongoing operation, not this sprint). No
  product-code change. No dogfood corpus entry (RS-R9).

### Acceptance criteria
- [ ] (code-verifiable) Evidence binds to specific AcceptanceOutcome nodes (tested).
- [ ] (code-verifiable) `implemented` and `verified` are computed independently; `implemented-but-
      unverified` is representable and returned by a query (tested).
- [ ] (code-verifiable) Partial/stale/invalidated verification states are supported (tested).
- [ ] (PO/code-verifiable) A simulated manifestation change flips dependent verification to stale and it
      appears in the stale-verification queue (demonstrated).
- [ ] Gates & fallbacks: per README **Global sprint requirements** (validators + standard gates; §28).

### Dependencies
RS-R6 (data) + RS-R7 (manifestation links) + RS-R3 (change-trigger). Feeds RS-R9.

### Executor
Claude (verification semantics) + Codex (mechanics).

### Final step
Carry-forward: evidence-binding command/field names; how staleness is triggered; counts of outcomes with
evidence vs unverified.
