---
sprint: RG-R6
plan: cicd-release-governance
title: ClickUp release board + GAS sink
family: external-config
executor: Claude / Codex / opencode (ClickUp tool; HTTP for GAS)
required-tools: ClickUp (MCP), HTTP client for GAS endpoints
depends-on: RG-R4
allowed-writes: ClickUp release list/fields config, GAS endpoint config, scripts/release/mirror-clickup.sh, output/RG-R6-*.md
forbidden-writes: src/**
status: Skipped — premise corrected by PO 2026-07-01, see output/RG-R6-decision.md
Status: Skipped
---

> **Skipped (2026-07-01).** ClickUp is the existing DCX task-initiation system, unrelated to
> production/CI-CD release tracking — building a ClickUp release board would have created a second,
> wrong source of truth. PO decision: release approval stays manual (PO approves in chat; agent writes
> `docs/releases/approvals/<version>-<env>.md` directly) — already the real mechanism used in RG-R4.
> See `output/RG-R6-decision.md` and the plan README's OD-RG-06/OD-RG-09 revision.

# RG-R6 — ClickUp release board + GAS sink

Human-visible release board (ClickUp) mirroring the canonical git registry, plus a secondary GAS record
sink. **Authority: the git registry is canonical (OD-RG-06); ClickUp is a mirror + human gate; GAS is a
secondary sink only.**

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-APPROVAL-005, REQ-RG-PLAT-018, REQ-RG-CSV-012 (mirror), REQ-RG-MD-013 — **Status: approved — canonical graph nodes, PO-locked 2026-06-30 (ledger LDG-2026-06-30-create-node-REQ-RG-*; OD-RG-07 closed)** |
| Acceptance IDs | AC-RG-6-1 … AC-RG-6-5 |
| Expected manifestations | ClickUp release list + status/custom field "Approved for X"; `mirror-clickup.sh`; GAS sheet/notify endpoint config |
| Verification (EVD) | a registry row appears as a ClickUp task; a ClickUp "Approved for Staging" flip is the human gate referenced by `promote.sh` |

## Step 0 — Continuity & environment (mandatory)
1. Read carry-forward (registry per RG-R2; promote.sh per RG-R4); §5 ClickUp/GAS rows; OD-RG-06/OD-RG-09.
2. `bash scripts/agent/build-current-state.sh`; confirm ClickUp tool availability.

## Scope
- **Allowed:** ClickUp list/fields, mirror script, GAS endpoint config.
- **Forbidden:** `src/**`; making ClickUp the source of truth; auto-promotion.

## Steps (exact)
1. Create a ClickUp **Releases** list; one task per version; custom fields: version, change_class, preview/staging/prod URLs, approval status ("Pending / Approved for Staging / Approved for Production").
2. `mirror-clickup.sh`: push a registry row → ClickUp task (idempotent upsert by version). Registry stays canonical.
3. Approval wiring (OD-RG-09): a PO "Approved for X" flip → CI/promote.sh writes the tamper-evident `docs/releases/approvals/<version>-<env>.md` record. ClickUp is the human trigger; the file is the gate artifact.
4. GAS sink: POST each release event to the existing GAS endpoint (log to a sheet + optional notify). Secondary mirror only — failures are non-blocking and logged.
5. Test: append a registry row → appears in ClickUp; flip approval → approval record written; GAS receives the event.

## Output
`output/RG-R6-clickup-gas.md` — ClickUp schema, mirror contract, approval flow (OD-RG-09), GAS payload, and the round-trip test.

## Acceptance criteria
| ID | Criterion | Verification |
|---|---|---|
| AC-RG-6-1 | Release task per version, mirrored from registry | a registry row → ClickUp task |
| AC-RG-6-2 | Registry remains canonical; ClickUp is mirror | mirror is one-way registry→ClickUp |
| AC-RG-6-3 | PO approval flip writes the approvals/ record | file created on flip |
| AC-RG-6-4 | GAS sink receives events; failure is non-blocking | event logged; simulated failure doesn't block release |
| AC-RG-6-5 | no `src/**` changed | name-only diff |

## Gates (core.md §11)
| Gate | Applies | How |
|---|---|---|
| no-`src/**` proof | YES | name-only diff |
| round-trip test | YES | registry→ClickUp→approval record |

## Fallbacks (core.md §28)
- No ClickUp tool in-session → write the schema + mirror script; mark live criteria `BLOCKED — ClickUp access unavailable`; do not fake a task.
- GAS endpoint unreachable → log and continue (secondary sink); never block a release on GAS.

## Close (core.md §29/§36a/§35c)
1. `bash scripts/agent/sprint-doctor.sh cicd-release-governance RG-R6 <agent>`.
2. **Requirement gates (core.md §35c):** `<changed-files>` via `git diff --name-only`, then `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, `npm run req:completion-gate -- --changed <changed-files>`. The `dcx-sprint-close` skill bundles steps 1–2; must return PASS / PASS_WITH_QUEUED_REVIEW.
3. Carry-forward: ClickUp board + mirror + approval flow + GAS sink live; OD-RG-06/09 resolution.
4. Session log + `bash scripts/build-log-index.sh`.
