# Sprint FIX-CRD — CardShell Parallel States (Re-work)

**Status:** ✅ Completed — 2026-06-25 by Codex  
**Prerequisite:** FIX-NDX  
**Audit finding:** B-CRD audit result was FAIL. Four distinct defects found.

**Rollback boundary:** `CardShell.tsx`, `useCardDrag.ts`, `TaskCard.tsx`, `TaskReadOnlyPopup.tsx`, `useEditorPanel.ts`, `StageProvider.tsx`, `useCardEffects.ts`

---

## FIX-CRD.1 — Rebuild TaskReadOnlyPopup to ≤100 lines, anchored

### Audit finding
`TaskReadOnlyPopup.tsx` is **243 lines** (hard cap is 250, sprint requirement was ≤100). The popup is a centered full-screen modal. The confirmed decision BLD-CRD-INT-004 / OD-004 requires an **anchored responsive popup** (280–360px, preferred 320px) that flips near screen edges and does not cover the stage.

### Files to change
- `src/builder/cards/templates/task/TaskReadOnlyPopup.tsx` — rebuild, ≤100 lines

### Required behaviour
- Render as `position: absolute` relative to the TaskCard container (or `position: fixed` using card bounding rect via `getBoundingClientRect`).
- Width: `clamp(280px, 320px, 360px)`. Height: content-driven, no fixed height.
- Content (unchanged): name, ChannelPill, sender/receiver, date, readiness badge, subtask count, close button.
- Close on outside `mousedown` via `useEffect` document listener.
- **Do NOT** render as a centered modal. **Do NOT** add a backdrop overlay.
- If content would overflow viewport right: flip to appear on the left of the card.
- **Do NOT** import from `src/rules/` — readiness comes from `behavior.readiness` passed as prop.

### Acceptance criteria
```
☑ TaskReadOnlyPopup.tsx ≤ 100 lines (wc -l confirmed)
☑ Popup anchors beside the Task card, not centered on screen
☑ No backdrop or modal overlay
☑ Width stays within 280–360px at all viewport sizes
☑ Clicking outside closes popup
☑ No import from src/rules/ in TaskReadOnlyPopup.tsx
☑ npm run typecheck passes
```

---

## FIX-CRD.2 — Wire long press to real editor session open

### Audit finding
`CardShell` passes `onLongPress={() => console.log('open editor', id)}` — a stub. This prevents B5 (editor multi-session) from being reachable. The stub was documented as intentional in B-CRD ("will be wired in B5") but B5 cannot be verified without the wire.

### Files to change
- `src/builder/cards/templates/task/TaskCard.tsx` — replace stub with real call
- `src/builder/islands/EditorViewerIsland/useEditorPanel.ts` — expose `openSession(id)` (may already exist)

### Required behaviour
`TaskCard` passes `onLongPress={() => openEditorSession(task.id)}` where `openEditorSession` calls the real `useEditorPanel` hook's session-open function.

Do NOT use `console.log` as the long-press handler.

### Acceptance criteria
```
☑ Long press on a Task card opens the EditorViewerIsland with that task loaded
☑ console.log('open editor', ...) does not appear anywhere in TaskCard.tsx
☑ npm run typecheck passes
```

---

## FIX-CRD.3 — Fix newly-edited highlight duration to 2000ms (OD-009)

### Audit finding
`StageProvider` clears `recentlyEditedIds` after **1000ms**. Confirmed decision OD-009 / BLD-CRD-INT-006 requires **2 seconds** (2000ms). The highlight must also be a **static border/glow** — not pulsing (`animate-pulse` is forbidden for this state).

### Files to change
- `src/builder/stage/StageProvider.tsx` — change clearTimeout from 1000 → 2000
- `src/builder/cards/useCardEffects.ts` — confirm no `animate-pulse` on `isJustEdited`; use a static glow class

### Acceptance criteria
```
☑ recentlyEditedIds cleared after 2000ms (not 1000ms)
☑ isJustEdited visual is a static border/glow, no CSS animation or pulse
☑ npm run typecheck passes
```

---

## FIX-CRD.4 — Remove receiving-child animate-pulse

### Audit finding
`useCardEffects` applies `animate-pulse` to the receiving-child state. The approved contract (BLD-CRD-003) requires a **distinct restrained state** — not pulsing. `animate-pulse` conflicts with OD-009 which also says no pulsing for edit feedback.

### Files to change
- `src/builder/cards/useCardEffects.ts` — replace `animate-pulse` with a static ring or scale effect for `isReceivingChild`

### Acceptance criteria
```
☑ isReceivingChild does not use animate-pulse
☑ Receiving-child state visually distinct from isDragOver and isJustEdited
☑ npm run typecheck passes
```

---

## FIX-CRD.5 — Remove direct rules/ import from card template

### Audit finding
A card template imports readiness logic directly from `src/rules/`. This violates the readiness boundary (§9.2 of AGENTS.md): card templates must receive readiness via `behavior.readiness`, not import from rules/.

### Files to change
Identify the specific card template file via grep: `grep -r "from.*rules/" src/builder/cards/templates/`

Remove the direct import; receive readiness through `useCardBehavior()` instead.

### Acceptance criteria
```
☑ grep -r "from.*rules/" src/builder/cards/templates/ returns zero results
☑ npm run typecheck passes
☑ bash scripts/verify.sh passes
```

### Progress log
`docs/progress/sessions/[date]-[agent]/FIX-CRD-cardshell-rework.md`
