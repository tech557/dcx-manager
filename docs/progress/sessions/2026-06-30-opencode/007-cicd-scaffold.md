## CICD-SCAFFOLD — GitHub Actions CI workflow
Agent: opencode
Model: deepseek-v4-flash-free
Provider: opencode
Date: 2026-06-30
Type: process-governance
Status: Completed
PO-Action: none

Intent: Scaffold .github/workflows/ with two workflow files that run the project's existing npm gates on push and PR — no new scripts invented.
Trigger: PO-approved sweep — session 2026-06-30 Task F

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | .github/workflows/ci.yml | Main CI: requirements + frontend gates + build | 56 |
| created | .github/workflows/req-validate-on-graph-change.yml | Fast guard: runs req:validate only when graph files change | 22 |

### Gates wired
| Gate | npm script | Job |
|---|---|---|
| Requirements graph | req:validate | requirements |
| TypeScript | typecheck | frontend |
| Lint | lint | frontend |
| Verify patterns | bash scripts/verify.sh | frontend |
| Architecture | validate:architecture | frontend |
| Unit tests | test | frontend |
| Build | build | build (needs: frontend + requirements) |

### Verification
| Check | Result |
|---|---|
| PRE-FIX ls .github/ | No such file or directory |
| YAML sanity (node check) | ci.yml OK / req-validate-on-graph-change.yml OK |
| POST-FIX ls -lh .github/workflows/ | ci.yml 1.2K, req-validate-on-graph-change.yml 453B |
| wc -l ci.yml | 56 |
| wc -l req-validate-on-graph-change.yml | 22 |
| req:validate (final) | pass: true |
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no code changes |
