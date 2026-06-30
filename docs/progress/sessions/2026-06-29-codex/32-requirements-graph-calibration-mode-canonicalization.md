## Requirements Graph — Calibration-mode canonicalization
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-29
Type: requirements-governance
Status: Completed
PO-Action: none

Intent: Check whether the product requirements graph needed canonical updates for the PO's calibration-mode operating rules, then apply the minimal graph update.
Trigger: User request: "check if u need to update the current requirements we logged in product graph regarding this system operations and usage"
Requirements covered: REQ-GOV-CAL-001, REQ-GOV-SRC-001, REQ-GOV-INV-001, REQ-GOV-TRACE-001-DATA, REQ-GOV-TRACE-001-AGENT

## Session Environment

| Item | Result |
|---|---|
| Repository version | v0.3.5 |
| Active plans | requirements-system |
| MCP operational | eslint |
| MCP awaiting | storybook, shadcn, semgrep, sonarqube |
| Tooling blocked/missing | semgrep CLI not installed; e2e tests not written |
| Code index | fresh, age 24 minutes at session start |
| `build-current-state.sh` | PASS; latest prior log was Codex/31 |
| `verify-tooling-state.sh` | PASS for npm scripts and `verify.sh`; semgrep CLI not installed |

### Skill routing

| Skill | Resolution |
|---|---|
| `dcx-requirement-intake` | Read from `agent-skills/dcx-requirement-intake/SKILL.md`; `.agents/skills/dcx-requirement-intake/SKILL.md` was absent |
| `dcx-requirement-maturation` | Read from `agent-skills/dcx-requirement-maturation/SKILL.md`; `.agents/skills/dcx-requirement-maturation/SKILL.md` was absent |

### Files touched

| Action | Path | What & why |
|---|---|---|
| created | `docs/product/requirements/graph/nodes/requirement/REQ-GOV-CAL-001.json` | Canonical calibration-mode rollout requirement |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-GOV-SRC-001.json` | Canonical no-automatic-src-mutation requirement |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-GOV-INV-001.json` | Canonical agent investigation-trigger requirement |
| created | `docs/product/requirements/graph/nodes/manifestation/function/MAN-function-docs-plans-active-requirements-system-output-rs-rollout-calibration-mode.json` | Manifestation for the calibration-mode output artifact |
| created | `docs/product/requirements/graph/nodes/manifestation/function/MAN-function-docs-product-requirements-graph-*.json` | Manifestations for touched graph artifacts required by completion gate |
| created | `docs/product/requirements/graph/trace-links/TRC-REQ-GOV-*.json` | Trace links from new requirements to their artifacts |
| created | `docs/product/requirements/graph/trace-links/TRC-REQ-GOV-TRACE-001-*.json` | Self-governance trace links for graph records and generated views |
| edited | `docs/product/requirements/graph/ledger/decision-ledger.jsonl` | Added `LDG-2026-06-29-RS-CALIBRATION-MODE` |
| regenerated | `docs/product/requirements/graph/generated/query-index.json` | Refreshed graph query view |
| regenerated | `docs/product/requirements/graph/generated/graph-summary.json` | Refreshed graph summary |
| regenerated | `docs/product/requirements/graph/views/requirements-summary.md` | Refreshed human-readable requirements view |
| regenerated | `docs/product/requirements/graph/nodes/**/README.md`, `docs/product/requirements/graph/nodes/**/index.csv` | Refreshed folder indexes |

### Findings

| Question | Finding |
|---|---|
| Was the calibration-mode decision already canonical in graph requirements? | Partially. Strict trace/agent/data governance existed, but calibration-mode operation, no automatic `src/**` authorization, and investigation triggers were only in plan/output docs. |
| Was a new feature/product requirement needed? | No. This is a governance refinement of the requirements system itself. |
| Were ambiguous mappings applied? | No. The update records operating rules only; it does not confirm RS-R7 product-code mappings. |

### Checks

| Check | Result |
|---|---|
| Churn - work reversed | None |
| Preserve-semantic (§9) | No product source behavior changed; graph/data docs only |
| Open decisions used (temporary default) | None |
| No `src/` change | `find src -newer docs/product/requirements/graph/nodes/requirement/REQ-GOV-CAL-001.json -type f` returned empty |
| Query check | `req:query -- --by-id` resolved all three new requirement IDs and their trace links |

### Gates

| Gate | Result |
|---|---|
| `npm run req:folder-index` | PASS; 716 nodes indexed |
| `npm run req:generate-views` | PASS |
| `npm run req:validate` | PASS, with existing `QST-VR-011` maturation warning |
| `npm run req:completion-gate -- --changed <graph scope>` | PASS for the originally updated 11 graph/view files |
| `bash scripts/verify.sh` | PASS |
| browser manual check | N/A |

### PO action required

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | PO calibration-mode ruling is now represented in canonical graph requirements | — |

### Open issues / follow-ups

- `QST-VR-011` remains an existing graph maturation warning.
- The broad graph still carries known RS-R7 calibration debt; this update only makes the operating rules canonical and traceable.
