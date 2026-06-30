## RS-R9 — Dogfood: session decisions + self-trace the system itself
Status: Completed (2026-06-29, OpenCode)

### Intent
Enter the 2026-06-29 session's decision corpus as the system's first NEW dataset **and** model the
**system's own chain** (self-governance, README Core model §13) — both through the governed sign-off
workflow, proving the system works end-to-end (incl. a real supersession) and that it can trace itself from
intent to manifestation to evidence.

### Step 0
Per README **Global sprint requirements** (env, read carry-forward). Read the on-hold plan's
`output/{decision-register,requirements-recovery,core-interaction-model}.md` **and** the session logs
`docs/progress/sessions/2026-06-29-claude/*` (the typed decision corpus).

### Scope — in
- **Ingest the session corpus** via `propose` → PO sign-off → `apply`:
  - D-01…D-12 (incl. **D-02 superseding the earlier highlight-only ruling** with FCS-002 isolation — the
    canonical supersession test);
  - the 4 core-model alignments (version-readiness rollup, smart-expand, auto-centre, drag-pill creation);
  - recovered requirements: keyboard layer, copy/paste, deselect, STG-004/DZ-001 movement, SBC card system,
    FCS-002, RDY-003, IFX-001, KBI-001.
  - Each: provenance (session + source doc), relationships, ledger entry, chain classification, states.
- **Self-trace the system itself (the locked source requirement + its chain):**
  - the **locked source product requirement** — *"every meaningful product or system manifestation must
    trace to approved product intent or be classified governed exempt technical work"*;
  - derived requirements across **product · frontend · backend/data · devops/tooling · test-qa ·
    security/operations · governance · agent-workflow** (e.g. human edit/preview view; graph store +
    validators; skill-sync tooling; validator/test suites; intake/maturation/reconcile skills + the §34
    loop);
  - their **responsibilities**, **expected manifestation categories**, and **actual manifestations** = the
    schema/stores/validators/scripts/skills/`AGENTS.md`+`core.md` rules/generated views/query mechanisms/
    hooks/tests/gates this plan built — each with `derives-from`/`implements` trace links;
  - **verification evidence** bound to the system's own acceptance outcomes (the validator/test runs).

### Scope — out
- No agent-rule wiring (RS-R4, done). No doc disposition (RS-R10). No frontend-polish redo (RS-R11).

### Acceptance criteria
- [ ] (PO-verifiable) All listed session decisions present as governed entries with provenance + ledger.
- [ ] (PO-verifiable) The D-02 supersession recorded the suppressed node + reason.
- [ ] (PO-verifiable) **Self-trace present:** the locked source requirement plus derived requirements across
      product/frontend/backend/devops/test-qa/security/governance/agent-workflow, each linked with
      `derives-from`, carrying all three states, with responsibilities, expected categories, **actual
      manifestation links to this plan's own artifacts**, and verification evidence.
- [ ] (code-verifiable) `trace --from <source-intent>` returns the system's own full chain; `justify
      --manifestation <a validator/skill id>` returns the source requirement (bidirectional self-trace).
- [ ] **(GATE) PO sign-off on the inaugural batch.**
- [ ] Gates & fallbacks: per README **Global sprint requirements** (`validate` + `reconcile` pass; §28).

### Dependencies
RS-R7 + RS-R8. Feeds RS-R10/R11.

### Executor
Claude (holds this session's context). PO signs off.

### Final step
Carry-forward: confirm the graph holds the session corpus + the self-trace; note any workflow friction.
