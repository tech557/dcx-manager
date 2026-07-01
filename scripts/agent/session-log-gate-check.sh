#!/usr/bin/env bash
# session-log-gate-check.sh — Stop hook.
# Blocks ending the turn if no new session-log file was written under
# docs/progress/sessions/ since the last check (core.md §33, STRICT: every user
# message gets an indexed log entry, even purely conversational ones — the human
# trail that docs/releases/registry.csv version rows link back to via session_folder).
# Main-session Stop only — never wire this to SubagentStop; a subagent doesn't own
# a top-level session log, the parent session does.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
STATE_FILE="$REPO/.claude/.session-log-gate-state"

CURRENT="$(find "$REPO/docs/progress/sessions" -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
BASELINE="$(cat "$STATE_FILE" 2>/dev/null || echo 0)"

if [ "$CURRENT" -gt "$BASELINE" ]; then
  echo "$CURRENT" > "$STATE_FILE"
  exit 0
fi

cat <<EOF
{"decision": "block", "reason": "No new session-log entry was found under docs/progress/sessions/ for this turn. Per core.md §33 (STRICT), every user message needs one — even a purely conversational answer with no file changes. Write the log entry for the turn that just completed (a new docs/progress/sessions/<session-folder>/NNN-*.md file), then finish."}
EOF
