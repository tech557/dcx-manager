import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { PendingAction } from '@/builder/stage/stageContext.types';

interface UnsavedChangesModalProps {
  pendingAction: PendingAction | null;
  handleProceedPending: (shouldSave: boolean) => void;
  handleCancelPending: () => void;
}

export function UnsavedChangesModal({
  pendingAction,
  handleProceedPending,
  handleCancelPending,
}: UnsavedChangesModalProps) {
  if (!pendingAction) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        id="unsaved-changes-dialog"
        className="w-full max-w-sm bg-[var(--theme-glass-bg)] border border-white/10 rounded-2xl p-6 shadow-2xl text-white/90 animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsaved-guard-title"
      >
        <div className="flex gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <h4 id="unsaved-guard-title" className="text-sm font-bold text-white">
              Unsaved Draft Changes
            </h4>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">
              You have unsaved changes in the editor. Leave and discard your current modifications?
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <button
            type="button"
            className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold rounded-lg transition-colors cursor-pointer"
            onClick={() => handleProceedPending(true)}
          >
            Save & Proceed
          </button>
          <button
            type="button"
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10 cursor-pointer"
            onClick={() => handleProceedPending(false)}
          >
            Discard & Proceed
          </button>
          <button
            type="button"
            className="w-full py-3 bg-transparent text-white/40 hover:text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            onClick={handleCancelPending}
          >
            Keep Editing
          </button>
        </div>
      </div>
    </div>
  );
}
