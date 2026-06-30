import { ReadyMark } from '@/builder/ui/feedback/ReadyMark';
import { AlertMark } from '@/builder/ui/feedback/AlertMark';
import { ShieldCheck } from 'lucide-react';
import type { TaskCardData, ActionCardData, PhaseNodeData } from '@/types/builder-node.types';
import { getTaskReadiness, getActionReadiness } from '@/rules/readiness.rules';

export interface ReadinessCheckContentProps {
  task?: TaskCardData | null;
  action?: ActionCardData | null;
  phase?: PhaseNodeData | null;
}

export function ReadinessCheckContent({ task, action, phase }: ReadinessCheckContentProps) {
  const isPhase = !!phase;
  const isAction = !isPhase && !!action;
  const targetId = isPhase ? phase.id : (isAction ? action.id : (task ? task.id : ''));

  const criteria = isPhase
    ? [
        {
          id: 'phase-name',
          label: 'Phase Name Specified',
          description: 'The phase must have a distinct, non-empty text label.',
          passes: !!phase.label && phase.label.trim().length > 0
        },
        {
          id: 'phase-has-actions',
          label: 'Actions Created',
          description: 'The phase must contain at least one action to be planned.',
          passes: !!phase.actionCards && phase.actionCards.length > 0
        },
        ...(phase.actionCards || []).map((ac) => {
          const isActionReady = getActionReadiness(ac).state === 'ready';
          return {
            id: `action-ready-${ac.id}`,
            label: `Action: ${ac.name || 'Untitled Action'}`,
            description: isActionReady
              ? 'Action meets 100% of campaign deployment constraints.'
              : 'Action has incomplete or missing child tasks/readiness requirements.',
            passes: isActionReady
          };
        })
      ]
    : isAction
      ? [
          {
            id: 'action-name',
            label: 'Action Name Specified',
            description: 'The action must have a distinct, non-empty text label.',
            passes: !!action.name && action.name.trim().length > 0
          },
          {
            id: 'action-has-tasks',
            label: 'Tasks Created',
            description: 'The action must contain at least one task to be planned.',
            passes: !!action.tasks && action.tasks.length > 0
          },
          ...(action.tasks || []).map((t) => {
            const isTaskReady = getTaskReadiness(t).state === 'ready';
            return {
              id: `task-ready-${t.id}`,
              label: `Task: ${t.name || 'Untitled Task'}`,
              description: isTaskReady
                ? 'Task meets 100% of campaign deployment constraints.'
                : 'Task has incomplete fields, missing date, or missing subtasks.',
              passes: isTaskReady
            };
          })
        ]
      : task
        ? [
            {
              id: 'task-name',
              label: 'Task Name Specified',
              description: 'The task must have a distinct, non-empty text label.',
              passes: !!task.name && task.name.trim().length > 0
            },
            {
              id: 'task-channel',
              label: 'Channel Selected',
              description: 'A communications distribution channel must be chosen.',
              passes: !!task.channelId && task.channelId.trim().length > 0
            },
            {
              id: 'task-sender',
              label: 'Sender ID Assigned',
              description: 'A dispatching sender must be specified.',
              passes: !!task.senderId && task.senderId.trim().length > 0
            },
            {
              id: 'task-receiver',
              label: 'Receiver ID Assigned',
              description: 'A target receiver must be specified.',
              passes: !!task.receiverId && task.receiverId.trim().length > 0
            },
            {
              id: 'task-message',
              label: 'Draft Message Configured',
              description: 'The core communications body copy must be non-empty.',
              passes: !!task.message && task.message.trim().length > 0
            },
            {
              id: 'task-date',
              label: 'Calendar Date Scheduled',
              description: 'Calendar scheduling mode must not be TBD.',
              passes: !!task.date && task.date.mode !== 'unset'
            },
            {
              id: 'task-subtasks-count',
              label: 'Subtask Benchmarks Defined',
              description: 'At least one benchmark action needs to exist.',
              passes: !!task.subtasks && task.subtasks.length > 0
            },
            {
              id: 'task-subtasks-duration',
              label: 'Benchmark Durations Set',
              description: 'All benchmarks must have a non-zero estimation minutes set.',
              passes: !!task.subtasks && task.subtasks.length > 0 && !task.subtasks.some(
                st => st.estimatedMinutes === null || st.estimatedMinutes === undefined || st.estimatedMinutes <= 0
              )
            },
            {
              id: 'task-specs',
              label: 'Asset Specifications Status',
              description: 'Asset configuration status cannot be empty.',
              passes: task.specsState?.status !== 'empty'
            },
            {
              id: 'task-missing',
              label: 'Missing Data Checked',
              description: 'Outstanding questions status cannot be empty.',
              passes: task.missingDataState?.status !== 'empty'
            }
          ]
        : [];

  const passedCount = criteria.filter(c => c.passes).length;
  const totalCount = criteria.length;
  const percentComplete = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  const isComplete = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="flex flex-col gap-4 font-sans h-full min-h-0" id={`readiness-audit-content-${targetId}`}>
      <div className="bg-neutral-950/40 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2 shrink-0 select-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-dcx-xs font-bold text-[var(--theme-accent)] uppercase font-mono tracking-wider">
              Release Compliance
            </p>
            <h4 className="text-dcx-md-plus font-bold text-white mt-0.5">
              {isComplete ? '100% Release Ready' : `${passedCount} of ${totalCount} Rules Satisfied`}
            </h4>
          </div>
          <div className="text-right">
            <span className={`text-base font-black font-mono ${isComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {percentComplete}%
            </span>
          </div>
        </div>

        <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isComplete ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto pr-1 space-y-1.5 [scrollbar-width:thin] scrollbar-thin max-h-[220px]"
        id="readiness-rules-list"
      >
        {criteria.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-2 bg-white/[0.01] hover:bg-white/[0.03] border rounded-lg transition-all ${
              item.passes
                ? 'border-emerald-500/10'
                : 'border-white/5'
            }`}
            id={`readiness-rule-item-${item.id}`}
          >
            <div className="py-0.5 shrink-0 select-none">
              {item.passes ? (
                <ReadyMark id={`rule-mark-ready-${item.id}`} className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertMark id={`rule-mark-alert-${item.id}`} className="w-4 h-4 text-amber-500 shrink-0 animate-none" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-dcx-sm font-extrabold tracking-tight leading-none ${
                  item.passes ? 'text-emerald-400/90' : 'text-neutral-200'
                }`}
              >
                {item.label}
              </p>
              <p className="text-dcx-2xs-plus text-neutral-400 leading-normal mt-1 font-sans">
                {item.description}
              </p>
            </div>

            <div className="shrink-0 select-none">
              <span className={`text-dcx-3xs-plus font-black font-mono uppercase px-1.5 py-0.5 rounded ${
                item.passes
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-500'
              }`}>
                {item.passes ? 'Pass' : 'Fail'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 pt-3 select-none shrink-0" id="readiness-audit-footer">
        {isComplete ? (
          <div className="flex items-center gap-2 p-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg text-dcx-xs-plus text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <p className="leading-snug">
              <strong>Certified production state:</strong> This configuration meets 100% of the active campaign deployment constraints.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-amber-500/5 border border-amber-500/15 rounded-lg text-dcx-xs-plus text-amber-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-500" />
            <p className="leading-snug">
              <strong>Constraints incomplete:</strong> Ensure all flagged red/yellow alerts are corrected prior to initiating final approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
