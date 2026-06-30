import { useWeeklyView } from './useWeeklyView';
import { DayGridCard } from './DayGridCard';

export function WeeklyView({ className }: { className?: string }) {
  const {
    days,
    actionsList,
    activeWeek,
    totalWeeks,
    anchorDateStr,
    isDraggingOverLeft,
    isDraggingOverRight,
    getTasksForDay,
    handleEdgeDragEnter,
    handleEdgeDragOver,
    handleEdgeDragLeave,
    handleEdgeDrop,
  } = useWeeklyView();

  return (
    <div className={`${className} relative flex flex-col gap-6 w-full h-full overflow-hidden`} data-weekly-view="true">
      {/* 2. Interactive Area with of-bound Hover Zones */}
      <div className="relative flex-1 min-h-0 w-full flex overflow-hidden">
        
        {/* Left Drag Edge (STG-005) */}
        {activeWeek > 1 && (
          <div
            onDragEnter={handleEdgeDragEnter('left')}
            onDragOver={handleEdgeDragOver}
            onDragLeave={handleEdgeDragLeave('left')}
            onDrop={handleEdgeDrop('left')}
            className={`absolute left-0 top-0 bottom-0 w-14 z-20 flex items-center justify-start pl-4 transition-all duration-300 rounded-r-2xl pointer-events-auto border-r border-[var(--theme-accent)]/20 ${
              isDraggingOverLeft
                ? 'bg-gradient-to-r from-sky-500/20 to-transparent border-l-4 border-sky-400 opacity-100 scale-y-[1.02] shadow-[10px_0_30px_var(--theme-info-bg)]'
                : 'bg-transparent opacity-0 hover:opacity-10'
            }`}
          >
            <div className="text-sky-500 text-dcx-xs font-black tracking-widest uppercase rotate-270 whitespace-nowrap block animate-pulse">
              PREV WEEK
            </div>
          </div>
        )}

        {/* Right Drag Edge (STG-005) */}
        {activeWeek < totalWeeks && (
          <div
            onDragEnter={handleEdgeDragEnter('right')}
            onDragOver={handleEdgeDragOver}
            onDragLeave={handleEdgeDragLeave('right')}
            onDrop={handleEdgeDrop('right')}
            className={`absolute right-0 top-0 bottom-0 w-14 z-20 flex items-center justify-end pr-4 transition-all duration-300 rounded-l-2xl pointer-events-auto border-l border-[var(--theme-accent)]/20 ${
              isDraggingOverRight
                ? 'bg-gradient-to-l from-sky-500/20 to-transparent border-r-4 border-sky-400 opacity-100 scale-y-[1.02] shadow-[-10px_0_30px_var(--theme-info-bg)]'
                : 'bg-transparent opacity-0 hover:opacity-10'
            }`}
          >
            <div className="text-sky-500 text-dcx-xs font-black tracking-widest uppercase rotate-90 whitespace-nowrap block animate-pulse">
              NEXT WEEK
            </div>
          </div>
        )}

        {/* 3. Days Horizontal Columns
            absolute inset-0: takes its dimensions from the constrained relative parent,
            not from content — so overflow-x-auto can scroll instead of growing.
            min-w-full w-max on the inner: when cards fit → inner=100% → justify-center.
            When cards overflow → inner=max-content > container → scrollbar, no left-clip. */}
        <div className="absolute inset-0 overflow-x-auto" id="days-horizontal-columns">
          <div className="min-w-full w-max h-full flex items-center justify-center p-1.5">
            <div className="flex gap-4 h-full items-center">
              {days.map((day) => (
                <DayGridCard
                  key={day.dateString}
                  dayLabel={day.label}
                  dateString={day.dateString}
                  isEnabled={day.isEnabled}
                  isWeekend={day.isWeekend}
                  isAnchorDay={day.isAnchorDay}
                  tasks={getTasksForDay(day.dayIndex)}
                  dayIndex={day.dayIndex}
                  weekIndex={activeWeek}
                  anchorDateStr={anchorDateStr}
                  actionsList={actionsList}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

