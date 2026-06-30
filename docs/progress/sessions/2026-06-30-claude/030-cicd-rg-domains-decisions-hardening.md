## RG-PLAN — Domain model answer + fatal-decision hardening + lock open decisions
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: mixed
Status: Completed
PO-Action: pending

Intent: Answer the PO's domain/subdomain question; apply the two approved hardening edits (RG-R0b secret scan, RG-R4 rollback); bake in the concrete domains; lock open decisions OD-RG-02..09.
Trigger: PO message: "if im publishing on a subdomain like dcx.dotment.com what will staging and preview links look like ... and yes i agree to your edits"
Sub-tasks (mixed):
- audit-review: explained Vercel domain/alias model for dcx.dotment.com.
- user-request-planning: applied edits + locked decisions.

### Domain model (answered)
- Production: `dcx.dotment.com` (DNS CNAME → Vercel; manual-promote alias).
- Staging: `staging.dcx.dotment.com` (sub-subdomain; alias; no new domain, no cost).
- Preview: auto `*.vercel.app` immutable per commit (free, no DNS). These are the registry `preview_url`s.
- No new domain needed — all hang off dotment.com. Branded preview wildcard + deployment protection need Vercel Pro (verified RG-R4).

### Fatal-decision analysis (answered)
- Only fatal-class OPEN decision: **OD-RG-05 (Supabase env)** — wrong choice risks irreversible prod-data loss. → PO chose **separate prod project** (D-RG-ENV).
- Fatal-class setup items: secrets/first-commit hygiene (RG-R0b) and exact-build capability (RG-R4, already gated).
- Everything else reversible (version numbers, branch names, authority rule).

### Decisions locked (PO-confirmed 2026-06-30)
| ID | Value |
|---|---|
| OD-RG-02..04, 06, 08, 09 | defaults accepted |
| OD-RG-05 | separate production Supabase project (D-RG-ENV) |
| D-RG-DOMAIN | dcx.dotment.com / staging.dcx.dotment.com / *.vercel.app |
| OD-RG-07 | graph intake proceeds (next workstream) |

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | sprints/RG-R0b.md | Pre-commit secret-scan FATAL gate before first commit; strict .gitignore (incl. brandbook.pdf); concrete domains; AC for scan + domains | ~10 |
| edited | sprints/RG-R4.md | `promote.sh --rollback` (one-command revert to previous promoted build); concrete domains; rollback AC | ~6 |
| edited | cicd-release-governance/README.md | Decisions table: D-RG-DOMAIN + D-RG-ENV; §9.2 marked PO-confirmed; OD-RG-05 decided | 3 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — additive |
| Preserve-semantic (§9) | N/A — no source changed |
| Open decisions used (⏱) | OD-RG-02..09 now decided (PO-confirmed); none silently decided |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Answer domain/subdomain question accurately | PASS |
| Identify fatal decision(s) + how to handle | PASS (OD-RG-05 + 2 setup items) |
| Apply approved hardening edits (secret scan, rollback) | PASS |
| Lock open decisions | PASS |
| No src/** changed | PASS — docs/planning only |

### Gates
| Gate | Result |
|---|---|
| typecheck / verify.sh / validate:architecture / test | N/A — docs/planning only |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Requirement intake sign-off (OD-RG-07) | Only remaining blocker for executable-READY; §35b PO gate | I draft proposals next; PO signs off, then apply + re-audit |
| Vercel Pro tier (if branded previews / deployment protection wanted) | D-RG-DOMAIN caveat | Confirm tier before RG-R4 |
| git init (RG-R0b) | Execution step 0; PO-owned | Run when ready to start sprints |

### Consumer updates required
- None.

### Open issues / follow-ups
- Next: draft the REQ-RG-*/GOV-RG-* intake proposals → PO sign-off (the last blocker).
- index: run `bash scripts/build-log-index.sh`.
