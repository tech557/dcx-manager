---
sprint: PAC-R6
plan: production-api-client-switch
title: Staging/Production promotion (PO sign-off, release governance)
family: release / governance
executor: Claude / Codex (only at PO direction)
required-tools: scripts/release/promote.sh, Supabase MCP (prod apply — PO-signed), Vercel
depends-on: PAC-R5
allowed-writes: docs/releases/approvals/**, supabase/migrations/** (prod apply record), docs/backend/switch/**, output/PAC-R6-*.md
forbidden-writes: promoting without a recorded PO approval; self-initiated production changes
status: Drafted
Status: Drafted
po-gated: yes — no promotion without docs/releases/approvals/<version>-<env>.md (core.md §26a). Agents NEVER promote on their own initiative.
---

# PAC-R6 — Staging/Production promotion

Apply the schema to **production** and promote the real backend to Staging then Production — **only** through
the release-governance pipeline with a recorded PO approval per environment.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-RG-*` (release governance); `REQ-BE-SCHEMA-001`, `REQ-BE-API-001` |
| Scope/type | release / governance (production — PO-signed) |
| Acceptance outcomes | AC-PAC-6-1 … AC-PAC-6-5 |
| Expected manifestations | `docs/releases/approvals/<version>-staging.md`, `<version>-production.md`; prod migration record |
| Actual manifestations (reuse) | `scripts/release/promote.sh`, `docs/releases/registry.csv`, `gate-prod-migration.sh` |
| Gate result | recorded approvals present; prod advisors clean; app live on real backend |

## Requirement Trace — 🔒 ID LOCK (audit blocking #1)
MUST NOT execute until `REQ-BE-SCHEMA-001` / `REQ-BE-API-001` are replaced with the exact PO-signed IDs from
PAC-R0 (the `REQ-RG-*` release-governance IDs already exist).

## Intent
Take the proven real backend to production safely, under the same hard-gated promotion rule as every other
release (no auto-promotion, ever).

## Step 0 — Session environment + carry-forward (MANDATORY)
1. `bash scripts/agent/build-current-state.sh`; read carry-forward + `cicd-release-governance` promotion rules (§2.3).
2. **Confirm the recorded PO approval for the target environment exists.** No promotion without it (core.md §26a).

## Scope — in
- Apply the migration to **`dcx-manager-prod`** (PO-signed), mirroring the dev apply (PAC-R1); `get_advisors`
  security clean.
- Promote via `scripts/release/promote.sh` to **Staging** (PO approval `<version>-staging.md`), validate, then
  **Production** (PO approval `<version>-production.md`).
- Flip `VITE_USE_REAL_BACKEND` on for the promoted build; confirm the live app runs on the real backend.
- Record the release in `docs/releases/registry.csv` (via the RG pipeline; no parallel registry).

## Scope — out
- Promoting without a recorded PO approval. Any Major/Stage version bump on agent initiative (PO-only, core.md
  §26). New features (ClickUp/AI/files) — out of scope.

## Acceptance criteria
- [ ] AC-PAC-6-0 — the exact PO-signed `REQ-BE-*` IDs from PAC-R0 are present in the trace (no wildcard) — else BLOCKED (doc-verifiable)
- [ ] AC-PAC-6-1 — recorded PO approval exists for each promoted environment (doc-verifiable: `approvals/<version>-<env>.md`)
- [ ] AC-PAC-6-2 — prod migration applied; prod `get_advisors` security clean; `list_tables` = 17 (tool-verifiable)
- [ ] AC-PAC-6-3 — promotion done via `promote.sh` (not a manual DB/deploy edit) (code-verifiable: registry row + approval)
- [ ] AC-PAC-6-4 — the live production app runs on the real backend; core journeys work (browser-verifiable)
- [ ] AC-PAC-6-5 — no unapproved promotion occurred; no Major/Stage bump on agent initiative (doc-verifiable)

## Verification plan
| Criterion | Method | Evidence |
|---|---|---|
| approvals | `docs/releases/approvals/` | one per env |
| prod schema | `list_tables` + `get_advisors` prod | 17 tables / clean |
| governed promotion | registry row + `promote.sh` log | present |
| live | production journeys | pass |

## Standard closeout gates + fallbacks (README §Standard closeout gates; audit blocking #3)
- Governance gates: recorded PO approval per environment; `promote.sh` run logged; registry row patched; `req:validate` PASS.
- **Supabase/Vercel fallback (§28):** if the Supabase MCP/CLI or Vercel promotion path is unavailable in-session, do **not** promote — mark `BLOCKED — <missing capability>` and hand off; a production promotion is **never** simulated or claimed without the real apply + recorded approval. `get_advisors` on prod must run post-apply; if unavailable, promotion is BLOCKED (prod cannot go live unverified).

## Dependencies
PAC-R5. Final sprint — plan completes when production is live on the real backend and the readiness dataset is
marked delivered.

## Files likely affected
- `docs/releases/approvals/<version>-staging.md`, `<version>-production.md` — create (PO-signed)
- `supabase/migrations/**` (prod apply record) — record
- `output/PAC-R6-promotion.md` — create

## Final step — Continuity wiring (MANDATORY)
Append to carry-forward: production live on real backend (version, approvals, advisors), mock retired as
default. On completion, the plan moves to `completed/` (PO accepts). Close via `dcx-sprint-close`.
