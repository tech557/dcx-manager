## requirements-system — revise per Codex round-3 audit
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: user-request-planning
Status: Completed

Intent: Apply Codex round-3 audit (NEEDS REVISION, 2 blocking + 2 advisory) — the Revise stage of the §34
loop. Verdict improved from NOT READY → NEEDS REVISION; remaining items are wording/enforcement.
Trigger: user — "revise latest codex audit."

Fixes:
- B1 RS-R4: cross-scope dogfood was in scope but not in acceptance → added an acceptance criterion
  requiring the requirements-system product req + derived frontend/backend/devops/test-qa/agent-workflow
  reqs with derives-from + lifecycle/lock + traces.
- B2 RS-R5: shorthand gates → exact (`npm run typecheck/lint/validate:architecture/test`, `bash
  scripts/verify.sh`, `bash scripts/build-log-index.sh` if logs changed).
- A1 README: revision metadata "round 1" → "rounds 1–3".
- A2: normalized scope value `test/QA` / `test-QA` → machine-safe `test-qa` everywhere (README + RS-R0).

Gates: N/A — planning/docs only, no src/ change.
Follow-ups: one more re-audit per §34 to confirm READY before PO implements.
