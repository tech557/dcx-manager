import type { ApiChannel, ApiChannelComposition } from '@/types/api';
import { Select } from '@/ui/forms/selects';

interface ChannelCompositionFieldsProps {
  id: string;
  channelId: string | null;
  compositionId: string | null;
  channels: ApiChannel[];
  compositions: ApiChannelComposition[];
  onChannelChange: (channelId: string) => void;
  onCompositionChange: (compositionId: string) => void;
}

export function ChannelCompositionFields({
  id,
  channelId,
  compositionId,
  channels,
  compositions,
  onChannelChange,
  onCompositionChange,
}: ChannelCompositionFieldsProps) {
  const channelOptions = channels.map((channel) => ({
    value: channel.id,
    label: channel.label,
    description: `${channel.availableCompositionIds?.length || 0} layouts`,
  }));
  const compositionOptions = [
    { value: 'freeform', label: 'Freeform / Custom', description: 'Manual ad-hoc workflow tasks' },
    ...compositions.map((composition) => ({
      value: composition.id,
      label: composition.name,
      description: `${composition.definitionIds?.length || 0} task steps`,
    })),
  ];

  return (
    <div className="space-y-3">
      <div>
        <label className="text-dcx-3xs-plus font-mono tracking-wider uppercase text-white/30 block mb-1">
          Active Channel
        </label>
        <Select
          id={`popover-channel-${id}`}
          value={channelId}
          options={channelOptions}
          onChange={onChannelChange}
          placeholder="Pick target channel..."
          className="w-full text-dcx-sm"
        />
      </div>
      <div>
        <label className="text-dcx-3xs-plus font-mono tracking-wider uppercase text-white/30 block mb-1">
          Template Composition
        </label>
        <Select
          id={`popover-compo-${id}`}
          value={compositionId || 'freeform'}
          options={compositionOptions}
          onChange={onCompositionChange}
          placeholder="Freeform template..."
          className="w-full text-dcx-sm"
        />
      </div>
    </div>
  );
}
