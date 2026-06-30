## RS-R0a — Conceptual model & graph design
Status: Completed

### Intent
Design the **conceptual core** of the product-intelligence graph — the chain, the node taxonomy, the three
state dimensions, progressive maturation, the provenance/confidence model, the responsibilities layer,
manifestation identity, and the trace-link/relationship/exemption/verification taxonomies. This is design,
not a system; it pairs with RS-R0b under a single PO sign-off (gate is at the end of RS-R0b).

### Step 0 — Session environment + read
Run `build-current-state.sh` + `verify-tooling-state.sh`; log. Read this README (esp. **Core conceptual
model** + **Hard constraints**), the on-hold plan's `output/{requirements-recovery,core-interaction-model,
decision-register}.md`, and the superseded flat-model RS-R0
(`sprints/_superseded-2026-06-29-flat-model/RS-R0-methodology-design.md`) for what is being replaced.

### Scope — in
- **The chain, made precise.** Define each layer of `product intent → requirement → rules & behaviors →
  system responsibilities → expected manifestation categories → actual manifestations → verification
  evidence`, what distinguishes adjacent layers, and what it means to traverse it **top-down and
  bottom-up**.
- **Node taxonomy + ID scheme.** Finalize the first-class node types (Intent, Requirement[scoped],
  Behavior/Rule, AcceptanceOutcome, SystemResponsibility, ExpectedManifestationCategory, Manifestation,
  TraceLink, Evidence, Exemption, DecisionLedgerEntry, OpenQuestion — add/refine with rationale). Keep CSV
  domain prefixes (STG/SBC/CRD/DZ/FCS/RDY…) for requirement scoping; propose node-type-prefixed IDs (e.g.
  `INT-`, `REQ-`, `BHV-`, `AC-`, `RSP-`, `EMC-`, `MAN-`, `TRC-`, `EVD-`, `EXM-`, `LDG-`). Alias `BLD-/OD-`.
- **Cross-scope taxonomy.** The `scope/type` set `product | frontend | backend | devops | test-qa | data |
  security | operations | governance | agent-workflow`. Rule: **product requirements are usually the locked
  source; technical/test requirements derive from them.** Show a worked decomposition: one product
  requirement → derived frontend + backend + devops + test-qa requirements.
- **Three SEPARATE state dimensions** (governance / maturity / delivery-verification) with concrete value
  names. Prove the model represents `locked + not-started`, `locked + partially-implemented`,
  `locked + implemented-but-unverified`, `superseded + still-manifested-in-code`. **State explicitly that
  `locked ≠ implemented ≠ verified`.**
- **Progressive maturation matrix.** For each (governance × maturity) state, the **required vs optional**
  fields. A draft (intent + problem/outcome + initial logic + provenance + open questions) must pass;
  implementation fields are not required until the matching maturity. Validation tightens as it matures.
- **Provenance & confidence model.** The field/node metadata set: value · source · authoring actor ·
  inference source · confidence · confirmation status · derivation reason · last-checked date · evidence.
  Define how the system distinguishes PO-decided vs agent-proposed vs skill-derived vs code-discovered vs
  confirmed vs verified.
- **System Responsibilities layer.** Finalize responsibility types (UI/presentation, interaction, domain
  logic, state, data, persistence, service/integration, validation, security, operations, governance,
  agent-workflow, verification) and how `requirement → responsibilities → expected manifestation
  categories` works. Define how **expected categories** are set before implementation and how
  coverage = complete/partial is computed.
- **Manifestation object + identity + boundary.** Define the manifestation kinds (components, functions,
  hooks, store actions, state transitions, types, schemas, endpoints, services, DB structures, selectors,
  scripts, config, **skills, agent rules, validators, CI/automation hooks**, infra, tests, evidence). Define
  **durable, non-path identity** and lifecycle (create/modify/rename/move/delete/replace/deprecate). Define
  the **"smallest meaningful manifestation" boundary** — minor internals inherit a parent's trace unless
  they encode a distinct rule/responsibility.
- **Trace-link & relationship taxonomy.** TraceLink as a first-class record (source, target, relationship
  type, coverage, confidence, evidence, inference source, confirmation status, last-checked, verification
  refs, stale/broken). Relationship types: derives-from, decomposes-into, implements,
  partially-implements, enforces, displays, persists, configures, validates, verifies, supports,
  depends-on, conflicts-with, supersedes, exempt-from-trace. Must be many-to-many.
- **Exemption taxonomy.** Typed exempt categories (infrastructure, refactoring, generated code, build
  tooling, internal dev tooling, observability, security hardening, defect correction, dependency
  maintenance, migration/compatibility) and the rule "unlinked ≠ ignored."
- **Verification model (conceptual).** `implemented` (sufficient manifestation coverage of expected
  categories) vs `verified` (evidence proves acceptance outcomes); evidence binds to **specific acceptance
  outcomes**; partial/stale/invalidated verification; change-triggered staleness.

### Scope — out
- No storage engine choice, no validators, no workflow, no reconciliation engine, no sample-record exhibit
  — those are RS-R0b. No build, no migration, no doc deletion.

### Acceptance criteria
- [ ] (PO-verifiable) `output/RS-R0a-conceptual-model.md` defines every in-scope item above.
- [ ] (PO-verifiable) The three state dimensions are separate and the four named combinations are shown.
- [ ] (PO-verifiable) The progressive maturation matrix lists required vs optional fields per state, and a
      draft demonstrably passes with only intent-level fields.
- [ ] (PO-verifiable) The responsibilities layer + expected manifestation categories + manifestation
      identity/boundary + trace-link/relationship/exemption/verification taxonomies are all specified.
- [ ] (PO-verifiable) Worked cross-scope decomposition: one product requirement → derived frontend/backend/
      devops/test-qa requirements with `derives-from`.
- [ ] (code-verifiable) No `src/` change; only `output/*.md` written (path + mtime check).

### Verification plan
| Criterion | Method | Fallback |
|---|---|---|
| state dimensions separable | the 4 combination examples render in the model | — |
| progressive maturation | a draft sample passes with intent-only fields | — |
| no source changed | path list + `src/` mtime | — |

### Dependencies
None. Pairs with RS-R0b; the PO sign-off gate is at the end of RS-R0b. Blocks all build sprints.

### Executor
Claude (design-heavy; holds this session's product context).

### Final step
Append to README carry-forward: the node taxonomy, ID prefixes, state-dimension value names, and the
maturation matrix so RS-R0b and the build sprints inherit them.
