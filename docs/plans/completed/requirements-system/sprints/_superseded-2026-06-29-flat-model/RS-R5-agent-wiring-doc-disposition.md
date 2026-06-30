## RS-R5 — Agent wiring + doc disposition
Status: Drafted

### Intent
Make the system authoritative: wire it into the agent rules + skills, publish the index, and disposition
the legacy requirement docs — PO-gated, archive-not-destroy.

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R0 wiring contract + populated system).

### Scope — in
- **Agent-rule wiring** (`core.md` / `AGENTS.md`): every behavior claim/sprint must **cite a requirement
  ID**; mutations require sign-off (RS-R2b workflow); validators run before "done". The system is the
  source of truth.
- **Mandatory plan-output Requirement Trace (constraint 12):** wire the generated trace section into the
  plan/sprint output contract; `dcx-sprint-planner` **fails** plans missing it, `dcx-plan-audit` **fails**
  ungrounded/unverifiable traces.
- **Skills wiring:** `dcx-sprint-planner` and `dcx-plan-audit` **enforce requirement-ID grounding** (a plan
  with un-grounded behavior claims fails audit). Ensure `dcx-requirement-intake` + all `dcx-*` skills are
  **synced to every agent dir** via `scripts/agent/sync-skills.sh` (fixes the `.agents/skills/` gap).
- **Publish the index** (the generated human+agent entry point from RS-R2b).
- **Doc disposition** for every legacy requirement doc (CSV, builder/*.md, decisions/, open-questions/):
  keep / merge-into-system / remove → **archive to `docs/archive/`** (never destroy). Per the RS-R0
  disposition policy. **PO approves the file-by-file table before any move/remove.**
  *(Correction from audit Codex #6: `core.md §32` is evidence/screenshot paths, NOT archival — use the
  RS-R0 disposition policy + `docs/archive/`.)*

### Scope — out
- No frontend-polish redo or reactivation (RS-R6 + PO).

### Acceptance criteria
- [ ] (PO-verifiable) Agent rules + planner/audit grounding updated; index published; skills synced to all dirs.
- [ ] (PO-verifiable) File-by-file disposition table; **PO approved before any move/remove**; removed docs
      archived under `docs/archive/` (not deleted).
- [ ] Gates: `npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test` ·
      `bash scripts/verify.sh` · `bash scripts/build-log-index.sh` (if session logs changed). §28 fallbacks named.

### Dependencies
RS-R4. Feeds RS-R6.

### Executor
Claude. PO approves deletions.

### Final step
Carry-forward: what was retired/merged/kept; canonical entry point path; skill-sync result.
