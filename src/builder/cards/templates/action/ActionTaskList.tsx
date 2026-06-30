import type { ActionCardData } from '@/types/builder-node.types';
import { HorizontalTaskFlow } from '@/builder/cards/templates/phase/HorizontalTaskFlow';
import { TaskBentoGrid } from '@/builder/cards/templates/phase/TaskBentoGrid';

interface ActionTaskListProps {
  action: ActionCardData;
  locked: boolean;
  isExpanded: boolean;
  onSelect: (id: string, isMulti: boolean) => void;
  selectedNodeIds: string[];
}

export function ActionTaskList({ action, locked, isExpanded, onSelect, selectedNodeIds }: ActionTaskListProps) {
  if (!isExpanded) {
    return (
      <div className="mt-1 text-left" id={`action-tasks-collapsed-${action.id}`}>
        <HorizontalTaskFlow 
          tasks={action.tasks} 
          actionId={action.id}
          selectedNodeIds={selectedNodeIds}
          onTaskClick={(taskId, e) => {
            onSelect(taskId, e.shiftKey);
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className="mt-1.5 pt-1.5 border-t border-white/[0.05] flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200 text-left pointer-events-auto"
      id={`action-tasks-expanded-${action.id}`}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <TaskBentoGrid
          tasks={action.tasks}
          actionId={action.id}
          locked={locked}
          selectedNodeIds={selectedNodeIds}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}
