import { useState, useRef, useEffect } from 'react';
import { useChannelsQuery, useCompositionsQuery } from '@/queries/channels.queries';
import { getChannelIcon } from '@/builder/shared/channel.icons';
import { ChevronDown, BookOpen, Layers, X } from 'lucide-react';
import { ChannelCompositionFields } from './ChannelCompositionFields';
import { CompositionLibraryModal, type CompositionLibraryItem } from './CompositionLibraryModal';
import { useToggle } from '@/hooks/useToggle';
import { createElement } from 'react';

interface InlineChannelCompositionSelectorProps {
  id: string;
  channelId: string | null;
  compositionId: string | null;
  onChannelChange: (newChannelId: string) => void;
  onCompositionChange: (newCompositionId: string | null) => void;
  disabled?: boolean;
}

export function InlineChannelCompositionSelector({
  id,
  channelId,
  compositionId,
  onChannelChange,
  onCompositionChange,
  disabled = false,
}: InlineChannelCompositionSelectorProps) {
  const [isOpen, toggleOpen, , closeOpen] = useToggle();
  const [showRegistry, , openRegistry, closeRegistry] = useToggle();
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: channels = [] } = useChannelsQuery();
  const { data: compositions = [] } = useCompositionsQuery(channelId || '');

  // Flattened query to retrieve ALL compositions across all channels for library reference
  const activeComposition = compositions.find((comp) => comp.id === compositionId);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeOpen();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOpen]);

  const handleChannelSelect = (newChannel: string) => {
    onChannelChange(newChannel);
  };

  const handleCompositionSelect = (newComp: string) => {
    const value = newComp === 'freeform' ? null : newComp;
    onCompositionChange(value);
    closeOpen();
  };

  // Icon Components
  const ChannelIcon = channelId ? getChannelIcon(channelId) : getChannelIcon('default');

  // Logic for Compositions Library (Lookup all compositions)
  const allCompositionsList = channels.flatMap((ch) => {
    // For each channel we fetch compositions in a real app, since we are offline/static cached we can rebuild mapping from the MOCK data.
    // Let's build lookup items
    const compIds = ch.availableCompositionIds || [];
    return compIds.map((cid) => {
      // Find composition definition if available
      let compName = cid.replace('comp-', '').replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
      let stepsCount = 3;
      if (cid.includes('short')) {
        compName = 'Short-form Email';
        stepsCount = 2;
      } else if (cid.includes('std') && ch.id === 'email') {
        compName = 'Standard Email';
        stepsCount = 3;
      } else if (ch.id === 'sms') {
        compName = 'Standard SMS';
        stepsCount = 2;
      } else if (ch.id === 'social') {
        compName = 'Standard Social Post';
        stepsCount = 4;
      } else if (ch.id === 'intranet') {
        compName = 'Standard Intranet Post';
        stepsCount = 4;
      } else if (ch.id === 'meeting') {
        compName = 'Standard Meeting';
        stepsCount = 3;
      } else if (ch.id === 'feedback') {
        compName = 'Standard Feedback Form';
        stepsCount = 2;
      }

      return {
        id: cid,
        channelId: ch.id,
        channelName: ch.label,
        name: compName,
        stepsCount,
      };
    });
  });

  const selectLibraryItem = (item: CompositionLibraryItem) => {
    onChannelChange(item.channelId);
    onCompositionChange(item.id);
    closeRegistry();
    closeOpen();
  };

  return (
    <div ref={containerRef} className="relative inline-block" id={`inline-nested-trigger-${id}`}>
      {/* Display Brand Metadata below task name */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className="group flex items-center gap-1 text-dcx-2xs-plus font-light text-neutral-400 hover:text-sky-300 transition-colors font-mono border-0 bg-transparent outline-none cursor-pointer py-0.5 select-none tracking-normal"
      >
        {createElement(ChannelIcon, { className: 'w-3 h-3 text-[var(--theme-accent)]/80 group-hover:scale-105 transition-transform shrink-0' })}
        <span className="normal-case text-neutral-300 font-light group-hover:text-[var(--theme-accent)] transition-colors">
          {activeComposition ? activeComposition.name : 'Freeform / Custom'}
        </span>
        <ChevronDown className="w-2.5 h-2.5 text-white/20 group-hover:text-sky-300/60 shrink-0" />
      </button>

      {/* Branded Popover Inline Editor */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-72 rounded-xl bg-neutral-950 border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.8)] z-50 p-3 space-y-3.5 text-left animate-fade-in font-sans"
          id={`inline-nested-popover-${id}`}
        >
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-dcx-2xs-plus font-mono tracking-wider uppercase text-neutral-400 font-bold">
              Channel & Layout Setup
            </span>
            <button
              onClick={closeOpen}
              className="text-neutral-500 hover:text-white"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <ChannelCompositionFields
            id={id}
            channelId={channelId}
            compositionId={compositionId}
            channels={channels}
            compositions={compositions}
            onChannelChange={handleChannelSelect}
            onCompositionChange={handleCompositionSelect}
          />

          {/* Composition Library Popup trigger button */}
          <div className="pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                openRegistry();
                closeOpen();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 bg-sky-500/5 hover:bg-sky-500/10 text-sky-300 hover:text-sky-200 border border-sky-400/10 hover:border-sky-400/20 rounded-md text-dcx-xs font-mono font-bold transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-[var(--theme-accent)]" />
                Compositions Library
              </span>
              <Layers className="w-3 h-3 text-neutral-500" />
            </button>
          </div>
        </div>
      )}

      {/* Composition Registry Library Modal Popup */}
      {showRegistry && (
        <CompositionLibraryModal
          items={allCompositionsList}
          searchQuery={searchQuery}
          channelId={channelId}
          compositionId={compositionId}
          onSearchChange={setSearchQuery}
          onSelect={selectLibraryItem}
          onClose={closeRegistry}
        />
      )}
    </div>
  );
}
