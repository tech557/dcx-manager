import { AlertTriangle, Check, X } from 'lucide-react';
import type { Version } from '@/types/domain';

interface ApprovalConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  version: Version;
  siblings: Version[];
}

export function ApprovalConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  version,
  siblings,
}: ApprovalConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  const activeSiblings = siblings.filter(
    (s) => s.id !== version.id && s.status !== 'Superseded'
  );

  return (
    <div
      className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      id="approval-confirm-modal-overlay"
    >
      <div
        className="w-full max-w-md bg-[var(--theme-glass-bg)] border border-white/10 rounded-2xl p-6 shadow-2xl text-white/90 animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="approval-modal-title"
        id="approval-confirm-modal"
      >
        <div className="flex items-start gap-4" id="approval-modal-header">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 id="approval-modal-title" className="text-sm font-bold text-white">
              Approve Version {version.versionNumber}
            </h4>
            <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
              Are you sure you want to approve this version? Setting this version to Approved will automatically transition and lock all other active sub-versions under this project to <strong>Superseded</strong>.
            </p>
          </div>
        </div>

        {activeSiblings.length > 0 && (
          <div className="mt-4 border border-white/5 bg-white/[0.01] rounded-xl p-3" id="approval-modal-affected">
            <p className="text-dcx-xs font-mono font-bold text-white/40 uppercase mb-2">
              Affected Alternative Versions ({activeSiblings.length})
            </p>
            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {activeSiblings.map((sibling) => (
                <div
                  key={sibling.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0"
                >
                  <span className="font-semibold text-white/70">
                    Version {sibling.versionNumber}
                  </span>
                  <span className="text-dcx-xs uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                    {sibling.status} → Superseded
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-5" id="approval-modal-footer">
          <button
            type="button"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            onClick={onConfirm}
            id="btn-confirm-approval"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve &amp; Lock Project</span>
          </button>
          <button
            type="button"
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
            onClick={onClose}
            id="btn-cancel-approval"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
