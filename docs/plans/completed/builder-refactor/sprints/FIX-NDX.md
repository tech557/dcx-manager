# Sprint FIX-NDX — Nested Node Traversal Helpers

**Status:** ✅ Completed — 2026-06-25 by Codex  
**Priority:** PREREQUISITE — must run before FIX-CRD, FIX-FIL, FIX-MOT, FIX-CAP, FIX-POL; run before any sprint that searches for Actions or Tasks.
**Audit finding:** B5, B6, B7, B8, B9, B11 all failed because `nodes.find/filter` treats the builder node list as flat. Runtime `nodes` contains only **PhaseNodes**. Actions live at `node.data.actionCards`; Tasks live at `action.tasks`. Code that calls `nodes.find(n => n.kind === 'task')` returns nothing.

---

## FIX-NDX.1 — Add traversal helpers to node.helpers.ts

### Objective
Add typed traversal helpers so every sprint that needs to find Actions or Tasks has a single, correct path. This file already exists; only add to it — do not change existing exports.

### File to change
`src/utils/node.helpers.ts`

### Helpers to add

```typescript
import type { BuilderNode, PhaseNode, ActionCardData, TaskCardData } from '@/types/builder-node.types';

/** Return all ActionCardData entries across all PhaseNodes. */
export function getAllActions(nodes: BuilderNode[]): ActionCardData[] {
  return nodes
    .filter((n): n is PhaseNode => n.kind === 'phase')
    .flatMap(n => n.data.actionCards);
}

/** Return all TaskCardData entries across all PhaseNodes → ActionCards. */
export function getAllTasks(nodes: BuilderNode[]): TaskCardData[] {
  return getAllActions(nodes).flatMap(a => a.tasks);
}

/** Find a single ActionCardData by id across all PhaseNodes. */
export function findAction(nodes: BuilderNode[], id: string): ActionCardData | undefined {
  return getAllActions(nodes).find(a => a.id === id);
}

/** Find a single TaskCardData by id across all PhaseNodes → ActionCards. */
export function findTask(nodes: BuilderNode[], id: string): TaskCardData | undefined {
  return getAllTasks(nodes).find(t => t.id === id);
}

/**
 * Find the kind ('phase' | 'action' | 'task') for any node id.
 * Searches phases first, then actions, then tasks.
 */
export function resolveNodeKind(
  nodes: BuilderNode[],
  id: string
): 'phase' | 'action' | 'task' | undefined {
  if (nodes.some(n => n.id === id)) return 'phase';
  if (findAction(nodes, id)) return 'action';
  if (findTask(nodes, id)) return 'task';
  return undefined;
}

/**
 * Find the PhaseNode that contains a given Action or Task id.
 */
export function findParentPhase(nodes: BuilderNode[], childId: string): PhaseNode | undefined {
  return nodes
    .filter((n): n is PhaseNode => n.kind === 'phase')
    .find(phase =>
      phase.data.actionCards.some(
        a => a.id === childId || a.tasks.some(t => t.id === childId)
      )
    );
}
```

### Acceptance criteria
```
☑ All six helpers are exported from src/utils/node.helpers.ts
☑ No existing exports changed or removed
☑ npm run typecheck passes with zero new errors
☑ getAllTasks(nodes) returns non-empty array when phases have nested tasks in a unit test
```

### Agent Execution Notes
After adding helpers, verify with a one-line test: import `getAllTasks` in the existing test suite and assert it returns tasks from nested mock data.

### Progress log
`docs/progress/sessions/[date]-[agent]/FIX-NDX-traversal-helpers.md`
