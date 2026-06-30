import React from 'react';
import { Trash, X, Maximize2, Minimize2, Copy } from 'lucide-react';

export interface SelectionButtonsProps {
  hasSelection: boolean;
  allTargetedAreExpanded: boolean;
  allTargetedAreCollapsed: boolean;
  handleExpandAllSelected: () => void;
  handleCollapseAllSelected: () => void;
  handleDuplicateSelected: () => void;
  handleDeleteSelected: () => void;
  handleClearSelection: () => void;
}

export function SelectionButtons({
  hasSelection,
  allTargetedAreExpanded,
  allTargetedAreCollapsed,
  handleExpandAllSelected,
  handleCollapseAllSelected,
  handleDuplicateSelected,
  handleDeleteSelected,
  handleClearSelection,
}: SelectionButtonsProps) {
  return (
    <div className="flex items-center gap-1.5 ml-2">
      {/* Expand button */}
      <button
        type="button"
        onClick={handleExpandAllSelected}
        disabled={allTargetedAreExpanded}
        className={`p-1.5 rounded-full transition cursor-pointer select-none ${
          allTargetedAreExpanded
            ? 'opacity-20 cursor-not-allowed text-neutral-400'
            : 'hover:bg-white/10 dark:hover:bg-white/5 text-neutral-400 dark:text-neutral-500 hover:text-white'
        }`}
        title={hasSelection ? "Expand selected recursively" : "Expand all"}
        id="btn-selection-expand"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Collapse button */}
      <button
        type="button"
        onClick={handleCollapseAllSelected}
        disabled={allTargetedAreCollapsed}
        className={`p-1.5 rounded-full transition cursor-pointer select-none ${
          allTargetedAreCollapsed
            ? 'opacity-20 cursor-not-allowed text-neutral-400'
            : 'hover:bg-white/10 dark:hover:bg-white/5 text-neutral-400 dark:text-neutral-500 hover:text-white'
        }`}
        title={hasSelection ? "Collapse selected recursively" : "Collapse all"}
        id="btn-selection-collapse"
      >
        <Minimize2 className="w-4 h-4" />
      </button>

      {hasSelection && (
        <div className="flex items-center gap-1.5 ml-1 pl-3 border-l border-white/10 dark:border-white/5">
          {/* Duplicate Selection button */}
          <button
            type="button"
            onClick={handleDuplicateSelected}
            className="p-1.5 rounded-full hover:bg-[var(--theme-accent)]/20 text-[var(--theme-accent)]/80 hover:text-[var(--theme-accent)] transition flex items-center justify-center cursor-pointer"
            title="Duplicate Selection"
            id="btn-selection-duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete Selection button */}
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="p-1.5 rounded-full hover:bg-rose-500/20 text-rose-450 dark:text-rose-400 transition flex items-center justify-center cursor-pointer"
            title="Delete Selection (Requires confirmation if multiple or ready)"
            id="btn-selection-delete"
          >
            <Trash className="w-3.5 h-3.5" />
          </button>

          {/* Clear selection button */}
          <button
            type="button"
            onClick={handleClearSelection}
            className="p-1.5 rounded-full hover:bg-white/10 dark:text-neutral-400 hover:text-white transition flex items-center justify-center cursor-pointer"
            title="Clear Selection (Esc)"
            id="btn-selection-clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
