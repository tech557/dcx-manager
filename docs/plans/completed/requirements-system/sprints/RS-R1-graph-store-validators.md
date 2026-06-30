## RS-R1 — Graph store + schema + 3-state lifecycle + progressive validators
Status: Completed with documented debt

### Intent
Implement the canonical **typed-graph store + schema** (per the RS-R0-approved design) and the
**validator catalog** — the data layer + the checking layer. Not yet the mutation workflow (RS-R2), the
reconciliation engine (RS-R3), or any data (RS-R6).

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R0a/RS-R0b). Confirm the approved
node taxonomy, ID scheme, state-dimension value names, and the progressive-maturation matrix from the
carry-forward.

### Scope — in
- **Canonical typed-graph store + schema** for every approved node type (Intent, Requirement[scoped],
  Behavior/Rule, AcceptanceOutcome, SystemResponsibility, ExpectedManifestationCategory, Manifestation,
  TraceLink, Evidence, Exemption, DecisionLedgerEntry, OpenQuestion). Storage engine/stack per RS-R0b.
  Trees are **generated views**, not the storage shape (views ship in RS-R2).
- **Three state-dimension enums** (governance / maturity / delivery-verification) on the relevant nodes,
  with `locked`/`superseded`/`archived` semantics and lock owner + lock date.
- **Provenance/confidence fields** on nodes/fields per RS-R0a (value, source, authoring actor, inference
  source, confidence, confirmation status, derivation reason, last-checked, evidence).
- **Validators (exact named commands; declare for later sprints — `§28`):**
  - schema validity per node type;
  - **progressive per-state field requirements** — a `draft` with only intent-level fields PASSES; an
    `implementation-ready` node missing responsibilities/expected-categories FAILS; validation tightens
    with maturity;
  - relationship integrity (dangling, orphan, cycle, double-supersede);
  - scope/type taxonomy (allowed values) + derivation-link integrity (direction product→technical/test);
  - lock enforcement (reject in-place edit to a `locked` node — changes only via governed supersession);
  - expected-vs-actual manifestation **coverage** computation (complete/partial) given trace links;
  - exemption validity (typed + reasoned).
- **Unit tests** covering each error class **and** each progressive-maturation pass/fail boundary (a draft
  passing with intent-only fields is an explicit test, not just the failure cases).

### Scope — out
- No mutation/sign-off workflow, ledger, queues, or generated views (RS-R2). No reconciliation engine
  (RS-R3). No data migration (RS-R6). No agent-rule edits (RS-R4).

### Acceptance criteria
- [ ] (code-verifiable) A `validate` command exists with an exact name + path; later sprints may depend on
      it. Declared in the carry-forward.
- [ ] (code-verifiable) Validators catch each error class AND honor **progressive maturation** — a draft
      with only intent-level fields passes; an over-mature node missing required fields fails (both tested).
- [ ] (code-verifiable) Lock enforcement rejects illegal in-place edits to `locked` nodes (tested).
- [ ] (code-verifiable) Expected-vs-actual coverage returns complete/partial correctly on fixtures.
- [ ] Gates: `npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test`.
- [ ] §28 fallback documented if a command can't run in-session (manual check / BLOCKED log).
- [ ] No `src/` product change beyond the tooling dir the system needs (path check).

### Dependencies
RS-R0a + RS-R0b (sign-off). Feeds RS-R2/R3/R6.

### Executor
Codex (tooling).

### Final step
Carry-forward: exact `validate` command name/path + store location + the schema/state files so RS-R2/R3
build on them.
