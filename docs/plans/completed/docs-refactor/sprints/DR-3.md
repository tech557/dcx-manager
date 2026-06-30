# DR-3 — Log-to-CSV Pipeline

**Status:** Draft

---

## Objective

Convert session logs into a compact, queryable CSV that agents can read in <200 tokens instead of scanning hundreds of markdown files.

## Tasks

### T1. Create `scripts/build-log-index.sh`

Bash script that:
- Parses all `docs/progress/sessions/**/*.md` files
- Extracts header fields: Agent, Model, Provider, Date, Status, Sprint ID (from title `## SprintID`)
- Extracts: Intent (one sentence), file counts from "Files created" / "Files edited" / "Files deleted"
- Extracts gate results from the "Gates:" section
- Appends rows to `docs/progress/index.csv`
- Creates the CSV with headers if it doesn't exist
- Deduplicates: does not re-add rows for already-indexed log files (tracked by filename)

### T2. Generate initial `docs/progress/index.csv`

Run the script to index all existing session logs.

---

## Acceptance Criteria

- [ ] AC1: `scripts/build-log-index.sh` exists and is executable
- [ ] AC2: `docs/progress/index.csv` exists with all existing session logs indexed
- [ ] AC3: CSV has columns: date, agent, model, session_folder, sprint_id, status, intent, gates_passed, files_changed
- [ ] AC4: No source code changed
- [ ] AC5: typecheck + verify.sh pass

## Gates

- [ ] `npm run typecheck` — 0 errors
- [ ] `bash scripts/verify.sh` — no forbidden patterns
- [ ] `bash scripts/build-log-index.sh` — runs without error, produces CSV
