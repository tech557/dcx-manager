## PAC addendum — ClickUp-gated Google/email sign-in
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: mixed
Status: Completed
PO-Action: none
Version: v1.0.3.0
Change-Class: non-source

Intent: Restrict app sign-in (Google OAuth + email magic-link) to emails present in the ClickUp workspace member roster, enforced at the database level; lay groundwork for using that same roster as an in-app assignment source. Components: (1) scope-change confirmation + governance decision, (2) migration + seed, (3) verification, (4) requirement-graph housekeeping.
Trigger: User request — "i wanna sign in to be via gmail only and only allow gmails from the allowed users email in the clickup workspace members ... this will also work as users that u can assign in the app"
Requirements covered: REQ-BE-AUTH-ALLOWLIST-001 (new, PO-signed)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/backend/switch/apply-approval-dev-2026-07-01-clickup-gated-auth.md | Records PO approval to apply (auth-gating migration only, RLS-defect fix declined) | 17 |
| created | scripts/backend/sync-allowed-members.mjs | Documented, reusable manual re-sync script (ClickUp API -> allowed_members) | 68 |
| created | docs/plans/active/production-api-client-switch/output/PAC-addendum-clickup-gated-auth.md | Output doc — what was built, verification, deferred scope | 64 |
| edited | docs/backend/switch/po-confirmations.md | Records decision #4 (ClickUp stub) as superseded for auth-gating purposes | +12 |
| edited | docs/plans/active/production-api-client-switch/README.md | Carry-forward — addendum entry appended | +18 |
| created | docs/product/requirements/graph/nodes/requirement/REQ-BE-AUTH-ALLOWLIST-001.json | New requirement node (PO-signed) | small |
| created | docs/product/requirements/graph/nodes/manifestation/function/MAN-function-scripts-backend-sync-allowed-members.json | New manifestation node | small |
| created | docs/product/requirements/graph/trace-links/TRC-MAN-function-scripts-backend-sync-allowed-members-TO-REQ-BE-AUTH-ALLOWLIST-001.json | New trace link | small |
| edited | docs/product/requirements/graph/ledger/decision-ledger.jsonl | 3 new ledger entries (1 requirement + 1 manifestation + 1 trace-link sign-off, `Mahmoud (PO)`) | +3 |

**Database (dcx-manager-dev, not a repo file):** `allowed_members` table (21 rows seeded from live ClickUp
data) + RLS read policy + `enforce_allowed_signup()` `BEFORE INSERT ON auth.users` trigger + grant hardening
(revoked `PUBLIC`/`anon`/`authenticated` EXECUTE on the trigger function).

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | No `src/**` changed; `LoginRedirect.tsx` (both sign-in options) needed no edit since the PO chose to keep email as a fallback — enforcement is DB-level for both paths |
| Open decisions used (⏱) | None — all 3 sub-decisions (scope-change handling, sync method, sign-in method) were explicit PO choices this turn, not defaults |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Sign-up rejected for non-roster emails | PASS — verified via a rolled-back SQL transaction simulating GoTrue's insert (`P0001` exception raised); also observed a 500 rejection via the live rate-limited signup API |
| Sign-up allowed for roster emails | PASS — verified via the same SQL-level method with a real roster email (rolled back, no side effect) |
| Enforcement applies to both Google OAuth and email magic-link | PASS by construction — the trigger fires on `auth.users` INSERT regardless of provider |
| No new security regression | PASS — found + fixed a `PUBLIC`-exposed trigger function (revoked); re-verified the trigger itself still fires after the grant revoke |
| Prod untouched | PASS — `list_migrations` (`xokgguodxjjwokngyquo`) = `[]` |

### Gates
| Gate | Result |
|---|---|
| typecheck | PASS |
| lint | PASS |
| req:validate | PASS |
| req:completion-gate (changed) | PASS (after 1 requirement + 1 manifestation + 1 trace link, signed off) |
| get_advisors security | 1 new finding found + fixed this session (PUBLIC grant on `enforce_allowed_signup`) |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None — no app code changed.

### Open issues / follow-ups
- Wiring `allowed_members` into the app's assignee/team pickers is explicitly deferred — needs a new contract route (e.g. `GET /api/team-members`), `real-dispatch.ts`/`mock-dispatch.ts` coverage, a type, and a UI picker change. Flagged, not built.
- `scripts/backend/sync-allowed-members.mjs` needs a `CLICKUP_API_TOKEN` + `SUPABASE_SERVICE_ROLE_KEY` to run standalone — neither available in this session; today's seed was done via the ClickUp MCP + `execute_sql` directly. Whoever runs a manual refresh later will need to source those credentials.
- The `channel_compositions_write` RLS-policy fix (PAC-R4 finding #3) remains BLOCKED/declined — still needs a migration before PAC-R6 or any real composition-create usage.
