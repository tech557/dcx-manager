# BE3-R0 — Discovery baseline & dataset scaffold (output)

Agent: Claude · Model: claude-opus-4-8 · Provider: Anthropic · Date: 2026-07-01
Version: v1.0.1.0 · Change-Class: non-source

## What this sprint established

A trustworthy, re-verified current-state baseline (the v2 discovery numbers are **pre-refactor** and were
not trusted) and the `docs/backend/` readiness-dataset home the rest of the plan fills.

## Re-verified current state (live tree, 2026-07-01)

| Area | Verified fact | Method |
|---|---|---|
| Contract surface | **22 routes** in `src/services/mock-dispatch.ts` | bootstrap `grep -cE '^\s*\{ method:'` = 22 (sanity only; authoritative count = BE3-R1 `extract-routes.sh`) |
| Route families | channels, channel-compositions, subtask-definitions, versions (+status/date/duplicate/files), builder, activity-logs, access, ai/review-draft, clickup/entry | read of route table |
| Domain types | `Api*` set complete in `src/types/api.ts`; enums `VersionStatus`, `VersionSourceType`, `LifecycleEventType`, `ApiPhaseIconType`, file `source` | read of `src/types/api.ts` + `src/types/lifecycle.ts` |
| Supabase prod (`xokgguodxjjwokngyquo`) | **0 public tables** — empty | `list_tables` read-only |
| Supabase dev (`ibekkxqujqvlajeldpoa`) | **0 public tables** — empty | `list_tables` read-only |

Both Supabase projects were created 2026-06-30 (RG-R5) and remain schema-less, matching the RG-R5 record.

## Dataset home created

`docs/backend/README.md` — indexes all five dataset parts + the scorecard, each marked ⏳ PENDING, with a
"how to read this dataset" section and the verified baseline table. Links resolve to the sprint-owned
subdirectories (created by R1–R6 as they run).

## Acceptance criteria

| Criterion | Verdict | Evidence |
|---|---|---|
| AC-BE3-0-1 — dataset home indexes 5 parts + scorecard | ✅ PASS | `docs/backend/README.md` created; dataset-index table lists contract/schema/auth/integrations/captured + scorecard |
| AC-BE3-0-2 — approximate route-count baseline recorded + deferral to BE3-R1 stated | ✅ PASS | "22 routes" recorded in both README + this output, with explicit "authoritative count = BE3-R1 extract-routes.sh" |
| AC-BE3-0-3 — both Supabase projects confirmed empty | ✅ PASS | `list_tables` returned `[]` for both prod + dev |
| AC-BE3-0-4 — no `src/**` changed | ✅ PASS | `git diff --name-only -- src/` empty |

## Gates

| Gate | Result |
|---|---|
| Supabase read-only (`list_tables` ×2) | PASS (0 tables each) |
| no-src diff | PASS (empty) |
| `req:validate` | deferred to sprint-close (docs-only sprint) |

## Notes / follow-ups

- The authoritative route count is intentionally deferred to BE3-R1's deterministic `extract-routes.sh`;
  R0's `grep` is a bootstrap sanity check per plan reaudit advisory #1.
- No `src/**` touched, no Supabase migration applied — read-only baseline only.
