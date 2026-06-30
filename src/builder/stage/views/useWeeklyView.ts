import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStageContext } from '../StageProvider';
import { useVersionQuery } from '@/queries/versions.queries';
import { getDaysForWeek, mapTaskToTimeline } from './timeline.helpers';

export function useWeeklyView() {
  const { nodes, activeWeek, setActiveWeek, totalWeeks, setExpandedNodeIds } = useStageContext();
  const { versionId = 'v-1' } = useParams();
  const versionQuery = useVersionQuery(versionId);

  const currentVersion = versionQuery.data;
  const anchorDateStr = currentVersion?.communicatedDate ?? '2026-07-01';

  const allTasks = useMemo(() => 
    nodes.flatMap(n => n.kind === 'phase' ? n.data.actionCards.flatMap(a => a.tasks) : [])
  , [nodes]);

  const actionsList = useMemo(() => 
    nodes.flatMap(n => n.kind === 'phase' ? n.data.actionCards : [])
  , [nodes]);

  const days = useMemo(() => getDaysForWeek(activeWeek, anchorDateStr), [activeWeek, anchorDateStr]);

  const [initializedWeeks, setInitializedWeeks] = useState<number[]>([]);

  useEffect(() => {
    if (initializedWeeks.includes(activeWeek)) return;
    const enabledDayIds = days.filter(d => d.isEnabled).map(d => `day:${d.dateString}`);
    // Functional updater avoids stale closure on expandedNodeIds and breaks the
    // re-fire loop that occurred when expandedNodeIds was in the dep array.
    setExpandedNodeIds(prev => Array.from(new Set([...prev, ...enabledDayIds])));
    // Track initialized week side-effect state after expanding enabled days.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitializedWeeks(prev => [...prev, activeWeek]);
  }, [activeWeek, days, setExpandedNodeIds, initializedWeeks]);

  const getTasksForDay = (dayIndex: number) => allTasks.filter((task) => {
    const placement = mapTaskToTimeline(task, anchorDateStr);
    return placement.week === activeWeek && placement.day === dayIndex;
  });

  const [dragEdges, setDragEdges] = useState({ left: false, right: false });
  const edgeDragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (edgeDragTimerRef.current) clearTimeout(edgeDragTimerRef.current);
  }, []);

  const setDragOver = (dir: 'left' | 'right', val: boolean) => {
    setDragEdges(prev => ({ ...prev, [dir]: val }));
  };

  const clearTimer = () => {
    if (edgeDragTimerRef.current) {
      clearTimeout(edgeDragTimerRef.current);
      edgeDragTimerRef.current = null;
    }
  };

  const handleEdgeDragEnter = (dir: 'left' | 'right') => (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/x-dcx-card')) {
      e.preventDefault();
      setDragOver(dir, true);
      clearTimer();
      edgeDragTimerRef.current = setTimeout(() => {
        const nextWeek = dir === 'left' ? activeWeek - 1 : activeWeek + 1;
        if (nextWeek >= 1 && nextWeek <= totalWeeks) setActiveWeek(nextWeek);
        setDragOver(dir, false);
      }, 700);
    }
  };

  const handleEdgeDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/x-dcx-card')) e.preventDefault();
  };

  const handleEdgeDragLeave = (dir: 'left' | 'right') => () => {
    setDragOver(dir, false);
    clearTimer();
  };

  const handleEdgeDrop = (dir: 'left' | 'right') => () => {
    setDragOver(dir, false);
    clearTimer();
  };

  return {
    days,
    actionsList,
    activeWeek,
    totalWeeks,
    anchorDateStr,
    isDraggingOverLeft: dragEdges.left,
    isDraggingOverRight: dragEdges.right,
    getTasksForDay,
    handleEdgeDragEnter,
    handleEdgeDragOver,
    handleEdgeDragLeave,
    handleEdgeDrop,
  };
}
