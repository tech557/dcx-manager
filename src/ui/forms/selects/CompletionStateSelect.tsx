import React, { useState, useEffect } from 'react';
import type { ApiFieldCompletionState } from '@/types/api';
import { Circle, CheckCircle2, HelpCircle } from 'lucide-react';

interface CompletionStateSelectProps {
  label: string;
  value?: ApiFieldCompletionState;
  onChange: (val: ApiFieldCompletionState) => void;
  placeholder?: string;
}

export function CompletionStateSelect({
  label,
  value = { status: 'empty' },
  onChange,
  placeholder = 'Add details...',
}: CompletionStateSelectProps) {
  const [details, setDetails] = useState('');

  // Sync internal details state on external value changes
  useEffect(() => {
    if (value.status === 'filled') {
      // Mirror externally loaded field details into the local textarea draft.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDetails(value.value || '');
    } else {
      setDetails('');
    }
  }, [value]);

  const handleStatusChange = (status: 'filled' | 'not-needed' | 'empty') => {
    if (status === 'filled') {
      onChange({ status: 'filled', value: details });
    } else {
      onChange({ status });
    }
  };

  const handleDetailsChange = (newVal: string) => {
    setDetails(newVal);
    onChange({ status: 'filled', value: newVal });
  };

  return (
    <div className="space-y-3.5 select-none text-left" id={`completion-select-${label.replace(/\s+/g, '-').toLowerCase()}`}>
      {/* Label Title */}
      <div>
        <span className="text-dcx-2xs font-black tracking-[0.15em] font-sans uppercase opacity-50 block leading-none mb-2">
          {label}
        </span>

        {/* 3-Way Segmented Controller */}
        <div className="grid grid-cols-3 gap-1 bg-black/30 p-1 rounded-xl border border-white/5">
          {/* Empty Status */}
          <button
            type="button"
            onClick={() => handleStatusChange('empty')}
            className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg border text-center transition-all duration-200 outline-none select-none cursor-pointer ${
              value.status === 'empty'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
                : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Circle className="w-3.5 h-3.5 mb-1 shrink-0" />
            <span className="text-dcx-2xs font-mono leading-none">Awaiting</span>
          </button>

          {/* Filled Status */}
          <button
            type="button"
            onClick={() => handleStatusChange('filled')}
            className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg border text-center transition-all duration-200 outline-none select-none cursor-pointer ${
              value.status === 'filled'
                ? 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/30 text-[var(--theme-accent)] font-bold'
                : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mb-1 shrink-0" />
            <span className="text-dcx-2xs font-mono leading-none">Resolved</span>
          </button>

          {/* Not-Needed Status */}
          <button
            type="button"
            onClick={() => handleStatusChange('not-needed')}
            className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg border text-center transition-all duration-200 outline-none select-none cursor-pointer ${
              value.status === 'not-needed'
                ? 'bg-white/10 border-white/10 text-neutral-300 font-bold'
                : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 mb-1 shrink-0" />
            <span className="text-dcx-2xs font-mono leading-none">Excluded</span>
          </button>
        </div>
      </div>

      {/* Conditionally Editable Details text block for 'filled' state */}
      {value.status === 'filled' && (
        <div className="space-y-1 animate-[fadeIn_0.15s_ease-out]">
          <span className="text-dcx-3xs font-black tracking-wider text-neutral-400 font-sans uppercase">
            Detailed Metrics & Specs
          </span>
          <textarea
            value={details}
            onChange={(e) => handleDetailsChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs px-2.5 py-2 rounded-xl outline-none focus:border-[var(--theme-accent)] transition-all resize-none placeholder-neutral-500 [scrollbar-width:thin]"
          />
        </div>
      )}
    </div>
  );
}
