import { BookOpen, HelpCircle, Search, X } from 'lucide-react';
import { getChannelIcon } from '@/builder/shared/channel.icons';

export interface CompositionLibraryItem {
  id: string;
  channelId: string;
  channelName: string;
  name: string;
  stepsCount: number;
}

interface CompositionLibraryModalProps {
  items: CompositionLibraryItem[];
  searchQuery: string;
  channelId: string | null;
  compositionId: string | null;
  onSearchChange: (query: string) => void;
  onSelect: (item: CompositionLibraryItem) => void;
  onClose: () => void;
}

export function CompositionLibraryModal({
  items,
  searchQuery,
  channelId,
  compositionId,
  onSearchChange,
  onSelect,
  onClose,
}: CompositionLibraryModalProps) {
  const query = searchQuery.toLowerCase();
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query)
    || item.channelName.toLowerCase().includes(query)
    || item.id.toLowerCase().includes(query),
  );

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-white/15 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl font-sans">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div>
            <h4 className="text-sm font-semibold font-mono text-neutral-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--theme-accent)]" />
              Compositions Registry Library
            </h4>
            <p className="text-dcx-xs text-neutral-500 font-mono mt-0.5">
              Browse and load pre-configured multi-step marketing campaign patterns.
            </p>
          </div>
          <button type="button" aria-label="Close compositions library" onClick={onClose} className="text-neutral-400 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search templates or channels..."
            className="w-full bg-black/40 border border-white/10 text-xs text-white rounded-lg pl-8 pr-3 py-2.5 font-mono"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const Icon = getChannelIcon(item.channelId);
            const isCurrent = item.channelId === channelId && item.id === compositionId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-sky-500/10 border-sky-400/30 text-sky-300'
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10 text-neutral-300'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="p-1.5 rounded bg-black/40 border border-white/5 shrink-0">
                    <Icon className="w-4 h-4 text-sky-400" />
                  </span>
                  <span className="min-w-0">
                    <span className="text-dcx-xs font-mono font-extrabold uppercase text-white/30 block">{item.channelName}</span>
                    <span className="text-dcx-md font-bold truncate block">{item.name}</span>
                  </span>
                </span>
                <span className="text-dcx-2xs-plus text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md">
                  {item.stepsCount} system tasks
                </span>
              </button>
            );
          })}
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-neutral-500 text-dcx-sm font-mono">No matching compositions found.</div>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-white/10 text-dcx-xs font-mono text-neutral-500">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Choosing a template generates default subtask checklists.
          </span>
          <button type="button" onClick={onClose} className="bg-white/10 hover:bg-white/15 text-white text-dcx-sm px-3 py-1 rounded-md">
            Close Library
          </button>
        </div>
      </div>
    </div>
  );
}

