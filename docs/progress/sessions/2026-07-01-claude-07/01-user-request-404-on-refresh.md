## Vercel SPA refresh 404 — fix rewrite config
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
Status: Completed
PO-Action: none
Version: v1.1.1.1
Change-Class: non-source

Intent: Fix browser refresh returning 404 NOT_FOUND on version pages in the deployed app.
Trigger: User report — "everytime i refresh the browser while on version of DCX page it returns error 404: NOT_FOUND ... ID: fra1:fra1::k72j2-1782935722242-e77a5e777da2"
Requirements covered: None (bug fix, not tied to a tracked requirement ID)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | vercel.json | Added `rewrites` fallback (`/(.*)` → `/index.html`) so Vercel serves the SPA shell for client-side routes on hard refresh/direct navigation | 5 (was 5) |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | Only added `rewrites` key; existing `name`, `framework`, `ignoreCommand` untouched |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Root cause identified (Vite + React Router SPA with no Vercel rewrite fallback → static 404 on non-root paths) | PASS |
| vercel.json updated with SPA fallback rewrite | PASS |

### Gates
| Gate | Result |
|---|---|
| typecheck | N/A (config-only change) |
| verify.sh | N/A |
| validate:architecture | N/A |
| test | N/A |
| browser manual check | Not run — fix only takes effect on a Vercel deploy, not in local Vite dev server (which already handles SPA fallback natively) |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None (Vercel hosting config only, no app code changed)

### Open issues / follow-ups
- Fix is unverified against production until the next Vercel deploy — confirm the version-page refresh works post-deploy.
