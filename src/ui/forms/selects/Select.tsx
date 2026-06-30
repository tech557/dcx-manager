import React, { useEffect, useRef } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useToggle } from '@/hooks/useToggle';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface SelectProps {
  id: string;
  value: string | null;
  options: SelectOption[];
  onChange: (newValue: string) => void;
  onQuickAdd?: () => void;
  quickAddLabel?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  id,
  value,
  options,
  onChange,
  onQuickAdd,
  quickAddLabel = 'Quick Add...',
  placeholder = 'Select option...',
  className = '',
  disabled = false,
}: SelectProps) {
  const [isOpen, toggleOpen, , closeOpen] = useToggle();
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeOpen();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    closeOpen();
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left min-w-[120px] select-none ${className}`}
      id={`select-container-${id}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className="w-full flex items-center justify-between gap-1 text-dcx-sm font-mono font-medium rounded px-1.5 py-0.5 border-0 border-none bg-transparent hover:bg-white/[0.04] transition-all duration-150 outline-none cursor-pointer text-neutral-300 hover:text-sky-300 disabled:opacity-40 disabled:cursor-not-allowed"
        id={`select-button-${id}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : <span className="text-neutral-500 italic">{placeholder}</span>}
        </span>
        <ChevronDown className="w-3 h-3 text-neutral-500 shrink-0" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-1 w-56 rounded-md bg-neutral-950 border border-white/10 shadow-2xl z-50 py-1.5 focus:outline-none max-h-60 overflow-y-auto scrollbar-thin overflow-x-hidden animate-fade-in"
          id={`select-dropdown-${id}`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-2.5 py-1.5 text-dcx-xs-plus font-mono flex flex-col hover:bg-white/[0.06] transition-colors focus:outline-none cursor-pointer ${
                opt.value === value ? 'text-sky-300 bg-sky-500/10' : 'text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {opt.label}
              </div>
              {opt.description && (
                <span className="text-dcx-3xs-plus text-neutral-500 mt-0.5 truncate max-w-full">
                  {opt.description}
                </span>
              )}
            </button>
          ))}

          {options.length === 0 && (
            <div className="px-2.5 py-1.5 text-dcx-xs text-neutral-500 italic font-mono">
              No options available
            </div>
          )}

          {onQuickAdd && (
            <div className="border-t border-white/5 mt-1.5 pt-1.5 px-1">
              <button
                type="button"
                onClick={() => {
                  onQuickAdd();
                  closeOpen();
                }}
                className="w-full flex items-center gap-1 px-2 py-1 text-dcx-2xs-plus font-mono text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span className="font-bold">{quickAddLabel}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
