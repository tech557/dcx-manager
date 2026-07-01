#!/usr/bin/env bash
# session-log-gate-init.sh — SessionStart hook.
# Records a baseline count of session-log files so session-log-gate-check.sh (Stop hook)
# can detect whether a new one was written for the turn that just ended.
# Enforces core.md §33 (STRICT): every user message gets an indexed session-log entry,
# even purely conversational ones.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
STATE_FILE="$REPO/.claude/.session-log-gate-state"

mkdir -p "$(dirname "$STATE_FILE")"
COUNT="$(find "$REPO/docs/progress/sessions" -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
echo "$COUNT" > "$STATE_FILE"
