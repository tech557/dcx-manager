import type { BuilderNode, PhaseNode, ActionNode, TaskNode } from '@/types/builder-node.types';
import type { Phase, Action, Task } from '@/types/domain';

// Clean an imported domain object by removing audit/lifecycle fields per RV-019
function stripAuditFromPhase(phase: Record<string, unknown>): Phase {
  const {
    createdAt: _createdAt,
    createdBy: _createdBy,
    lastUpdatedAt: _lastUpdatedAt,
    lastUpdatedBy: _lastUpdatedBy,
    inProgressAt: _inProgressAt,
    readyAt: _readyAt,
    approvedAt: _approvedAt,
    supersededAt: _supersededAt,
    ...rest
  } = phase;
  return rest as unknown as Phase;
}

function stripAuditFromAction(action: Record<string, unknown>): Action {
  const { updatedAt: _updatedAt, updatedBy: _updatedBy, createdAt: _createdAt, createdBy: _createdBy, ...rest } = action;
  return rest as unknown as Action;
}

function stripAuditFromTask(task: Record<string, unknown>): Task {
  const { updatedAt: _updatedAt, updatedBy: _updatedBy, createdAt: _createdAt, createdBy: _createdBy, ...rest } = task;
  return rest as unknown as Task;
}

export interface ImportDiffGroup {
  added: BuilderNode[];
  updated: { existingId: string; node: BuilderNode }[];
  missing: { existingId: string }[]; // present in existing but missing in import
  conflicts: { importedId: string; reason: string }[];
}

export function parseImportJson(json: unknown): BuilderNode[] {
  // Expect an array of phases with nested actions/tasks (same shape export uses)
  if (!Array.isArray(json)) {
    throw new Error('Import JSON must be an array of phases');
  }

  const nodes: BuilderNode[] = [];

  (json as Record<string, unknown>[]).forEach((phaseObj, pIndex) => {
    const phase = stripAuditFromPhase(phaseObj as Record<string, unknown>);
    const phaseId = phase.id;
    const phaseNode: PhaseNode = {
      id: phase.id,
      kind: 'phase',
      parentId: phase.versionId ?? null,
      orderIndex: phase.orderIndex ?? pIndex,
      data: {
        ...phase,
        actionCards: [],
      },
    } as PhaseNode;

    nodes.push(phaseNode);

    const actions = (phaseObj as Record<string, unknown>).actions as Record<string, unknown>[] | undefined;
    (actions || []).forEach((actionObj, aIndex) => {
      const action = stripAuditFromAction(actionObj);
      const actionNode: ActionNode = {
        id: action.id,
        kind: 'action',
        parentId: phaseId,
        orderIndex: action.orderIndex ?? aIndex,
        data: {
          ...action,
          parentPhaseId: phaseId,
          tasks: [],
        },
      } as ActionNode;

      nodes.push(actionNode);

      const tasks = (actionObj as Record<string, unknown>).tasks as Record<string, unknown>[] | undefined;
      (tasks || []).forEach((taskObj, tIndex) => {
        const task = stripAuditFromTask(taskObj);
        const taskNode: TaskNode = {
          id: task.id,
          kind: 'task',
          parentId: action.id,
          orderIndex: task.orderIndex ?? tIndex,
          data: {
            ...task,
            parentActionId: action.id,
          },
        } as TaskNode;
        nodes.push(taskNode);
      });
    });
  });

  return nodes;
}

export function diffImportedNodes(existing: BuilderNode[], imported: BuilderNode[]): ImportDiffGroup {
  const existingById = new Map(existing.map((n) => [n.id, n]));
  const importedById = new Map(imported.map((n) => [n.id, n]));

  const added: BuilderNode[] = [];
  const updated: { existingId: string; node: BuilderNode }[] = [];
  const missing: { existingId: string }[] = [];
  const conflicts: { importedId: string; reason: string }[] = [];

  // Detect added or updated
  for (const imp of imported) {
    const existing = existingById.get(imp.id);
    if (!existing) {
      added.push(imp);
      continue;
    }

    // simple shallow compare on JSON string for now — could be improved
    try {
      const a = JSON.stringify(existing);
      const b = JSON.stringify(imp);
      if (a !== b) {
        updated.push({ existingId: existing.id, node: imp });
      }
    } catch {
      conflicts.push({ importedId: imp.id, reason: 'compare-error' });
    }
  }

  // Detect missing (present in existing but not in import)
  for (const ex of existing) {
    if (!importedById.has(ex.id)) {
      missing.push({ existingId: ex.id });
    }
  }

  return { added, updated, missing, conflicts };
}

export type ImportDecision = 'keep' | 'update' | 'add' | 'delete' | 'skip';

/**
 * Merge existing nodes and imported nodes according to per-node decisions.
 * - For updated nodes: if decision is 'update' replace existing node with imported node; if 'keep' leave existing as-is.
 * - For added nodes: if decision is 'add' include the imported node; if 'skip' do not add.
 * - For missing nodes: if decision is 'delete' remove the existing node (and its descendants); if 'keep' leave it.
 */
export function mergeImportedNodes(
  existing: BuilderNode[],
  imported: BuilderNode[],
  decisions: Record<string, ImportDecision>,
): BuilderNode[] {
  const existingById = new Map(existing.map((n) => [n.id, n]));
  // Start with a working map of existing nodes
  const finalById = new Map(existing.map((n) => [n.id, n]));

  // Apply updates
  for (const imp of imported) {
    const dec = decisions[imp.id];
    const exists = existingById.has(imp.id);
    if (exists) {
      // updated candidate
      if (dec === 'update' || dec === undefined) {
        finalById.set(imp.id, imp);
      } else if (dec === 'keep') {
        // leave existing
      }
    } else {
      // added candidate
      if (dec === 'add' || dec === undefined) {
        finalById.set(imp.id, imp);
      }
    }
  }

  // Handle deletes: decisions marked 'delete' for existing ids should remove that node and descendants
  const toDelete = new Set<string>();
  for (const ex of existing) {
    const dec = decisions[ex.id];
    if (dec === 'delete') {
      toDelete.add(ex.id);
    }
  }

  if (toDelete.size > 0) {
    // propagate to children
    const childrenMap = new Map<string, string[]>();
    for (const node of Array.from(finalById.values())) {
      if (node.parentId) {
        const arr = childrenMap.get(node.parentId) || [];
        arr.push(node.id);
        childrenMap.set(node.parentId, arr);
      }
    }

    const stack = Array.from(toDelete);
    while (stack.length) {
      const id = stack.pop()!;
      toDelete.add(id);
      const children = childrenMap.get(id) || [];
      for (const c of children) {
        if (!toDelete.has(c)) stack.push(c);
      }
    }

    for (const id of toDelete) finalById.delete(id);
  }

  return Array.from(finalById.values());
}
