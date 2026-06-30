import React from 'react';
import { X } from 'lucide-react';
import { getTaskReadiness, getActionReadiness, getPhaseReadiness } from '@/rules/readiness.rules';
import type { EditorSession } from '@/store/builderStore';

export function EditorSessionPill({ session, kind, onSelect, onClose }: {
  session: EditorSession; kind: string; onSelect: (id: string) => void; onClose: (id: string) => void;
}) {
  const draft = session.draftData as unknown as Record<string, unknown>;
  const name = (draft.name as string) || (draft.label as string) || 'Untitled';
  const firstChar = name.trim().charAt(0).toUpperCase() || '?';
  const readiness = kind === 'task' ? getTaskReadiness({ ...draft, id: session.taskId } as never).state
    : kind === 'action' ? getActionReadiness(draft as never).state
    : kind === 'phase' ? getPhaseReadiness(draft as never).state : 'none';

  const dotColor = readiness === 'ready' ? 'bg-emerald-500' : readiness === 'blocked' ? 'bg-rose-500' : readiness === 'incomplete' ? 'bg-amber-500' : 'bg-neutral-500';

  return (
    <div className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[var(--theme-surface-dark)]/95 hover:bg-neutral-800 transition-all cursor-pointer shadow-lg shrink-0" id={`session-pill-${session.taskId}`}>
      <button type="button" className="w-full h-full rounded-full flex items-center justify-center text-white/80 text-xs font-bold font-mono" onClick={() => onSelect(session.taskId)} title={name}>
        {firstChar}
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[var(--theme-surface-dark)] ${dotColor}`} />
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onClose(session.taskId); }} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black/80 hover:bg-black text-white/60 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/10" title="Close session">
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}
