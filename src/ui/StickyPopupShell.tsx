import React from 'react';
import { Minimize2, X } from 'lucide-react';

interface StickyPopupShellProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function StickyPopupShell({
  isOpen,
  onClose,
  onMinimize,
  isMinimized = false,
  title = 'Preview',
  children,
  className = '',
  style
}: StickyPopupShellProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-[18%] left-[50%] -translate-x-1/2 z-50 w-[560px] h-[420px] max-w-[90vw] max-h-[75vh] resize overflow-hidden shadow-2xl rounded-2xl border border-white/10 glass bg-[var(--theme-surface-deep)]/90 backdrop-blur-xl flex flex-col transition-all duration-300 ${className}`}
      role="dialog"
      aria-label={title}
      style={{
        ...style,
        height: isMinimized ? '40px' : style?.height || undefined,
        minHeight: isMinimized ? '40px' : '200px',
        resize: isMinimized ? 'none' : 'both',
      }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.02] shrink-0 select-none">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)] font-mono truncate">{title}</div>
        <div className="flex items-center gap-1.5">
          {onMinimize && (
            <button
              type="button"
              aria-label={isMinimized ? 'Restore' : 'Minimize'}
              onClick={onMinimize}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-4 min-h-0 text-white text-xs">
          {children}
        </div>
      )}
    </div>
  );
}
