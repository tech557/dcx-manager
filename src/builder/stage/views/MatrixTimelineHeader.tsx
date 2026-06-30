import { ChevronLeft, ChevronRight, ListTodo } from 'lucide-react';

interface MatrixTimelineHeaderProps {
  activeWeek: number;
  totalWeeks: number;
  setActiveWeek: (week: number) => void;
  prevWeek: () => void;
  nextWeek: () => void;
}

export function MatrixTimelineHeader({
  activeWeek,
  totalWeeks,
  setActiveWeek,
  prevWeek,
  nextWeek,
}: MatrixTimelineHeaderProps) {
  return (
    <div className="flex items-center justify-between shrink-0 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <ListTodo className="w-5 h-5 text-sky-500" />
        <div>
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Interactive Matrix Timeline</h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
            Tasks mapped horizontally across days and vertically by Actions &bull; Task-creation only view &bull; Week {activeWeek}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={activeWeek <= 1}
          onClick={prevWeek}
          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 hover:bg-neutral-55 dark:hover:bg-neutral-900 transition"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-950 rounded-lg p-1 border border-neutral-200/55 dark:border-neutral-805/50">
          {Array.from({ length: totalWeeks }, (_, index) => index + 1).map((week) => (
            <button
              key={week}
              type="button"
              onClick={() => setActiveWeek(week)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                activeWeek === week
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              W{week}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={activeWeek >= totalWeeks}
          onClick={nextWeek}
          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 hover:bg-neutral-55 dark:hover:bg-neutral-900 transition"
          aria-label="Next week"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
