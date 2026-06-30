## RS-R2a — Store + schema + validators
Status: Drafted

### Intent
Implement the canonical store + schema (per the RS-R0-approved design) and the relationship/schema
validators. The data layer + the checking layer — not yet the mutation workflow (RS-R2b).

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R0/RS-R1).

### Scope — in
- Create the canonical store + schema (format/stack named in RS-R0; repo default node + `npm run`).
- Validators (named commands, declared for later sprints to depend on — `§28`):
  - schema validity; relationship integrity (dangling, orphan, cycle, double-supersede);
  - **scope/type taxonomy** (allowed values per constraint 10) + **derivation-link integrity**
    (derives-from points to a valid source; direction is product→technical/test);
  - **lock enforcement** (constraint 11): reject an in-place edit to a `locked` record — changes only via
    governed supersession.
- Unit tests covering each error class (incl. illegal-edit-to-locked + bad scope/type + broken derivation).

### Scope — out
- No mutation/sign-off workflow, generated views, or intake skill (RS-R2b). No data migration (RS-R3).

### Acceptance criteria
- [ ] (code-verifiable) `validate` command exists with an exact name + path; later sprints may depend on it.
- [ ] (code-verifiable) Validators catch each error class — relationship, scope/type, derivation, and
      illegal-edit-to-locked (tested).
- [ ] Gates: `npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test`.
- [ ] §28 fallback documented if a command can't run in-session (manual check / BLOCKED log).

### Dependencies
RS-R0 + RS-R1. Feeds RS-R2b/R3.

### Executor
Codex (tooling). 

### Final step
Carry-forward: exact `validate` command name/path + store location.
