import { useStageContext } from '../StageProvider';
import { WeeklyView } from './WeeklyView';
import { MonthlyView } from './MonthlyView';
import { MatrixTimelineView } from './MatrixTimelineView';

export function TimelineView({ className }: { className?: string }) {
  const { activeSubView } = useStageContext();

  return (
    <div className={`${className} flex flex-col gap-4 w-full h-full overflow-hidden`} id="timeline-view-wrapper">
      {/* Render selected sub-view */}
      <div className="flex-1 min-h-0 w-full" id="timeline-subview-panel">
        {activeSubView === 'weekly' && <WeeklyView className="w-full h-full" />}
        {activeSubView === 'monthly' && <MonthlyView className="w-full h-full" />}
        {activeSubView === 'matrix' && <MatrixTimelineView className="w-full h-full" />}
      </div>
    </div>
  );
}
