import { getChannelIcon } from '@/builder/shared/channel.icons';
import { Chip } from '@/ui/atoms/Chip';
import { createElement } from 'react';

interface ChannelPillProps {
  channelId: string;
  className?: string;
}

export function ChannelPill({ channelId, className = '' }: ChannelPillProps) {
  const Icon = getChannelIcon(channelId);
  const displayLabel = channelId || 'UNSET';

  return (
    <Chip
      as="span"
      label={displayLabel}
      icon={createElement(Icon, { className: 'h-3 w-3 text-sky-400' })}
      size="sm"
      className={`channel-pill ${className}`}
      id={`channel-pill-${channelId}`}
    />
  );
}
