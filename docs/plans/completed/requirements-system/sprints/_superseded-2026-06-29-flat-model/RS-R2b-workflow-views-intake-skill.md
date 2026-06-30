## RS-R2b — Mutation/sign-off workflow + generated views + intake skill
Status: Drafted

### Intent
Build the governed-mutation workflow, the generated human+agent views/index, and the
`dcx-requirement-intake` skill — on top of RS-R2a's store + validators.

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R0/RS-R2a).

### Scope — in
- **Governed mutation:** `propose-change` (staging) → PO sign-off → `apply-after-signoff` (commit).
  Supersession records suppressed entry + by/when/why. No silent write. (Exact command names declared.)
- **Generated views (constraint 13):** derive the human-editable/preview surface AND a **low-token agent
  query** from the single canonical source (`index/generate-views`, `query --by-id/--scope/--feature`);
  agents read a small manifest/query result, never the whole store. Surface choice per RS-R0 eval.
- **`dcx-requirement-intake` skill** (canonical `agent-skills/` → synced via `scripts/agent/sync-skills.sh`
  to `.claude/skills/` + `.agents/skills/`): a typed user message (`core.md §33`) → candidate-requirement
  assessment → proposal → contradiction/impact check (reusing RS-R2a validators + `code-query.sh` traces).
- Unit tests for the supersession/sign-off path + the intake assessment.

### Scope — out
- No requirement DATA migrated (RS-R3) beyond fixtures. No agent-rule edits (RS-R5).

### Acceptance criteria
- [ ] (code-verifiable) `propose-change` / `apply-after-signoff` / `index/generate-views` exist (named).
- [ ] (PO-verifiable) A write without sign-off is blocked; supersession is recorded with reason.
- [ ] (code-verifiable) `dcx-requirement-intake` skill present in `agent-skills/` and synced to all agent dirs.
- [ ] (code-verifiable) Low-token `query --by-id/--scope/--feature` returns a small slice (not the whole store).
- [ ] Gates: `npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test`;
      `bash scripts/agent/sync-skills.sh` runs clean. §28 fallbacks named.

### Dependencies
RS-R2a. Feeds RS-R3/R4/R5.

### Executor
Codex (tooling + skill).

### Final step
Carry-forward: workflow command names + skill name/location + sync status.
