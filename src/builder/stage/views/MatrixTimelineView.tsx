import { AlertCircle } from 'lucide-react';
import { mapTaskToTimeline } from './timeline.helpers';
import { TimelineHourCell } from './TimelineHourCell';
import { TimelineCustomEdgeSensors } from './TimelineCustomEdgeSensors';
import { MatrixTimelineHeader } from './MatrixTimelineHeader';
import { useMatrixTimeline } from './useMatrixTimeline';

export function MatrixTimelineView({ className }: { className?: string }) {
  const {
    activeWeek,
    setActiveWeek,
    prevWeek,
    nextWeek,
    totalWeeks,
    anchorDateStr,
    allTasks,
    actionsList,
    days,
    isDraggingOverLeft,
    setIsDraggingOverLeft,
    isDraggingOverRight,
    setIsDraggingOverRight,
    handleCellDrop,
    handleSaveMinimalTask,
  } = useMatrixTimeline();

  return (
    <div className={`${className} flex flex-col gap-6 w-full h-full overflow-hidden`} data-matrix-timeline-view="true" id="matrix-timeline-view">
      <MatrixTimelineHeader
        activeWeek={activeWeek}
        totalWeeks={totalWeeks}
        setActiveWeek={setActiveWeek}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
      />

      {actionsList.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 bg-white dark:bg-neutral-900/50">
          <AlertCircle className="w-12 h-12 text-neutral-400 mb-3" />
          <h4 className="text-base font-bold text-neutral-700 dark:text-neutral-300 font-sans">No parent actions defined yet</h4>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm text-center mt-1 leading-relaxed">
            Please create at least one Phase and parent Action card inside the **Kanban** tab first, then return here to plan your calendar schedule!
          </p>
        </div>
      ) : (
        <div className="relative flex-1 min-h-0 w-full flex overflow-hidden">
          <TimelineCustomEdgeSensors
            activeWeek={activeWeek}
            totalWeeks={totalWeeks}
            setActiveWeek={setActiveWeek}
            isDraggingOverLeft={isDraggingOverLeft}
            setIsDraggingOverLeft={setIsDraggingOverLeft}
            isDraggingOverRight={isDraggingOverRight}
            setIsDraggingOverRight={setIsDraggingOverRight}
          />

          <div className="flex-1 w-full h-full flex flex-col overflow-auto rounded-xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900 shadow-sm min-h-0">
            <div className="flex shrink-0 border-b border-neutral-200 dark:border-neutral-850 sticky top-0 bg-neutral-55 dark:bg-neutral-950 z-10">
              <div className="w-[220px] shrink-0 p-4 font-bold text-xs text-neutral-400 dark:text-neutral-500 border-r border-neutral-200 dark:border-neutral-850 uppercase tracking-wider backdrop-blur bg-neutral-55/90 dark:bg-neutral-950/90 flex items-center">
                Action Stream
              </div>

              {days.map((day) => (
                <div
                  key={day.dateString}
                  className={`flex-1 min-w-[140px] p-4 text-center border-r border-neutral-200 dark:border-neutral-850 last:border-r-0 backdrop-blur ${
                    day.isAnchorDay ? 'bg-sky-50/50 dark:bg-sky-950/20' : 'bg-neutral-55/80 dark:bg-neutral-950/80'
                  }`}
                >
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1">
                    {day.label}
                    {day.isAnchorDay && <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />}
                  </p>
                  <span className="text-dcx-xs font-mono text-neutral-400 dark:text-neutral-500 block mt-0.5">{day.dateString}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 min-h-0 divide-y divide-neutral-200 dark:divide-neutral-850">
              {actionsList.map((action) => (
                <div key={action.id} className="flex min-h-[140px] hover:bg-neutral-55/30 dark:hover:bg-neutral-850/5 transition duration-150">
                  <div className="w-[220px] shrink-0 p-4 font-semibold text-xs border-r border-neutral-200 dark:border-neutral-850 text-neutral-700 dark:text-neutral-300 flex flex-col justify-between bg-white dark:bg-neutral-900 bg-opacity-95 dark:bg-opacity-95 z-5 overflow-hidden">
                    <div>
                      <h4 className="font-bold text-neutral-800 dark:text-neutral-200 leading-tight">{action.name}</h4>
                      <p className="text-dcx-xs text-neutral-450 mt-1 line-clamp-3">{action.description || 'No description provided.'}</p>
                    </div>
                    <span className="text-dcx-2xs font-mono opacity-40 uppercase tracking-widest block select-none">
                      ID: {action.id.slice(0, 6)}
                    </span>
                  </div>

                  {days.map((day) => {
                    const cellTasks = allTasks.filter((task) => {
                      const placement = mapTaskToTimeline(task, anchorDateStr);
                      return task.parentActionId === action.id && placement.week === activeWeek && placement.day === day.dayIndex;
                    });

                    return (
                      <TimelineHourCell
                        key={day.dateString}
                        day={day}
                        actionId={action.id}
                        activeWeek={activeWeek}
                        cellTasks={cellTasks}
                        onCellDrop={handleCellDrop}
                        onSaveMinimalTask={handleSaveMinimalTask}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
