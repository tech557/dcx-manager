import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { GlassSurface } from '@/ui/surfaces/GlassSurface';

interface TaskHoverCardProps {
  name: string;
  isOpen: boolean;
  anchorRef: RefObject<HTMLElement | null>;
}

/**
 * Minimal hover card: shows only the task name, floats above the card, and is dismissed purely
 * by ending the hover (no close button). Pointer-events are disabled so it never steals the hover.
 */
export function TaskHoverCard({ name, isOpen, anchorRef }: TaskHoverCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    if (!isOpen) return;
    const anchor = anchorRef.current?.getBoundingClientRect();
    if (!anchor) return;
    const width = ref.current?.offsetWidth ?? 160;
    const height = ref.current?.offsetHeight ?? 28;
    const left = Math.min(Math.max(8, anchor.left + anchor.width / 2 - width / 2), window.innerWidth - width - 8);
    const above = anchor.top - height - 8;
    setPos({ left, top: above < 64 ? anchor.bottom + 8 : above });
  }, [isOpen, anchorRef, name]);

  if (!isOpen || !name) return null;

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[130] pointer-events-none animate-in fade-in duration-100"
      style={pos}
      role="tooltip"
    >
      <GlassSurface radius="sm" intensity="high" className="border border-white/10 bg-[var(--theme-surface-deep-alt)]/95 px-2.5 py-1">
        <span className="block max-w-[200px] truncate text-dcx-2xs font-semibold text-white">{name}</span>
      </GlassSurface>
    </div>,
    document.body,
  );
}
