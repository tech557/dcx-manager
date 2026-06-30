# DR-5 — Stale Docs Cleanup

**Status:** Draft

---

## Objective

Remove or update documents that are outdated and consume agent tokens without providing accurate information.

## Tasks

### T1. Update `docs/architecture/builder/current-architecture.md`

- Version header v0.2.15 → v0.3.2
- Update component hierarchy to reflect completed state (B0, B1, B2, B5, B6, B8, B-FIL, B-CRD are done)
- Update "Known Issues" table to mark all items as Resolved
- Fix the "Files popup: to be added in B-FIL" note (done), "multi-session in B5" (done), "ViewHelperIsland wrong product — fixed in B-FIL + B8" (done)

### T2. Populate `docs/references/README.md`

Replace the stub with a proper index referencing all known reference material: component_registry.json, brand tokens, design system, API types, domain types, and the new agent-rules/ directory.

### T3. Add `docs/plans/active/README.md`

Create a README explaining the active plans folder, listing the current plan (docs-refactor), linking to the plan lifecycle rules in core.md §24.

### T4. Verify no stale version references

- `docs/README.md` should already say v0.3.2 (verify; no change needed if correct)
- No active doc references `v0.2.15` except archived/historical content

### T5. gsap audit

- Confirm no active documentation references gsap as a current library (already clean per exploration)

---

## Acceptance Criteria

- [ ] AC1: `current-architecture.md` header updated to v0.3.2 with completed tasks resolved
- [ ] AC2: `docs/references/README.md` lists all known reference materials
- [ ] AC3: `docs/plans/active/README.md` exists and describes the folder
- [ ] AC4: No active doc references v0.2.15 or gsap as current
- [ ] AC5: No source code changed
- [ ] AC6: typecheck + verify.sh pass

## Gates

- [ ] `npm run typecheck` — 0 errors
- [ ] `bash scripts/verify.sh` — no forbidden patterns
