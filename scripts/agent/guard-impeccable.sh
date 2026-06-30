#!/usr/bin/env bash
# guard-impeccable.sh — PreToolUse guard for the Skill tool.
# Blocks any invocation of the `impeccable` design skill while the
# folder-structure-v2 refactor is active. Reads the hook JSON on stdin.
#
# To LIFT the quarantine after the refactor is done:
#   remove the PreToolUse `Skill` hook from .claude/settings.json
#   (and optionally flip skillOverrides.impeccable back to "on").
set -euo pipefail

input="$(cat)"

skill="$(printf '%s' "$input" | jq -r '.tool_input.skill // ""' 2>/dev/null || echo "")"

if [ "$skill" = "impeccable" ]; then
  # PreToolUse deny — the reason is shown to the model and the user.
  cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"BLOCKED: the `impeccable` design skill is QUARANTINED until the folder-structure-v2 refactor is complete. When enabled it is BRAND-SYSTEM ONLY (src/brand/) and must NOT touch component/app code (src/ui, src/builder, src/components, logic). Do not invoke it now. To lift: remove the Skill PreToolUse hook in .claude/settings.json."}}
JSON
  exit 0
fi

# Not impeccable — allow silently.
exit 0
