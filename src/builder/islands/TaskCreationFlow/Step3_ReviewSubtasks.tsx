import type { Subtask } from '@/types/domain';
import type { ApiChannel, ApiChannelComposition } from '@/types/api';

interface Step3ReviewSubtasksProps {
  channel: ApiChannel;
  composition: ApiChannelComposition;
  subtasks: Subtask[];
  onBack: () => void;
  onConfirm: () => void;
}

export function Step3ReviewSubtasks({
  channel,
  composition,
  subtasks,
  onBack,
  onConfirm,
}: Step3ReviewSubtasksProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-dcx-sm font-bold uppercase text-neutral-400">Review subtasks</div>
          <div className="text-dcx-md-plus font-semibold text-white">{channel.label} / {composition.name}</div>
        </div>
        <button type="button" className="text-dcx-xs text-sky-300" onClick={onBack}>Back</button>
      </div>

      <div className="space-y-1">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center justify-between rounded-md bg-white/5 px-2 py-1.5 text-dcx-xs">
            <span className="text-white">{subtask.label}</span>
            <span className="text-neutral-400">{subtask.estimatedMinutes ?? '-'} min</span>
          </div>
        ))}
      </div>

      <button type="button" className="w-full rounded-lg bg-sky-500 px-3 py-2 text-dcx-xs font-bold text-white" onClick={onConfirm}>
        Create task
      </button>
    </div>
  );
}
