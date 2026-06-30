#!/usr/bin/env bash
# sync-skills.sh — Copy canonical agent-skills/ into .claude/skills/ adapters
# Run after updating any canonical SKILL.md in agent-skills/
# Usage: bash scripts/agent/sync-skills.sh [--dry-run]
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
DRY="${1:-}"

CANONICAL="$REPO/agent-skills"
CLAUDE_TARGET="$REPO/.claude/skills"
AGENTS_TARGET="$REPO/.agents/skills"

mkdir -p "$CLAUDE_TARGET" "$AGENTS_TARGET"

SKILLS=(dcx-sprint-planner dcx-frontend-refactor dcx-frontend-verify dcx-sprint-close dcx-code-query dcx-plan-audit dcx-requirement-intake dcx-requirement-maturation dcx-manifestation-reconcile)

synced=0
for skill in "${SKILLS[@]}"; do
  src="$CANONICAL/$skill/SKILL.md"
  if [[ ! -f "$src" ]]; then
    echo "WARN: canonical skill not found: $src" >&2
    continue
  fi

  # Read frontmatter from canonical
  name=$(grep -E "^name:" "$src" | head -1 | sed 's/name://;s/^ //;s/\r//')
  desc=$(awk '/^description:/{found=1; sub(/^description: *>/,""); sub(/^description: */,""); print; next} found && /^  /{print; next} found{found=0}' "$src" | tr '\n' ' ' | sed 's/  */ /g;s/^ //;s/ $//')

  # .claude/skills/ adapter: frontmatter + pointer to canonical + Claude-specific additions
  claude_dest="$CLAUDE_TARGET/${skill}.md"
  agents_dest="$AGENTS_TARGET/${skill}.md"

  # Build adapter content
  adapter=$(cat << ADAPTER
---
name: ${name}
description: ${desc}
---

<!-- Claude adapter — canonical source: agent-skills/${skill}/SKILL.md -->
<!-- This file adds Claude-specific MCP and hook context. -->
<!-- To update this skill, edit agent-skills/${skill}/SKILL.md and run: bash scripts/agent/sync-skills.sh -->

$(cat "$src" | tail -n +$(grep -n "^---$" "$src" | tail -1 | cut -d: -f1) | tail -n +2)

---
## Claude-specific additions

### MCP tools available
- **playwright** (global) — use for browser-verifiable acceptance criteria
- **chrome-devtools** (global) — use for runtime/console/network inspection
- **context7** (global) — use before writing code that depends on a versioned library
- **eslint** (.mcp.json) — use for interactive lint rule explanation and repair
- Storybook / Semgrep / SonarQube / Shadcn — see .mcp.json (disabled; setup required)

### Deferred tool loading
Use ToolSearch to load MCP tool schemas only when needed. Do not load all tools eagerly.
ADAPTER
)

  if [[ "$DRY" == "--dry-run" ]]; then
    echo "[DRY] Would write: $claude_dest"
    echo "[DRY] Would write: $agents_dest"
  else
    echo "$adapter" > "$claude_dest"
    # .agents/skills/ gets the canonical content directly (no Claude-specific additions)
    # Compare first — skip write if dest matches (tolerates read-only env like Codex audit)
    if [[ -f "$agents_dest" ]] && diff -q "$src" "$agents_dest" &>/dev/null; then
      echo "Synced: $skill (no change)"
    elif cp -X "$src" "$agents_dest" 2>/dev/null; then
      echo "Synced: $skill"
    elif cp "$src" "$agents_dest" 2>/dev/null; then
      echo "Synced: $skill (cp without xattr)"
    elif cat "$src" > "$agents_dest" 2>/dev/null; then
      echo "Synced: $skill (cat fallback)"
    else
      echo "WARN: cannot write $agents_dest (read-only fs, content differs)" >&2
    fi
    synced=$((synced + 1))
  fi
done

echo "Done. $synced skill(s) synced."
