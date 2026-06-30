# CC-3 evidence — interactive PO Web Check BLOCKED (§28)

No screenshot of the working interaction could be captured this session. The Preview MCP
browser wedges to `chrome-error://chromewebdata/` immediately after the app mounts on the
builder route, and the sandboxed Vite port is unreachable from Bash (`curl` → HTTP 000) and
from Playwright (different network context). Port 3000 is held by another chat's dev server,
so this session's Vite bumped to 3001 and the preview proxy could not track it.

This is the same live-verify limitation documented in progress logs 025 and 026.

## What WAS verified (non-visual)
- Dev server (`vite`) compiled the three changed files with **no build errors** (`preview_logs --error`: none).
- **No browser console errors** captured before the wedge (`preview_console_logs --error`: none).
- Code gates all green: typecheck, lint, test(82), architecture(272), req:validate, req:completion-gate.

## What the PO must verify with REAL pointer/drag (mock data: version v-1)
1. Route /builder/v-1 at 1440. With NO card selected: editor pill (collapsed `#editor-island`,
   `[data-testid="editor-pill"]`) is disabled, title "Drag task here to edit".
2. Select a Task/Action/Phase card (real pointer). The pill becomes enabled (accent ring,
   cursor-pointer, title "Open editor for selected card"). Click it → editor opens for that card.
3. Open a Task editor → Core tab → "Routing & Endpoint Directory": Sender and Receiver render
   in a single column, full editor width (~382px), labels/values NOT truncated.
