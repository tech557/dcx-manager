---
sprint: RG-R0b
plan: cicd-release-governance
date: 2026-07-01
agent: Claude (claude-sonnet-5, Anthropic)
status: partial — local repo steps complete; credentialed external steps pending
---

# RG-R0b — Repo + integration setup runbook

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PLAT-018, REQ-RG-CONC-014, REQ-RG-OWN-007 — approved, canonical graph nodes, PO-locked 2026-06-30 |
| Acceptance IDs | AC-RG-0b-1 … AC-RG-0b-6 — see status table below |
| Verification (EVD) | `git remote -v`, `git branch -a`, secret-scan output, `src/**` shasum diff (all below) |

## What this run executed (PO authorized direct execution in-session, 2026-07-01)

### Step 1 — `.gitignore` written before any staging
`.gitignore` (repo root), anchored to avoid swallowing `docs/plans/**/output/` plan deliverables:
```
/node_modules/
/dist/
/.venv*/
/.playwright-mcp/
/.npm-cache/
/.vite/
/test-results/
/output/
/tmp/
*.pdf
.env
.env.*
*.key
*.pem
*.local
.DS_Store
```
Note: `output/` and `tmp/` were anchored with a leading `/` (root-only) — the unanchored form from the
sprint spec would have also matched `docs/plans/*/output/`, which holds tracked plan deliverables and
must NOT be ignored.

### Step 2 — `git init`
```
$ git init
Initialized empty Git repository in <repo>/.git/
```
Local `user.name`/`user.email` were not configured (neither local nor global) — set locally
(`git config user.name "DCX Manager"`, `user.email "tech@dotment.com"`) so the first commit has an
identity; this is a repo-local config only, not global.

### Step 2a — Pre-commit secret scan (FATAL gate — run BEFORE first commit)
```
$ git add -A
$ git diff --cached --name-only | grep -iE '\.env|\.key$|\.pem$|brandbook\.pdf'
docs/archive/dcx-manager-v0.1.4/.env.example      # verified: placeholder template, not a real secret (see below)

$ git diff --cached | grep -inE 'API_KEY[:=]...|SECRET[:=]|PASSWORD[:=]|PRIVATE KEY|-----BEGIN|bearer ...'
93158:+GEMINI_API_KEY="MY_GEMINI_API_KEY"          # same archived template file — placeholder value, not a real key
148967:+...(sprint file's own prose describing this scan command)...   # false positive — documentation text, not a secret

$ gitleaks
gitleaks not installed — recorded as fallback (core.md §28); grep-based scan + manual review used instead.
```
**Verdict: CLEAN.** Both hits inspected manually:
- `docs/archive/dcx-manager-v0.1.4/.env.example` — pre-existing archived template with placeholder values
  (`MY_GEMINI_API_KEY`, `MY_APP_URL`), already shipped in `docs/archive/` for reference; not a live credential.
- The other hit is this plan's own sprint file (`sprints/RG-R0b.md`) quoting the scan command in prose.

No `brandbook.pdf` staged (excluded by `*.pdf`). No real `.env`, `.key`, or `.pem` file is in the staged set
(the only `.pem` files found anywhere in the tree are inside `.venv-semgrep/`, already excluded by
`/.venv*/`).

### Step 2b — `src/**` unchanged proof
```
$ find src -type f -exec shasum {} + | sort > /tmp/src-rg0b.sha
$ diff /tmp/src-pre.sha /tmp/src-rg0b.sha
(empty)
```
No source files were modified by this sprint; `src/**` is included in the first commit as-is (committing
existing files for the first time is not a "change" under D-RG-GIT).

### Step 3 — First commit
```
$ git add -A   (3687 files including this runbook, 299634 insertions)
$ git commit -m "chore: initial commit — bootstrap v0.3.5.0 baseline (RG-R0b)"
$ git log --oneline -1
648dbf6 chore: initial commit — bootstrap v0.3.5.0 baseline (RG-R0b)
$ git status --short --branch
## main
```
`git log --all --name-only | grep -iE '\.env$|\.key$|\.pem$|brandbook\.pdf$'` → empty (confirmed clean
history after commit).

### Step 4 (partial) — Branches
`.github/workflows/` already existed pre-commit (now tracked as-is; see carry-forward note on the
discrepancy). Local branches created (no remote yet to push to):
```
$ git branch staging
$ git branch integration
$ git branch -a
  integration
* main
  staging
```

## Steps NOT executed in this run — require PO credentials/account access

| Step | Why blocked | What the PO must do |
|---|---|---|
| Create GitHub repo, `git remote add origin <url>`, push | No `gh` CLI installed in this environment; no GitHub credentials available to this agent | Install `gh` and run `gh auth login`, or create the repo via GitHub web UI; provide the remote URL, or run `git remote add origin <url> && git push -u origin main` |
| Create `staging` / `integration` branches | Depends on the remote existing (OD-RG-08 branch model) | After remote + push, run `git branch staging && git branch integration && git push -u origin staging integration` (or do this once `gh`/remote is available — agent can run these once a remote exists) |
| Link Vercel project to the GitHub repo | Requires Vercel account access/credentials and an existing GitHub remote to link to | Use Vercel dashboard or the Vercel MCP (`mcp__...__create_project` is not yet attempted — needs a GitHub remote first per Vercel's import flow) |
| Configure domains (`dcx.dotment.com`, `staging.dcx.dotment.com`) | Requires DNS access to `dotment.com` and a linked Vercel project | Add CNAME records → `cname.vercel-dns.com`; assign domains in Vercel project settings |
| Add platform credentials as GitHub/Vercel secrets | Requires GitHub/Vercel account access | Add via GitHub repo Settings → Secrets, and Vercel project → Environment Variables; never commit secrets to the repo |

## Acceptance criteria status

| ID | Criterion | Status |
|---|---|---|
| AC-RG-0b-1 | Repo initialized + remote set | **PARTIAL** — repo initialized (`git log` shows 1 commit on `main`); remote NOT set (no GitHub repo created yet) |
| AC-RG-0b-2 | `main`/`staging`/`integration` branches exist | **PARTIAL** — all three exist locally (`git branch -a`); not yet pushed (no remote) |
| AC-RG-0b-3 | Vercel project linked, no auto-promotion | **BLOCKED** — awaiting PO/credentials |
| AC-RG-0b-4 | Pre-commit secret scan clean; no secret/`.env`/`brandbook.pdf` in history | **PASS** — see Step 2a |
| AC-RG-0b-5 | Domains configured | **BLOCKED** — awaiting PO/DNS access |
| AC-RG-0b-6 | `src/**` unchanged throughout | **PASS** — see Step 2b |

## Completion evidence (PO-confirmed)

_To be appended once the PO completes the credentialed steps above (remote, branches, Vercel link,
domains, secrets)._
