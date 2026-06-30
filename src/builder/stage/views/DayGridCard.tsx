import { Plus, EyeOff } from 'lucide-react';
import type { TaskCardData } from '@/types/builder-node.types';
import type { ActionCardData } from '@/types/builder-node.types';
import { DayTaskCreator } from './DayTaskCreator';
import { TaskCard } from '@/builder/cards/templates/task/TaskCard';
import { useDayGridDrag } from './useDayGridDrag';
import { DayGridCardCollapsed } from './DayGridCardCollapsed';
import { DayGridCardEmpty } from './DayGridCardEmpty';
import { useDayGridCard } from './useDayGridCard';
import { getDayReadiness } from '@/rules/readiness.rules';
import { PhaseReadinessBadge } from '@/builder/cards/templates/phase/PhaseReadinessBadge';

interface DayGridCardProps {
  dayLabel: string;
  dateString: string;
  isEnabled: boolean;
  isWeekend: boolean;
  isAnchorDay: boolean;
  tasks: TaskCardData[];
  dayIndex: number;
  weekIndex: number;
  anchorDateStr: string;
  actionsList: ActionCardData[];
  isMonthly?: boolean;
}

export function DayGridCard({
  dayLabel,
  dateString,
  isEnabled,
  isWeekend,
  isAnchorDay,
  tasks,
  dayIndex,
  weekIndex,
  anchorDateStr,
  actionsList,
  isMonthly = false,
}: DayGridCardProps) {
  const {
    isAdding,
    isSelected,
    isCollapsed,
    hasAnyExpandedTask,
    dayNum,
    formattedDateParts,
    expandedNodeIds,
    setExpandedNodeIds,
    setFocusedNodeId,
    selectedNodeIds,
    handleToggleCollapse,
    handleSelectTask,
    handleOpenAdd,
    handleCloseAdd,
  } = useDayGridCard({
    dateString,
    dayIndex,
    weekIndex,
    anchorDateStr,
    tasks,
    isMonthly,
  });

  const { isDragOver, handleDragLeave, handleDragOver, handleDrop, handleDragStart } = useDayGridDrag({
    dateString,
    dayLabel,
    dayIndex,
    weekIndex,
    dayNum,
    isEnabled,
  });

  const readiness = getDayReadiness(dateString, tasks, anchorDateStr);

  if (!isMonthly && isCollapsed) {
    return (
      <DayGridCardCollapsed
        dayNum={dayNum}
        dateString={dateString}
        dayLabel={dayLabel}
        isEnabled={isEnabled}
        isWeekend={isWeekend}
        isAnchorDay={isAnchorDay}
        tasksCount={tasks.length}
        readinessState={readiness.state}
        formattedDateParts={formattedDateParts}
        isDragOver={isDragOver}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        onExpand={() => {
          setExpandedNodeIds(Array.from(new Set([...expandedNodeIds, `day:${dateString}`])));
        }}
        onDoubleClick={handleToggleCollapse}
        isSelected={isSelected}
        onClick={(e) => {
          e.stopPropagation();
          setFocusedNodeId(`day:${dateString}`);
        }}
      />
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={(e) => {
        e.stopPropagation();
        setFocusedNodeId(`day:${dateString}`);
      }}
      onDoubleClick={handleToggleCollapse}
      data-card-kind="day"
      data-selected={isSelected ? "true" : "false"}
      data-anchor-day={isAnchorDay ? "true" : undefined}
      className={`relative flex flex-col rounded-xl border backdrop-blur-md transition-all duration-200 cursor-pointer min-w-0 ${
        isMonthly
          ? 'h-full p-2 text-xs'
          : 'h-[var(--dim-card-height-pct)] p-4 flex-none'
      } ${
        isSelected
          ? 'border-[var(--theme-accent)] bg-white/[0.08] shadow-[0_0_15px_var(--theme-accent-medium)] ring-1 ring-[var(--theme-accent)]/30'
          : isAnchorDay
            ? 'border-[var(--theme-accent)]/30 bg-white/[0.04] shadow-[0_0_15px_var(--theme-selected-glow)] shadow-lg'
            : isWeekend
              ? 'border-white/[0.05] bg-white/[0.01]'
              : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]'
      } ${
        !isEnabled
          ? 'opacity-40 cursor-not-allowed select-none bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.01),rgba(255,255,255,0.01)_10px,transparent_10px,transparent_20px)]'
          : ''
      } ${
        isDragOver
          ? 'border-dashed border-[var(--theme-accent)] bg-white/[0.08] shadow-[inset_0_0_12px_var(--theme-accent-medium)] scale-[1.01]'
          : ''
      }`}
      style={!isMonthly ? { width: hasAnyExpandedTask ? 'var(--dim-phase-expanded)' : '220px' } : undefined}
    >
      {isAnchorDay && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-[var(--theme-accent)] shadow-[0_0_8px_var(--theme-accent)]" />
      )}

      <div className={`flex items-start justify-between ${isMonthly ? 'mb-1' : 'mb-3'}`}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-5 h-5 rounded bg-white/10 dark:bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono text-dcx-xs font-bold text-[var(--theme-accent)] shadow-sm shrink-0 select-none">
            {dayNum}
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            {formattedDateParts ? (
              <>
                <span className={`font-bold tracking-tight text-neutral-800 dark:text-white ${isMonthly ? 'text-dcx-sm' : 'text-sm'} truncate`}>
                  {formattedDateParts.dayName} {formattedDateParts.dateNum}
                </span>
                <span className={`font-mono text-neutral-400 dark:text-neutral-500 ${isMonthly ? 'text-dcx-3xs' : 'text-dcx-xs'} uppercase tracking-wider`}>
                  {formattedDateParts.monthName}
                </span>
              </>
            ) : (
              <>
                <span className={`font-bold tracking-tight text-neutral-800 dark:text-white ${isMonthly ? 'text-dcx-sm' : 'text-sm'} truncate`}>
                  {dayLabel}
                </span>
                <span className={`font-mono text-neutral-400 dark:text-neutral-500 ${isMonthly ? 'text-dcx-3xs' : 'text-dcx-xs'}`}>
                  {dateString}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <PhaseReadinessBadge state={readiness.state} />
          {!isMonthly && (
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="text-neutral-500 hover:text-[var(--theme-accent)] focus:outline-none transition-colors p-1 rounded-md hover:bg-white/5 cursor-pointer"
              title="Collapse day card"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          )}
          {isAnchorDay && (
            <span className="text-dcx-2xs font-black tracking-widest px-1.5 py-0.5 rounded bg-sky-500 text-white uppercase scale-90 shrink-0">
              ANCHOR
            </span>
          )}
          {isEnabled && !isWeekend && !isMonthly && !isAdding && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="p-1 rounded-md text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white/5 dark:hover:bg-white/5 transition cursor-pointer"
              aria-label={`Add task for ${dayLabel}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className={`h-px bg-white/[0.08] dark:bg-white/[0.08] shrink-0 ${isMonthly ? 'mb-1' : 'mb-3'}`} />

      {/* REQ-CAL-MONTH-001: monthly = collapsed TaskCards (disableExpand) in wrapping flex rows;
          weekly = full TaskCards in a grid/stack layout */}
      {isMonthly ? (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-wrap content-start gap-1">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              selected={selectedNodeIds.includes(task.id)}
              onSelect={handleSelectTask}
              disableExpand={true}
            />
          ))}
          {tasks.length === 0 && !isAdding && (
            <DayGridCardEmpty
              isMonthly={isMonthly}
              isEnabled={isEnabled}
              isWeekend={isWeekend}
              handleOpenAdd={handleOpenAdd}
            />
          )}
        </div>
      ) : (
        <div className={`flex-1 overflow-y-auto pr-0.5 scrollbar-thin scroll-smooth min-h-0 ${
          hasAnyExpandedTask
            ? 'space-y-3 flex flex-col items-center w-full'
            : 'grid grid-cols-3 gap-2 auto-rows-max justify-items-center items-start w-full'
        }`}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              selected={selectedNodeIds.includes(task.id)}
              onSelect={handleSelectTask}
            />
          ))}

          {tasks.length === 0 && !isAdding && (
            <DayGridCardEmpty
              isMonthly={isMonthly}
              isEnabled={isEnabled}
              isWeekend={isWeekend}
              handleOpenAdd={handleOpenAdd}
            />
          )}

          {isAdding && (
            <div className="col-span-3 w-full">
              <DayTaskCreator
                actionsList={actionsList}
                weekIndex={weekIndex}
                dayOffset={dayNum}
                onClose={handleCloseAdd}
              />
            </div>
          )}
        </div>
      )}

      {!isMonthly && tasks.length > 0 && (
        <div className="pt-2 mt-2 border-t border-white/[0.08] dark:border-white/[0.08] flex items-center justify-between text-dcx-xs font-mono text-neutral-400 dark:text-neutral-500 shrink-0">
          <span>WEEK {weekIndex}</span>
          <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
        </div>
      )}
    </div>
  );
}
