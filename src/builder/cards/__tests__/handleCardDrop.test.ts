import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { builderActions } from '@/actions/builder.actions';
import type { BuilderNode, PhaseNodeData } from '@/types/builder-node.types';
import { handleCardDrop } from '../handleCardDrop';

const action1 = { id: 'action-1', phaseId: 'phase-1', parentPhaseId: 'phase-1', name: 'A1',
  orderIndex: 0, tasks: [{ id: 'task-1', actionId: 'action-1', parentActionId: 'action-1', orderIndex: 0 }] };
const action2 = { id: 'action-2', phaseId: 'phase-2', parentPhaseId: 'phase-2', name: 'A2',
  orderIndex: 0, tasks: [] };
const phase1 = { id: 'phase-1', versionId: 'v-1', label: 'P1', orderIndex: 0, actionCards: [action1] };
const phase2 = { id: 'phase-2', versionId: 'v-1', label: 'P2', orderIndex: 1, actionCards: [action2] };
const nodes = [
  { id: 'phase-1', kind: 'phase', parentId: 'v-1', orderIndex: 0, data: phase1 },
  { id: 'phase-2', kind: 'phase', parentId: 'v-1', orderIndex: 1, data: phase2 },
] as unknown as BuilderNode[];

const actions = {
  createPhase: vi.fn(),
  createAction: vi.fn(),
  createTask: vi.fn(),
  movePhases: vi.fn(),
  moveActions: vi.fn(),
  moveTasks: vi.fn(),
} as unknown as typeof builderActions;

function dragEvent(payload: object) {
  return {
    dataTransfer: { getData: () => JSON.stringify(payload) },
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as React.DragEvent<HTMLDivElement>;
}

describe('handleCardDrop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reorders phases', () => {
    handleCardDrop({
      event: dragEvent({ id: 'phase-2', kind: 'phase' }),
      nodes,
      kind: 'phase',
      data: phase1 as unknown as PhaseNodeData,
      actions,
      locked: false,
      hoverDirection: 'left',
    });
    expect(actions.movePhases).toHaveBeenCalledWith({ ids: ['phase-2'], toIndex: 0 });
  });

  it('moves actions between phases', () => {
    handleCardDrop({
      event: dragEvent({ id: 'action-1', kind: 'action' }),
      nodes,
      kind: 'phase',
      data: phase2 as unknown as PhaseNodeData,
      actions,
      locked: false,
    });
    expect(actions.moveActions).toHaveBeenCalledWith({
      actionIds: ['action-1'],
      toPhaseId: 'phase-2',
      toIndex: 1,
    });
  });

  it('moves tasks between actions', () => {
    handleCardDrop({
      event: dragEvent({ id: 'task-1', kind: 'task' }),
      nodes,
      kind: 'action',
      data: action2 as never,
      actions,
      locked: false,
    });
    expect(actions.moveTasks).toHaveBeenCalledWith({
      taskIds: ['task-1'],
      toActionId: 'action-2',
      toIndex: 0,
    });
  });

  it('creates an action from the palette on a phase', () => {
    handleCardDrop({
      event: dragEvent({ id: 'new:action', kind: 'action', create: true }),
      nodes,
      kind: 'phase',
      data: phase2 as unknown as PhaseNodeData,
      actions,
      locked: false,
    });
    expect(actions.createAction).toHaveBeenCalledWith({ phaseId: 'phase-2', name: 'New Action' });
  });

  it('creates and positions a phase from the palette', () => {
    const createdPhase = { id: 'phase-new' };
    vi.mocked(actions.createPhase).mockReturnValueOnce(createdPhase as never);
    handleCardDrop({
      event: dragEvent({ id: 'new:phase', kind: 'phase', create: true }),
      nodes,
      kind: 'phase',
      data: phase1 as unknown as PhaseNodeData,
      actions,
      locked: false,
      hoverDirection: 'right',
    });
    expect(actions.createPhase).toHaveBeenCalledWith({ versionId: 'v-1', label: 'New Phase' });
    expect(actions.movePhases).toHaveBeenCalledWith({ ids: ['phase-new'], toIndex: 1 });
  });

  it('creates a task from the palette on an action', () => {
    handleCardDrop({
      event: dragEvent({ id: 'new:task', kind: 'task', create: true }),
      nodes,
      kind: 'action',
      data: action2 as never,
      actions,
      locked: false,
    });
    expect(actions.createTask).toHaveBeenCalledWith({
      actionId: 'action-2',
      actionName: 'A2',
      channelId: 'empty',
      channelLabel: 'Unassigned',
      compositionId: null,
    });
  });

  it('falls back to single card when multi-selection contains mixed kinds', () => {
    handleCardDrop({
      event: dragEvent({ id: 'task-1', ids: ['phase-2', 'task-1'], kind: 'task' }),
      nodes,
      kind: 'action',
      data: action2 as never,
      actions,
      locked: false,
    });
    // phase-2 (kind='phase') + task-1 (kind='task') are mixed kinds
    // Only the grabbed card (task-1) should move
    expect(actions.moveTasks).toHaveBeenCalledWith({
      taskIds: ['task-1'],
      toActionId: 'action-2',
      toIndex: 0,
    });
  });
});
