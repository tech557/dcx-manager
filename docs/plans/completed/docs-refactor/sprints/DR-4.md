# DR-4 — Codebase Manifest

**Status:** Draft

---

## Objective

Give agents a single file that describes every source folder and key file in `src/` so they spend fewer tokens on discovery.

## Tasks

### T1. Create `scripts/gen-manifest.sh`

Bash script that:
- Walks `src/` top-level directories using `find`
- Reports file count and total line count per directory
- Extracts top-level exports via `grep "^export"`
- For `builder/`, reports sub-directories (cards, islands, stage, dropzones, focus, import)
- Preserves manual annotations via a `# MANUAL:` comment block that the script does not overwrite
- Outputs structured markdown

### T2. Create `docs/references/codebase-manifest.md`

First version of the manifest with:
- All 16 top-level directories documented
- Sub-directory breakdown for `builder/`
- Key exports listed for actions, builder/cards, builder/islands, builder/stage, hooks, rules, services, types, ui
- Manual annotations for key constraints (e.g., "Do not import from cards/islands/stage" for actions)
- Version header and generation date

---

## Acceptance Criteria

- [ ] AC1: `scripts/gen-manifest.sh` exists, is executable, and produces valid markdown
- [ ] AC2: `docs/references/codebase-manifest.md` exists with all src/ directories documented
- [ ] AC3: Manifest includes key exports for at least 9 directories (actions, cards, islands, stage, hooks, rules, services, types, ui)
- [ ] AC4: No source code changed
- [ ] AC5: typecheck + verify.sh pass

## Gates

- [ ] `npm run typecheck` — 0 errors
- [ ] `bash scripts/verify.sh` — no forbidden patterns
- [ ] `bash scripts/gen-manifest.sh` — produces output without error
