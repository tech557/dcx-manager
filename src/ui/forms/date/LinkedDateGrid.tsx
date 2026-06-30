import { Plus, Trash2 } from 'lucide-react';
import type { ApiTaskDate } from '@/types/api';
import { formatFriendlyDate, getDaysForWeek } from './date.utils';

interface LinkedDateGridProps {
  value: ApiTaskDate;
  anchorDateStr: string;
  selectedWeek: number;
  totalWeeks: number;
  isDark: boolean;
  onWeekChange: (week: number) => void;
  onTotalWeeksChange: (weeks: number) => void;
  onSelect: (week: number, day: number) => void;
}

export function LinkedDateGrid({
  value,
  anchorDateStr,
  selectedWeek,
  totalWeeks,
  isDark,
  onWeekChange,
  onTotalWeeksChange,
  onSelect,
}: LinkedDateGridProps) {
  return (
    <div className="flex gap-2 h-[200px]" id="linked-mode-section">
      <div className="w-[42%] flex flex-col border-r border-white/5 pr-2">
        <span className="text-dcx-3xs font-black uppercase opacity-40 mb-1">Select Week</span>
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {Array.from({ length: totalWeeks }, (_, index) => index + 1).map((week) => (
            <div key={week} className="flex items-center gap-1 group">
              <button
                type="button"
                onClick={() => onWeekChange(week)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-left font-mono font-bold text-dcx-xs border ${
                  week === selectedWeek
                    ? 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border-[var(--theme-accent)]/20'
                    : 'text-neutral-400 border-transparent hover:bg-white/5'
                }`}
              >
                Week {week}
              </button>
              {week === totalWeeks && week > 1 && (
                <button
                  type="button"
                  aria-label={`Delete Week ${week}`}
                  onClick={() => {
                    onTotalWeeksChange(totalWeeks - 1);
                    if (selectedWeek === week) onWeekChange(week - 1);
                  }}
                  className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 text-rose-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => onTotalWeeksChange(totalWeeks + 1)}
            className="w-full py-1.5 rounded-lg font-mono text-dcx-2xs uppercase flex items-center justify-center gap-1 border border-dashed border-white/10"
          >
            <Plus className="w-3 h-3 text-[var(--theme-accent)]" />
            Add Week
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col pl-1">
        <span className="text-dcx-3xs font-black uppercase opacity-40 mb-1">Select Weekday</span>
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {getDaysForWeek(selectedWeek, anchorDateStr).map((day) => {
            const dayNumber = day.dayIndex + 1;
            const selected = value.mode === 'linked' && value.weekOffset === selectedWeek && value.dayOffset === dayNumber;
            return (
              <button
                key={day.dayIndex}
                type="button"
                disabled={!day.isEnabled}
                onClick={() => onSelect(selectedWeek, dayNumber)}
                className={`w-full py-1 px-1.5 rounded-lg text-left flex items-center justify-between text-dcx-xs ${
                  !day.isEnabled
                    ? 'opacity-20 cursor-not-allowed'
                    : selected
                      ? 'bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/50 text-[var(--theme-accent)]'
                      : isDark ? 'hover:bg-white/5 text-neutral-200' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <span className="truncate">Day {dayNumber} · {formatFriendlyDate(day.dateString)}</span>
                {day.isWeekend && <span className="text-dcx-4xs uppercase opacity-60">Wknd</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

