## Improve Task Editor input experience + drag-only editor open
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
Status: Completed
PO-Action: none
Version: v1.0.1.0
Change-Class: source

Intent: Make the Task Editor inputs read as intentional, grouped controls in the dark-glass builder language; fix the non-working editor Close button; and remove the long-press-to-open gesture so a task only opens in the editor by drag-and-drop into the editor island.
Trigger: User requests — "Improve Task Editor Input Experience"; then "remove the long press behavior that opens the task/editor card and lets only on draging and dropping the task into the editor island". Consolidated into one task per PO ("create one task and create one preview").

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| modified | src/ui/atoms/Input.tsx | Reusable field primitive: `hint` + `locked` props, exported `FIELD_LABEL_CLASS`/`FIELD_HINT_CLASS`, distinct hover/focus/filled/disabled states, glass surface | +57 −13 |
| modified | src/builder/islands/EditorViewerIsland/TaskEditor/TaskSection1.tsx | Draft message field uses grouped hint; removed heavy black bg override that made it a void | +2 −1 |
| modified | src/ui/forms/date/CommunicationDateField.tsx | Label/helper text use shared field styles; trigger hover/focus/disabled states aligned | +9 −6 |
| modified | src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx | Save = accent-filled primary, Discard = quiet secondary; Close wired to `closeEditor` | +5 −4 |
| modified | src/builder/islands/EditorViewerIsland/useEditorState.ts | New `closeEditor`: minimize session (clears `activeTaskId`, keeps draft) + unfocus in one update, fixing the focus-sync race that kept the panel open | +8 −0 |
| modified | src/builder/cards/templates/task/TaskCard.tsx | Removed `onLongPress` open-editor handlers (both card states) and unused `setFocusedNodeId`; editor now opens only via drag-drop into the island | +1 −3 |

### Behavior
| Area | Before | After |
|---|---|---|
| Message/date fields | Oversized black areas, weak labels, detached helper text | Glass fields with grouped label + control + hint; clear hover/focus/filled/disabled |
| Save / Discard | Both sky/border, weak hierarchy | Save accent-filled primary with glow; Discard secondary text |
| Close (X) button | No-op — focus-sync effect re-opened the panel | Collapses to the pill and stays closed; draft preserved |
| Open editor | Long-press OR drag-drop | Drag-drop into editor island only |

### Verification
| Gate | Result |
|---|---|
| npm run verify:frontend (typecheck, lint 0-warnings, verify.sh, validate:architecture) | PASS |
| npm run test | PASS — 92/92 |
| Browser (Playwright, real input) | Save persists + cleans dirty; Close collapses & stays closed; long-press no longer opens (700ms hold); drag-drop still opens (task id carried); 0 console errors |

Product rules preserved: no fields added/removed; date/draft/validation/save/discard logic unchanged; editor shell not redesigned. Pre-existing unrelated working-tree changes (src/services/api-client.ts, src/telemetry/capture-sink*) are from another session and are deliberately excluded from this commit.
