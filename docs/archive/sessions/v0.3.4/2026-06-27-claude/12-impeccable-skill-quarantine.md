## Install + quarantine the impeccable design skill
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-28
Status: Completed

Intent: Install the impeccable design skill into the project's agent skills, but keep it dormant until the refactor is done, restrict it to the brand system (no code), and make accidental use impossible/visible.
Trigger: user request — "add it to the agents skills. But i dont wanna use it now at all. it will be used later after the refactor is done and it shall not be allowed to touch code only my brand system. And i should know before accidentally using the skill."
Requirements covered: N/A — tooling/config; no product src changed.

## Install
- `npx skills add pbakaus/impeccable` → installed to `.agents/skills/impeccable/` (SKILL.md v3.8.0 + agents/ + reference/ + scripts/, 99 files), symlinked into `.claude/skills/impeccable`. Project-local, not ~/.claude global. Not managed by sync-skills.sh.
- Installer security rating: Med Risk (Gen/Snyk), 0 Socket alerts. "Skills run with full agent permissions."

## Quarantine (3 layers)
1. `skillOverrides.impeccable: "user-invocable-only"` in `.claude/settings.json` → removes impeccable from the model's auto-trigger listing (no accidental auto-use), keeps `/impeccable` for the user.
2. `PreToolUse` `Skill` hook → `scripts/agent/guard-impeccable.sh` (NEW). Reads hook stdin; if `.tool_input.skill == "impeccable"` emits a PreToolUse `permissionDecision: deny` with a message: quarantined until folder-structure-v2 done; BRAND-SYSTEM ONLY (src/brand/); must NOT touch component/app code; how to lift. Otherwise allows silently. Pipe-tested both branches; deny JSON validates.
3. Governance note in `docs/agent-skills.md` ("Third-party / quarantined skills") recording the policy + how to lift.

## Verification
- guard-impeccable.sh: impeccable input → valid deny JSON (exit 0); other skill → no output (exit 0); jq confirms permissionDecision=deny.
- settings.json: valid JSON; Skill PreToolUse hook present + command resolves; skillOverrides present; existing PostToolUse Write|Edit hooks preserved.

## Caveat (reload)
The hook + skillOverride take effect on config reload. The Claude Code settings watcher watches `.claude/` (settings.json existed at session start), so it should reload; if the block doesn't fire in THIS session, opening `/hooks` once (or restarting) reloads config. I did NOT test by actually invoking impeccable — if the guard weren't live yet, that would run the very skill we're quarantining. Logic is proven via pipe-test + jq validation instead.

## Files
Files created:
  scripts/agent/guard-impeccable.sh — PreToolUse guard blocking Skill(impeccable)
  .agents/skills/impeccable/ + .claude/skills/impeccable (symlink) — installed skill (third-party)
  docs/progress/sessions/2026-06-27-claude/12-impeccable-skill-quarantine.md — this log
Files edited:
  .claude/settings.json — added skillOverrides.impeccable + PreToolUse Skill hook (merged, PostToolUse preserved)
  docs/agent-skills.md — governance note for quarantined impeccable
Files deleted: None

Churn — work reversed: None.

Preserve-semantic check: No product code changed. Existing log-index + completed-plan-warn hooks preserved.

Acceptance criteria:
  □ impeccable added to agent skills: PASS (.agents/skills/impeccable)
  □ not usable now (model auto-trigger off + hard block): PASS
  □ brand-only / no-code rule recorded (hook message + governance doc): PASS
  □ user warned before accidental use (hook deny message): PASS

Gates: N/A — config/docs only.

Consumer updates required: None.

Open issues / follow-ups (PO):
  - If the block doesn't fire this session, open /hooks once or restart to reload config.
  - To enable impeccable after the refactor: remove the Skill PreToolUse hook in .claude/settings.json (+ optionally skillOverrides.impeccable: "on"), then run /impeccable init against src/brand/.
  - impeccable is a Med-Risk third party with full-permission scripts in .agents/skills/impeccable/scripts/ — review before enabling.

index: hand-appended to docs/progress/index.csv (build-log-index.sh mislabels/duplicates — known tooling debt).
