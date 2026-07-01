---
sprint: BE3-R4
plan: backend-discovery-v3
title: External integration decisions
family: discovery
executor: Claude / Codex / opencode
required-tools: bash scripts
depends-on: BE3-R1
allowed-writes: docs/backend/integrations/**, output/BE3-R4-*.md
forbidden-writes: src/**, Supabase apply/execute
status: Active
Status: Active
---

# BE3-R4 — External integration decisions

Decide, per external integration, whether v1 builds it or keeps the stub — and record exactly what data
and credentials each needs if built — so nothing is discovered late during the build plan.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | RG-R6 decision record (`active/cicd-release-governance/output/RG-R6-decision.md`) for ClickUp scope; `REQ-DM-017` for the AI/ClickUp payload shapes |
| Scope/type | discovery / product-decision (matrix; no behavior) |
| Acceptance outcomes | AC-BE3-4-1 … AC-BE3-4-4 |
| Expected manifestations | `docs/backend/integrations/decision-matrix.md` |
| Actual manifestations | `src/services/ai.service.ts` (stub), `src/services/clickup.service.ts` (stub), `ApiFileAttachment` (`google-drive`/`link`), RG-R6 (GAS scoped-out) |
| Evidence | matrix with a recorded decision + data-need per integration (no "TBD") |
| Gate result | `req:validate` PASS |

## Intent
Turn the four integration unknowns into recorded v1 decisions (plan §5 matrix).

## Step 0 — Session environment + carry-forward (MANDATORY, first step)
1. `bash scripts/agent/build-current-state.sh`; read plan §5 integration matrix + BE3-R1 contract (the
   `ai/review-draft` + `clickup/entry` routes) + carry-forward.
2. Read RG-R6 decision (ClickUp = task-initiation, not release; GAS scoped-out) — do not relitigate; carry it.

## Scope — in
- `decision-matrix.md`: one row per integration — **ClickUp** (`clickup/entry`), **AI** (`ai/review-draft`),
  **Files** (`file_attachments`, `google-drive`/`link`), **GAS** — each with: current state, recorded v1
  decision (build / stay-stub / stay-out), owner, and — if build — the data/credentials/config the schema
  or config must carry.
- Record OD-BE3-05 (files: Supabase Storage vs. external-URL-only for v1).
- For any "build" decision, define the payload contract addition needed (e.g. AI `proposedActions` schema)
  and hand it to R1's contract / R2's schema as a follow-up note.

## Scope — out
- Building any integration. Provisioning credentials. Any `src/**` change.

## Acceptance criteria
- [ ] AC-BE3-4-1 — every integration row has a recorded v1 decision, owner, and data-need — **no "TBD"** (doc-verifiable)
- [ ] AC-BE3-4-2 — OD-BE3-05 (files) recorded with recommendation (doc-verifiable)
- [ ] AC-BE3-4-3 — any "build" decision names the exact contract/schema addition it requires (doc-verifiable: cross-reference to R1/R2)
- [ ] AC-BE3-4-4 — no `src/**` changed (code-verifiable: name-only diff empty)

## Verification plan
| Criterion | Method | Evidence required | Fallback if tool unavailable |
|---|---|---|---|
| no-TBD | grep matrix for "TBD"/blank decision cells | 0 hits | — |
| build→needs | cross-ref build rows to R1/R2 notes | each build row linked | — |
| no src | `git diff --name-only -- src/` | empty | — |

## Dependencies
BE3-R1 (integration routes). Parallel with BE3-R3.

## Files likely affected
- `docs/backend/integrations/decision-matrix.md` — create
- `output/BE3-R4-integrations.md` — create

## Final step — Continuity wiring (MANDATORY, last step)
Append to carry-forward: per-integration v1 decisions, OD-BE3-05 status, and any contract/schema additions
handed forward. Close via `dcx-sprint-close`.
