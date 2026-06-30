import React, { useEffect, useRef } from 'react';
import { Calendar, Check } from 'lucide-react';
import { useStageContext } from '@/builder/stage/StageProvider';
import { PopoverShell } from '@/ui/PopoverShell';
import { useTheme } from '@/hooks/useTheme';
import { getAllTasks } from '@/utils/node.helpers';
import { useToggle } from '@/hooks/useToggle';

interface WeekOptionProps {
  id?: string;
  activeWeek: number | null;
  setActiveWeek: (week: number | null) => void;
  focusMode: 'and' | 'or';
}

export function WeekOption({
  id = 'focus-option-week',
  activeWeek,
  setActiveWeek,
  focusMode: _focusMode,
}: WeekOptionProps) {
  const { nodes, totalWeeks } = useStageContext();
  const { isDark } = useTheme();
  const [isOpen, toggleOpen, , closeOpen] = useToggle();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeOpen();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOpen]);

  // Calculate tasks for a given week index (1-based)
  const getTasksForWeek = (wNum: number) => {
    return getAllTasks(nodes).filter((task) => {
      const date = task.date;
      if (!date) return false;
      if (date.mode === 'linked') {
        return date.weekOffset === wNum - 1;
      }
      return false;
    });
  };

  const handleWeekSelect = (wNum: number) => {
    setActiveWeek(wNum);
    closeOpen();
  };

  const weeksList = Array.from({ length: totalWeeks }, (_, idx) => idx + 1);

  const activeWeekSelection = activeWeek;

  return (
    <div ref={containerRef} className="relative flex items-center justify-center" id={id}>
      <button
        type="button"
        onClick={toggleOpen}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border cursor-pointer relative ${
          isOpen
            ? 'bg-[var(--theme-accent)]/20 border-[var(--theme-accent)]/40 text-white shadow-[0_0_12px_var(--theme-accent-bg)]'
            : activeWeekSelection !== null
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_var(--theme-success-bg)]'
            : isDark
            ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/85'
            : 'bg-black/5 hover:bg-neutral-100 border-black/15 hover:border-neutral-300 text-black/85'
        }`}
        title={`Focus by Week${activeWeekSelection !== null ? ` (Currently Week ${activeWeekSelection})` : ''}`}
        id={`${id}-trigger`}
      >
        <Calendar size={18} className={activeWeekSelection !== null ? 'text-emerald-400' : 'text-white'} />
        
        {/* Active mini pulse indicator */}
        {activeWeekSelection !== null && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <PopoverShell
          width="w-[210px]"
          className="absolute right-[115%] top-0 p-3 text-left animate-fade-in shadow-2xl border border-white/10 bg-zinc-950/95"
        >
          <div className="space-y-2.5" id={`${id}-popover-content`}>
            <div className="pb-1.5 border-b border-white/5">
              <span className="text-dcx-2xs uppercase tracking-wider font-mono text-neutral-400 font-extrabold">
                Select Focus Week
              </span>
            </div>

            <div className="max-h-[220px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {weeksList.map((wNum) => {
                const tasks = getTasksForWeek(wNum);
                const isSelected = activeWeekSelection === wNum;

                return (
                  <button
                    key={`focus-week-choice-${wNum}`}
                    type="button"
                    onClick={() => handleWeekSelect(wNum)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] font-bold'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                    id={`${id}-choice-${wNum}`}
                  >
                    <span className="flex items-center gap-1.5">
                      {isSelected && <Check size={12} className="text-[var(--theme-accent)]" />}
                      Week {wNum}
                    </span>
                    <span className="text-dcx-2xs text-neutral-500 font-mono">
                      {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {activeWeekSelection !== null && (
              <button
                type="button"
                onClick={() => {
                  setActiveWeek(null);
                  closeOpen();
                }}
                className="w-full text-center text-dcx-xs text-rose-400 hover:text-rose-300 transition-colors pt-1 border-t border-white/5 font-semibold cursor-pointer"
              >
                Clear Focus Highlight
              </button>
            )}

            {weeksList.length === 0 && (
              <p className="text-dcx-xs text-neutral-500 italic p-1">No active weeks.</p>
            )}
          </div>
        </PopoverShell>
      )}
    </div>
  );
}
