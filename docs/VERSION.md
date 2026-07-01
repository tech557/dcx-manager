# Project Version

| Field | Value |
|---|---|
| current | `v1.1.1.4` |
| previous_minor | `v0.2.x` (archived: `docs/archive/v0.2/`) |
| next_planned | `v0.3.6.0` (next source-code Iteration bump, once RG-R3 CI wiring is live) |

## Version scheme — 4-part `Major.Stage.Iteration.Revision` (RG-R1, 2026-07-01)

Example: `v0.1.4.2`.

| Field | Meaning | Owner | Increments when |
|---|---|---|---|
| **Major** | Production version | **PO only** | a build is promoted to Production |
| **Stage** | Staging version | **PO only** | a build is promoted to Staging |
| **Iteration** | Source-code implementation version | code workflow / agents / devs (mechanical) | a **source** change lands (creates a preview) |
| **Revision** | Non-source planning/docs/testing/governance/bookkeeping | agents / devs (mechanical) | a **non-source** change lands (no preview) |

**Increment & reset rules:**

| Event | Major | Stage | Iteration | Revision | Preview? |
|---|---|---|---|---|---|
| Source-code change lands | — | — | **+1** | **→ 0** | **Yes** |
| Non-source change lands | — | — | — | **+1** | **No** |
| Promote to Staging | — | **+1** | **→ 0** | **→ 0** | (promotes existing build) |
| Promote to Production | **+1** | **→ 0** | **→ 0** | **→ 0** | (promotes existing build) |

Full mechanical detail (classifier, registry schema, CI wiring): `docs/plans/active/cicd-release-governance/README.md` §3.

## Migration & bootstrap — `v0.3.5` → `v0.3.5.0` (PO-decided 2026-06-30)

The project **stays in the `v0.3.x` line** — there is no jump to `v0.4`. The existing 3-part version is
carried as-is into the 4-part scheme: `v0.3.5` → **`v0.3.5.0`** (Major `0` · Stage `3` · Iteration `5`,
carried from the old Patch · Revision `0`).

`v0.3.5.0` was stamped **manually** by the PO as "version 0" at the point this governance scheme was
introduced (2026-07-01) — no automation ran yet. **Automation (mechanical Iteration/Revision bumps)
activates only after the GitHub CI wiring lands (RG-R3).** Until then, this `current` field is still
PO-maintained by hand, same as before.

## Legacy (pre-governance) 3-part semantics

The table below described the version scheme **before** RG-R1 (3-part `Major.Minor.Patch`). It is
superseded by the 4-part scheme above but kept for historical reference when reading pre-2026-07-01 logs.

| Bump | Example | Effect |
|---|---|---|
| Patch | `v0.3.2` → `v0.3.3` | Bug fixes, visual polish. Logs accumulate in active session folders. |
| Minor | `v0.3.x` → `v0.4.0` | Feature boundary. Triggers archive sweep — see `scripts/archive-version.sh`. |
| Major | `v0.x.y` → `v1.0.0` | Full system change. Full docs freeze + new docs tree. |

## What agents do with this

1. Read this file first, before `docs/agent-rules/core.md`.
2. Confirm the version matches the active plan's `version_context` frontmatter.
3. If there is a mismatch, stop and ask the PO before proceeding.

## Version ownership — READ THIS

**PO owns Major and Stage exclusively; the system/agents own Iteration and Revision under the mechanical
rules above** (`core.md §26`, rewritten by RG-R1 — this is no longer "agents never change the version").

- Do **not** hand-pick or guess an Iteration/Revision bump — until RG-R3 automation exists, treat this
  file as PO-maintained by hand, same as the legacy rule, and do not edit it on your own initiative.
- Never increment, bump, or suggest a **Major** or **Stage** change in any output — those remain PO-only,
  tied to an actual Staging/Production promotion (`core.md §26`).
- The version you read here is the current authoritative version. Use it as-is in all
  `version_context` fields, progress logs, and plan frontmatter.
- When the PO says "the version is now vX.Y.Z.W", update only this file's `current` field to
  exactly the value they stated — nothing else.

---

*Major/Stage set by PO only. Iteration/Revision become mechanical once RG-R3 CI wiring lands; until then
this file is still PO-maintained by hand.*
