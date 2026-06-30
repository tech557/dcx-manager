import React from 'react';
import { Calendar } from 'lucide-react';
import type { TaskCardData } from '@/types/builder-node.types';
import { Input } from '@/ui/atoms/Input';

interface DayEditorSectionProps {
  draftData: {
    id: string;
    label: string;
    dateString: string;
    notes?: string;
  };
  updateDraftField: (field: string, value: unknown) => void;
  tasks: TaskCardData[];
}

export function DayEditorSection({ draftData, updateDraftField, tasks }: DayEditorSectionProps) {
  return (
    <div className="space-y-4" id={`day-editor-section-${draftData.id}`}>
      <div>
        <label className="block text-dcx-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
          <Calendar className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
          Date Reference
        </label>
        <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white flex items-center justify-between">
          <span className="font-semibold">{draftData.label}</span>
          <span className="font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md text-dcx-xs">
            {draftData.dateString}
          </span>
        </div>
      </div>

      <Input
        as="textarea"
        id={`day-notes-${draftData.id}`}
        label="Daily Campaign Brief / Notes"
        value={draftData.notes || ''}
        onChange={(event) => updateDraftField('notes', event.target.value)}
        placeholder="Enter custom campaign requirements, timing adjustments, or team briefs for this date here..."
        rows={4}
        size="lg"
        className="bg-neutral-900/60 hover:bg-neutral-900 resize-y select-text font-sans"
      />

      <div>
        <label className="block text-dcx-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
          Scheduled Tasks ({tasks.length})
        </label>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col gap-1 hover:border-white/10 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-dcx-sm font-bold text-neutral-200 line-clamp-1">{task.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              </div>
              {task.message && (
                <p className="text-dcx-2xs text-neutral-500 line-clamp-1 italic">{task.message}</p>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="border border-dashed border-white/5 rounded-xl p-6 text-center text-neutral-500">
              <p className="text-dcx-xs font-mono">No tasks scheduled for this day</p>
              <p className="text-dcx-3xs text-neutral-600 mt-1">Drag and drop tasks on this day column in Weekly View to schedule</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
