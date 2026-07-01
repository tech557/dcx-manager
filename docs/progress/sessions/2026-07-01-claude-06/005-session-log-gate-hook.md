## agent-rules — add local session-log enforcement hook (SessionStart + Stop)
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: process-governance
Status: Completed
PO-Action: none
Version: v1.1.0.1
Change-Class: non-source

Intent: Fix the repeatable failure the PO flagged — agents (including me, three times this session) skipping
the STRICT core.md §33 rule that every user message gets a session-log entry. Investigated first: confirmed
the mechanical version-bump system (`version-assign.yml`/`classify-change.sh`) is git-push-triggered and
classifies by file-diff paths, not by session logs — so missing logs don't corrupt version numbers, but they
do break the human-readable trail the `docs/releases/registry.csv` rows are supposed to link back to via
`session_folder`. PO chose "enforce session logging locally" over moving the version-bump trigger itself
(which would reintroduce the exact parallel-session race condition `cicd-release-governance/README.md §4.2`
was built to prevent).
Trigger: User request — "but u ignored the task log in the session which is a repeatable behavior... Is
there a way to change that so the agents can log session safely that trigger a mechanical version update..."
Requirements covered: none — agent-behavior/tooling change, not a product requirement.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | `scripts/agent/session-log-gate-init.sh` | `SessionStart` hook: records baseline count of `docs/progress/sessions/**/*.md` | 12 |
| created | `scripts/agent/session-log-gate-check.sh` | `Stop` hook: blocks ending a turn (JSON `decision: block`) if the count didn't increase since the last check; updates baseline on pass | 21 |
| edited | `.claude/settings.json` | wired both hooks in, alongside (not replacing) the existing `PostToolUse` hooks | +18 |
| edited | `.gitignore` | added `.claude/.session-log-gate-state` (per-checkout, not committed) | +1 |

### Checks
| Check | Result |
|---|---|
| `jq empty .claude/settings.json` | valid JSON |
| `jq -e` on both new hook paths | both resolve, correct command strings |
| Pipe-test: init then check with no new log file | correctly emits `{"decision":"block",...}`, exit 0 |
| Pipe-test: check after a file count increase | correctly passes silently, updates baseline |
| Live test | this file's creation is what the `Stop` hook (firing at the end of this turn) checks for — if it fires clean, the hook is proven live |

### Note
Only wired to `Stop`, not `SubagentStop`, per the PO's design: subagents don't own a top-level session log,
the parent session does.

### PO action required
None.
