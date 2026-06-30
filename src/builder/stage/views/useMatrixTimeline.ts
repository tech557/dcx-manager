import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useStageContext } from '../StageProvider';
import { useVersionQuery } from '@/queries/versions.queries';
import { getDaysForWeek, parseDateString } from './timeline.helpers';
import { useBuilderActions } from '@/actions/useBuilderActions';
import type { TaskCardData, ActionCardData } from '@/types/builder-node.types';

export function useMatrixTimeline() {
  const {
    nodes,
    activeWeek,
    setActiveWeek,
    prevWeek,
    nextWeek,
    totalWeeks,
  } = useStageContext();

  const { versionId = 'v-1' } = useParams();
  const versionQuery = useVersionQuery(versionId);

  const currentVersion = versionQuery.data;
  const anchorDateStr = currentVersion?.communicatedDate ?? '2026-07-01';

  const allTasks = useMemo(() => {
    const tasks: TaskCardData[] = [];
    nodes.forEach((n) => {
      if (n.kind === 'phase') {
        n.data.actionCards.forEach((action) => {
          action.tasks.forEach((task) => {
            tasks.push(task);
          });
        });
      }
    });
    return tasks;
  }, [nodes]);

  const actionsList = useMemo(() => {
    const actions: ActionCardData[] = [];
    nodes.forEach((n) => {
      if (n.kind === 'phase') {
        n.data.actionCards.forEach((action) => {
          actions.push(action);
        });
      }
    });
    return actions;
  }, [nodes]);

  const days = useMemo(() => {
    return getDaysForWeek(activeWeek, anchorDateStr);
  }, [activeWeek, anchorDateStr]);

  const [isDraggingOverLeft, setIsDraggingOverLeft] = useState(false);
  const [isDraggingOverRight, setIsDraggingOverRight] = useState(false);

  const actions = useBuilderActions();

  const getDayNumber = (dayIndex: number) => {
    if (activeWeek > 1) return dayIndex + 1;
    return dayIndex - parseDateString(anchorDateStr).getUTCDay() + 1;
  };

  const handleCellDrop = (
    event: React.DragEvent,
    targetActionId: string,
    dayIndex: number,
    isEnabled: boolean,
  ) => {
    if (!isEnabled) return;
    const raw = event.dataTransfer.getData('application/x-dcx-card');
    if (!raw) return;

    try {
      const payload = JSON.parse(raw);
      if (payload.kind !== 'task') return;
      let foundTask: TaskCardData | undefined;
      nodes.forEach((node) => {
        if (node.kind !== 'phase') return;
        node.data.actionCards.forEach((action) => {
          foundTask ??= action.tasks.find((task) => task.id === payload.id);
        });
      });
      if (!foundTask) return;

      const dayNumber = getDayNumber(dayIndex);
      if (dayNumber < 1) return;
      if (foundTask.parentActionId !== targetActionId) {
        actions.moveTask({
          taskId: payload.id,
          fromActionId: foundTask.parentActionId,
          toActionId: targetActionId,
          toIndex: 0,
        });
      }
      actions.updateTask({
        actionId: targetActionId,
        taskId: payload.id,
        changes: { date: { mode: 'linked', weekOffset: activeWeek, dayOffset: dayNumber } },
      });
    } catch (error) {
      console.error('Error on matrix day-action drop:', error);
    }
  };

  const handleSaveMinimalTask = (name: string, targetActionId: string, dayIndex: number) => {
    actions.createTask({
      actionId: targetActionId,
      actionName: name,
      channelId: 'empty',
      channelLabel: 'Unassigned',
      compositionId: null,
      date: { mode: 'linked', weekOffset: activeWeek, dayOffset: getDayNumber(dayIndex) },
    });
  };

  return {
    nodes,
    activeWeek,
    setActiveWeek,
    prevWeek,
    nextWeek,
    totalWeeks,
    anchorDateStr,
    allTasks,
    actionsList,
    days,
    isDraggingOverLeft,
    setIsDraggingOverLeft,
    isDraggingOverRight,
    setIsDraggingOverRight,
    handleCellDrop,
    handleSaveMinimalTask,
  };
}
