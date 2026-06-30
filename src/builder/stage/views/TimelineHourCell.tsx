import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskGridMarker } from './TaskGridMarker';
import type { TaskCardData } from '@/types/builder-node.types';
import { useToggle } from '@/hooks/useToggle';

interface DayData {
  dateString: string;
  label: string;
  isAnchorDay: boolean;
  dayIndex: number;
  isEnabled: boolean;
}

interface TimelineHourCellProps {
  day: DayData;
  actionId: string;
  activeWeek: number;
  cellTasks: TaskCardData[];
  onCellDrop: (e: React.DragEvent, targetActionId: string, dayIndex: number, isEnabled: boolean) => void;
  onSaveMinimalTask: (name: string, actionId: string, dayIndex: number) => void;
}

export function TimelineHourCell({
  day,
  actionId,
  activeWeek: _activeWeek,
  cellTasks,
  onCellDrop,
  onSaveMinimalTask,
}: TimelineHourCellProps) {
  const [isAdding, , openAdding, closeAdding] = useToggle();
  const [newTaskName, setNewTaskName] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    onSaveMinimalTask(newTaskName, actionId, day.dayIndex);
    setNewTaskName('');
    closeAdding();
  };

  return (
    <div
      onDragOver={(e) => {
        if (!day.isEnabled) return;
        e.preventDefault();
        setIsHovered(true);
      }}
      onDragLeave={() => setIsHovered(false)}
      onDrop={(e) => {
        setIsHovered(false);
        onCellDrop(e, actionId, day.dayIndex, day.isEnabled);
      }}
      className={`flex-1 min-w-[140px] p-3 border-r border-neutral-200 dark:border-neutral-850 last:border-r-0 relative flex flex-col gap-2 transition duration-150 group/cell ${
        day.isAnchorDay
          ? 'bg-sky-500/[0.01]'
          : !day.isEnabled
            ? 'bg-neutral-50/30 dark:bg-neutral-950/20 opacity-55 cursor-not-allowed select-none bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.01),rgba(0,0,0,0.01)_10px,transparent_10px,transparent_20px)]'
            : ''
      } ${
        isHovered
          ? 'bg-sky-50 dark:bg-sky-950/20 ring-1 ring-inset ring-sky-400/30 border-dashed'
          : ''
      }`}
    >
      <div className="flex-1 space-y-1.5 overflow-y-auto">
        {cellTasks.map((task) => (
          <TaskGridMarker key={task.id} task={task} />
        ))}
      </div>

      {isAdding ? (
        <form
          onSubmit={handleSubmit}
          className="p-1.5 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2 shrink-0 shadow-sm z-5 absolute inset-x-2 bottom-2"
        >
          <input
            type="text"
            required
            placeholder="Minimal name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            className="w-full text-dcx-sm h-7 px-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none"
            autoFocus
          />
          <div className="flex justify-end gap-1">
            <button
              type="button"
              onClick={closeAdding}
              className="px-1 text-dcx-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-1.5 py-0.5 text-dcx-xs bg-sky-500 text-white font-bold rounded hover:bg-sky-600"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        day.isEnabled && (
          <button
            type="button"
            onClick={openAdding}
            className="h-6 w-6 rounded-full bg-neutral-100 hover:bg-sky-500 hover:text-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-300 absolute right-2 bottom-2 font-bold flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition duration-150 text-dcx-xs shadow"
            aria-label="Add task"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )
      )}
    </div>
  );
}
