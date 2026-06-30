import React, { forwardRef } from 'react';

interface QuickEditTriggerProps {
  label: string;
  value: string;
  status: 'empty' | 'filled' | 'not-needed' | 'neutral';
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const QuickEditTrigger = forwardRef<HTMLButtonElement, QuickEditTriggerProps>(
  ({ label, value, status, onClick, icon, className = '' }, ref) => {
    // Determine dynamic background, border and text accents depending on state
    let stateStyles = '';
    if (status === 'empty') {
      stateStyles = 'bg-amber-500/10 border-amber-500/15 hover:border-amber-500/35 text-amber-500';
    } else if (status === 'filled') {
      stateStyles = 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/15 hover:border-[var(--theme-accent)]/35 text-[var(--theme-accent)]';
    } else if (status === 'not-needed') {
      stateStyles = 'bg-white/5 border-white/5 hover:border-white/20 text-neutral-400';
    } else {
      stateStyles = 'bg-white/5 border-white/5 hover:border-white/15 text-neutral-300';
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`group flex items-center gap-1 text-dcx-2xs font-mono py-0.5 px-2 rounded-full border transition-all duration-200 uppercase tracking-tight font-black select-none cursor-pointer outline-none ${stateStyles} ${className}`}
        id={`quick-edit-trigger-${label.replace(/\s+/g, '-').toLowerCase()}`}
      >
        {icon && <span className="opacity-80 group-hover:scale-105 transition-transform duration-200 shrink-0">{icon}</span>}
        <span className="opacity-60 font-sans tracking-widest">{label}:</span>
        <span className="truncate max-w-[65px]">{value}</span>
      </button>
    );
  }
);

QuickEditTrigger.displayName = 'QuickEditTrigger';
