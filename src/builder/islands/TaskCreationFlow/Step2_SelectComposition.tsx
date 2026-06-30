import type { ApiChannel, ApiChannelComposition } from '@/types/api';

interface Step2SelectCompositionProps {
  channel: ApiChannel;
  compositions: ApiChannelComposition[];
  isLoading: boolean;
  onBack: () => void;
  onCreateNew: () => void;
  onSelect: (composition: ApiChannelComposition) => void;
}

export function Step2SelectComposition({
  channel,
  compositions,
  isLoading,
  onBack,
  onCreateNew,
  onSelect,
}: Step2SelectCompositionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-dcx-sm font-bold uppercase text-neutral-400">Select composition</div>
          <div className="text-dcx-md-plus font-semibold text-white">{channel.label}</div>
        </div>
        <button type="button" className="text-dcx-xs text-sky-300" onClick={onBack}>Back</button>
      </div>

      {isLoading ? <div className="text-dcx-xs text-neutral-400">Loading compositions...</div> : null}

      <div className="space-y-2">
        {compositions.map((composition) => (
          <button
            key={composition.id}
            type="button"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10"
            onClick={() => onSelect(composition)}
          >
            <span className="block text-dcx-md-plus font-semibold text-white">{composition.name}</span>
            <span className="text-dcx-xs text-neutral-400">{composition.definitionIds.length} subtasks</span>
          </button>
        ))}
      </div>

      <button type="button" className="w-full rounded-lg border border-sky-400/30 px-3 py-2 text-dcx-xs font-bold text-sky-200" onClick={onCreateNew}>
        Create new composition
      </button>
    </div>
  );
}
