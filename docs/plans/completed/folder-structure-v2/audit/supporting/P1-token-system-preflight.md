# P1 — Token System — PREFLIGHT EVIDENCE ONLY (not an execution output)

Date: 2026-06-27 | Agent: Claude (Opus 4.8, Anthropic)

> ⚠️ **Status correction (2026-06-27 audits).** This file holds **Step 0/1 preflight evidence only**
> — no `src/` code was changed. It was **moved out of `output/` into `audit/supporting/`** so the
> plan's `output/` directory is empty at activation and executors do not mistake P1 for partially
> complete. The plan is **DRAFTED**, in `docs/plans/drafted/folder-structure-v2/`; it was **not**
> activated and **not** moved to `active/` (the earlier note claiming activation was inaccurate and
> is retracted here). P1's real execution output (Steps 2–8) will be written to
> `output/P1-token-system.md` by the assigned executor after activation. The typography-only scope
> correction this preflight flagged is now baked into the revised P1 sprint file.

---

## Session Environment

`version_context` = `v0.3.4` — **matches** `docs/VERSION.md` `current` = `v0.3.4`. ✓

### `bash scripts/agent/build-current-state.sh`

```json
{
  "repository_version": "v0.3.4",
  "package_version": "0.2.0",
  "metadata_version": "v0.3.3",
  "active_plans": [],
  "open_questions_count": 0,
  "mcp_operational": ["eslint"],
  "mcp_awaiting_external_setup": ["storybook", "shadcn", "semgrep", "sonarqube"],
  "code_index_stale": true,
  "code_index_age_minutes": 116,
  "git_branch": "unknown",
  "uncommitted_changes": 0,
  "documentation_contradictions": [
    "docs/VERSION.md=v0.3.4 vs metadata.json=v0.3.3"
  ]
}
```

### `bash scripts/agent/verify-tooling-state.sh`

```json
{
  "npm_script_typecheck": "available",
  "npm_script_lint": "available",
  "npm_script_test": "available",
  "npm_script_build": "available",
  "npm_script_validate_architecture": "available",
  "npm_script_test_e2e": "available",
  "verify_sh": "pass — verify passed",
  "dependency_cruiser": "available",
  "semgrep_cli": "not_installed (brew install semgrep)",
  "code_index": "stale (age 116m — regenerate: npm run generate:code-index)",
  "mcp_active": ["eslint"],
  "mcp_awaiting_setup": ["storybook", "shadcn", "semgrep", "sonarqube"]
}
```

**Operational MCPs:** `eslint` only.
**Playwright test runner (for Step 8 browser gate):** `npm run test:e2e` script is
present/available; the executable browser gate is deferred to the code-writing run
(not part of this Step 0–1 audit).

**Notes for the executor:**
- `metadata_version` (`v0.3.3`) lags `docs/VERSION.md` (`v0.3.4`). This is a pre-existing
  documentation contradiction flagged by the state script — not introduced here, not a
  P1 blocker. The authoritative version per §26 is `docs/VERSION.md` = `v0.3.4`.
- `code_index` is stale (116 min). Regenerate with `npm run generate:code-index` before
  the Step 2+ code-writing run.

---

## Step 1 — Audit of current `@theme` block and token var names

Commands run (read-only):

```bash
grep -n "@theme" src/brand/index.css
grep -n "--text-"   src/brand/index.css
grep -n "--font-"   src/brand/index.css
grep -n "--radius-" src/brand/index.css
grep -n "--shadow-" src/brand/index.css
# plus full src/ arbitrary-usage enumeration (below)
```

### 1a. `@theme` blocks present

| Line | Block | Current contents |
|---|---|---|
| 168 | `@theme { … }` | only `--font-sans: "Gilroy";` |
| 752 | `@theme inline { … }` | shadcn-style inline mappings (`--font-heading`, `--font-sans`, `--radius-*`, color tokens) |

**No `--font-size-*`, `--font-weight-dcx-*`, or `--shadow-dcx-*` utilities are registered yet.**
The Step 2 typography registration will extend the `@theme` block at line 168.

### 1b. `--text-*` typography vars (defined in `:root`, lines 173–183)

Every var below is real and in use. **These are the 11 vars that get a utility registration in Step 2.**

| CSS var | Value | Proposed utility (Step 2) |
|---|---|---|
| `--text-4xs` | `0.4375rem` | `text-dcx-4xs` |
| `--text-3xs` | `0.5rem` | `text-dcx-3xs` |
| `--text-3xs-plus` | `0.53125rem` | `text-dcx-3xs-plus` |
| `--text-2xs` | `0.5625rem` | `text-dcx-2xs` |
| `--text-2xs-plus` | `0.59375rem` | `text-dcx-2xs-plus` |
| `--text-xs` | `0.625rem` | `text-dcx-xs` |
| `--text-xs-plus` | `0.65625rem` | `text-dcx-xs-plus` |
| `--text-sm` | `0.6875rem` | `text-dcx-sm` |
| `--text-md` | `0.75rem` | `text-dcx-md` |
| `--text-md-plus` | `0.8125rem` | `text-dcx-md-plus` |
| `--text-base` | `0.9375rem` | `text-dcx-base` |

> ⚠️ Note the `-plus` half-step variants (`3xs-plus`, `2xs-plus`, `xs-plus`, `md-plus`).
> The sprint's Step 2/Step 3 example blocks **omit these four**. The executor must register
> and migrate all 11, not the 7 in the example.

### 1c. `--font-*` vars — **only `--font-sans` / `--font-heading`**

```
168: @theme { --font-sans: "Gilroy"; }
753: --font-heading: var(--font-sans);   (inside @theme inline)
754: --font-sans: 'Geist Variable', sans-serif;
```

**There are NO `--font-weight-*` / `--font-light` / `--font-medium` / `--font-bold` CSS vars.**
Per-Step-2 rule ("do not add vars that don't exist") → **no `font-dcx-*` weight utilities to register.**
Font weights in the codebase use Tailwind-native `font-medium`/`font-semibold`/etc., not CSS vars.

### 1d. `--radius-*` vars (defined lines 786–792, inside `@theme inline`)

`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-3xl`, `--radius-4xl`.
These are already Tailwind-native radius tokens (consumed as `rounded-sm`/`rounded-lg`/etc.).

### 1e. `--shadow-*` vars

**None defined** anywhere in `src/**/*.css`. → no `shadow-dcx-*` utilities to register.

---

## Step 1 — Arbitrary-usage reality check (drives Steps 2–3 scope)

Full `src/` enumeration of arbitrary `*-[var(--…)]` patterns:

| Arbitrary pattern family | Occurrences in `src/` |
|---|---|
| `text-[var(--text-*)]` | **275** |
| `font-[var(--font-*)]` | **0** |
| `shadow-[var(--shadow-*)]` | **0** |
| `rounded-[var(--radius-*)]` | **0** |

**Conclusion: the only arbitrary-token debt that actually exists is typography (`text-[var(--text-*)]`).**
The font-weight, shadow, and radius migrations described in the sprint examples have **nothing to migrate**.

### Per-pattern baseline (the 275 typography usages) — Step 3 before-counts

| Pattern | Before count | Target after |
|---|---|---|
| `text-[var(--text-xs)]` | 94 | 0 |
| `text-[var(--text-2xs)]` | 63 | 0 |
| `text-[var(--text-sm)]` | 37 | 0 |
| `text-[var(--text-3xs)]` | 27 | 0 |
| `text-[var(--text-3xs-plus)]` | 13 | 0 |
| `text-[var(--text-md-plus)]` | 9 | 0 |
| `text-[var(--text-xs-plus)]` | 7 | 0 |
| `text-[var(--text-md)]` | 7 | 0 |
| `text-[var(--text-2xs-plus)]` | 7 | 0 |
| `text-[var(--text-base)]` | 6 | 0 |
| `text-[var(--text-4xs)]` | 5 | 0 |
| **Total** | **275** | **0** |

> The plan README estimated "274+"; the measured count is **275**. Use 275 as the P1 baseline.

---

## Findings for the PO (before activation)

1. **Sprint scope correction — Steps 2/3 are typography-only.** `font-dcx-*`, `shadow-dcx-*`,
   and `rounded-dcx-*` registrations/migrations in the sprint examples have **zero** matching
   usages and zero source vars. The executor should register/migrate the **11 `--text-*`**
   utilities and skip the (non-existent) weight/shadow/radius arbitrary migrations.
2. **Four half-step variants must not be dropped.** `3xs-plus`, `2xs-plus`, `xs-plus`, `md-plus`
   are real and used (36 occurrences combined). The sprint's example replacement lists omit them.
3. **Step 4/5/6/7 inputs not yet re-verified** against UX2-R1/UX2-R2 in this run — they belong to
   the code-writing run. This audit covers Steps 0–1 only.

---

## Steps 2–8 — NOT STARTED (left for executor)

| Step | Status |
|---|---|
| 2 — Register `@theme` utilities | not started (audit complete — 11 `--text-*` vars enumerated above) |
| 3 — Migrate 275 typography usages | not started (per-pattern baseline captured above) |
| 4 — Add 6 missing surface tokens | not started |
| 5 — Replace 26 raw hex | not started |
| 6 — Delete 3 dead CSS classes | not started |
| 7 — Remove 3 dead token exports | not started |
| 8 — Full gate + browser evidence | not started |

## Gate results

Not run — Steps 0–1 change no code, so the §11 / sprint gates do not apply to this audit run.
Gates are required at the end of the Step 2+ code-writing run.
