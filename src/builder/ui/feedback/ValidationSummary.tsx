import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ValidationSummaryProps {
  isOpen: boolean;
  issues: string[];
  onClose: () => void;
  onFocusIssue?: (path: string) => void;
}

export function ValidationSummary({ isOpen, issues, onClose, onFocusIssue }: ValidationSummaryProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Validation issues" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden />
      <div className="bg-white dark:bg-gray-900 rounded shadow-lg p-4 w-[560px] max-w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">Validation Issues</h3>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-gray-100" aria-label="Close validation dialog">
            <X />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto text-sm text-neutral-800 dark:text-neutral-200">
          {issues.length === 0 ? (
            <div className="text-neutral-500">No issues found.</div>
          ) : (
            <ul>
              {issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 py-1">
                  <div className="w-3 h-3 rounded-full bg-amber-400 mt-1" />
                  <div className="flex-1">
                    <div className="truncate">{issue}</div>
                    {onFocusIssue && (
                      <button
                        type="button"
                        className="text-xs text-sky-500 hover:underline mt-1"
                        onClick={() => onFocusIssue(issue)}
                        aria-label={`Focus ${issue}`}
                      >
                        Focus
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button type="button" className="px-3 py-1 rounded bg-neutral-800 text-white" onClick={onClose} aria-label="Close">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
