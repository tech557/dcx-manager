import { X } from 'lucide-react';
import type { HomeFilterState } from './HomeVersionList';

export interface SavedView {
  id: string;
  name: string;
  filters: HomeFilterState;
}

interface HomeSavedViewsProps {
  savedViews: SavedView[];
  activeViewId: string | null;
  onSelectView: (view: SavedView) => void;
  onDeleteView: (id: string) => void;
  onSaveCurrentView: () => void;
  canSave: boolean;
}

export function HomeSavedViews({
  savedViews,
  activeViewId,
  onSelectView,
  onDeleteView,
  onSaveCurrentView,
  canSave,
}: HomeSavedViewsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {savedViews.map((view) => (
        <div
          key={view.id}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-dcx-2xs font-semibold border transition-all duration-150 ${
            activeViewId === view.id
              ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)]/40 text-[var(--theme-accent)]'
              : 'bg-transparent border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:border-[var(--theme-accent)]/30'
          }`}
        >
          <button
            type="button"
            onClick={() => onSelectView(view)}
            className="focus-visible:outline-none"
            aria-pressed={activeViewId === view.id}
          >
            {view.name}
          </button>
          {!['view-all', 'view-active'].includes(view.id) && (
            <button
              type="button"
              onClick={() => onDeleteView(view.id)}
              className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
              aria-label={`Delete view ${view.name}`}
            >
              <X size={10} />
            </button>
          )}
        </div>
      ))}
      {canSave && (
        <button
          type="button"
          onClick={onSaveCurrentView}
          className="px-2.5 py-1 rounded-full text-dcx-2xs font-semibold border border-dashed border-[var(--theme-border)] text-[var(--theme-text-secondary)]/60 hover:border-[var(--theme-accent)]/40 hover:text-[var(--theme-accent)] transition-all duration-150"
        >
          + Save view
        </button>
      )}
    </div>
  );
}
