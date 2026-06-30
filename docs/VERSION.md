# Project Version

| Field | Value |
|---|---|
| current | `v0.3.5` |
| previous_minor | `v0.2.x` (archived: `docs/archive/v0.2/`) |
| next_planned | `v0.4.0` |

## Version semantics

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

**Agents never change the version number.** The version is set exclusively by the PO (Mahmoud).

- Do **not** increment, bump, or suggest a version change in any output.
- Do **not** run `scripts/version-bump.sh` or edit `docs/VERSION.md` on your own initiative.
- The version you read here is the current authoritative version. Use it as-is in all
  `version_context` fields, progress logs, and plan frontmatter.
- When the PO says "the version is now vX.Y.Z", update only this file's `current` field to
  exactly the value they stated — nothing else.

---

*Version set by PO only. Agents read, never write, except when explicitly told to update it.*
