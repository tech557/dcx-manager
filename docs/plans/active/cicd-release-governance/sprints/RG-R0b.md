---
sprint: RG-R0b
plan: cicd-release-governance
title: Repo + integration setup (PO-owned; agent writes the runbook)
family: external-setup
executor: PO executes external steps; any agent writes the runbook + records evidence
required-tools: git, gh CLI, Vercel/Supabase/ClickUp account access (PO credentials)
depends-on: RG-R0a
allowed-writes: output/RG-R0b-*.md, repo metadata (.git via init), .github/ scaffolding placeholders, README carry-forward + decisions
forbidden-writes: src/** (D-RG-GIT — no product source until PO starts implementation)
status: Partial
Status: Partial
---

# RG-R0b — Repo + integration setup (PO-owned)

Resolves the `no .git` blocker and connects the integrations. **External/credentialed steps are PO-owned**
and are not agent acceptance criteria; the agent produces the runbook, records what the PO completed, and
seeds the integration branch. Operates strictly within **D-RG-GIT** (no `src/**` changes).

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PLAT-018, REQ-RG-CONC-014 (branch model needs a repo), REQ-RG-OWN-007 (CODEOWNERS needs a repo) — **Status: approved — canonical graph nodes, PO-locked 2026-06-30 (ledger LDG-2026-06-30-create-node-REQ-RG-*; OD-RG-07 closed)** |
| Acceptance IDs | AC-RG-0b-1 … AC-RG-0b-5 |
| Expected manifestations | git repo initialized + remote; `integration` + `staging` + `main` branches; Vercel project linked; `output/RG-R0b-setup-runbook.md` with completion evidence |
| Verification (EVD) | `git remote -v`, `git branch -a`, Vercel project id recorded in the runbook |

## Step 0 — Continuity & environment (mandatory)
1. Read carry-forward + Decisions (esp. **D-RG-GIT** boundary) + RG-R0a report.
2. Run `bash scripts/agent/build-current-state.sh`; log results.

## Scope
- **Allowed (agent):** write the runbook; scaffold `.github/` placeholder dirs; seed branches once the repo exists; record PO-completed evidence.
- **Allowed (PO only):** `git init`, create GitHub remote, push, link Vercel project, set credentials/secrets, grant access.
- **Forbidden:** `src/**` edits; storing secrets in the repo; enabling auto-promotion.

## Steps (exact)
**PO-owned (runbook documents, PO executes):**
1. `git init` at repo root; write a **strict `.gitignore` BEFORE staging anything**: `node_modules`, `dist`, `.venv*`, `.playwright-mcp`, `.npm-cache`, `.vite`, `test-results`, `output`, `tmp`, `*.pdf` (keep `brandbook.pdf` out of history), `.env*`, `*.key`, `*.pem`, `*.local`, any secrets.
2. **Pre-commit secret scan — FATAL gate, runs before the FIRST commit (history is permanent):** `git add -A`, then scan the staged set: `git diff --cached | grep -inE 'API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE KEY|-----BEGIN|bearer '` and, if available, `gitleaks protect --staged`. Also `git diff --cached --name-only | grep -iE '\.env|\.key|\.pem|brandbook\.pdf'` must be empty. If anything matches → unstage, fix `.gitignore`, re-scan. **Do not create the first commit until the scan is clean.**
3. Create GitHub repo; `git remote add origin <url>`; first commit + push.
4. Create branches: `main`, `staging`, `integration` (per OD-RG-08).
5. Link Vercel project to the GitHub repo (no auto-promote to staging/prod yet). Domains: production `dcx.dotment.com`, staging `staging.dcx.dotment.com` (DNS CNAME → `cname.vercel-dns.com`); previews use auto `*.vercel.app`.
6. Add platform credentials as GitHub/Vercel secrets (never in-repo).

**Agent-owned:**
7. Write `output/RG-R0b-setup-runbook.md` with the exact commands above + a checkbox per step + the secret-scan result.
8. After PO confirms, record evidence: `git remote -v`, `git branch -a`, Vercel project id, configured domains, secret names (not values).
9. Scaffold empty `.github/workflows/` dir placeholder for RG-R3 (no active workflow yet).

## Output
`output/RG-R0b-setup-runbook.md` — the runbook + a "Completion evidence (PO-confirmed)" section.

## Acceptance criteria
| ID | Criterion | Verification |
|---|---|---|
| AC-RG-0b-1 | Repo initialized + remote set | `git remote -v` recorded |
| AC-RG-0b-2 | `main`/`staging`/`integration` branches exist | `git branch -a` recorded |
| AC-RG-0b-3 | Vercel project linked, **no** auto-promotion enabled | runbook records project id + "manual-promote only" |
| AC-RG-0b-4 | **Pre-commit secret scan clean before first commit; no secret/`.env`/`brandbook.pdf` in history** | scan output recorded; `git log --all --name-only \| grep -iE '\.env\|\.key\|brandbook\.pdf'` empty |
| AC-RG-0b-5 | Domains configured: prod `dcx.dotment.com`, staging `staging.dcx.dotment.com` | Vercel domains list recorded |
| AC-RG-0b-6 | `src/**` unchanged throughout | mtime/`git diff --name-only` shows no `src/` paths |

## Gates (core.md §11)
| Gate | Applies | How |
|---|---|---|
| no-`src/**` proof | YES | `git diff --name-only` excludes `src/` |
| typecheck/lint/test | N/A | no source changed |
| browser | optional | confirm Vercel project dashboard shows linked repo |

## Fallbacks (core.md §28)
- PO not ready to init git → sprint pauses at "runbook written"; mark AC-RG-0b-1..3 `BLOCKED — awaiting PO`, do not fake.
- `gh` unavailable → PO uses GitHub web UI; runbook documents both paths.

## Close (core.md §29/§36a/§35c)
1. `bash scripts/agent/sprint-doctor.sh cicd-release-governance RG-R0b <agent>`.
2. **Requirement gates (core.md §35c):** `<changed-files>` via `git diff --name-only` (repo now exists), then `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, `npm run req:completion-gate -- --changed <changed-files>`. The `dcx-sprint-close` skill bundles steps 1–2; must return PASS / PASS_WITH_QUEUED_REVIEW.
3. Update carry-forward: repo now exists; branch names; Vercel project id; secret names.
4. Session log + `bash scripts/build-log-index.sh`.
