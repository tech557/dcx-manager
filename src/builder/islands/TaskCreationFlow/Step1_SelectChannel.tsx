import type { ApiChannel } from '@/types/api';

interface Step1SelectChannelProps {
  channels: ApiChannel[];
  isLoading: boolean;
  onSelect: (channel: ApiChannel) => void;
}

export function Step1SelectChannel({ channels, isLoading, onSelect }: Step1SelectChannelProps) {
  if (isLoading) {
    return <div className="text-dcx-xs text-neutral-400">Loading channels...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="text-dcx-sm font-bold uppercase text-neutral-400">Select channel</div>
      <div className="grid grid-cols-2 gap-2">
        {channels.map((channel) => (
          <button
            key={channel.id}
            type="button"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10"
            onClick={() => onSelect(channel)}
          >
            <span className="block text-dcx-md-plus font-semibold text-white">{channel.label}</span>
            <span className="text-dcx-xs text-neutral-400">{channel.availableCompositionIds.length} compositions</span>
          </button>
        ))}
      </div>
    </div>
  );
}
