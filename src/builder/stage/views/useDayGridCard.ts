import { useMemo } from 'react';
import { useStageContext } from '../StageProvider';
import { parseDateString } from './timeline.helpers';
import type { TaskCardData } from '@/types/builder-node.types';
import { useToggle } from '@/hooks/useToggle';

export interface UseDayGridCardOptions {
  dateString: string;
  dayIndex: number;
  weekIndex: number;
  anchorDateStr: string;
  tasks: TaskCardData[];
  isMonthly?: boolean;
}

export function useDayGridCard({
  dateString,
  dayIndex,
  weekIndex,
  anchorDateStr,
  tasks,
  isMonthly = false,
}: UseDayGridCardOptions) {
  const {
    focusedNodeId,
    setFocusedNodeId,
    expandedNodeIds,
    setExpandedNodeIds,
    selectedNodeIds,
    setSelectedNodeIds,
  } = useStageContext();

  const [isAdding, , handleOpenAdd, handleCloseAdd] = useToggle();

  const isSelected = focusedNodeId === `day:${dateString}`;
  const isCollapsed = !isMonthly && !expandedNodeIds.includes(`day:${dateString}`);

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dayId = `day:${dateString}`;
    if (expandedNodeIds.includes(dayId)) {
      setExpandedNodeIds(expandedNodeIds.filter((id) => id !== dayId));
    } else {
      setExpandedNodeIds([...expandedNodeIds, dayId]);
    }
  };

  const handleSelectTask = (id: string, isMulti: boolean) => {
    if (isMulti) {
      if (selectedNodeIds.includes(id)) {
        setSelectedNodeIds(selectedNodeIds.filter((x) => x !== id));
      } else {
        setSelectedNodeIds([...selectedNodeIds, id]);
      }
    } else {
      setSelectedNodeIds([id]);
    }
  };

  const hasAnyExpandedTask = useMemo(() => {
    return tasks.some((task) => expandedNodeIds.includes(task.id));
  }, [tasks, expandedNodeIds]);

  const anchorDateObj = useMemo(() => parseDateString(anchorDateStr), [anchorDateStr]);
  const baseDayOfWeek = anchorDateObj.getUTCDay();

  const dayNum = useMemo(() => {
    if (weekIndex === 1) {
      return dayIndex - baseDayOfWeek + 1;
    } else {
      return dayIndex + 1;
    }
  }, [weekIndex, dayIndex, baseDayOfWeek]);

  const formattedDateParts = useMemo(() => {
    try {
      const parsedDate = parseDateString(dateString);
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const dayName = daysOfWeek[parsedDate.getUTCDay()];
      const monthName = months[parsedDate.getUTCMonth()];
      const dateNum = parsedDate.getUTCDate();
      
      return {
        dayName,
        monthName,
        dateNum,
        full: `${dayName} ${dateNum} ${monthName}`
      };
    } catch {
      return null;
    }
  }, [dateString]);

  return {
    isAdding,
    isSelected,
    isCollapsed,
    hasAnyExpandedTask,
    dayNum,
    formattedDateParts,
    expandedNodeIds,
    setExpandedNodeIds,
    focusedNodeId,
    setFocusedNodeId,
    selectedNodeIds,
    setSelectedNodeIds,
    handleToggleCollapse,
    handleSelectTask,
    handleOpenAdd,
    handleCloseAdd,
  };
}
