# Component Source Policy

Date: 2026-06-28
Plan: `folder-structure-v2`
Sprint: `P5-frontend-readiness`

## Purpose

This policy defines how agents choose between DCX custom components and library/MCP-sourced
components. The goal is to make UI polish and future library swaps predictable: feature code keeps a
stable public contract, while implementation details can change behind a documented adapter seam.

## Current State

- shadcn is configured through `components.json`.
- shadcn style: `radix-nova`.
- shadcn options: `tsx: true`, `cssVariables: true`, `baseColor: neutral`, icon library `lucide`.
- shadcn raw component alias: `@/ui/shadcn`.
- shadcn landing folder: `src/ui/shadcn/`.
- Current raw shadcn contents: `src/ui/shadcn/button.tsx`.
- Storybook is installed in `.storybook/`.
- Feature imports of `@/ui/shadcn/*` outside `src/ui/`: 0.

## Source Decision Matrix

| Component need | Source | Why | Where it lives |
|---|---|---|---|
| Brand-owned visual atom: `Badge`, `Chip`, `Input`, `ToggleGroup` | Custom | Carries DCX token language, glass/surface treatment, and compact builder-specific density. | `src/ui/atoms/` |
| Brand-owned surface: `GlassSurface`, popover/shell surfaces, builder background | Custom | The visual system is a DCX differentiator and already maps to `--theme-*` tokens. | `src/ui/surfaces/`, `src/ui/`, `src/ui/BuilderBg/` |
| Compound form controls: specs/list/date/select wrappers | Custom wrapper over shared primitive | These contain builder/domain behavior, not only generic visual behavior. | `src/ui/forms/` or feature-owned folders |
| Generic primitive with heavy accessibility or focus behavior: `Dialog`, `Popover`, `Combobox`, `Command`, `Tooltip` | shadcn raw primitive behind a DCX adapter | Focus management, keyboard behavior, and aria state are expensive to own. The adapter applies DCX tokens and keeps consumers stable. | Raw: `src/ui/shadcn/`; adapter: `src/ui/<role>/` |
| Domain control: completion state, version actions, readiness flows | Custom wrapper over a shared primitive | Domain state and wording are product behavior, so consumers should not bind to raw library APIs. | Feature folder or `src/ui/forms/` if shared |
| One-off feature view or layout | Custom, feature-local | Feature-specific structure should stay close to the owning workflow. | `src/builder/**` or owning feature folder |

## Adapter Boundary Rules

1. Feature code must not import raw shadcn components directly from `@/ui/shadcn/*`.
2. Raw shadcn primitives land only in `src/ui/shadcn/`.
3. A DCX adapter wraps each raw primitive before feature use. The adapter lives in the relevant
   `src/ui/<role>/` folder and applies DCX tokens, density, naming, and public props.
4. The adapter file is the swap seam. Switching custom to shadcn, or shadcn back to custom, changes
   only the adapter implementation. Consumers keep importing the adapter and keep the same public
   props.
5. Custom remains the default for brand atoms and brand surfaces.
6. Use shadcn behind an adapter when the primitive's accessibility or interaction cost justifies it.
7. Do not add a new base primitive when an existing DCX atom/form/surface already covers the need.

## First shadcn Candidate List

| Candidate | Reason | Raw landing folder | Adapter location |
|---|---|---|---|
| `Dialog` | Modal focus trap, escape handling, and aria state should not be hand-rolled. | `src/ui/shadcn/` | `src/ui/surfaces/` or `src/ui/modals/` if created |
| `Popover` | Positioning, focus return, outside-click behavior, and keyboard support are recurring needs. | `src/ui/shadcn/` | `src/ui/surfaces/PopoverShell.tsx` or a future popover adapter |
| `Combobox` / `Command` | Searchable selection and keyboard navigation are interaction-heavy. | `src/ui/shadcn/` | `src/ui/forms/selects/` |
| `Tooltip` | Hover/focus timing and aria description behavior are cross-cutting. | `src/ui/shadcn/` | `src/ui/overlays/` if created, otherwise relevant `src/ui/<role>/` |

## Current Adapter Seam

Designated seam for P5: `src/ui/PopoverShell.tsx`.

Why this seam:
- It is a shared shell already in `src/ui/`.
- It has a small public prop contract: `children`, `className?`, and `width?`.
- Popover is a named shadcn candidate with meaningful accessibility and focus behavior.
- Future shadcn-backed replacement can preserve the public `PopoverShell` contract while changing
  internals only.

## Consumer Import Rule

Allowed:

```ts
import { PopoverShell } from '@/ui/PopoverShell';
import { Select } from '@/ui/forms/selects';
```

Not allowed in feature code:

```ts
import { Button } from '@/ui/shadcn/button';
```

Exception: files inside `src/ui/` may import `@/ui/shadcn/*` to implement adapters.

## Verification Commands

```bash
grep -rn "@/ui/shadcn" src --include="*.tsx" | grep -v "src/ui/"
```

Expected result: no feature-code matches.

```bash
find src/ui/shadcn -maxdepth 1 -type f -print | sort
```

Expected current baseline: `src/ui/shadcn/button.tsx`.
