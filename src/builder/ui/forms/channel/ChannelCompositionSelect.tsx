import React, { useState } from 'react';
import { useCompositionsQuery, useCreateCompositionMutation } from '@/queries/channels.queries';
import { useSubtaskDefinitionsQuery } from '@/queries/subtask-definitions.queries';
import { generateSubtasksFromComposition } from '@/utils/composition.helpers';
import { Plus, Check, Loader2, Save } from 'lucide-react';
import type { Subtask } from '@/types/domain';
import { useToggle } from '@/hooks/useToggle';

interface ChannelCompositionSelectProps {
  channelId: string;
  selectedCompositionId: string | null;
  taskId: string;
  onChange: (compositionId: string | null, subtasks?: Subtask[]) => void;
  currentSubtasks: Subtask[];
}

export function ChannelCompositionSelect({
  channelId,
  selectedCompositionId,
  taskId,
  onChange,
  currentSubtasks,
}: ChannelCompositionSelectProps) {
  const { data: compositions = [], isLoading: isCompositionsLoading } = useCompositionsQuery(channelId);
  const { data: definitions = [], isLoading: isDefinitionsLoading } = useSubtaskDefinitionsQuery(channelId);
  const createCompositionMutation = useCreateCompositionMutation(channelId);

  const [newCompositionName, setNewCompositionName] = useState('');
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  const [selectedDefinitionIdsForNew, setSelectedDefinitionIdsForNew] = useState<string[]>([]);
  const [showSaveForm, , openSaveForm, closeSaveForm] = useToggle();

  const handleSelectComposition = (compositionId: string | null) => {
    if (!compositionId) {
      onChange(null, []);
      return;
    }

    const matchedComp = compositions.find((c) => c.id === compositionId);
    if (!matchedComp) {
      onChange(compositionId);
      return;
    }

    // Automatically generate subtasks from composition
    const generated = generateSubtasksFromComposition(taskId, matchedComp, definitions);
    onChange(compositionId, generated);
  };

  const handleQuickSaveComposition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompositionName.trim()) return;

    try {
      setIsSavingCustom(true);
      
      // Determine which definitionIds to include. 
      // If we selected some manually, use those. 
      // Otherwise, use any definitionIds from current subtasks of the task.
      let listIds = selectedDefinitionIdsForNew;
      if (listIds.length === 0) {
        listIds = currentSubtasks
          .map((s) => s.definitionId)
          .filter((id): id is string => id !== null);
      }

      const newComp = await createCompositionMutation.mutateAsync({
        name: newCompositionName.trim(),
        definitionIds: listIds,
      });

      // Select the newly created composition
      const generated = generateSubtasksFromComposition(taskId, newComp, definitions);
      onChange(newComp.id, generated);

      // Reset form state
      setNewCompositionName('');
      setSelectedDefinitionIdsForNew([]);
      closeSaveForm();
    } catch (err) {
      console.error('Failed to create composition:', err);
    } finally {
      setIsSavingCustom(false);
    }
  };

  const toggleSelectDefinition = (id: string) => {
    setSelectedDefinitionIdsForNew((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isLoading = isCompositionsLoading || isDefinitionsLoading;

  return (
    <div className="space-y-3.5 select-none text-left" id="channel-composition-select-form">
      <div>
        <span className="text-dcx-2xs font-black tracking-[0.15em] font-sans uppercase opacity-50 block leading-none mb-1.5">
          Select Layout Composition
        </span>

        {isLoading ? (
          <div className="flex items-center gap-2 py-4 text-xs font-mono text-neutral-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--theme-accent)]" />
            <span>Syncing templates...</span>
          </div>
        ) : (
          <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 [scrollbar-width:thin] scrollbar-thin">
            {/* Blank / Custom Option */}
            <button
              type="button"
              onClick={() => handleSelectComposition(null)}
              className={`w-full flex items-center justify-between text-left text-xs font-mono py-1.5 px-3 rounded-lg border transition-all duration-200 outline-none ${
                selectedCompositionId === null
                  ? 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/30 text-[var(--theme-accent)] font-bold'
                  : 'bg-white/5 border-white/5 text-neutral-300 hover:border-white/10 hover:bg-white/10'
              }`}
            >
              <span>Blank (Freeform / No Template)</span>
              {selectedCompositionId === null && <Check className="w-3.5 h-3.5" />}
            </button>

            {compositions.map((comp) => {
              const isActive = selectedCompositionId === comp.id;
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => handleSelectComposition(comp.id)}
                  className={`w-full flex items-center justify-between text-left text-xs font-mono py-1.5 px-3 rounded-lg border transition-all duration-200 outline-none ${
                    isActive
                      ? 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/30 text-[var(--theme-accent)] font-bold'
                      : 'bg-white/5 border-white/5 text-neutral-300 hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="truncate">{comp.name}</span>
                  {isActive && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}

            {compositions.length === 0 && (
              <p className="text-dcx-xs font-mono text-neutral-500 italic py-2 px-1">
                No templates initialized for this channel.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Save Current Layout to Library Form */}
      <div className="border-t border-white/5 pt-2.5">
        {!showSaveForm ? (
          <button
            type="button"
            onClick={() => {
              // Pre-select definitionIds from current subtasks
              const existingIds = currentSubtasks
                .map((s) => s.definitionId)
                .filter((id): id is string => id !== null);
              setSelectedDefinitionIdsForNew(existingIds);
              openSaveForm();
            }}
            className="flex items-center gap-1 text-dcx-xs font-black tracking-tight font-sans uppercase text-[var(--theme-accent)] hover:text-[var(--theme-accent)]/80 select-none cursor-pointer outline-none transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Save layout as template...</span>
          </button>
        ) : (
          <form onSubmit={handleQuickSaveComposition} className="space-y-3">
            <div className="flex flex-col gap-1">
              <span className="text-dcx-3xs font-black tracking-wider text-neutral-400 font-sans uppercase">
                Template Name
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newCompositionName}
                  onChange={(e) => setNewCompositionName(e.target.value)}
                  placeholder="e.g. Weekly Newsletter"
                  className="bg-black/40 border border-white/10 text-white font-mono text-xs px-2 py-1.5 rounded-lg w-full outline-none focus:border-[var(--theme-accent)] transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isSavingCustom || !newCompositionName.trim()}
                  className="bg-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/95 text-neutral-900 px-2.5 py-1.5 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Save Layout"
                >
                  {isSavingCustom ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {definitions.length > 0 && (
              <div className="space-y-1">
                <span className="text-dcx-3xs font-black tracking-wider text-neutral-400 font-sans uppercase block">
                  Assign Subtask Definitions
                </span>
                <div className="max-h-[90px] overflow-y-auto space-y-1 p-1 bg-black/25 rounded-md border border-white/5 scrollbar-thin">
                  {definitions.map((def) => {
                    const isSelected = selectedDefinitionIdsForNew.includes(def.id);
                    return (
                      <button
                        key={def.id}
                        type="button"
                        onClick={() => toggleSelectDefinition(def.id)}
                        className={`w-full text-left text-dcx-xs font-mono py-1 px-1.5 rounded transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-[var(--theme-accent)]/5 border-[var(--theme-accent)]/25 text-[var(--theme-accent)]'
                            : 'border-transparent text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <span className="truncate">{def.label}</span>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={closeSaveForm}
              className="text-dcx-2xs font-bold text-neutral-500 hover:text-neutral-300 outline-none select-none"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
