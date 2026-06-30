import { useRef, useEffect } from 'react';

interface TimelineCustomEdgeSensorsProps {
  activeWeek: number;
  totalWeeks: number;
  setActiveWeek: React.Dispatch<React.SetStateAction<number>>;
  isDraggingOverLeft: boolean;
  setIsDraggingOverLeft: (val: boolean) => void;
  isDraggingOverRight: boolean;
  setIsDraggingOverRight: (val: boolean) => void;
}

export function TimelineCustomEdgeSensors({
  activeWeek,
  totalWeeks,
  setActiveWeek,
  isDraggingOverLeft,
  setIsDraggingOverLeft,
  isDraggingOverRight,
  setIsDraggingOverRight,
}: TimelineCustomEdgeSensorsProps) {
  const edgeDragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (edgeDragTimerRef.current) {
        clearTimeout(edgeDragTimerRef.current);
      }
    };
  }, []);

  const handleEdgeDragEnter = (dir: 'left' | 'right') => (e: React.DragEvent) => {
    const types = Array.from(e.dataTransfer.types);
    if (types.includes('application/x-dcx-card')) {
      e.preventDefault();
      if (dir === 'left') {
        setIsDraggingOverLeft(true);
      } else {
        setIsDraggingOverRight(true);
      }

      // Timer cleanup is event-local state and intentionally lives in a ref.
      // eslint-disable-next-line react-hooks/refs
      if (edgeDragTimerRef.current) {
        clearTimeout(edgeDragTimerRef.current);
      }

      edgeDragTimerRef.current = setTimeout(() => {
        if (dir === 'left') {
          if (activeWeek > 1) {
            setActiveWeek((prev) => prev - 1);
          }
          setIsDraggingOverLeft(false);
        } else {
          if (activeWeek < totalWeeks) {
            setActiveWeek((prev) => prev + 1);
          }
          setIsDraggingOverRight(false);
        }
      }, 700);
    }
  };

  const handleEdgeDragOver = (e: React.DragEvent) => {
    const types = Array.from(e.dataTransfer.types);
    if (types.includes('application/x-dcx-card')) {
      e.preventDefault();
    }
  };

  const handleEdgeDragLeave = (dir: 'left' | 'right') => () => {
    if (dir === 'left') {
      setIsDraggingOverLeft(false);
    } else {
      setIsDraggingOverRight(false);
    }
    if (edgeDragTimerRef.current) {
      clearTimeout(edgeDragTimerRef.current);
      edgeDragTimerRef.current = null;
    }
  };

  const handleEdgeDrop = (dir: 'left' | 'right') => () => {
    if (dir === 'left') {
      setIsDraggingOverLeft(false);
    } else {
      setIsDraggingOverRight(false);
    }
    if (edgeDragTimerRef.current) {
      clearTimeout(edgeDragTimerRef.current);
      edgeDragTimerRef.current = null;
    }
  };

  return (
    <>
      {activeWeek > 1 && (
        <div
          onDragEnter={handleEdgeDragEnter('left')}
          onDragOver={handleEdgeDragOver}
          onDragLeave={handleEdgeDragLeave('left')}
          onDrop={handleEdgeDrop('left')}
          className={`absolute left-[200px] top-0 bottom-0 w-12 z-20 flex items-center justify-start pl-2 transition-all duration-300 rounded-r-xl pointer-events-auto border-r border-[var(--theme-accent)]/20 ${
            isDraggingOverLeft
              ? 'bg-gradient-to-r from-sky-500/20 to-transparent border-l-4 border-sky-450 opacity-100 scale-y-[1.01] shadow-[5px_0_15px_var(--theme-info-bg)]'
              : 'bg-transparent opacity-0'
          }`}
        >
          <div className="text-sky-500 text-dcx-2xs font-black tracking-widest uppercase rotate-270 whitespace-nowrap block animate-pulse">
            PREV
          </div>
        </div>
      )}

      {activeWeek < totalWeeks && (
        <div
          onDragEnter={handleEdgeDragEnter('right')}
          onDragOver={handleEdgeDragOver}
          onDragLeave={handleEdgeDragLeave('right')}
          onDrop={handleEdgeDrop('right')}
          className={`absolute right-0 top-0 bottom-0 w-12 z-20 flex items-center justify-end pr-2 transition-all duration-300 rounded-l-xl pointer-events-auto border-l border-[var(--theme-accent)]/20 ${
            isDraggingOverRight
              ? 'bg-gradient-to-l from-sky-500/20 to-transparent border-r-4 border-sky-450 opacity-100 scale-y-[1.01] shadow-[-5px_0_15px_var(--theme-info-bg)]'
              : 'bg-transparent opacity-0'
          }`}
        >
          <div className="text-sky-500 text-dcx-2xs font-black tracking-widest uppercase rotate-90 whitespace-nowrap block animate-pulse">
            NEXT
          </div>
        </div>
      )}
    </>
  );
}
