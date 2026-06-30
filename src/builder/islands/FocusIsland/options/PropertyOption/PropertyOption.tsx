import React, { useState, useEffect, useRef } from 'react';
import { Sliders, ArrowLeft, Check, ArrowRight } from 'lucide-react';
import { useStageContext } from '@/builder/stage/StageProvider';
import { PopoverShell } from '@/ui/PopoverShell';
import { useTheme } from '@/hooks/useTheme';
import { getAllTasks } from '@/utils/node.helpers';
import { useToggle } from '@/hooks/useToggle';

type PropertyKey = 'senderId' | 'receiverId';

interface PropertyOptionProps {
  id?: string;
  activeProperty: { key: PropertyKey; val: string } | null;
  setActiveProperty: (prop: { key: PropertyKey; val: string } | null) => void;
  focusMode: 'and' | 'or';
}

// Predefined human-friendly labels for property segments
const PREDEFINED_SEGMENTS: Record<string, string> = {
  MARKETING_SYS: 'Marketing Core',
  BILLING_GATEWAY: 'Billing System',
  CRM_CLIENT: 'CRM Sync Tool',
  CUSTOMER_MOBILE: 'Mobile App Tiers',
  SUBSCRIBER_EMAIL: 'Bulk Email list',
  GLOBAL_AUDIENCE: 'All Registered Audiences',
};

export function PropertyOption({
  id = 'focus-option-property',
  activeProperty,
  setActiveProperty,
  focusMode: _focusMode,
}: PropertyOptionProps) {
  const { nodes } = useStageContext();
  const { isDark } = useTheme();
  
  const [isOpen, toggleOpen, , closeOpen] = useToggle();
  const [selectedKey, setSelectedKey] = useState<PropertyKey | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeOpen();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOpen]);

  // Reset selected key on open / close transition
  useEffect(() => {
    if (!isOpen) {
      // Reset the two-step property picker when its popover closes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedKey(null);
    }
  }, [isOpen]);

  const taskNodes = getAllTasks(nodes);

  // Discover all unique values used for a given property key in task nodes
  const getUniqueValues = (key: PropertyKey) => {
    return Array.from(
      new Set(
        taskNodes
          .map((task) => {
            const val = task[key];
            return typeof val === 'string' ? val : '';
          })
          .filter((val) => val !== '')
      )
    );
  };

  // Group task IDs by property valuation
  const getTasksWithVal = (key: PropertyKey, val: string) => {
    return taskNodes.filter((task) => task[key] === val);
  };

  const handleValueSelect = (key: PropertyKey, val: string) => {
    setActiveProperty({ key, val });
    closeOpen();
  };

  const activePropSelection = activeProperty;

  return (
    <div ref={containerRef} className="relative flex items-center justify-center" id={id}>
      <button
        type="button"
        onClick={toggleOpen}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border cursor-pointer relative ${
          isOpen
            ? 'bg-[var(--theme-accent)]/20 border-[var(--theme-accent)]/40 text-white shadow-[0_0_12px_var(--theme-accent-bg)]'
            : activePropSelection !== null
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_var(--theme-success-bg)]'
            : isDark
            ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/85'
            : 'bg-black/5 hover:bg-neutral-100 border-black/15 hover:border-neutral-300 text-black/85'
        }`}
        title={`Focus by Property${
          activePropSelection !== null
            ? ` (${activePropSelection.key === 'senderId' ? 'Sender' : 'Receiver'}: ${
                PREDEFINED_SEGMENTS[activePropSelection.val] || activePropSelection.val
              })`
            : ''
        }`}
        id={`${id}-trigger`}
      >
        <Sliders size={18} className={activePropSelection !== null ? 'text-emerald-400' : 'text-white'} />
        
        {/* Active Property indicator dot */}
        {activePropSelection !== null && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <PopoverShell
          width="w-[230px]"
          className="absolute right-[115%] top-0 p-3.5 text-left animate-fade-in shadow-2xl border border-white/10 bg-zinc-950/95"
        >
          <div className="space-y-3" id={`${id}-popover-content`}>
            {/* Step 1: No selected key yet */}
            {selectedKey === null ? (
              <>
                <div className="pb-1.5 border-b border-white/5">
                  <span className="text-dcx-2xs uppercase tracking-wider font-mono text-neutral-400 font-extrabold">
                    Select Filter Field
                  </span>
                </div>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedKey('senderId')}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs hover:bg-white/5 text-neutral-300 hover:text-white transition-colors cursor-pointer group text-left border border-white/5"
                  >
                    <div>
                      <h5 className="font-bold">Sender Gateway</h5>
                      <span className="text-dcx-2xs text-neutral-500">Filter by system sources</span>
                    </div>
                    <ArrowRight size={14} className="text-neutral-500 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedKey('receiverId')}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs hover:bg-white/5 text-neutral-300 hover:text-white transition-colors cursor-pointer group text-left border border-white/5"
                  >
                    <div>
                      <h5 className="font-bold">Receiver Target</h5>
                      <span className="text-dcx-2xs text-neutral-500">Filter by audience targets</span>
                    </div>
                    <ArrowRight size={14} className="text-neutral-500 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </>
            ) : (
              /* Step 2: List unique segment parameters for key */
              <>
                <div className="pb-1.5 border-b border-white/5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedKey(null)}
                    className="p-1 -ml-1 rounded hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Go back"
                  >
                    <ArrowLeft size={13} />
                  </button>
                  <span className="text-dcx-2xs uppercase tracking-wider font-mono text-neutral-400 font-extrabold">
                    {selectedKey === 'senderId' ? 'Sender Gateway' : 'Receiver Target'}
                  </span>
                </div>

                <div className="max-h-[200px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                  {getUniqueValues(selectedKey).map((val) => {
                    const tasks = getTasksWithVal(selectedKey, val);
                    const isSelected = activePropSelection?.key === selectedKey && activePropSelection?.val === val;
                    const readableName = PREDEFINED_SEGMENTS[val] || val;

                    return (
                      <button
                        key={`focus-prop-choice-${val}`}
                        type="button"
                        onClick={() => handleValueSelect(selectedKey, val)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] font-bold'
                            : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                        }`}
                        id={`${id}-choice-${val}`}
                      >
                        <span className="flex items-center gap-1.5 truncate max-w-[130px]" title={readableName}>
                          {isSelected && <Check size={12} className="text-[var(--theme-accent)]" />}
                          {readableName}
                        </span>
                        <span className="text-dcx-2xs text-neutral-500 font-mono shrink-0">
                          {tasks.length} {tasks.length === 1 ? 'tk' : 'tks'}
                        </span>
                      </button>
                    );
                  })}

                  {getUniqueValues(selectedKey).length === 0 && (
                    <p className="text-dcx-xs text-neutral-500 italic p-1">No active tags found.</p>
                  )}
                </div>
              </>
            )}

            {activePropSelection !== null && (
              <button
                type="button"
                onClick={() => {
                  setActiveProperty(null);
                  closeOpen();
                }}
                className="w-full text-center text-dcx-xs text-rose-400 hover:text-rose-300 transition-colors pt-1.5 border-t border-white/5 font-semibold cursor-pointer"
              >
                Clear Focus Highlight
              </button>
            )}
          </div>
        </PopoverShell>
      )}
    </div>
  );
}
