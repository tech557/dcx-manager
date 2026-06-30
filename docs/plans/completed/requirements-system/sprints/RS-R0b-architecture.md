## RS-R0b — Operational & enforcement architecture (PO sign-off gate)
Status: Completed — PO signed off 2026-06-29 (see output-review/RS-R0b-review.md); RS-R1 + RS-R5 unblocked

### Intent
Design **how the conceptual model (RS-R0a) is stored, mutated, enforced, reconciled, queried, wired into
agents, and made to survive across agents** — and produce the **concrete sample records** and the
**Behavior-Sustaining Map**. Ends with the **PO sign-off that covers both RS-R0a and RS-R0b. Nothing builds
until this sign-off is recorded.**

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R0a). Read `code-index/` shape and
`scripts/agent/code-query.sh` so the reconciliation design reuses, not reinvents, them. Read the skill
format (`agent-skills/*/SKILL.md`) and `scripts/agent/sync-skills.sh` (note its hardcoded `SKILLS=()`).

### Scope — in
- **Storage engine + stack.** Evaluate options for a **typed graph** against ALL hard constraints
  (human-edit ergonomics, machine-checkability, diff-ability, automation cost, low-token query): e.g.
  structured JSON/YAML node files + generated views; SQLite (graph-as-tables) + generated spreadsheet/docs;
  a hybrid. Recommend one. Repo default runtime is node + `npm run` scripts (Vite/React/TS). Trees are
  **generated views** over the graph, not the storage.
- **Mutation / sign-off workflow.** `propose` (staging) → PO sign-off → `apply-after-signoff` (commit);
  supersession records the suppressed node + by/when/why; no silent writes; locked records change only by
  governed supersession. Name exact command(s).
- **Validator catalog.** Enumerate every validator RS-R1 builds: schema validity; **progressive** per-state
  field requirements (drafts don't fail for missing impl fields); relationship integrity (dangling, orphan,
  cycle, double-supersede); scope/type taxonomy; derivation-link integrity (product→technical/test);
  lock enforcement (illegal-edit-to-locked); provenance/confidence presence where required; expected-vs-
  actual manifestation coverage; exemption validity.
- **Reconciliation engine design (reuse `code-index`/`code-query.sh`).** Specify: the manifestation
  inventory pass over existing code; the candidate-mapping inference (names, imports, usages, selectors,
  labels, tests, plans, diffs, existing links, graph context) with **confidence · evidence · reason ·
  needs-confirmation**; the **auto-apply rule** (high-confidence *technical* links only, with an audit
  record) vs the **review queue** for ambiguity; the **change-triggered** check that runs **before work is
  marked done** (the questions in README Core model §9); the code-index **refresh hook**
  (`npm run generate:code-index`). **Document why a new indexer is NOT needed** (or, if proven
  insufficient, exactly what is missing).
- **Queues & views.** Define the reconciliation/governance queues (README Core model §11) as queries over
  the graph; the human-editable/preview surface; and the **low-token agent query** (`query --by-id/--scope/
  --feature/--layer`, plus top-down `trace --from <intent>` and bottom-up `justify --manifestation <id>`).
  Agents read a small slice, never the whole store.
- **Bidirectional answerability as a gate.** Specify how top-down (intent→evidence + coverage gaps) and
  bottom-up (manifestation→justifying intent or exemption) become **completion-gate** checks, not just
  reports.
- **Skills + agent-rule + hooks/gates wiring blueprint.** Which skills exist (intake/maturation/reconcile),
  which `AGENTS.md`/`core.md` rules make the behaviors mandatory, which hooks/gates enforce them, and how
  `dcx-sprint-planner`/`dcx-plan-audit` enforce graph-ID grounding + the mandatory Requirement Trace.
- **Mandatory plan-output Requirement Trace format.** The exact generated section every plan/sprint output
  must carry: IDs, scope/type, governance/maturity/delivery state, source/locked status, acceptance
  outcomes, responsibilities, expected vs actual manifestations (files/functions/selectors/scripts/skills/
  rules/hooks/tests), evidence, impact/dependency notes, coverage status.
- **Self-governance design.** The locked source product requirement ("every meaningful manifestation must
  trace to approved intent or be classified governed exempt") and how the system traces its own artifacts.
- **Behavior-Sustaining Map (REQUIRED).** For every major behavior (intake, maturation, mutation/sign-off,
  validation, reconciliation, queues, verification, grounding-in-plans, self-governance), a row covering
  all 10 points in README **Behavior-sustaining architecture**.
- **Disposition/archive policy.** The keep/merge/remove → **archive-to-`docs/archive/`** rule RS-R10
  applies, file-by-file, PO-gated. (Do **not** cite `core.md §32` — that is evidence paths.)
- **Migration strategy.** How RS-R5 inventory + RS-R6 migration populate the graph and classify into chain
  layers & states; how RS-R7 reconciles existing code.
- **Concrete sample records (REQUIRED output).** Real samples showing the final shape:
  - one product **Intent** → derived **Requirement** (scoped) with all three states;
  - its **Behaviors/AcceptanceOutcomes**, **SystemResponsibilities**, **ExpectedManifestationCategories**;
  - **Manifestation** nodes + **TraceLink** records (incl. a `partially-implements` and a low-confidence
    candidate awaiting confirmation);
  - an **Exemption** record; an **Evidence** record bound to a specific acceptance outcome;
  - a **locked** example and a **superseded** example (with the supersession ledger entry);
  - a generated **plan-output Requirement Trace** example; a **low-token query** example (top-down and
    bottom-up).
- **Worked end-to-end examples (REQUIRED):** (a) how D-02 (with FCS-002 supersession) flows through the
  governed workflow; (b) how a plain-English PO request flows through the §33-anchored intake → candidate →
  PO-confirm → contradiction/impact → responsibilities → expected categories → trace; (c) how a new code
  change triggers reconciliation before "done."

### Required output template (STRICT — `output/RS-R0b-architecture.md`)
Because this is the highest-risk handoff (it carries most of the architecture), the output must use these
exact top-level headings, in order, so the PO and RS-R1–R4 executors can find each decision:
1. **Storage engine & stack** (options table + recommendation)
2. **Command-name table** — every command later sprints will build, with name, owning sprint, and purpose
   (`validate`, `propose`, `apply-after-signoff`, `generate-views`, `query`, `trace`, `justify`,
   `reconcile`, change-trigger check, refresh hook). RS-R1/R2/R3/R4 must use these exact names.
3. **Validator catalog table** — one row per validator (name, what it checks, error class, owning sprint).
4. **Mutation / sign-off workflow**
5. **Reconciliation engine design** (incl. the explicit "why no new indexer" note + change-trigger)
6. **Queues & views + low-token query/trace/justify**
7. **Bidirectional answerability as a gate**
8. **Skills + agent-rule + hooks/gates wiring blueprint** + **mandatory Requirement Trace format**
9. **Self-governance design**
10. **Behavior-Sustaining Map** (one row per major behavior, all 10 points filled)
11. **Disposition/archive policy** and **migration strategy**
12. **Concrete sample records** — **≥ one record per node type** listed in scope, plus a locked example, a
    superseded example (with its ledger entry), a plan-output Requirement Trace, and top-down + bottom-up
    low-token query examples.
13. **Worked end-to-end examples** — the three named in scope.
14. **PO sign-off checklist** — a checkbox list the PO ticks to record the gate (covers RS-R0a + RS-R0b).

### Scope — out
- No build, no migration, no doc deletion. Design + recommendation + samples only. Do not pre-commit the PO
  to a format — present options and a recommendation for sign-off.

### Acceptance criteria
- [ ] (PO-verifiable) `output/RS-R0b-architecture.md` covers every in-scope item with a recommendation each.
- [ ] (PO-verifiable) Honors **all** README hard constraints (Section A preserved + Section B new); each
      maps to a concrete mechanism.
- [ ] (PO-verifiable) The reconciliation design **reuses `code-index`/`code-query.sh`** (or documents why
      it cannot) and defines the change-triggered pre-done check.
- [ ] (PO-verifiable) The **Behavior-Sustaining Map** is present and every row fills all 10 points; the
      architecture is not reduced to files/folders/schema.
- [ ] (PO-verifiable) The Map includes a **per-phase Skills × Automation-tier × PO-gate view** (table +
      diagram): every operational phase names the skill that runs it, exactly what is mechanically automated
      (validator/hook/gate, no human), and where the PO gates and why it cannot be automated; new skills are
      marked vs existing. (Closes the "I don't see the skills in the process diagram" gap — see README
      §"Skills &amp; automation per phase".)
- [ ] (PO-verifiable) **Concrete sample records** present for every node type listed above, plus a locked +
      a superseded example, a plan-output Requirement Trace, and top-down + bottom-up low-token queries.
- [ ] (PO-verifiable) The three worked end-to-end examples are present.
- [ ] (PO-verifiable) The output follows the **Required output template** (all 14 headings present; the
      command-name table and validator-catalog table are filled; ≥ one sample record per node type; the PO
      sign-off checklist is present).
- [ ] **(GATE) PO sign-off recorded (covers RS-R0a + RS-R0b) before RS-R1/RS-R5 start.**
- [ ] (code-verifiable) No `src/` change; only `output/*.md` written (path + mtime check).

### Verification plan
| Criterion | Method | Fallback |
|---|---|---|
| constraints mapped | cross-ref README hard constraints → design mechanism | — |
| reconciliation reuses code-index | design cites `code-query.sh` commands + refresh hook | document insufficiency if claimed |
| sign-off/supersession real | worked example (D-02) walks end-to-end | — |
| no source changed | path list + `src/` mtime | — |

### Dependencies
RS-R0a. **Blocks all build sprints** (sign-off gate). RS-R5 (inventory) may start after this sign-off.

### Executor
Claude (design-heavy). PO signs off.

### Final step
Append to README carry-forward: chosen storage/stack, exact command names to be built (`validate`,
`propose`, `apply-after-signoff`, `reconcile`, `query`, `trace`, `justify`), skill names, the Requirement
Trace format location, and the disposition policy — so RS-R1+ inherit them.
