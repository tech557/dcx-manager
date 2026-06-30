## RS-R6 — Re-grounding brief (hand-off only)
Status: Drafted

### Intent
Produce a **re-grounding brief** so that, once the PO reactivates `frontend-polish-v0.3.5`, that plan can
redo FP-R4/R5 grounded in the system. **This sprint does NOT redo FP-R4/R5 and does NOT reactivate the
on-hold plan** — both would violate the `core.md §24` on-hold boundary (audit Codex #7).

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + populated system + the on-hold plan's
FP-R4/R5 + core-interaction-model — READ ONLY).

### Scope — in
- Produce `output/RS-R6-reground-brief.md`: which system requirement IDs FP-R4 must cover (incl. the
  recovered families — keyboard/SBC/STG/DZ/FCS-002/RDY-003/IFX/KBI), and a gap map vs the old FP-R4 criteria.
- State the hand-off contract: FP-R4 redo must cite system IDs only; FP-R5 rebuilds its matrix on it.

### Scope — out
- **No** FP-R4/R5 redo. **No** moving the on-hold plan. **No** edits inside `on-hold/` (read-only).
- No new system schema changes (frozen after RS-R5).

### Acceptance criteria
- [ ] (PO-verifiable) `output/RS-R6-reground-brief.md` lists the system IDs FP-R4 must cover + the gap map.
- [ ] (code-verifiable) No writes under `on-hold/` or `src/` (path + mtime check).
- [ ] States explicitly that PO reactivation is the downstream step (not done here).

### Dependencies
RS-R5. **Downstream (PO action, not this sprint):** PO moves `frontend-polish-v0.3.5` → `active/`; that
reactivated plan owns the FP-R4/R5 redo.

### Executor
Claude.

### Final step
Carry-forward: brief location; explicit note that the plan is complete and hand-off is ready for PO
reactivation (`dcx-sprint-close` for this plan).
