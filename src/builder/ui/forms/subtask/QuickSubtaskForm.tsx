import React, { useState, useCallback } from 'react';
import type { Subtask } from '@/types/domain';
import { generateId } from '@/utils/id.helpers';
import { ChevronUp, ChevronDown, Trash2, Plus, Clock, Copy, ClipboardPaste } from 'lucide-react';
import { subtaskClipboard } from './subtaskClipboard';

interface QuickSubtaskFormProps {
  taskId: string;
  subtasks: Subtask[];
  onChange: (updatedSubtasks: Subtask[]) => void;
}

export function QuickSubtaskForm({ taskId, subtasks, onChange }: QuickSubtaskFormProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Re-render trigger when clipboard changes (module-level state needs a local signal)
  const [clipboardVersion, setClipboardVersion] = useState(0);

  // Ensure subtasks are sorted correctly
  const sortedSubtasks = [...subtasks].sort((a, b) => a.orderIndex - b.orderIndex);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleCopySelected = useCallback(() => {
    const toCopy = sortedSubtasks.filter((st) => selectedIds.has(st.id));
    if (toCopy.length === 0) return;
    subtaskClipboard.copy(toCopy);
    setClipboardVersion((v) => v + 1);
    setSelectedIds(new Set());
  }, [selectedIds, sortedSubtasks]);

  const handlePasteSubtasks = useCallback(() => {
    if (!subtaskClipboard.hasItems()) return;
    const pasted = subtaskClipboard.paste().map((st, i) => ({
      ...st,
      id: generateId(),
      taskId,
      orderIndex: sortedSubtasks.length + i,
    }));
    onChange([...sortedSubtasks, ...pasted]);
  }, [onChange, sortedSubtasks, taskId]);

  const handleUpdateSubtask = (id: string, changes: Partial<Subtask>) => {
    const updated = sortedSubtasks.map((st) =>
      st.id === id ? { ...st, ...changes } : st
    );
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const list = [...sortedSubtasks];
    const tempIndex = list[index].orderIndex;
    list[index].orderIndex = list[index - 1].orderIndex;
    list[index - 1].orderIndex = tempIndex;
    onChange(list);
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedSubtasks.length - 1) return;
    const list = [...sortedSubtasks];
    const tempIndex = list[index].orderIndex;
    list[index].orderIndex = list[index + 1].orderIndex;
    list[index + 1].orderIndex = tempIndex;
    onChange(list);
  };

  const handleDelete = (id: string) => {
    const remaining = sortedSubtasks
      .filter((st) => st.id !== id)
      .map((st, idx) => ({ ...st, orderIndex: idx }));
    onChange(remaining);
  };

  const handleAddDefaultCard = () => {
    const newSubtask: Subtask = {
      id: generateId(),
      taskId,
      definitionId: null,
      label: 'New benchmark task',
      done: false,
      estimatedMinutes: 10,
      orderIndex: sortedSubtasks.length,
      metadata: null,
      aiContext: null,
      sourceContext: null,
    };
    onChange([...sortedSubtasks, newSubtask]);
  };

  return (
    <div className="space-y-4 select-none text-left" id="quick-subtask-form">
      {/* 1. Header with Gilroy Light styling */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <span className="text-dcx-xs font-light tracking-[0.08em] font-mono uppercase text-neutral-400 block leading-none">
          Benchmarks / Subtasks Pipeline
        </span>
        <div className="flex items-center gap-1.5">
          {selectedIds.size > 0 && (
            <button
              type="button"
              onClick={handleCopySelected}
              title={`Copy ${selectedIds.size} selected subtask${selectedIds.size > 1 ? 's' : ''}`}
              className="flex items-center gap-1 px-2 py-0.5 text-dcx-3xs font-mono text-sky-400 border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 rounded transition-all cursor-pointer"
              id="btn-subtask-copy"
            >
              <Copy className="w-3 h-3" />
              <span>Copy {selectedIds.size}</span>
            </button>
          )}
          {subtaskClipboard.hasItems() && clipboardVersion >= 0 && (
            <button
              type="button"
              onClick={handlePasteSubtasks}
              title={`Paste ${subtaskClipboard.count()} subtask${subtaskClipboard.count() > 1 ? 's' : ''} (appended — existing subtasks preserved)`}
              className="flex items-center gap-1 px-2 py-0.5 text-dcx-3xs font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded transition-all cursor-pointer"
              id="btn-subtask-paste"
            >
              <ClipboardPaste className="w-3 h-3" />
              <span>Paste {subtaskClipboard.count()}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Structured Card Container */}
      <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin [scrollbar-width:thin]">
        {sortedSubtasks.map((st, index) => (
          <div
            key={st.id}
            className={`group bg-neutral-900/40 border p-2 rounded-xl flex items-center justify-between gap-3 transition-all duration-200 hover:bg-neutral-900/60 ${selectedIds.has(st.id) ? 'border-sky-500/30 bg-sky-950/20' : 'border-white/5 hover:border-white/10'}`}
          >
            {/* Selection checkbox */}
            <input
              type="checkbox"
              checked={selectedIds.has(st.id)}
              onChange={() => toggleSelect(st.id)}
              onClick={(e) => e.stopPropagation()}
              className="w-3 h-3 shrink-0 accent-sky-400 cursor-pointer"
              aria-label={`Select subtask: ${st.label}`}
            />
            {/* Reorder utilities */}
            <div className="flex flex-col shrink-0">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => handleMoveUp(index)}
                className="p-0.5 text-neutral-500 hover:text-neutral-200 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-all"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                disabled={index === sortedSubtasks.length - 1}
                onClick={() => handleMoveDown(index)}
                className="p-0.5 text-neutral-500 hover:text-neutral-200 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-all"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Input fields for title and time directly on the card */}
            <div className="flex-1 min-w-0 grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => handleUpdateSubtask(st.id, { label: e.target.value })}
                  className="bg-black/20 border border-white/5 hover:border-white/10 focus:border-[var(--theme-accent)]/40 font-sans text-dcx-sm px-2 py-1 h-7 rounded-lg text-white w-full outline-none transition-all truncate"
                  placeholder="Task name"
                />
              </div>

              {/* Time column directly inside card */}
              <div className="flex items-center bg-black/20 border border-white/5 hover:border-white/10 focus-within:border-[var(--theme-accent)]/40 rounded-lg h-7 px-2 transition-all">
                <Clock className="w-3 h-3 text-neutral-500 shrink-0 mr-1.5" />
                <input
                  type="number"
                  value={st.estimatedMinutes ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                    handleUpdateSubtask(st.id, { estimatedMinutes: isNaN(Number(val)) ? null : val });
                  }}
                  placeholder="Mins"
                  className="bg-transparent text-dcx-xs font-mono font-medium text-right text-white w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-dcx-3xs font-mono text-neutral-500 ml-1">m</span>
              </div>
            </div>

            {/* Delete button wrapper */}
            <button
              type="button"
              onClick={() => handleDelete(st.id)}
              className="p-1 px-1.5 hover:bg-rose-500/10 text-neutral-500 hover:text-rose-400 select-none cursor-pointer border border-transparent hover:border-rose-500/20 rounded-lg transition-all shrink-0"
              title="Remove Subtask Card"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {sortedSubtasks.length === 0 && (
          <div className="text-dcx-xs font-sans font-light text-neutral-500 italic py-6 text-center border border-dashed border-white/5 rounded-xl">
            No pipeline steps generated. Click below to add.
          </div>
        )}
      </div>

      {/* 3. Central Add Button directly at bottom */}
      <button
        type="button"
        onClick={handleAddDefaultCard}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-dcx-xs-plus font-mono text-emerald-400 border border-dashed border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="font-bold">Add Benchmark Step</span>
      </button>
    </div>
  );
}
