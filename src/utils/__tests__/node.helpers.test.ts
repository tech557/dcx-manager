import { describe, expect, it } from 'vitest';
import type { BuilderNode } from '@/types/builder-node.types';
import {
  findAction,
  findParentPhase,
  findTask,
  getAllActions,
  getAllTasks,
  resolveNodeKind,
} from '../node.helpers';

const nestedNodes = [
  {
    id: 'phase-1',
    kind: 'phase',
    parentId: 'version-1',
    orderIndex: 0,
    data: {
      id: 'phase-1',
      versionId: 'version-1',
      label: 'Awareness',
      orderIndex: 0,
      actionCards: [
        {
          id: 'action-1',
          phaseId: 'phase-1',
          parentPhaseId: 'phase-1',
          name: 'Launch',
          orderIndex: 0,
          tasks: [
            {
              id: 'task-1',
              actionId: 'action-1',
              parentActionId: 'action-1',
              name: 'Email',
              orderIndex: 0,
            },
          ],
        },
      ],
    },
  },
] as unknown as BuilderNode[];

describe('nested node traversal helpers', () => {
  it('flattens nested actions and tasks', () => {
    expect(getAllActions(nestedNodes).map((action) => action.id)).toEqual(['action-1']);
    expect(getAllTasks(nestedNodes).map((task) => task.id)).toEqual(['task-1']);
  });

  it('finds nested records and resolves their kinds', () => {
    expect(findAction(nestedNodes, 'action-1')?.name).toBe('Launch');
    expect(findTask(nestedNodes, 'task-1')?.name).toBe('Email');
    expect(resolveNodeKind(nestedNodes, 'phase-1')).toBe('phase');
    expect(resolveNodeKind(nestedNodes, 'action-1')).toBe('action');
    expect(resolveNodeKind(nestedNodes, 'task-1')).toBe('task');
    expect(resolveNodeKind(nestedNodes, 'missing')).toBeUndefined();
  });

  it('finds the containing phase for actions and tasks', () => {
    expect(findParentPhase(nestedNodes, 'action-1')?.id).toBe('phase-1');
    expect(findParentPhase(nestedNodes, 'task-1')?.id).toBe('phase-1');
    expect(findParentPhase(nestedNodes, 'missing')).toBeUndefined();
  });
});
