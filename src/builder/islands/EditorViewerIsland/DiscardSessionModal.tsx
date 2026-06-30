import { AlertTriangle } from 'lucide-react';

interface DiscardSessionModalProps {
  sessionToDiscard: unknown;
  confirmDiscardSession: () => void;
  cancelDiscardSession: () => void;
}

export function DiscardSessionModal({ sessionToDiscard, confirmDiscardSession, cancelDiscardSession }: DiscardSessionModalProps) {
  if (!sessionToDiscard) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" id="discard-session-modal">
      <div
        id="discard-session-dialog"
        className="w-full max-w-sm bg-[var(--theme-glass-bg)] border border-white/10 rounded-2xl p-6 shadow-2xl text-white/90 animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">
              Discard Session Draft?
            </h4>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">
              This session has unsaved changes. Closing it will discard your modifications forever.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <button
            type="button"
            className="w-full py-2 bg-rose-500 hover:bg-rose-400 text-black text-xs font-bold rounded-lg transition-colors cursor-pointer"
            onClick={confirmDiscardSession}
          >
            Discard & Close
          </button>
          <button
            type="button"
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10 cursor-pointer"
            onClick={cancelDiscardSession}
          >
            Keep Session
          </button>
        </div>
      </div>
    </div>
  );
}
