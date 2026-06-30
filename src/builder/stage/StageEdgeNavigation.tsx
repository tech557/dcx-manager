import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StageEdgeNavigationProps {
  direction: 'left' | 'right';
  view: 'kanban' | 'timeline' | 'weekly' | 'monthly';
  isDragging: boolean;
  isHovered: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

export function StageEdgeNavigation({
  direction,
  view,
  isDragging,
  isHovered,
  onDragEnter,
  onDragLeave,
}: StageEdgeNavigationProps) {
  const isLeft = direction === 'left';
  const Icon = isLeft ? ChevronLeft : ChevronRight;

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        onDragEnter();
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDragLeave}
      className={`absolute top-1/2 -translate-y-1/2 w-28 h-2/3 border-y-2 border-dashed transition-all duration-500 z-50 flex items-center justify-center flex-col pointer-events-auto ${
        isLeft ? 'left-0 rounded-r-3xl border-r-2' : 'right-0 rounded-l-3xl border-l-2'
      } ${
        isDragging
          ? 'opacity-100 scale-100 translate-x-0'
          : `opacity-0 scale-95 ${isLeft ? '-translate-x-10' : 'translate-x-10'} pointer-events-none`
      } ${
        isHovered
          ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_40px_rgba(52,211,153,0.35)]'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400/80'
      }`}
      id={`stage-crescent-${direction}`}
    >
      <Icon className="w-6 h-6 animate-pulse text-emerald-400" />
      <span className={`text-dcx-2xs font-black tracking-widest uppercase whitespace-nowrap mt-6 ${
        isLeft ? 'rotate-270' : 'rotate-90'
      }`}>
        {view === 'kanban' ? `Scroll ${isLeft ? 'Left' : 'Right'}` : `${isLeft ? 'Prev' : 'Next'} Week`}
      </span>
    </div>
  );
}
