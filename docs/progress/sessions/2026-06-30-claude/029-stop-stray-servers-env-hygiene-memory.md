---
log: 029-stop-stray-servers-env-hygiene-memory
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: process-governance
version_context: v0.3.5
---

# 029 — Stop all stray dev servers; record one-clean-server env hygiene in MEMORY (not agent rules)

## Type: process-governance
PO: stop all stray servers; clean environment + one test server per run as pre-CI/CD readiness; get context
from the CI/CD draft plan; **do NOT change agent instructions — rely on memory.**

## Actions
- **Killed all stray dev servers** (PO-directed): `vite --port=3000` (PID 2759) + `npm run dev` (2748/2747)
  + `pkill -f node_modules/.bin/vite` / `npm run dev`. **Result: 0 dev servers, port 3000 free** (0 listeners).
- **CI/CD plan context** read: `docs/plans/drafted/cicd-release-governance/README.md` — an **architecture
  brief** (Path 2, NOT executable): preview-per-source-change (immutable per-commit Vercel URL), 4-part
  versioning (Major.Stage.Iteration.Revision), promote-exact-build, release registry, PO approval gates.
  Blocker: repo is **not git** (no `.git`) — G2, PO-owned. Sprints folder empty (brief only).
- **Recorded MEMORY** (per "rely on memory"): `~/.claude/projects/.../memory/env-hygiene-one-clean-server.md`
  + `MEMORY.md` index. Captures: before any Preview/Playwright verification, stop strays + free port 3000 +
  run exactly ONE server; relative-nav only (explicit-origin nav wedges the proxy); this is the LOCAL
  stand-in for the cicd preview-per-change model. Explicitly NOT encoded in core.md/AGENTS.md/skills.

## Root cause closed (recurring evidence gap)
The CT-3/CC-2/OA-1/CC-3 "can't screenshot / empty evidence" pattern = the stray :3000 server wedging the
Preview MCP proxy. With strays stopped + 3000 free, one clean Preview server can now capture screenshots.

## Boundary honored
No edits to agent instructions (core.md / AGENTS.md / skills / sprint files). Behavior carried via MEMORY only.

## Gates
Env cleanup + memory + doc. 0 `src/` writes. No graph mutation.

## Next
- Environment is clean + ready: one Preview server can be started on port 3000 for verification per run.
- Open (PO/future): the cicd-release-governance brief's git-init (G2) + REQ-RG-* intake are preconditions
  before that plan becomes executable.
