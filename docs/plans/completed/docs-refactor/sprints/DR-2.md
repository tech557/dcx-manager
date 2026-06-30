# DR-2 — Version Awareness System

**Status:** Draft

---

## Objective

Every agent session starts knowing the current product version and what that means for log archiving.

## Tasks

### T1. Create `docs/VERSION.md`

Single source of truth for project version. Include current version, previous minor, next planned, version semantics, and agent instructions.

### T2. Create `scripts/version-bump.sh`

Bash script that:
- Takes argument: `patch` or `minor`
- `patch`: increments patch number (0.3.2 → 0.3.3), updates `docs/VERSION.md`
- `minor`: bumps minor (0.3.x → 0.4.0), updates `docs/VERSION.md`, runs `scripts/archive-version.sh`
- Validates the argument and current version format

### T3. Create `scripts/archive-version.sh`

Bash script that:
- Takes current version and target version as arguments
- Moves `docs/progress/sessions/` to `docs/archive/sessions/v0.3/`
- Moves completed active plans to `docs/plans/completed/`
- Creates/updates `docs/archive/README.md` with version summary

### T4. Update AGENTS.md to reference VERSION.md

Add `docs/VERSION.md` as the first file to read in the routing header (before core rules).

---

## Acceptance Criteria

- [ ] AC1: `docs/VERSION.md` exists with current, previous_minor, next_planned, semantics, and agent instructions
- [ ] AC2: `scripts/version-bump.sh` exists, is executable, and handles `patch` and `minor` arguments
- [ ] AC3: `scripts/archive-version.sh` exists and is executable
- [ ] AC4: AGENTS.md routing header lists VERSION.md as first read
- [ ] AC5: No source code changed
- [ ] AC6: typecheck + verify.sh pass

## Gates

- [ ] `npm run typecheck` — 0 errors
- [ ] `bash scripts/verify.sh` — no forbidden patterns
- [ ] `bash scripts/version-bump.sh patch` — runs without error
