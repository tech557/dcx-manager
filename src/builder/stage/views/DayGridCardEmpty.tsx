import { Plus, Calendar } from 'lucide-react';

interface DayGridCardEmptyProps {
  isMonthly: boolean;
  isEnabled: boolean;
  isWeekend: boolean;
  handleOpenAdd: () => void;
}

export function DayGridCardEmpty({ isMonthly, isEnabled, isWeekend, handleOpenAdd }: DayGridCardEmptyProps) {
  if (isMonthly) {
    return (
      <div className="flex items-center justify-center h-12 text-neutral-400 dark:text-neutral-500 opacity-50 col-span-3 w-full">
        <span className="text-dcx-2xs font-medium font-mono">Empty</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 text-neutral-400 dark:text-neutral-500 col-span-3 w-full h-full select-none animate-in fade-in duration-300">
      <div className="w-10 h-10 rounded-full border border-dashed border-white/10 dark:border-white/10 flex items-center justify-center text-neutral-400/60 dark:text-neutral-500/60 mb-3 bg-white/[0.01]">
        <Calendar className="w-4 h-4 opacity-50" />
      </div>
      <span className="text-dcx-sm font-bold text-neutral-800 dark:text-white tracking-wide uppercase">
        Clear Day
      </span>
      <span className="text-dcx-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-[140px] text-center leading-normal">
        No campaign tasks scheduled on this day.
      </span>
      {isEnabled && !isWeekend && (
        <button
          type="button"
          onClick={handleOpenAdd}
          className="mt-3.5 px-3 py-1.5 text-dcx-2xs font-bold uppercase tracking-wider bg-[var(--theme-accent)]/10 hover:bg-[var(--theme-accent)]/20 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 rounded-full transition-all cursor-pointer active:scale-95 flex items-center gap-1"
        >
          <Plus className="w-2.5 h-2.5" />
          <span>Add Task</span>
        </button>
      )}
    </div>
  );
}
