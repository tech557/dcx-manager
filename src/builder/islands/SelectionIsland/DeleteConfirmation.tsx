import React from 'react';
import { Trash2 } from 'lucide-react';
import { GlassSurface } from '@/ui/surfaces/GlassSurface';

export interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  count: number;
}

export function DeleteConfirmation({ onConfirm, onCancel, count }: DeleteConfirmationProps) {
  return (
    <div className="flex items-center" id="delete-confirmation-panel">
      <GlassSurface
        radius="sm"
        intensity="medium"
        className="bg-[var(--theme-error-deep-bg)]/80 border border-rose-500/25 text-rose-300 px-3 py-1 flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-200"
      >
        <div className="flex items-center gap-1.5 text-dcx-xs font-mono tracking-tight font-semibold">
          <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>CONFIRM DELETE ({count})?</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onConfirm}
            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-black text-dcx-xs font-bold transition cursor-pointer font-mono"
            id="btn-confirm-delete"
          >
            DELETE
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-dcx-xs font-semibold transition cursor-pointer border border-white/10 font-mono"
            id="btn-cancel-delete"
          >
            CANCEL
          </button>
        </div>
      </GlassSurface>
    </div>
  );
}
