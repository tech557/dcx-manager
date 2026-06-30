import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useStageContext } from '../StageProvider';
import { useVersionQuery } from '@/queries/versions.queries';
import { getDaysForWeek, mapTaskToTimeline } from './timeline.helpers';
import { DayGridCard } from './DayGridCard';
import type { TaskCardData, ActionCardData } from '@/types/builder-node.types';

// REQ-CAL-MONTH-001: NO vertical scroll — 4-week page driven by activeWeek.
// Each week row is flex-1 min-h-0; the 7-col grid uses minmax(0,1fr) so DayGridCard
// h-full is bounded and its internal overflow-y-auto engages. Week label is vertical
// in a narrow left gutter — no horizontal date header that overlaps cards.
const WEEKS_PER_PAGE = 4;

export function MonthlyView({ className }: { className?: string }) {
  const { nodes, totalWeeks, activeWeek } = useStageContext();
  const { versionId = 'v-1' } = useParams();
  const versionQuery = useVersionQuery(versionId);

  const currentVersion = versionQuery.data;
  const anchorDateStr = currentVersion?.communicatedDate ?? '2026-07-01';

  const allTasks = useMemo(() => {
    const tasks: TaskCardData[] = [];
    nodes.forEach((n) => {
      if (n.kind === 'phase') {
        n.data.actionCards.forEach((action) => {
          action.tasks.forEach((task) => tasks.push(task));
        });
      }
    });
    return tasks;
  }, [nodes]);

  const actionsList = useMemo(() => {
    const actions: ActionCardData[] = [];
    nodes.forEach((n) => {
      if (n.kind === 'phase') {
        n.data.actionCards.forEach((action) => actions.push(action));
      }
    });
    return actions;
  }, [nodes]);

  const activeMonthIndex = Math.ceil(activeWeek / WEEKS_PER_PAGE);
  const startWeek = (activeMonthIndex - 1) * WEEKS_PER_PAGE + 1;
  const endWeek = Math.min(totalWeeks, activeMonthIndex * WEEKS_PER_PAGE);

  const weeksToRender = useMemo(() => {
    const weeks: number[] = [];
    for (let w = startWeek; w <= endWeek; w++) weeks.push(w);
    return weeks;
  }, [startWeek, endWeek]);

  return (
    <div className={`${className} flex flex-col gap-1 w-full h-full overflow-hidden p-2`} data-monthly-view="true">
      {weeksToRender.map((weekNum) => {
        const days = getDaysForWeek(weekNum, anchorDateStr);

        return (
          <div key={weekNum} className="flex-1 min-h-0 flex flex-row gap-1">
            {/* Narrow vertical gutter — week label reads bottom-to-top */}
            <div className="w-5 shrink-0 flex items-center justify-center">
              <span
                className="text-dcx-3xs font-black tracking-[0.2em] uppercase text-[var(--theme-accent)]/60 font-mono select-none"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                W{weekNum}
              </span>
            </div>

            {/* 7-column grid — minmax(0,1fr) row height keeps cards bounded (Fix 3) */}
            <div className="flex-1 min-h-0 grid grid-cols-7 gap-1.5 [grid-template-rows:minmax(0,1fr)]">
              {days.map((day) => {
                const tasksOnDay = allTasks.filter((task) => {
                  const placement = mapTaskToTimeline(task, anchorDateStr);
                  return placement.week === weekNum && placement.day === day.dayIndex;
                });

                return (
                  <DayGridCard
                    key={day.dateString}
                    dayLabel={day.label}
                    dateString={day.dateString}
                    isEnabled={day.isEnabled}
                    isWeekend={day.isWeekend}
                    isAnchorDay={day.isAnchorDay}
                    tasks={tasksOnDay}
                    dayIndex={day.dayIndex}
                    weekIndex={weekNum}
                    anchorDateStr={anchorDateStr}
                    actionsList={actionsList}
                    isMonthly={true}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
