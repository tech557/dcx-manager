import { Eye } from 'lucide-react';
import type { MouseEvent, DragEvent } from 'react';
import type { ReadinessState } from '@/types/card.types';
import { PhaseReadinessBadge } from '@/builder/cards/templates/phase/PhaseReadinessBadge';

interface DayGridCardCollapsedProps {
  readinessState?: ReadinessState;
  dayNum: number;
  dateString: string;
  dayLabel: string;
  isEnabled: boolean;
  isWeekend: boolean;
  isAnchorDay: boolean;
  tasksCount: number;
  formattedDateParts: {
    dayName: string;
    monthName: string;
    dateNum: number;
    full: string;
  } | null;
  isDragOver: boolean;
  handleDragStart: (e: DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
  onExpand: () => void;
  isSelected: boolean;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  onDoubleClick: (e: MouseEvent<HTMLDivElement>) => void;
}

export function DayGridCardCollapsed({
  dayNum,
  dateString: _dateString,
  dayLabel,
  isEnabled,
  isWeekend,
  isAnchorDay,
  tasksCount,
  formattedDateParts,
  isDragOver,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  onExpand,
  isSelected,
  onClick,
  onDoubleClick,
  readinessState,
}: DayGridCardCollapsedProps) {
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      data-card-kind="day"
      data-selected={isSelected ? "true" : "false"}
      className={`relative flex flex-col items-center justify-between pb-6 pt-5 rounded-xl border backdrop-blur-md transition-all duration-200 w-[70px] h-[var(--dim-card-height-pct)] flex-none group/card overflow-hidden cursor-pointer ${
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
    >
      {isAnchorDay && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-[var(--theme-accent)] shadow-[0_0_8px_var(--theme-accent)]" />
      )}

      {/* Top: Sequential identifier & Collapse/Expand button */}
      <div className="flex flex-col items-center gap-2.5 shrink-0 select-none">
        <div className="w-5 h-5 rounded bg-white/10 dark:bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono text-dcx-xs font-bold text-[var(--theme-accent)] shadow-sm shrink-0">
          {dayNum}
        </div>
        {readinessState && <PhaseReadinessBadge state={readinessState} />}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          className="text-neutral-500 hover:text-[var(--theme-accent)] focus:outline-none transition-colors p-0.5 rounded flex items-center justify-center cursor-pointer select-none shrink-0 animate-none"
          title="Expand day card"
        >
          <Eye className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
        </button>
      </div>

      {/* Middle: Rotated Vertical Text */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 overflow-hidden min-h-0 select-none gap-4">
        <span 
          className="text-dcx-md font-black tracking-widest uppercase text-white/90 font-sans whitespace-nowrap block"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          {formattedDateParts ? `${formattedDateParts.dayName} ${formattedDateParts.dateNum}` : dayLabel}
        </span>
      </div>

      {/* Bottom: Task Count badge */}
      <div className="flex flex-col items-center shrink-0 select-none">
        <div className="w-6 h-6 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-dcx-xs font-mono text-neutral-400">
          {tasksCount}
        </div>
      </div>
    </div>
  );
}
