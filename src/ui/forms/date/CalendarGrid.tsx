import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ApiTaskDate } from '@/types/api';
import { formatDateString, parseDateString } from './date.utils';

interface CalendarGridProps {
  currentDate: Date;
  isDark: boolean;
  value: ApiTaskDate;
  anchorDateStr: string;
  onCurrentDateChange: (date: Date) => void;
  onSelect: (date: string) => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function CalendarGrid({
  currentDate,
  isDark,
  value,
  anchorDateStr,
  onCurrentDateChange,
  onSelect,
}: CalendarGridProps) {
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const days = [...Array<null>(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  return (
    <div className="space-y-3" id="calendar-mode-section">
      <div className="flex items-center justify-between">
        <span className="font-mono font-black text-dcx-sm uppercase text-[var(--theme-accent)]">
          {monthNames[month]} {year}
        </span>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Previous month" onClick={() => onCurrentDateChange(new Date(Date.UTC(year, month - 1, 1)))} className="p-1.5 rounded-lg text-neutral-400 hover:text-white">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button type="button" aria-label="Next month" onClick={() => onCurrentDateChange(new Date(Date.UTC(year, month + 1, 1)))} className="p-1.5 rounded-lg text-neutral-400 hover:text-white">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-bold opacity-30 text-dcx-2xs uppercase">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />;
          const date = formatDateString(new Date(Date.UTC(year, month, day)));
          const selected = value.mode === 'fixed' && value.date === date;
          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelect(date)}
              className={`py-1 rounded-lg text-center font-mono font-bold text-dcx-xs border ${
                selected
                  ? 'bg-[var(--theme-accent)]/20 border-[var(--theme-accent)]/50 text-[var(--theme-accent)]'
                  : isDark
                    ? 'hover:bg-white/5 text-neutral-200 border-transparent'
                    : 'hover:bg-neutral-100 text-neutral-800 border-transparent'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          onCurrentDateChange(parseDateString(anchorDateStr));
          onSelect(anchorDateStr);
        }}
        className="w-full py-1 rounded-lg font-mono text-dcx-2xs uppercase border border-white/5 hover:border-white/10"
      >
        Go to Launch ({anchorDateStr})
      </button>
    </div>
  );
}

