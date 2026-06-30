## [Reference] — opencode MCP Setup Instructions

Agent: Claude (System Architect)
Date: 2026-06-27
Status: Reference — no code changed

---

## Can opencode configure its own MCPs?

**Yes — with one catch.** opencode reads MCP config from `~/.config/opencode/opencode.jsonc`
(global) or a project-level `opencode.jsonc` (project root). It can write that file via shell
commands during a session. However, **MCP servers only load at startup** — opencode cannot
hot-reload them mid-session. After editing the config, the user must restart opencode.

---

## Current state

Global config path: `~/.config/opencode/opencode.jsonc`
Current content: `{ "$schema": "https://opencode.ai/config.json" }` (empty — no MCPs configured)

Project `.mcp.json` is **Claude Code only** — opencode does not read it.

---

## What to add — full config for opencode

Replace `~/.config/opencode/opencode.jsonc` with:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "eslint": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@eslint/mcp@latest"]
    },
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

**Why these three:**
- `context7` — fetch live library docs for Tailwind v4, React 19, Vite 6 before writing version-sensitive code. High value, no side effects.
- `eslint` — interactive lint repair. Already works in Claude Code. opencode should have it too.
- `playwright` — browser verification after code changes. Useful for P2/P3 component work.

**Not including:** `chrome-devtools-mcp` — requires a running Chrome tab via CDP. Hard to wire reliably in non-interactive sessions. Skip for now.

---

## How opencode installs it (self-setup in a session)

opencode can run this shell command in a session to write the config:

```bash
cat > ~/.config/opencode/opencode.jsonc << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "eslint": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@eslint/mcp@latest"]
    },
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
EOF
echo "Config written. Restart opencode to load MCPs."
```

**After running:** user must restart opencode. MCPs are not hot-reloadable.

**Verify on next session start:**
- context7 tool should appear in opencode's tool list
- eslint tool should appear (`lint-files` or similar)
- playwright tools should appear (`browser_navigate`, `browser_screenshot`, etc.)

---

## Alternative MCPs (if the above don't connect)

| MCP | Alternative | Notes |
|---|---|---|
| `context7` | Direct web search or `curl` to docs | context7 is the preferred approach for Tailwind v4 |
| `eslint` | `npm run lint 2>&1` in shell | Full fallback — all the info, just not interactive |
| `playwright` | `npm run test:e2e` CLI | e2e tests only; no free-form browser interaction |

---

## Impact on folder-structure-v2 sprints

**If MCPs remain unavailable for opencode**, no sprints are blocked. All 4 sprint files
(P1–P4) use only shell commands and npm scripts — zero MCP dependencies. The only thing
lost without MCPs:

| Sprint | MCP benefit | Without MCP |
|---|---|---|
| P1 (tokens) | eslint MCP for interactive repair | `npm run lint` gives same info |
| P2 (components) | playwright for browser verification | Manual browser check or skip step 8 verification |
| P3 (quality) | eslint MCP for exhaustive-deps diagnosis | `npm run lint 2>&1 \| grep exhaustive-deps` |
| P4 (backend) | none — pure service code | No impact |

**Verdict: all sprints executable without MCPs.** MCPs are a quality-of-life improvement,
not a prerequisite.

---

## Codex MCP situation

Codex (OpenAI Code Interpreter / coding agent) does not support arbitrary MCP servers.
It has its own fixed tool set (code execution sandbox, file I/O, web search in some configs).
No MCP setup path exists for Codex.

**Codex sprint assignments should avoid tasks that rely on MCPs.**
All P1–P4 sprint files already satisfy this constraint.
