---
plan: docs-refactor
status: completed
version_context: v0.3.2
created: 2026-06-25
completed: 2026-06-25
briefed_by: PO
---

# Plan: Docs Refactor

**Status:** Completed — all 5 sprints finished. See `docs/plans/completed/docs-refactor/` after archive.

---

## Problem Statement

The documentation system had five compounding problems, all resolved by this plan. See individual sprint files for details.

---

## Initiatives (Sprints)

### DR-1 — AGENTS.md Modularization
**Status:** ✅ Completed
**Result:** AGENTS.md slimmed from 501→67 lines routing header. Core rules extracted to `docs/agent-rules/core.md`, log format to `docs/agent-rules/log-format.md`. All 4 agent guides updated with performance profiles.

### DR-2 — Version Awareness System
**Status:** ✅ Completed
**Result:** `docs/VERSION.md` created. `scripts/version-bump.sh` and `scripts/archive-version.sh` implemented. AGENTS.md routing header now lists VERSION.md as first read.

### DR-3 — Log-to-CSV Pipeline
**Status:** ✅ Completed
**Result:** `scripts/build-log-index.sh` indexes all 156 session logs into `docs/progress/index.csv` for <200-token agent consumption.

### DR-4 — Codebase Manifest
**Status:** ✅ Completed
**Result:** `docs/references/codebase-manifest.md` auto-generated with manual annotations. `scripts/gen-manifest.sh` for regeneration.

### DR-5 — Stale Docs Cleanup
**Status:** ✅ Completed
**Result:** Updated `current-architecture.md` to v0.3.2, resolved all stale references. Populated `docs/references/README.md`. Added `docs/plans/active/README.md`.

---

## Execution Order

```
DR-5 first  ← unblocks clean baseline (fast, no scripts)         ✅
DR-2        ← version file needed before DR-3 references it       ✅
DR-4        ← manifest generation can run once codebase is stable ✅
DR-3        ← CSV pipeline built after manifest exists for ref    ✅
DR-1 last   ← AGENTS.md split happens after all other docs stalk → ⚡ done first per PO override
```

All 5 sprints: ✅ Completed on 2026-06-25.

---

## Out of Scope

- Changing any source code
- Updating product requirements content (only format/location changes)
- Changing build config or CI pipelines
- Any changes to `src/`
