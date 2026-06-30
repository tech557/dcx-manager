---
sprint: RG-R1
plan: cicd-release-governance
date: 2026-07-01
agent: Claude (claude-sonnet-5, Anthropic)
status: complete
---

# RG-R1 — Versioning model + rule changes

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-VER-006, REQ-RG-OWN-007, REQ-RG-ITER-008, REQ-RG-REV-009, REQ-RG-RESET-010, REQ-RG-LOG-011 — approved, canonical graph nodes, PO-locked 2026-06-30 |
| Acceptance IDs | AC-RG-1-1 … AC-RG-1-6 — all PASS (see below) |
| Verification (EVD) | grep evidence below; `build-log-index.sh` run twice, clean both times, new columns confirmed end-to-end |

## What changed in each file

### `docs/VERSION.md`
- `current` updated `v0.3.5` → `v0.3.5.0` (carry-as-is bootstrap, per D-RG-VER — this is documenting the
  already-decided bootstrap value, not an agent-initiated version bump).
- New "Version scheme — 4-part" section: field table (Major/Stage/Iteration/Revision, owner, trigger) +
  increment/reset table.
- New "Migration & bootstrap" section documenting `v0.3.5 → v0.3.5.0` and that automation activates only
  after RG-R3.
- Old 3-part semantics table kept, retitled "Legacy (pre-governance)", for reading old logs.
- "Version ownership" section rewritten: PO owns Major/Stage only; Iteration/Revision become mechanical
  after RG-R3; until then this file stays PO-maintained by hand (no agent free-for-all introduced).

### `docs/agent-rules/core.md`
- §26 retitled "4-Part Split Ownership" and rewritten: PO-only for Major/Stage; Iteration/Revision
  mechanical-only (never agent hand-picked) once RG-R3 lands.
- New §26a "Release Governance" added: points at the plan, the registry (`docs/releases/registry.csv`)
  as operational record of truth, the promotion gate (`scripts/release/promote.sh` + recorded PO
  approval), and the no-auto-promotion rule. Explicitly additive — does not relax §5/§6/§19 etc.

**Before/after of §26 (excerpt):**
```diff
- ## §26. Version Number — PO-Only, Never Auto-Increment
- The project version is set exclusively by the PO (Mahmoud). Agents read it; they never change it.
+ ## §26. Version Number — 4-Part Split Ownership (revised RG-R1, 2026-07-01)
+ The version is a 4-part `Major.Stage.Iteration.Revision`. PO owns Major and Stage exclusively...
+ The system/agents own Iteration and Revision, but only mechanically...
```

### `docs/agent-rules/log-format.md`
- §0 identity block gains `Version:` and `Change-Class:` fields (additive — appended after
  `PO-Action:`).
- §1 sample log template updated to show the two new fields.
- New explanatory paragraph: backward-compatible, old logs never rewritten, render `—`; classification
  rule (source vs non-source path set) cross-referenced from the plan §3.3.

**Sample 4-part log header (after this change):**
```
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: process-governance
Status: Completed
PO-Action: none
Version: v0.3.5.0
Change-Class: non-source
```

### `scripts/build-log-index.sh`
- Header gains `version,change_class` columns (both header-write sites: fresh-index creation, and a new
  **one-time additive migration** that rewrites only the header line of an existing `index.csv` — data
  rows are never touched, confirmed by diff).
- `awk` extraction gains `Version:` / `Change-Class:` field parsing; `printf` appends both at the end of
  each row.
- Verified idempotent: ran twice, second run did zero migration/changes; a synthetic test log confirmed
  the new columns populate correctly end-to-end, then the test artifacts were removed.

## Acceptance criteria

| ID | Criterion | Verification | Verdict |
|---|---|---|---|
| AC-RG-1-1 | `VERSION.md` documents 4-part scheme + split ownership | `grep "Major.Stage.Iteration.Revision" docs/VERSION.md` → line 9 | PASS |
| AC-RG-1-2 | Migration note `v0.3.5 → v0.3.5.0` present | `docs/VERSION.md` lines 31, 34 | PASS |
| AC-RG-1-3 | `core.md` §26 rewritten (old phrase gone, new rule present) | `grep "agents never change the version" core.md` → empty; §26/§26a present | PASS |
| AC-RG-1-4 | `log-format.md` §0 has `Version:` + `Change-Class:` | lines 16-17 (§0), 84-85 (§1 sample) | PASS |
| AC-RG-1-5 | Index builder adds columns + runs clean; old logs untouched | ran twice clean; header migrated once; pre-existing data rows byte-identical (diffed row 2 before/after) | PASS |
| AC-RG-1-6 | No `src/**` changed | `find src -type f -exec shasum` pre/post diff empty | PASS |

## Gates

| Gate | Result |
|---|---|
| no-`src/**` proof | PASS — shasum diff empty |
| index integrity | PASS — `build-log-index.sh` exits 0, `index.csv` parses, 196 lines stable |
| typecheck/lint/validate:architecture/test | N/A — no source/TS changed |
