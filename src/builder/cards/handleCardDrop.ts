import type { DragEvent, Dispatch, SetStateAction } from 'react';
import type { builderActions } from '@/actions/builder.actions';
import type { BuilderNode, PhaseNodeData } from '@/types/builder-node.types';
import type { CardKind } from '@/types/card.types';
import type { CardData } from './useCardBehavior';
import { adjustDropIndex, findActionLocation, findPhaseLocation, findTaskLocation } from './dragDropHelpers';
import { getCardDragPayload } from './cardDrag.helpers';
import { findParentPhase, resolveNodeKind } from '@/utils/node.helpers';

type BuilderActionsAPI = typeof builderActions;

interface HandleCardDropOptions {
  event: DragEvent<HTMLDivElement>;
  nodes: BuilderNode[];
  kind: CardKind;
  data: CardData;
  actions: BuilderActionsAPI;
  locked: boolean;
  hoverDirection?: 'left' | 'right' | null;
  setReceivingChildId?: (id: string | null) => void;
  setExpandedNodeIds?: Dispatch<SetStateAction<string[]>>;
}

function getVisualOrderOfIds(nodes: BuilderNode[]): string[] {
  const result: string[] = [];
  const phases = nodes
    .filter((n) => n.kind === 'phase')
    .sort((a, b) => a.orderIndex - b.orderIndex);

  phases.forEach((phase) => {
    result.push(phase.id);
    const actions = nodes
      .filter((n) => n.kind === 'action' && n.parentId === phase.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    actions.forEach((action) => {
      result.push(action.id);
      const tasks = nodes
        .filter((n) => n.kind === 'task' && n.parentId === action.id)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      tasks.forEach((task) => {
        result.push(task.id);
      });
    });
  });
  return result;
}

function isPhaseData(kind: CardKind, data: CardData): data is PhaseNodeData {
  return kind === 'phase' && 'actionCards' in data;
}

export function handleCardDrop({
  event,
  nodes,
  kind,
  data,
  actions,
  locked,
  hoverDirection,
  setReceivingChildId,
  setExpandedNodeIds,
}: HandleCardDropOptions): void {
  if (locked) return;

  const payload = getCardDragPayload(event.dataTransfer);
  if (!payload || payload.id === data.id) return;

  const { id: sourceId, ids: sourceIds, kind: sourceKind, create: isCreation } = payload;
  const initialDraggedIds = sourceIds.length > 0 ? sourceIds : [sourceId];

  // Determine kinds for each selected id using resolveNodeKind
  const selectedKinds = initialDraggedIds.map((id) => resolveNodeKind(nodes, id));
  const firstKind = selectedKinds[0];
  const allSameKind = firstKind ? selectedKinds.every((k) => k === firstKind) : true;

  let draggedIds: string[];
  if (allSameKind) {
    const visualOrder = getVisualOrderOfIds(nodes);
    draggedIds = [...initialDraggedIds].sort(
      (a, b) => visualOrder.indexOf(a) - visualOrder.indexOf(b)
    );
  } else {
    // Mixed-level selection: only the dragged card moves
    draggedIds = [sourceId];
  }

  const notifyParentAndGrandparent = (directParentId: string) => {
    if (setReceivingChildId) {
      setReceivingChildId(directParentId);
    }
    const grandparentPhase = findParentPhase(nodes, directParentId);
    if (grandparentPhase && setExpandedNodeIds) {
      setExpandedNodeIds((current) => Array.from(new Set([...current, grandparentPhase.id])));
    }
  };

  if (sourceKind === 'phase' && kind === 'phase' && isPhaseData(kind, data)) {
    const { orderIndex } = findPhaseLocation(nodes, data.id);
    const toIndex = hoverDirection === 'right' ? orderIndex + 1 : orderIndex;
    if (isCreation) {
      const newPhase = actions.createPhase({ versionId: data.versionId, label: 'New Phase' });
      if (newPhase) actions.movePhases({ ids: [newPhase.id], toIndex });
      return;
    }
    actions.movePhases({ ids: draggedIds, toIndex });
    return;
  }

  if (sourceKind === 'action' && kind === 'action') {
    const targetLoc = findActionLocation(nodes, data.id);
    if (!targetLoc) return;
    if (isCreation) {
      const newAction = actions.createAction({ phaseId: targetLoc.phaseId, name: 'New Action' });
      if (newAction) {
        actions.moveActions({
          actionIds: [newAction.id],
          toPhaseId: targetLoc.phaseId,
          toIndex: targetLoc.orderIndex,
        });
      }
      setReceivingChildId?.(targetLoc.phaseId);
      return;
    }
    const targetPhase = nodes.find((node) => node.id === targetLoc.phaseId);
    const toIndex = targetPhase?.kind === 'phase'
      ? adjustDropIndex(
          targetLoc.orderIndex,
          draggedIds,
          targetPhase.data.actionCards.map((action) => action.id),
        )
      : targetLoc.orderIndex;
    actions.moveActions({
      actionIds: draggedIds,
      toPhaseId: targetLoc.phaseId,
      toIndex,
    });
    setReceivingChildId?.(targetLoc.phaseId);
    return;
  }

  if (sourceKind === 'action' && isPhaseData(kind, data)) {
    if (isCreation) {
      actions.createAction({ phaseId: data.id, name: 'New Action' });
      setReceivingChildId?.(data.id);
      return;
    }
    actions.moveActions({
      actionIds: draggedIds,
      toPhaseId: data.id,
      toIndex: data.actionCards.length,
    });
    setReceivingChildId?.(data.id);
    return;
  }

  if (sourceKind === 'task' && kind === 'task') {
    const targetLoc = findTaskLocation(nodes, data.id);
    if (!targetLoc) return;
    if (isCreation) {
      const newTask = actions.createTask({
        actionId: targetLoc.actionId,
        actionName: 'New Task',
        channelId: 'empty',
        channelLabel: 'Unassigned',
        compositionId: null,
      });
      if (newTask) {
        actions.moveTasks({
          taskIds: [newTask.id],
          toActionId: targetLoc.actionId,
          toIndex: targetLoc.orderIndex,
        });
      }
      notifyParentAndGrandparent(targetLoc.actionId);
      return;
    }
    const targetAction = nodes
      .filter((node) => node.kind === 'phase')
      .flatMap((node) => node.data.actionCards)
      .find((action) => action.id === targetLoc.actionId);
    const toIndex = targetAction
      ? adjustDropIndex(targetLoc.orderIndex, draggedIds, targetAction.tasks.map((task) => task.id))
      : targetLoc.orderIndex;
    actions.moveTasks({
      taskIds: draggedIds,
      toActionId: targetLoc.actionId,
      toIndex,
    });
    notifyParentAndGrandparent(targetLoc.actionId);
    return;
  }

  if (sourceKind === 'task' && kind === 'action' && 'tasks' in data) {
    if (isCreation) {
      actions.createTask({
        actionId: data.id,
        actionName: data.name,
        channelId: 'empty',
        channelLabel: 'Unassigned',
        compositionId: null,
      });
      notifyParentAndGrandparent(data.id);
      return;
    }
    actions.moveTasks({
      taskIds: draggedIds,
      toActionId: data.id,
      toIndex: data.tasks.length,
    });
    notifyParentAndGrandparent(data.id);
    return;
  }

  if (sourceKind === 'task' && isPhaseData(kind, data)) {
    const firstAction = data.actionCards[0];
    if (!firstAction) return;
    if (isCreation) {
      actions.createTask({
        actionId: firstAction.id,
        actionName: firstAction.name,
        channelId: 'empty',
        channelLabel: 'Unassigned',
        compositionId: null,
      });
      setReceivingChildId?.(firstAction.id);
      setExpandedNodeIds?.((current) => Array.from(new Set([...current, data.id])));
      return;
    }
    actions.moveTasks({
      taskIds: draggedIds,
      toActionId: firstAction.id,
      toIndex: firstAction.tasks.length,
    });
    setReceivingChildId?.(firstAction.id);
    setExpandedNodeIds?.((current) => Array.from(new Set([...current, data.id])));
  }
}
