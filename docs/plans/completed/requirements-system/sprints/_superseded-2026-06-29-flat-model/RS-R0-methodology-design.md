## RS-R0 — Methodology & System Design (PO sign-off gate)
Status: Drafted

### Intent
Design the requirements system — storage, schema, ID scheme, governed-mutation/sign-off workflow,
relationship model, automation surface, and human+agent access — and get **PO sign-off before any build**.
This sprint produces a design, not a system.

### Step 0 — Session environment + read
Run `build-current-state.sh` + `verify-tooling-state.sh`; log. Read this plan README, and the on-hold
plan's `output/{requirements-recovery,core-interaction-model,decision-register}.md` (the evidence + the
first dataset).

### Scope — in
- **Evaluate storage options against ALL README hard constraints**: e.g. CSV-as-canonical + tooling;
  SQLite + generated views; structured YAML/JSON + generated spreadsheet + docs. Recommend one, with
  trade-offs on human-edit ergonomics, machine-checkability, diff-ability, and automation cost.
- **Schema**: requirement fields (id, statement, status, priority, domain, provenance, related, depends-on,
  supersedes/superseded-by, decision-ref, affected-modules, last-changed), and the decision-ledger entry
  shape (append-only).
- **ID scheme**: confirm/extend the CSV domain prefixes (STG/SBC/CRD/DZ/FCS/RDY…) as canonical; alias
  `BLD-/OD-`. (Default — RS-R0 may propose otherwise with rationale.)
- **Governed-mutation / sign-off workflow**: how an agent PROPOSES an add/change, how the PO reviews and
  signs off, how a **supersession** records the suppressed entry + reason — mechanically (staging area,
  pending-changes file, PR-like flow, or tool command). No silent writes.
- **Relationship model + checks**: define related/depends-on/supersedes semantics and the validations
  (dangling ref, orphan, cycle, double-supersede).
- **Automation surface**: which scripts/commands exist (validate, index/generate views, propose-change,
  apply-after-signoff) and where they live (`scripts/` or a tool dir).
- **Human + agent access**: the human-editable surface and the agent-readable/queryable surface, and how
  they stay in sync (single source + generated derivatives).
- **Agent wiring contract**: the rules RS-R5 will add (ground-in-IDs, request-sign-off, run-validators).
- **Intake target model (wired to `core.md §33`, NOT reinvented).** Specify how a plain-English user
  message — already typed by §33 — is assessed as a *candidate requirement*: propose → PO-confirm →
  contradiction/duplicate/supersession check → impact analysis → technical trace. Adopt the 7-step target
  from `on-hold/frontend-polish-v0.3.5/audit/2026-06-29-codex-target-fit-addendum.md`. Design the
  *mechanism*; per PO the spec need not be exhaustive — lock the §33 hook.
- **Intake as a skill.** Design the intake/proposal flow as a **`dcx-requirement-intake` skill** (canonical
  `agent-skills/` → `.claude/skills/` + `.agents/skills/`), and how `dcx-sprint-planner` / `dcx-plan-audit`
  will **enforce requirement-ID grounding** on every plan/sprint.
- **Technical-trace layer = a consumer of `code-index/` + `scripts/agent/code-query.sh`** (not a new
  indexer); define the refresh hook.
- **Skill distribution:** how `sync-skills.sh` ships skills to all agent dirs (fix the current gap where
  `.agents/skills/` has only `impeccable`).
- **Disposition/archive policy:** the keep/merge/remove/**archive-to-`docs/archive/`** rule RS-R5 applies
  (replaces the incorrect `§32` reference; §32 is evidence paths, not archival).
- **Tooling stack:** name it (repo is Vite/React/TS → node + `npm run` scripts) so later gate commands are concrete.
- **Cross-scope object model (constraint 10).** Define the `scope/type` taxonomy (product/frontend/backend/
  devops/test-qa/data/security/operations/agent-workflow), derivation links (derives-from, dependency
  direction), ownership, and verification mode. State the rule: **product requirements are usually the
  locked source; technical/test requirements derive from them.** Show a worked decomposition: one product
  requirement → derived frontend + backend + devops + test requirements.
- **Lock lifecycle (constraint 11).** Define states `draft → proposed → approved → locked → superseded →
  archived`, lock owner + date, and immutability (locked records change only by governed supersession).
- **Plan-output Requirement Trace format (constraint 12).** Define the exact generated section every plan/
  sprint output must carry (IDs, scope/type, source/locked, acceptance, affected files/functions/selectors/
  scripts, tests/gates, impact, status) and how `dcx-sprint-planner`/`dcx-plan-audit` enforce it.
- **Human-edit/preview + low-token query (constraint 13).** Evaluate editing/preview surfaces (CSV/
  spreadsheet, SQLite admin/browser, Obsidian-style markdown/graph, generated docs) AND the agent query
  slice; specify the **low-token contract** (agents query by ID/scope/feature; never read the whole store).
- **Concrete sample records (REQUIRED output).** RS-R0 must show the final shape with real samples: a
  product source requirement; derived frontend/backend/devops/test requirements; a locked + a superseded
  example; a plan-output Requirement Trace example; and a low-token agent query example.

### Scope — out
- No build, no migration, no doc deletion. Design + recommendation only.
- Do not pre-commit the PO to a format — present options and a recommendation for sign-off.

### Acceptance criteria
- [ ] (PO-verifiable) `output/RS-R0-system-design.md` covers every in-scope item (storage, schema, IDs,
      sign-off workflow, relationships, automation, access surfaces, agent wiring, intake-via-§33,
      intake-as-skill, code-index trace, skill-sync, disposition policy, stack) with a recommendation each.
- [ ] (PO-verifiable) Honors all 13 README hard constraints; each maps to a concrete mechanism.
- [ ] (PO-verifiable) Defines the cross-scope object model (10), lock lifecycle (11), plan-output trace
      format (12), and low-token/editing surfaces (13).
- [ ] (PO-verifiable) **Concrete sample records** present: a product source req → derived frontend/backend/
      devops/test reqs; a locked + a superseded example; a plan-output Requirement Trace example; a
      low-token query example.
- [ ] (PO-verifiable) Worked examples: (a) how D-02 (with FCS-002 supersession) is entered; (b) how a
      plain-English request flows through the §33-anchored intake to an approved, traced requirement.
- [ ] **(GATE) PO sign-off recorded before RS-R1 starts.**
- [ ] (code-verifiable) No `src/` change; only `output/*.md` written (path + mtime check).

### Verification plan
| Criterion | Method | Fallback |
|---|---|---|
| constraints mapped | cross-ref README §constraints → design | — |
| sign-off flow is real | worked example (D-02 supersede) walks end-to-end | — |
| no source changed | path list + `src/` mtime | — |

### Dependencies
- None. First sprint. **Blocks all later RS sprints** (gate).

### Executor
- Claude or Codex (design-heavy). PO signs off.

### Final step
Append to README carry-forward: chosen approach (post-sign-off), and the schema/ID/workflow decisions so
RS-R1+ inherit them.
