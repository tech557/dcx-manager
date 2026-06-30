import React from "react";
import { Lock, FileText, Plus } from "lucide-react";
import { TaskCardData } from "../../../../types";
import { TaskCard } from "../task/TaskCard";

interface DayCardTasksProps {
  isEnabled: boolean;
  isWeekend: boolean;
  tasks: TaskCardData[];
  onStartEditTask?: (task: TaskCardData) => void;
  onEditTask?: (phaseId: string, actionCardId: string, updatedTask: TaskCardData) => void;
  onDeleteTask?: (phaseId: string, actionCardId: string, taskId: string) => void;
  onDuplicateTask?: (phaseId: string, actionCardId: string, task: TaskCardData) => void;
  onAddTaskClick?: () => void;
  isMonthly?: boolean;
}

export function DayCardTasks({
isEnabled,
  isWeekend,
  tasks,
  onStartEditTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onAddTaskClick,
  isMonthly,
}: DayCardTasksProps) {
  return (
    <div className={`flex-1 overflow-y-auto scrollbar-none min-h-0 select-text ${isMonthly ? "space-y-1.5" : "space-y-3 pr-1"}`}>
      {!isMonthly && (
        <div 
          className="flex items-center justify-between mb-2 group/deliverables relative cursor-pointer" 
          onClick={isEnabled ? onAddTaskClick : undefined}
        >
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black tracking-widest uppercase opacity-45 block font-mono">
              DELIVERABLES
            </span>
            {isEnabled && (
              <span className="px-1.5 py-0.5 rounded-full font-mono text-[8px] font-black bg-[#75E2FF]/10 text-[#75E2FF] border border-[#75E2FF]/15">
                {tasks.length}
              </span>
            )}
          </div>
          {isEnabled && onAddTaskClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddTaskClick();
              }}
              className="opacity-0 group-hover/deliverables:opacity-100 focus:opacity-100 transition-opacity duration-200 pointer-events-auto p-1 -mr-1 rounded hover:bg-current/10 text-[#75E2FF]"
              title="Add Deliverable"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {!isEnabled ? (
        <div className={`flex flex-col items-center justify-center text-center px-2 border border-dashed border-current/[0.04] rounded-xl ${isMonthly ? "py-2 bg-transparent" : "h-44"}`}>
          <Lock className={`${isMonthly ? "w-3 h-3 mb-0.5" : "w-5 h-5 mb-2"} opacity-25 text-current`} />
          {!isMonthly && (
            <span className="text-[8px] font-black font-mono tracking-widest uppercase opacity-45 leading-relaxed">
              {isWeekend ? "Weekend Sleep — locked" : "Pre-Comm Day Gap"}
            </span>
          )}
        </div>
      ) : tasks.length === 0 ? (
        <div className={`flex flex-col items-center justify-center border border-dashed border-current/[0.04] rounded-xl ${isMonthly ? "py-2 bg-transparent" : "h-44 p-5"}`}>
          <FileText className={`${isMonthly ? "w-3 h-3 mb-0.5" : "w-4 h-4 mb-2"} opacity-15 text-current`} />
          {!isMonthly && (
            <span className="text-[8px] font-black uppercase tracking-wider font-mono opacity-25">
              No tasks
            </span>
          )}
          {isMonthly && (
            <span className="text-[7px] font-bold uppercase tracking-wider font-mono opacity-20">
              Empty
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-2 w-full">
          {tasks.map((task) => {
            const anyTask = task as any;
            return (
              <div 
                key={task.id} 
                className={`transition-all duration-300 relative ${
                  isMonthly
                    ? "w-11 h-11 shrink-0"
                    : task.isSmall !== false
                      ? "w-[68px] h-[68px] shrink-0"
                      : "w-full shrink-0 z-30"
                }`}
              >
                <TaskCard
                  task={task}
                  parentActionCardId={anyTask.actionCardId}
                  parentPhaseId={anyTask.phaseId}
                  onEdit={(updatedTask) => onEditTask?.(anyTask.phaseId || "", anyTask.actionCardId || "", updatedTask)}
                  onDelete={() => onDeleteTask?.(anyTask.phaseId || "", anyTask.actionCardId || "", task.id)}
                  onDuplicate={() => onDuplicateTask?.(anyTask.phaseId || "", anyTask.actionCardId || "", task)}
                  onStartEdit={() => onStartEditTask?.(task)}
                  isMonthly={isMonthly}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
