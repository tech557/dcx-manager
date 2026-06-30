# Tool Evaluation — Code Structure Inspection

_Generated: 2026-06-25 | Sprint: SA-R2_

---

## Evaluation Criteria

1. **Vite + `@/` alias compatibility** — Can the tool resolve TypeScript path aliases used by this project (`tsconfig.json` → `@/` → `src/`)?
2. **Rule enforcement** — Can it enforce import rules (e.g. "nothing in `src/ui/` may import from `src/builder/`")?
3. **AI-useful output** — Does it produce output (markdown, JSON) that an AI agent can read and act on, not just interactive visuals?
4. **Maintenance burden** — Last release date, repo health, dependency weight, configuration complexity.

---

## ts-morph (already installed)

| Criteria | Assessment |
|---|---|
| Vite + `@/` alias | ✅ Full support — reads `tsconfig.json` paths natively |
| Rule enforcement | ❌ Not built-in — requires custom script to traverse AST and check rules |
| AI-useful output | ✅ Custom script → any format. We already generate markdown + JSON |
| Maintenance burden | ✅ Already installed (v28.0.0). Active repo (1k+ stars, weekly releases). Zero new deps |
| **Verdict** | ✅ **Keep using.** Already proven (SA-R1). Best for deep ad-hoc analysis. Pair with a lighter tool for CI enforcement. |

---

## madge

| Criteria | Assessment |
|---|---|
| Vite + `@/` alias | ⚠️ Partial — needs `--ts-config tsconfig.json` flag. Resolves aliases if configured correctly. Can miss `@/` patterns in some setups |
| Rule enforcement | ❌ Detection only (circulars). Cannot enforce custom import rules |
| AI-useful output | ✅ JSON output with circular dependency list, tree visualization as text |
| Maintenance burden | ✅ Small install (`npm i -D madge`). Last release 2023. Minimal config. 9k+ stars |
| **Verdict** | 🟡 **Nice-to-have** for quick circular checks, but ts-morph already covers this with more depth. |

---

## dependency-cruiser

| Criteria | Assessment |
|---|---|
| Vite + `@/` alias | ✅ Supports `tsconfig.json` path resolution via `--ts-config` or `.dependency-cruiser.js` |
| Rule enforcement | ✅ **Best-in-class.** Define rules like `"forbidden": [{ "from": { "path": "^src/ui" }, "to": { "path": "^src/builder" } }]`. Runs in CI as a lint step |
| AI-useful output | ✅ Outputs JSON, markdown, HTML, dot graphs. `--output-type err` shows violations as text |
| Maintenance burden | ⚠️ Moderate — requires an init config file. Last release 2025, 6k+ stars. Active maintenance |
| **Verdict** | ✅ **Recommended.** Best fit for this project's needs: enforce the L1-L9 layer rule and prevent regressions. |

---

## skott

| Criteria | Assessment |
|---|---|
| Vite + `@/` alias | ⚠️ Partial — supports path mapping but may need manual alias config |
| Rule enforcement | ❌ Detection only (circulars, orphans). No custom rule engine |
| AI-useful output | ✅ JSON + mermaid graph output. Has a web UI optional |
| Maintenance burden | ✅ Small install (`npm i -D skott`). Last release 2025. 2k stars. Minimal config |
| **Verdict** | 🟡 **Alternative to madge** — similar feature set, slightly more modern. Not needed if we adopt dependency-cruiser. |

---

## source-map-explorer

| Criteria | Assessment |
|---|---|
| Vite + `@/` alias | ✅ Works on the built bundle, not source imports. No alias handling needed |
| Rule enforcement | ❌ Bundle size analysis only — cannot enforce import rules |
| AI-useful output | ⚠️ Primarily visual (treemap HTML). JSON output exists but is less useful |
| Maintenance burden | ✅ Small install. Last release 2023. 7k stars |
| **Verdict** | ❌ **Not recommended** for this project. Different use case (bundle size, not code structure). |

---

## Rollup plugin visualizer

| Criteria | Assessment |
|---|---|
| Vite + `@/` alias | ✅ Vite plugin — works natively with Vite's module resolution |
| Rule enforcement | ❌ Bundle visualization only |
| AI-useful output | ❌ Primarily interactive HTML treemap. JSON template exists but limited |
| Maintenance burden | ✅ Vite plugin, small install. Actively maintained |
| **Verdict** | ❌ **Not recommended.** Bundle insights are useful but out of scope for code structure auditing. |

---

## Recommendation

### Adopt: **dependency-cruiser**

**Rationale:**
- Only tool in this evaluation that can **enforce** import rules (e.g., block `src/ui/` from importing `src/builder/`)
- CI-integratable as a lint step — prevents structural regressions during development
- Works with Vite and `@/` aliases via tsconfig resolution
- Outputs machine-readable reports (JSON/markdown) usable by AI agents
- Active maintenance and good community

### Keep: **ts-morph** (already installed)

**Rationale:**
- Already proven (SA-R1) for deep ad-hoc analysis
- Custom scripts can answer any structural question
- No additional install cost
- Use for periodic deep audits; use dependency-cruiser for continuous enforcement

### Install command

```bash
npm i -D dependency-cruiser
npx depcruise --init  # creates .dependency-cruiser.js config
```

### First rule to add

```javascript
// .dependency-cruiser.js
forbidden: [
  {
    name: 'no-ui-import-builder',
    comment: 'src/ui/ (L1) must not import from src/builder/ (L4-L8)',
    from: { path: '^src/ui' },
    to: { path: '^src/builder' }
  },
  {
    name: 'no-components-import-builder',
    comment: 'src/components/ (L3) must not import from src/builder/ (L4-L8)',
    from: { path: '^src/components' },
    to: { path: '^src/builder' }
  }
]
```

---

_Note: No packages were installed during this evaluation. All assessments are based on documentation, past experience, and the current project setup._
