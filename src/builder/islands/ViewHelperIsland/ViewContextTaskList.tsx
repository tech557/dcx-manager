import React from 'react';
import { useStageContext } from '../../stage/StageProvider';
import { ViewContextTaskItem } from './ViewContextTaskItem';
import type { PhaseNode } from '@/types/builder-node.types';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { getAllTasks } from '@/utils/node.helpers';

export function ViewContextTaskList() {
  const { nodes } = useStageContext();

  const phases = nodes
    .filter((n): n is PhaseNode => n.kind === 'phase')
    .sort((a, b) => a.orderIndex - b.orderIndex);
  
  const allTasks = getAllTasks(nodes);
  const unassignedTasks = allTasks.filter((t) => t.date.mode === 'unset');
  const totalTasks = allTasks.length;

  if (totalTasks === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center p-6 text-center gap-2.5 h-full select-none"
        id="view-context-empty"
      >
        <AlertCircle className="w-8 h-8 text-white/20" />
        <p className="text-dcx-sm text-white/50 font-medium">No campaign tasks found.</p>
        <p className="text-dcx-2xs text-white/30">
          Create phases, actions, and tasks on the main canvas to see them here.
        </p>
      </div>
    );
  }

  const allAssigned = unassignedTasks.length === 0;

  return (
    <div className="flex flex-col gap-4 h-full w-full select-none min-h-0" id="view-context-task-list">
      {allAssigned && (
        <div
          className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-dcx-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.05)] shrink-0"
          id="view-context-all-assigned-banner"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold tracking-wide">
            All tasks have communication dates assigned.
          </span>
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto pr-0.5 flex flex-col gap-4 min-h-0"
        id="view-context-scroll-area"
      >
        {phases.map((phase) => {
          const phaseActions = phase.data.actionCards;
          const hasAnyTask = phaseActions.some(a => a.tasks.length > 0);
          if (!hasAnyTask) return null;

          return (
            <div key={phase.id} className="flex flex-col gap-2" id={`phase-group-${phase.id}`}>
              {/* Phase Header */}
              <div className="flex items-center gap-1.5 opacity-80 pl-1">
                <div className="w-1 h-3 rounded bg-[var(--theme-accent)]" />
                <span className="text-dcx-xs font-bold tracking-wider uppercase text-white/70">
                  {phase.data.label}
                </span>
              </div>

              {/* Actions under Phase */}
              <div className="flex flex-col gap-3 pl-2.5 border-l border-white/5 ml-1.5">
                {phaseActions.map((action) => {
                  if (action.tasks.length === 0) return null;

                  return (
                    <div key={action.id} className="flex flex-col gap-1.5" id={`action-group-${action.id}`}>
                      {/* Action Name */}
                      <span className="text-dcx-2xs font-semibold text-white/40 tracking-wide">
                        {action.name}
                      </span>

                      {/* Tasks under Action */}
                      <div className="flex flex-col gap-1.5">
                        {action.tasks.map((task) => (
                          <ViewContextTaskItem
                            key={task.id}
                            taskNode={{
                              id: task.id,
                              kind: 'task' as const,
                              parentId: task.parentActionId ?? '',
                              orderIndex: task.orderIndex ?? 0,
                              data: task,
                            }}
                            actionName={action.name}
                            phaseName={phase.data.label}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
