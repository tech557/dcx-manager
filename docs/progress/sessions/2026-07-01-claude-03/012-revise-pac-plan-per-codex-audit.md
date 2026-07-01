## Revise production-api-client-switch per Codex audit
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-planning
Status: Completed
PO-Action: pending
Version: v1.0.1.0
Change-Class: non-source

Intent: Check the Codex plan audit (NEEDS REVISION) of the drafted production-api-client-switch plan and apply all blocking + advisory revisions.
Trigger: User request — "can u check codex audit to ur drafted plan".
Stage (§34): Revise — applied the audit's blocking findings.

### Audit reviewed
`docs/plans/drafted/production-api-client-switch/audit/2026-07-01-codex.md` — verdict NEEDS REVISION (3 blocking, 3 advisory).

### Findings resolved
| # | Finding | Fix |
|---|---|---|
| Blocking 1 | Wildcard requirement traces (REQ-BE-*) read as executable | Added a plan-level 🔒 ID-lock rule + per-sprint ID-LOCK note + hard-gate acceptance criterion AC-PAC-{1..6}-0 (no execution on wildcards); PAC-R0 is the sole first-activatable sprint |
| Blocking 2 | PAC-R2 mapper boundary inverted | Rewrote PAC-R2: realDispatch returns contract-valid Api* only, does NOT call api-mappers.ts; query layer (unchanged) maps Api*→domain. Verified against code (versions.service returns ApiVersion*; versions.queries calls apiVersionToDomain) |
| Blocking 3 | Insufficient gate/fallback coverage | Added a README "Standard closeout gates" table + per-sprint gate blocks (typecheck/lint/validate:architecture/test/verify:frontend/req:validate/reconcile/completion-gate/sprint-doctor) + explicit §28 BLOCKED fallbacks for Supabase/Vercel/Playwright |
| Advisory 1 | PAC-R5 depends on immature capture | PAC-R5 now explicitly consumes the LIVE captured summary, not the local synthetic proof |
| Advisory 2 | PAC-R5 no cleanup step | Added a server/preview cleanup + evidence-path (§32) step |
| Advisory 3 | Activation lifecycle unclear | README + PAC-R0: two-stage activation (PAC-R0 first, then R1..R6 once IDs signed) |

### Files touched
| Action | Path | What & why |
|---|---|---|
| edited | drafted/production-api-client-switch/README.md | ID-lock rule, standard-gates table, two-stage activation, audit history |
| edited | sprints/PAC-R0.md | sole-first-activatable note |
| edited | sprints/PAC-R1.md | ID-lock + AC-1-0 + Supabase fallback gates |
| edited | sprints/PAC-R2.md | mapper direction corrected + AC-2-0/2-4 rewrite + gates |
| edited | sprints/PAC-R3.md | ID-lock + AC-3-0 + full gates + RLS-test fallback |
| edited | sprints/PAC-R4.md | ID-lock + AC-4-0 + full gates + Supabase fallback |
| edited | sprints/PAC-R5.md | ID-lock + AC-5-0 + gates + browser fallback + live-capture note + cleanup |
| edited | sprints/PAC-R6.md | ID-lock + AC-6-0 + governance fallback |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — revisions to my own draft; no code |
| Preserve-semantic (§9) | Corrected the mapper-boundary description to match actual code (§5/§9.4) |
| Verification | ID-lock in all 6 sprints ✓; standard-gates block in all 6 ✓; AC-x-0 in all 6 ✓; PAC-R2 mapper wording fixed ✓ |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Re-audit the revised plan | verdict was NEEDS REVISION; blockers now addressed | run `dcx-plan-audit` again → expect READY; then two-stage activation once backend-discovery-v3 = READY |

### Open issues / follow-ups
- Ready for re-audit. Activation still gated on backend-discovery-v3 READY (G5 live capture + G6 intake).
