---
output: RS-R0a-conceptual-model
plan: requirements-system
sprint: RS-R0a
agent: Codex
date: 2026-06-29
status: completed-for-RS-R0b-review
---

# RS-R0a — Conceptual Model & Graph Design

## 1. Source Manifest

| Source | Included? | Reason |
|---|---:|---|
| `docs/plans/active/requirements-system/README.md` | yes | Active plan goal, hard constraints, carry-forward contract, sprint sequence. |
| `docs/plans/active/requirements-system/sprints/RS-R0a-conceptual-model.md` | yes | Sprint scope and acceptance criteria. |
| `docs/plans/active/requirements-system/sprints/_superseded-2026-06-29-flat-model/RS-R0-methodology-design.md` | yes | Prior flat-model design being replaced. |
| `docs/plans/on-hold/frontend-polish-v0.3.5/output/requirements-recovery.md` | yes | Evidence of missed CSV/v0.1.4 requirement families and reconciliation rule. |
| `docs/plans/on-hold/frontend-polish-v0.3.5/output/core-interaction-model.md` | yes | PO-confirmed builder interaction model and new behavior requirements. |
| `docs/plans/on-hold/frontend-polish-v0.3.5/output/decision-register.md` | yes | Closed D-01..D-12 decisions, including refined D-02. |
| `docs/plans/on-hold/frontend-polish-v0.3.5/output/FP-RC-requirements-system-design.md` | yes | Superseded sketch; read to avoid repeating markdown-only design. |
| `src/**` | no | RS-R0a is design-only; no code inspection or code edits required. |

## 2. Conceptual Chain

The requirements system stores a typed graph that can render tree-like views. The conceptual chain is:

`product intent -> requirement -> rules & behaviors -> system responsibilities -> expected manifestation categories -> actual technical manifestations -> verification evidence`

Layer definitions:

| Layer | Meaning | Adjacent-boundary rule |
|---|---|---|
| Product intent | Human goal, problem, desired outcome, or PO direction before it is normalized. | Intent is not yet a buildable requirement; it can be partial and question-bearing. |
| Requirement | A scoped, governed statement of what must be true. | Requirements normalize intent and can derive narrower technical/test requirements. |
| Rules & behaviors | Conditions, exceptions, interaction rules, state rules, and acceptance outcomes that make a requirement testable. | Behaviors explain how a requirement must hold; acceptance outcomes are the proof targets. |
| System responsibilities | Product-neutral duties the system must perform to satisfy behaviors. | Responsibilities bridge product language to technical manifestations without forcing the PO to name code. |
| Expected manifestation categories | The kinds of places where implementation is expected to exist. | Expected categories are declared before implementation so partial coverage is visible. |
| Actual technical manifestations | Durable, smallest meaningful places where behavior materially exists. | Manifestations are first-class objects with lifecycle and identity independent from file paths. |
| Verification evidence | Proof attached to specific acceptance outcomes. | Evidence verifies outcomes, not requirements in general. |

Top-down traversal asks: given an intent, which requirements, behaviors, responsibilities, manifestations,
and evidence satisfy it, and where is coverage missing or stale?

Bottom-up traversal asks: given a manifestation, which approved intent or responsibility justifies it, or
which explicit exemption class governs it?

## 3. Node Taxonomy and ID Scheme

Canonical node types:

| Type | Prefix | Purpose |
|---|---|---|
| Intent | `INT-` | Raw or normalized product/business intent. |
| Requirement | `REQ-` | Governed requirement with scope and lifecycle. |
| BehaviorRule | `BHV-` | Rule, condition, exception, or behavior constraint. |
| AcceptanceOutcome | `AC-` | Specific outcome that evidence must prove. |
| SystemResponsibility | `RSP-` | System duty derived from requirements/behaviors. |
| ExpectedManifestationCategory | `EMC-` | Expected implementation/evidence category. |
| Manifestation | `MAN-` | Actual meaningful product, code, tooling, rule, skill, test, or evidence location. |
| TraceLink | `TRC-` | Typed relationship record between graph nodes. |
| Evidence | `EVD-` | Verification proof bound to acceptance outcomes. |
| Exemption | `EXM-` | Governed reason an unlinked manifestation is valid technical work. |
| DecisionLedgerEntry | `LDG-` | Append-only decision, sign-off, supersession, or mutation record. |
| OpenQuestion | `QST-` | Explicit unresolved decision or missing fact. |

Requirement IDs preserve source-domain identity inside the `REQ-` namespace:

- CSV-style domain prefixes remain valid as requirement family codes: `STG`, `SBC`, `CRD`, `DZ`, `FCS`, `RDY`, `IFX`, `KBI`, `VHB`, `EVI`, etc.
- Newer `BLD-*`, `OD-*`, and decision IDs are aliases or provenance refs, not discarded.
- Example: `REQ-FCS-002` may carry aliases `FCS-002` and `D-02-refined`.

ID form:

`<NODE-PREFIX><scope-or-family>-<number-or-slug>`

Examples: `REQ-FCS-002`, `BHV-FCS-002-HIDE-NONMATCHING`, `RSP-FOCUS-FILTER-VISIBILITY`,
`EMC-FRONTEND-CONTROL`, `MAN-SKILL-REQUIREMENT-INTAKE`, `TRC-DERIVES-FCS-002-FOCUS-RSP`.

## 4. Cross-Scope Taxonomy

Allowed requirement scopes:

`product | frontend | backend | devops | test-qa | data | security | operations | governance | agent-workflow`

Rules:

- Product requirements are usually the locked source of truth.
- Frontend/backend/devops/data/security/test/governance/agent requirements normally derive from product requirements or from governed technical exemptions.
- Derived requirements use `derives-from` TraceLinks and keep their own lifecycle; locking a product requirement does not imply derived requirements are implemented.

Worked decomposition:

| Node | Scope | Statement | Relationship |
|---|---|---|---|
| `REQ-FCS-002` | product | Focus Isolation Mode can hide non-selected cards as an explicit opt-in mode without deleting data. | source product requirement |
| `REQ-FCS-002-FE` | frontend | The Focus Island exposes an explicit isolation toggle and renders non-matching cards hidden only while isolation is active. | derives-from `REQ-FCS-002` |
| `REQ-FCS-002-BE` | backend | No persistence mutation may occur when visual isolation hides cards. | derives-from `REQ-FCS-002` |
| `REQ-FCS-002-DATA` | data | Selection/focus state is transient view state, not canonical campaign data. | derives-from `REQ-FCS-002` |
| `REQ-FCS-002-DEVOPS` | devops | Verification gates must detect accidental persistence of focus-isolation visibility state. | derives-from `REQ-FCS-002` |
| `REQ-FCS-002-TQA` | test-qa | Tests prove default spotlight keeps all cards visible and opt-in isolation hides only non-matches. | derives-from `REQ-FCS-002` |

## 5. Three Separate State Dimensions

State dimensions are orthogonal:

| Dimension | Values |
|---|---|
| Governance | `draft -> proposed -> approved -> locked -> superseded -> archived` |
| Maturity / readiness | `intent-captured -> logic-defined -> behavior-defined -> decomposed -> implementation-ready` |
| Delivery / verification | `not-assessed -> not-started -> planned -> in-progress -> partially-implemented -> implemented -> verified -> blocked -> deprecated` |

Rules:

- `locked != implemented != verified`.
- Governance answers whether truth is authoritative and mutable.
- Maturity answers how structurally ready the node is.
- Delivery/verification answers whether implementation and proof exist.

Required combinations the model supports:

| Combination | Example |
|---|---|
| locked + not-started | `REQ-FCS-002` is approved product truth but no implementation sprint has begun. |
| locked + partially-implemented | Default spotlight is implemented, but opt-in isolation is missing. |
| locked + implemented-but-unverified | UI toggle exists, but tests/evidence do not yet prove no data deletion. |
| superseded + still-manifested-in-code | A prior hide-by-default rule is superseded but old code still hides cards by default. |

## 6. Progressive Maturation Matrix

| Governance x maturity state | Required fields | Optional fields |
|---|---|---|
| draft + intent-captured | id, scope, source/provenance, raw intent, problem/outcome, authoring actor, open questions | initial links, candidate family, confidence |
| proposed + logic-defined | draft fields, normalized statement, rationale, affected scope, candidate dependencies/conflicts, confirmation status | initial behaviors, proposed acceptance outcomes |
| approved + behavior-defined | proposed fields, rules/conditions/exceptions, acceptance outcomes, decision ledger ref | responsibilities, expected categories |
| locked + decomposed | approved fields, derived requirements, responsibilities, expected manifestation categories, relationship links | candidate manifestations, exemptions |
| locked + implementation-ready | decomposed fields, required coverage model, verification expectations, query tags | actual manifestations, evidence |
| superseded/archived | prior fields, superseded-by/suppressed-by link, reason, ledger ref, disposition | remaining manifestations, migration notes |

A draft passes validation with only: product intent, problem/outcome, initial logic if known, source/provenance, authoring actor, and open questions. It must not require implementation fields.

## 7. Provenance and Confidence Model

Every node and inference-capable field may carry:

`value, source, source_path, source_anchor, authoring_actor, inference_source, confidence, confirmation_status, derivation_reason, last_checked_date, evidence_refs`

Confirmation statuses:

`po-decided | agent-proposed | skill-derived | code-discovered | confirmed | verified | disputed | stale`

Rules:

- PO-decided truth outranks agent inference.
- Code-discovered facts can describe implementation but cannot silently approve product truth.
- Verified means backed by evidence for an acceptance outcome, not merely linked to code.
- Confidence belongs to the inference, not to the product requirement's authority.

## 8. System Responsibilities and Expected Categories

Responsibility types:

`ui-presentation | interaction | domain-logic | state | data | persistence | service-integration | validation | security | operations | governance | agent-workflow | verification`

Expected manifestation category examples:

| Responsibility type | Expected categories |
|---|---|
| ui-presentation | component, visual state, accessible label, design token |
| interaction | event handler, command/action, keyboard shortcut, drag/drop behavior |
| domain-logic | rule function, selector, state transition |
| state | store field, reducer/action, context provider |
| data/persistence | type/schema, mapper, storage field, migration |
| governance | agent rule, validator, ledger entry, sign-off workflow |
| agent-workflow | skill, generated context, planner/audit check |
| verification | unit test, e2e test, manual evidence, stale-evidence check |

Coverage is complete only when every required expected category has a valid manifestation or a governed exemption. One linked component does not make a requirement fully implemented.

## 9. Manifestation Object, Identity, Boundary, Lifecycle

Manifestation kinds:

`react-component | function | hook | store-action | state-transition | type | schema | endpoint | service | db-structure | selector | script | config | skill | agent-rule | validator | ci-hook | infra | test | evidence-artifact | documentation-view`

Durable identity scheme:

`MAN-<kind>-<semantic-owner>-<stable-slug>`

The identity is semantic and survives path movement. The manifestation stores current path(s) as attributes, not as its identity.

Lifecycle values:

`created | modified | renamed | moved | deleted | replaced | deprecated`

Smallest meaningful boundary:

- Trace the smallest unit that carries an independent rule, behavior, responsibility, state transition, external contract, or verification obligation.
- Do not trace every local variable, JSX wrapper, or trivial helper.
- Internals inherit the parent manifestation unless they encode a distinct rule or responsibility.

## 10. Trace-Link and Relationship Taxonomy

A TraceLink carries:

`id, source_node, target_node, relationship_type, coverage, confidence, evidence_refs, inference_source, confirmation_status, last_checked_date, verification_refs, stale_state`

Relationship types:

`derives-from | decomposes-into | implements | partially-implements | enforces | displays | persists | configures | validates | verifies | supports | depends-on | conflicts-with | supersedes | exempt-from-trace`

Coverage values:

`complete | partial | missing | stale | invalidated | exempt`

TraceLinks are many-to-many and are themselves auditable records.

## 11. Exemption Taxonomy

Exemption categories:

`infrastructure | refactoring | generated-code | build-tooling | internal-dev-tooling | observability | security-hardening | defect-correction | dependency-maintenance | migration-compatibility`

Rules:

- Unlinked never means ignored.
- Every meaningful manifestation is either linked to a requirement/responsibility or attached to an `EXM-` node.
- Exemptions need reason, owner/actor, date, scope, and review status.

## 12. Verification Model

Implemented and verified are separate:

- Implemented: required responsibilities have sufficient actual manifestation coverage.
- Verified: evidence proves specific acceptance outcomes.

Evidence binds to `AC-` nodes. A requirement can be:

`implemented-but-unverified | partially-verified | verified-with-stale-edge-case | invalidated-by-change | verified`

A material manifestation change can mark linked evidence stale unless the change record explains why the evidence remains valid.

## 13. RS-R0b Handoff Decisions

RS-R0b must turn this conceptual model into an operational architecture:

- storage stack and file layout
- validator catalog for the three dimensions and progressive matrix
- concrete sample records for every node type
- exact command names
- sign-off workflow and ledger mechanics
- reconciliation queues and generated low-token views
- Behavior-Sustaining Map
- mandatory Requirement Trace format

## 14. Acceptance Evidence

| RS-R0a criterion | Evidence in this output |
|---|---|
| Defines every in-scope item | Sections 2-12. |
| Three state dimensions separate and four combinations shown | Section 5. |
| Progressive maturation matrix with draft passing intent-only fields | Section 6. |
| Responsibilities, expected categories, manifestation identity/boundary, trace links, exemptions, verification | Sections 8-12. |
| Worked cross-scope decomposition | Section 4. |
| No `src/` change | Design output only; path/mtime check recorded in session log. |
