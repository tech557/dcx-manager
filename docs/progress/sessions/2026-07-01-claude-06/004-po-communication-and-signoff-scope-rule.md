## agent-rules — add PO communication & sign-off scope rule (core.md §37)
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: process-governance
Status: Completed
PO-Action: none
Version: v1.1.0.1
Change-Class: non-source

Intent: Correct and codify the meaning of "PO" for all future agent sessions, per direct PO correction.
Trigger: User request — "no PO doesnt mean just the human in chat... enforce this to agents.md... shouldnt
reflect any changes in requirement graph."
Requirements covered: none — explicitly an agent-behavior rule, not a product requirement (per the
trigger's own instruction; confirmed no `docs/product/requirements/graph/**` file was touched).

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | `docs/agent-rules/core.md` | added §37 — PO = real Product Owner, not a developer; product-friendly language by default; sign-off gates reserved for genuine PO-level decisions (production risk, user impact, scope/cost, compliance, irreversible actions), not routine technical execution | +19 |
| edited | `AGENTS.md` | added a short pointer section ("Communicating with the PO") to §37, kept terse per PO's explicit concern about file size / agents skipping long files | +9 |

### Checks
| Check | Result |
|---|---|
| `docs/product/requirements/graph/**` untouched by this edit | Confirmed via `git status` |
| File size discipline | AGENTS.md 273→282 lines, core.md 859→878 lines — pointer + rule only, no duplication |

### PO action required
None — rule is now active for all future sessions.

### Note
This entry itself was written retroactively, one message late — the omission is what the PO flagged in the
next message. See `005-*.md` for the follow-up on session-logging reliability.
