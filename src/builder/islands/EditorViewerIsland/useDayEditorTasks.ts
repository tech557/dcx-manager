import { useMemo } from 'react';
import { mapTaskToTimeline, getDateForWeekAndDay } from '../../stage/views/timeline.helpers';
import type { TaskCardData, BuilderNode } from '@/types/builder-node.types';

export function useDayEditorTasks(activeNode: { kind: string; id: string } | null, nodes: BuilderNode[], anchorDateStr: string) {
  return useMemo(() => {
    if (!activeNode || activeNode.kind !== 'day') return [];
    const dateStr = activeNode.id.replace('day:', '');

    const allTasks: TaskCardData[] = [];
    nodes.forEach((phase) => {
      if (phase.kind === 'phase') {
        phase.data.actionCards.forEach((action) => {
          allTasks.push(...action.tasks);
        });
      }
    });

    return allTasks.filter((t) => {
      if (!t.date || t.date.mode === 'unset') return false;
      if (t.date.mode === 'fixed') {
        return t.date.date === dateStr;
      }
      const placement = mapTaskToTimeline(t, anchorDateStr);
      return placement.isScheduled && getDateForWeekAndDay(placement.week, placement.day, anchorDateStr) === dateStr;
    });
  }, [activeNode, nodes, anchorDateStr]);
}
