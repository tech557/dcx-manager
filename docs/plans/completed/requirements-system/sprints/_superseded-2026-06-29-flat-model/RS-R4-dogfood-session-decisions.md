## RS-R4 — Dogfood: ingest this session's decisions
Status: Drafted

### Intent
Enter the 2026-06-29 session's decision corpus as the system's first NEW dataset, through the governed
sign-off workflow — proving the system works end-to-end (incl. a real supersession).

### Step 0
Per README **Global sprint requirements** (env, read carry-forward). Read the on-hold plan's
`output/{decision-register,requirements-recovery,core-interaction-model}.md` **and** the session logs
`docs/progress/sessions/2026-06-29-claude/*` (the typed decision corpus).

### Scope — in
- Ingest via `propose-change` → PO sign-off → commit:
  - D-01…D-12 (incl. **D-02 superseding the earlier highlight-only ruling** with FCS-002 isolation — the
    canonical supersession test).
  - The 4 core-model alignments (version-readiness rollup, smart-expand, auto-centre, drag-pill creation).
  - Recovered requirements: keyboard layer, copy/paste, deselect, STG-004/DZ-001 movement, SBC card system,
    FCS-002, RDY-003, IFX-001, KBI-001.
- Each entry: provenance (session + source doc), relationships, ledger entry.
- **Also model the requirements-system's OWN requirements across scopes** (Codex re-audit #3) — prove the
  taxonomy decomposes: a product requirement (e.g. "governed, traceable requirements source of truth") →
  derived **frontend** (human edit/preview surface), **backend** (store + validators), **devops** (skill-sync
  tooling), **test** (validator suites), and **agent-workflow** (intake skill, §34 loop) requirements — each
  with derives-from links and technical traces where applicable.

### Scope — out
- No agent-rule wiring (RS-R5). No frontend-polish redo (RS-R6).

### Acceptance criteria
- [ ] (PO-verifiable) All listed decisions present as governed entries with provenance + ledger.
- [ ] (PO-verifiable) The D-02 supersession recorded the suppressed entry + reason.
- [ ] (PO-verifiable) **Cross-scope dogfood present:** a requirements-system **product** requirement plus
      derived **frontend / backend / devops / test-qa / agent-workflow** requirements, each linked with
      `derives-from`, carrying lifecycle/lock states, and with technical traces where applicable.
- [ ] **(GATE) PO sign-off on the inaugural batch.**
- [ ] Gates & fallbacks: per README **Global sprint requirements** (`validate` passes; §28 fallbacks).

### Dependencies
RS-R3. Feeds RS-R5/R6.

### Executor
Claude (holds this session's context). PO signs off.

### Final step
Carry-forward: confirm the system holds the session corpus; note any workflow friction found.
