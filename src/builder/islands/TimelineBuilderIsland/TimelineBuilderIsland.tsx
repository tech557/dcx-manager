import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, LayoutGrid, CalendarPlus, Check } from 'lucide-react';
import { useStageContext } from '../../stage/StageProvider';
import { useTheme } from '@/hooks/useTheme';

interface TimelineBuilderIslandProps {
  versionId?: string;
}

const WEEKS_PER_MONTH = 4;

export function TimelineBuilderIsland({ versionId: _versionId }: TimelineBuilderIslandProps) {
  const {
    activeWeek,
    prevWeek,
    nextWeek,
    totalWeeks,
    setTotalWeeks,
    setActiveWeek,
    activeSubView,
    setActiveSubView,
  } = useStageContext();

  const [showSuccess, setShowSuccess] = useState(false);

  // Month-level derived state (a month = 4 weeks)
  const monthCount = Math.ceil(totalWeeks / WEEKS_PER_MONTH);
  const activeMonth = Math.ceil(activeWeek / WEEKS_PER_MONTH);

  const prevMonth = () => {
    const target = (activeMonth - 2) * WEEKS_PER_MONTH + 1;
    setActiveWeek(Math.max(1, target));
  };
  const nextMonth = () => {
    const target = activeMonth * WEEKS_PER_MONTH + 1;
    setActiveWeek(Math.min(totalWeeks, target));
  };

  const handleAddWeek = () => {
    setTotalWeeks((prev) => prev + 1);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1800);
  };

  useTheme();

  const isMonthlyMode = activeSubView === 'monthly';

  return (
    <div
      className="relative pointer-events-auto shrink-0 select-none"
      id="timeline-builder-island-wrapper"
    >
      <div
        className={`island-shell flex items-center gap-3.5 py-2 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.15)] h-14 transition-all duration-500 overflow-hidden ${
          showSuccess ? 'max-w-[440px] px-5 border-emerald-500/30' : 'max-w-[380px]'
        }`}
        id="timeline-island-bar"
      >
        {/* Navigation — week in weekly view, month in monthly view (Fix 6) */}
        <div className="flex items-center gap-1.5" id="timeline-nav">
          <button
            type="button"
            disabled={isMonthlyMode ? activeMonth <= 1 : activeWeek <= 1}
            onClick={isMonthlyMode ? prevMonth : prevWeek}
            className="p-1.5 rounded-full text-neutral-400 dark:text-white/50 hover:text-neutral-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition cursor-pointer"
            aria-label={isMonthlyMode ? 'Previous month' : 'Previous week'}
            id="timeline-prev-btn"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex flex-col items-center justify-center leading-none min-w-[80px]">
            <span className="text-dcx-3xs font-black tracking-widest text-neutral-400 dark:text-neutral-500 font-mono uppercase">
              TIMELINE
            </span>
            <span className="text-dcx-md font-black text-[var(--theme-accent)] font-mono mt-0.5">
              {isMonthlyMode
                ? `Month ${activeMonth}/${monthCount}`
                : `Week ${activeWeek}/${totalWeeks}`}
            </span>
          </div>

          <button
            type="button"
            disabled={isMonthlyMode ? activeMonth >= monthCount : activeWeek >= totalWeeks}
            onClick={isMonthlyMode ? nextMonth : nextWeek}
            className="p-1.5 rounded-full text-neutral-400 dark:text-white/50 hover:text-neutral-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition cursor-pointer"
            aria-label={isMonthlyMode ? 'Next month' : 'Next week'}
            id="timeline-next-btn"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Separator */}
        <div className="w-[1px] h-6 bg-neutral-200 dark:bg-white/15" id="timeline-separator" />

        {/* Sub-view switcher + Add Week */}
        <div className="flex items-center gap-1.5" id="timeline-subview-switcher">
          <button
            type="button"
            onClick={() => setActiveSubView('weekly')}
            className={`p-2 rounded-full transition-all duration-300 relative group cursor-pointer ${
              activeSubView === 'weekly'
                ? 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] shadow-[0_0_12px_var(--theme-selected-glow)] ring-1 ring-[var(--theme-accent)]/30 scale-105'
                : 'text-neutral-400 dark:text-white/40 hover:text-neutral-800 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            aria-label="Weekly Timeline"
            id="timeline-weekly-view-btn"
          >
            <Calendar size={15} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition px-2 py-0.5 bg-neutral-900 border border-white/10 text-white text-dcx-2xs font-bold rounded shadow-lg whitespace-nowrap z-50">
              Weekly View
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('monthly')}
            className={`p-2 rounded-full transition-all duration-300 relative group cursor-pointer ${
              activeSubView === 'monthly'
                ? 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] shadow-[0_0_12px_var(--theme-selected-glow)] ring-1 ring-[var(--theme-accent)]/30 scale-105'
                : 'text-neutral-400 dark:text-white/40 hover:text-neutral-800 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            aria-label="Monthly Calendar"
            id="timeline-monthly-view-btn"
          >
            <LayoutGrid size={15} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition px-2 py-0.5 bg-neutral-900 border border-white/10 text-white text-dcx-2xs font-bold rounded shadow-lg whitespace-nowrap z-50">
              Monthly Calendar
            </span>
          </button>

          {/* Add Week — only growth control; crossing a multiple of 4 unlocks a new month */}
          <button
            type="button"
            onClick={handleAddWeek}
            className="p-2 rounded-full text-neutral-400 dark:text-white/40 hover:text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/10 hover:ring-1 hover:ring-[var(--theme-accent)]/30 transition-all duration-300 relative group cursor-pointer active:scale-95"
            aria-label="Add week to timeline"
            id="timeline-add-week-btn"
          >
            <CalendarPlus size={15} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition px-2 py-0.5 bg-neutral-900 border border-white/10 text-white text-dcx-2xs font-bold rounded shadow-lg whitespace-nowrap z-50">
              Add More Weeks
            </span>
          </button>
        </div>

        {showSuccess && (
          <div
            className="flex items-center gap-1.5 pl-1.5 border-l border-neutral-200 dark:border-white/15 animate-fade-in-right"
            id="timeline-success-badge"
          >
            <div className="p-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
              <Check size={11} className="stroke-[3]" />
            </div>
            <span className="text-dcx-xs font-black text-emerald-400 font-mono tracking-wider whitespace-nowrap">
              +1 WEEK
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
