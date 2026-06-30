## BUG-KAN — Kanban Phase Count and Centering
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Code complete — awaiting external verification

Intent: Fix Kanban phase centering using actual rendered width instead of hardcoded phase count.
Trigger: Claude audit — screenshot evidence of left-aligned phases
Prerequisite: BUG-OVF (completed by Claude) — timeline overflow fix

Files created: none
Files edited:
  src/builder/stage/views/KanbanView.tsx — width-aware centering via ResizeObserver + computed board width (146 lines, was 120)

Churn — work reversed: None

Preserve-semantic check:
  - Action boundary: PASS — no mutations, no useBuilderActions calls
  - Readiness boundary: PASS — not touched
  - Theme boundary: PASS — not touched
  - Mapper boundary: PASS — not touched
  - No global side-channels: PASS — ResizeObserver is a standard browser API
  - StageProvider: PASS — no changes
  - BuilderPage: PASS — no changes

Open decisions used: none

### BUG-KAN.1 — Fix phase centering logic

Changed `phaseNodes.length <= 3` (hardcoded count) to `shouldCenter` (width comparison):

```typescript
const containerRef = useRef<HTMLDivElement>(null);
const [containerWidth, setContainerWidth] = useState(0);

useEffect(() => {
  const el = containerRef.current;
  if (!el) return;
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) setContainerWidth(entry.contentRect.width);
  });
  observer.observe(el);
  setContainerWidth(el.clientWidth);
  return () => observer.disconnect();
}, []);

const totalBoardWidth = phaseNodes.reduce((sum, p) => {
  return sum + (expandedNodeIds.includes(p.id) ? 360 : 72);
}, 0) + (phaseNodes.length - 1) * 24; // gap-6 = 24px

const shouldCenter = phaseNodes.length > 0 && totalBoardWidth < containerWidth;
```

Replaced `phaseNodes.length <= 3` with `shouldCenter` in the className builder.

Acceptance criteria:
  □ 3 expanded phases (1128px total) are horizontally centered when no editor is open — PASS (code: totalBoardWidth=1128 < containerWidth when stage ≥1200 → justify-center)
  □ 4+ phases use justify-start — PASS (code: totalBoardWidth > containerWidth → justify-start)
  □ Collapsed phases (4 × 72px + gaps = 360px) are centered — PASS (code: 360 < containerWidth → justify-center)
  □ No layout change to StageProvider or BuilderPage — PASS
  □ npm run typecheck passes — PASS
  □ Browser check: 3 expanded phases sit in the middle of the stage canvas — BLOCKED: no browser access

### BUG-KAN.2 — Verify all phases reachable

Code inspection confirms:
  - Outer scroll container: `overflow-x-auto` (line 78) — phases overflow causes scrollbar ✓
  - Kanban board: `shrink-0` (line 107) — doesn't compress below natural width ✓
  - Phase columns: `shrink-0` (line 117) — individual columns don't compress ✓
  - No `max-w` constraint on board or columns — no clipping ✓

Acceptance criteria:
  □ All phase columns exist in DOM regardless of total width — PASS (no conditional rendering based on width)
  □ Scrolling reaches all phases — PASS (overflow-x-auto on scroll container)
  □ Scrollbar visible when content overflows — PASS (thin scrollbar via Tailwind)
  □ Browser check — BLOCKED: no browser access

### BUG-KAN.3 — Timeline view day columns

BUG-OVF already applied:
  - `WeeklyView.tsx` uses `justify-start` + scroll-to-anchor useEffect ✓
  - `DayGridCard.tsx` has `data-anchor-day` attribute ✓
  - No `max-w` constraint on day columns — no left-side clipping ✓

Acceptance criteria:
  □ Timeline shows all days from configured range — PASS (rendered from `days` array)
  □ Anchor day visible without scrolling on initial render — PASS (useEffect scrolls to anchor)
  □ No day columns missing from DOM — PASS (no conditional rendering)
  □ Browser check — BLOCKED: no browser access

Gates:
  typecheck: PASS (0 errors)
  vitest: PASS (27/27)
  verify.sh: PASS
  browser manual check: BLOCKED — no browser access; three browser-gate items remain unchecked above

Consumer updates required: none

Open issues / follow-ups:
  - Browser verification needed for centering, scroll reachability, and timeline columns
