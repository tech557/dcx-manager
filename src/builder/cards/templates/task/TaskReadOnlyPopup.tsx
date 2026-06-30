import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { GlassSurface } from '@/ui/surfaces/GlassSurface';
import type { TaskCardData } from '@/types/builder-node.types';
import type { ReadinessState } from '@/types/card.types';
import { ChannelPill } from './task-properties/ChannelPill';

interface TaskReadOnlyPopupProps {
  task: TaskCardData;
  isOpen: boolean;
  readiness: { state: ReadinessState; reasons: string[] };
  resolvedDate: string | null;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

export function TaskReadOnlyPopup({
  task, isOpen, readiness, resolvedDate, anchorRef, onClose,
}: TaskReadOnlyPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 12, top: 12 });

  useLayoutEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      if (!anchor) return;
      const width = popupRef.current?.offsetWidth ?? 320;
      const height = popupRef.current?.offsetHeight ?? 260;
      const right = anchor.right + 8;
      const left = right + width <= window.innerWidth - 12
        ? right
        : Math.max(12, anchor.left - width - 8);
      setPosition({ left, top: Math.min(Math.max(12, anchor.top), window.innerHeight - height - 12) });
    };
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!popupRef.current?.contains(target) && !anchorRef.current?.contains(target)) onClose();
    };
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    updatePosition();
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('keydown', handleKey);
    };
  }, [anchorRef, isOpen, onClose]);

  if (!isOpen) return null;
  const dateLabel = task.date.mode === 'unset'
    ? 'Unset'
    : task.date.mode === 'fixed'
      ? `Fixed: ${resolvedDate ?? task.date.date}`
      : `Linked: Week ${task.date.weekOffset + 1}, Day ${task.date.dayOffset}`;

  return createPortal(
    <div
      ref={popupRef}
      id={`task-readonly-popup-${task.id}`}
      className="fixed z-[130] w-[clamp(280px,320px,360px)] max-h-[calc(100vh-24px)] shadow-2xl"
      style={position}
      role="dialog"
      aria-label={`Task details: ${task.name}`}
    >
      <GlassSurface radius="md" intensity="high" className="border border-white/10 bg-[var(--theme-surface-deep-alt)]/95 text-neutral-200">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
          <div className="min-w-0">
            <ChannelPill channelId={task.channelId} className="mb-2 flex w-fit items-center gap-1 rounded border border-sky-800/30 bg-sky-950/40 px-2 py-0.5 text-dcx-xs text-sky-300" />
            <h3 className="truncate text-sm font-bold text-white">{task.name || 'Untitled Task'}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close task details" className="p-1 text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <dl className="grid grid-cols-[88px_1fr] gap-x-3 gap-y-2 p-4 text-xs">
          <dt className="text-neutral-500">Direction</dt><dd>{task.senderId || 'Unset'} -&gt; {task.receiverId || 'Unset'}</dd>
          <dt className="text-neutral-500">Date</dt><dd>{dateLabel}</dd>
          <dt className="text-neutral-500">Readiness</dt><dd className="capitalize">{readiness.state} ({readiness.reasons.length})</dd>
          <dt className="text-neutral-500">Subtasks</dt><dd>{task.subtasks.length} subtasks</dd>
        </dl>
      </GlassSurface>
    </div>,
    document.body,
  );
}
