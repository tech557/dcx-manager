# Dependency Graph

_Generated: 2026-06-25 | Tool: ts-morph via scripts/gen-dep-graph.ts_

## Folder-to-Folder Import Matrix

Rows = source folder, Columns = target folder. Count = `import` statements.

| From ↓ / To → | actions | brand | builder | components | hooks | mock | pages | queries | rules | services | store | telemetry | types | ui | utils | external |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| actions | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 5 | 0 | 9 | 0 | 6 | 0 |
| brand | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| builder | 25 | 1 | 0 | 28 | 12 | 0 | 0 | 15 | 10 | 3 | 9 | 2 | 112 | 18 | 16 | 0 |
| components | 0 | 0 | 1 | 0 | 3 | 0 | 0 | 4 | 1 | 1 | 0 | 0 | 12 | 3 | 2 | 0 |
| hooks | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 2 | 3 | 2 | 0 | 1 | 0 | 3 | 0 |
| mock | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 |
| pages | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| queries | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 1 | 0 | 1 | 0 |
| rules | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 7 | 0 | 2 | 0 |
| services | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 1 | 0 | 0 | 0 | 10 | 0 | 2 | 0 |
| store | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |
| telemetry | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| types | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ui | 0 | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| utils | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 6 | 0 | 0 | 0 |

## Upward Import Violations

These files import from a higher L-level (lower §8 folder placement level).

| File | From | To | Import | Line |
|---|---|---|---|---|
| `src/components/auth/RouteGuard.tsx` | components | services | `@/services/access.service` | 4 |
| `src/ui/BuilderBg/LightRays.tsx` | ui | builder/stage | `@/builder/stage/StageProvider` | 2 |
| `src/components/forms/channel/CompositionLibraryModal.tsx` | components | builder/cards | `@/builder/cards/templates/task/task-properties/channel.icons` | 2 |
| `src/components/forms/channel/InlineChannelCompositionSelector.tsx` | components | builder/cards | `@/builder/cards/templates/task/task-properties/channel.icons` | 3 |
| `src/components/modals/readiness-check-modal/ReadinessCheckModal.tsx` | components | rules | `@/rules/readiness.rules` | 7 |

## Circular Dependencies

| Folder A | Folder B |
|---|---|
| builder | components |

## Analysis

### Does `src/components/` import from `src/builder/`?

⚠️ **Yes** — 2 import(s) found. This means `src/components/` is not truly independent of the builder. Files in `src/components/forms/` are likely builder-specific.

- `src/components/forms/channel/CompositionLibraryModal.tsx` → `@/builder/cards/templates/task/task-properties/channel.icons` (line 2)
- `src/components/forms/channel/InlineChannelCompositionSelector.tsx` → `@/builder/cards/templates/task/task-properties/channel.icons` (line 3)

### Does `src/ui/` import from `src/builder/`?

⚠️ **Yes** — 1 import(s) found. This means `src/ui/` is not truly primitive.

- `src/ui/BuilderBg/LightRays.tsx` → `@/builder/stage/StageProvider` (line 2)

### Which files in `src/components/` are imported outside the builder?

3 file(s) in `src/components/` are imported from outside `src/builder/`:

- `src/components/forms/selects/index.ts`
- `src/components/feedback/ReadyMark.tsx`
- `src/components/feedback/AlertMark.tsx`

---
_258 source files analyzed._
