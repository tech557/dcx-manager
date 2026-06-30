---
name: dcx-frontend-refactor
description: >
  Guide frontend modularization, component extraction, and architectural refactor
  work in DCX Manager. Use this skill whenever the user mentions refactoring a
  component, extracting a component, splitting a large file, modularizing the
  frontend, reorganizing src/, or improving component boundaries. Also trigger
  when an agent is about to create a new React component and should first check
  whether a reusable one already exists.
---

# DCX Frontend Refactor

This skill governs how frontend modularization and refactor work is conducted in
DCX Manager. The project has strict architectural contracts — violating them has
caused rework across 11+ sprints. Read this before touching any component.

## The core question before any extraction

Before creating a new component, answer all of these:

1. Does it already exist in `src/ui/`?
   → `bash scripts/agent/code-query.sh component <Name>`
2. Is there a shell that covers this purpose (`BuilderIslandShell`, `GlassSurface`, `CardShell`)?
3. Does a hook for this behavior exist in `src/hooks/`?
4. Does this type exist in `src/types/`?
   → If yes to any: import it, don't recreate it.

Only create a new component if it is:
- **Reused** in 2+ places (or clearly will be)
- **Stateful or behavioral** in a way distinct from its parent
- **A recognizable product concept** (card, island, badge, shell, popup)
- **Independently testable** and likely to have a story
- **Variant-driven** (same component, different props)
- **An architectural boundary** (separates layers)
- **A repeated structure** expected to evolve consistently

**Do not create a component just because something is a `<div>` or a render block.**

## Architectural rules that must not be violated

Read `docs/agent-rules/core.md §5` (Preserve-Semantic Boundaries) and `§8` (Folder
Placement) for the full contract. Key rules:

| Layer | Rule |
|---|---|
| `src/ui/` | Must not import from `src/builder/` |
| `src/types/` | Must not import from higher layers |
| `src/services/` | Must not import from `src/store/` or `src/queries/` |
| Cards/islands/stage | Mutations only via `useBuilderActions()` — never `setNodes` |
| Card templates | Readiness via `behavior.readiness` — never import `src/rules/` |
| Theme | Always via `useTheme()` — never read `themeMode` from `useAppStore` directly |
| Animations | Always via `src/ui/motion/effects.registry.ts` — never parallel systems |

Validate after every extraction:
```bash
npm run validate:architecture
```
Zero violations required.

## Design token governance

Every visual constant must live in `src/brand/tokens.ts`. Before using a color,
spacing, or radius value:
```bash
bash scripts/agent/code-query.sh hardcoded-tokens
```
If hardcoded values exist in the file you're touching, move them to tokens as part
of the sprint — but only the ones in scope. Don't refactor the whole project.

## File size rules (hard caps from core.md §6)

| Type | Hard cap |
|---|---|
| `.tsx` component | 250 lines |
| `use*.ts` hook | 200 lines |
| Action / service / rules | 250 lines |
| Registry / config | 400 lines |

Check sizes before and after:
```bash
wc -l <file>
```
A file over the cap must be split before the sprint is closed.

## Consumer migration before deletion

Before deleting or renaming any component:
```bash
bash scripts/agent/code-query.sh consumers <ComponentName>
```
All consumers must be migrated first. Deletion before migration is a sprint failure.

## Date, time, and form controls — check existing primitives first

Before creating any date/time input, range picker, or form primitive:
```bash
bash scripts/agent/code-query.sh raw-controls
```
This lists all existing form controls. A `DateInput`, `DateField`, `DualInput`, or
similar component may already exist. Check for near-name equivalents before concluding
nothing exists. Prefer extending an existing control over creating a new one.

## Typography and controls

If the refactor touches form controls, buttons, or typography:
- Check `src/ui/` for existing shared controls
- Check `src/brand/` for existing typography tokens
- Do not create a parallel button or input component — extend the existing one

## Output format

For a refactor sprint, produce:
1. List of files to change with current `wc -l` counts
2. Which components will be extracted and why (matching criteria above)
3. Consumer migration plan if anything is renamed/deleted
4. Verification plan (typecheck, lint, validate:architecture, affected tests)
5. What is explicitly OUT of scope for this sprint
