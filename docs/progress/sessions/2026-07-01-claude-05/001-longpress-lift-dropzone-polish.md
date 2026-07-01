Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
PO-Action: none
Version: v1.0.2.0
Change-Class: source

# Long-press "lift" card state + dropzone appearance/animation polish

## Request
PO: add a new card state when long-pressed (Phase / Action / Task) — long-pressing anywhere
except on the card's children triggers a drag-and-drop state immediately so cards move faster
and smoother; and do a final polish on the dropzone appearance and animation to production standard.

## What changed

| File | Change |
|---|---|
| `src/builder/cards/cardDrag.helpers.ts` | Added `isDragExcludedTarget()` — leaf-control guard (input/textarea/select/button/a/[role=button]/contenteditable/[data-no-drag]). |
| `src/builder/cards/useCardDrag.ts` | Long-press now arms a **lift**: hold ≥400ms (TA-001, unchanged) on the card body → `isLifted=true`. `pointerdown` `stopPropagation()` so only the innermost card arms ("except children"); interactive controls excluded via the guard. Lift clears on pointer release without a drag, and on drop/dragend. Quick native drag still works and skips the lift. Exposes `isLifted`. |
| `src/builder/cards/useCardEffects.ts` | New top-priority `isLifted` branch → reuses the registry `dragFeedback` effect (scale/elevation) + an elevated surface (accent ring, deep shadow). |
| `src/builder/cards/CardShell.tsx` | Threads `isLifted`; adds `data-lifted`, `cursor-grabbing`, raised z-index while lifted. |
| `src/builder/stage/views/PhaseDropZone.tsx` | Polished over-state: rounded glass panel, 1.5px dashed accent border, soft top-down accent wash, badged icon, cleaner labels; reduced-motion gating on pulse/scale/transitions. |
| `src/builder/stage/views/ActionDropZone.tsx` | Unified accent-glass over-state, `CornerDownRight` icon + "Drop action here", reduced-motion gating. |
| `src/builder/stage/views/TaskDropZone.tsx` | Unified over-state for both small/full variants, `ArrowDownToLine` icon, removed noisy double-arrow copy, reduced-motion gating. |

## Design notes
- Preserve-semantic boundaries (core.md §5): lift reuses the existing named `dragFeedback` effect from
  `ui/motion/effects.registry.ts` — no parallel animation system. Native HTML5 DnD + dropzone
  activation logic untouched; only the card visual state and dropzone styling were added/polished.
- Reduced motion (§20): dropzones drop pulse/scale/transition under `prefers-reduced-motion`; the lift's
  `dragFeedback` uses its existing reduced variant via `EffectLayer`.

## Gates
| Gate | Result |
|---|---|
| `npm run typecheck` | PASS — 0 errors |
| `eslint` (7 changed files) | PASS — 0 warnings |
| `bash scripts/verify.sh` | `verify passed` |
| `npm run test` | PASS — 92/92 (incl. `useCardEffects.test.ts`) |
| File-size caps (§6) | PASS — `useCardDrag.ts` 200 (hook cap), all others under cap |

## Browser verification (Preview MCP, own server on :3000)
- Builder `/builder/v-1` loaded clean: 11 phases / 59 actions / 329 tasks, no console errors.
- Long-press lift: `data-lifted` transitions false→true after the 400ms hold and holds; the lifted
  Phase card renders visibly elevated (accent ring + shadow) vs siblings. (Preview screenshot shown to PO in-session.)
- Dropzone polish: simulated a phase drag → 12 dropzones activate; the over-state PhaseDropZone renders
  the polished rounded glass panel ("INSERT PHASE / DROP TO PLACE HERE", badged icon, accent glow).
  (Preview screenshot shown to PO in-session.)

## Notes / follow-ups
- Native HTML5 DnD remains desktop-only (touch DnD would need a pointer-based engine — out of scope).
- Fake-DragEvent simulation via preview_eval is flaky for measuring transient width; verification relied
  on polling + screenshots, which confirmed both features render correctly.
</content>
</invoke>
