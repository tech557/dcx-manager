import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import type { TaskCardData } from '@/types/builder-node.types';
import { useStageContext } from '../StageProvider';

interface TaskGridMarkerProps {
  task: TaskCardData;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function TaskGridMarker({ task, onClick, className = '' }: TaskGridMarkerProps) {
  const { selectedNodeIds, setSelectedNodeIds, setDraggingState } = useStageContext();
  const isSelected = selectedNodeIds.includes(task.id);

  // Check if any status is incomplete ('empty')
  const hasMissing = useMemo(() => {
    return task.specsState?.status === 'empty' || task.missingDataState?.status === 'empty';
  }, [task]);

  function handleDragStart(event: React.DragEvent<HTMLElement>) {
    setDraggingState(true, 'task', task.id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      'application/x-dcx-card',
      JSON.stringify({ id: task.id, kind: 'task' }),
    );
    event.dataTransfer.setData('application/x-dcx-task', task.id);
  }

  function handleSelect(e: React.MouseEvent) {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
      return;
    }
    const isMulti = e.metaKey || e.ctrlKey || e.shiftKey;
    if (isMulti) {
      if (isSelected) {
        setSelectedNodeIds(selectedNodeIds.filter((id) => id !== task.id));
      } else {
        setSelectedNodeIds([...selectedNodeIds, task.id]);
      }
    } else {
      setSelectedNodeIds([task.id]);
    }
  }

  return (
    <article
      id={`timeline-task-${task.id}`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleSelect}
      className={`group relative flex flex-col gap-1.5 p-2 rounded-lg border text-left cursor-pointer transition-all duration-200 select-none ${
        isSelected
          ? 'border-sky-400 bg-sky-50 dark:bg-sky-950/30 shadow-sm ring-1 ring-sky-400/30'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-850'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <h6 className="text-dcx-sm font-bold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-tight">
          {task.name}
        </h6>
        <span className="relative flex h-1.5 w-1.5 shrink-0 mt-0.5">
          {hasMissing ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-450 dark:bg-sky-400"></span>
          )}
        </span>
      </div>

      <p className="text-dcx-xs text-neutral-400 dark:text-neutral-500 line-clamp-1 leading-normal">
        {task.message || 'No message drafted yet.'}
      </p>

      {task.date && task.date.mode !== 'unset' && (
        <div className="flex items-center gap-1 text-dcx-2xs font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
          <Calendar className="w-2.5 h-2.5 text-sky-400/80" />
          <span>
            {task.date.mode === 'linked'
              ? `W${task.date.weekOffset}-D${task.date.dayOffset}`
              : task.date.date}
          </span>
        </div>
      )}
    </article>
  );
}
