import { useState } from 'react';
import type { ApiChannelComposition, ApiSubtaskDefinition } from '@/types/api';
import { useCreateCompositionMutation } from '@/queries/channels.queries';

interface CreateCompositionFormProps {
  channelId: string;
  definitions: ApiSubtaskDefinition[];
  onCancel: () => void;
  onCreated: (composition: ApiChannelComposition) => void;
}

export function CreateCompositionForm({ channelId, definitions, onCancel, onCreated }: CreateCompositionFormProps) {
  const [name, setName] = useState('');
  const [definitionIds, setDefinitionIds] = useState<string[]>([]);
  const createComposition = useCreateCompositionMutation(channelId);

  function toggleDefinition(definitionId: string) {
    setDefinitionIds((current) =>
      current.includes(definitionId) ? current.filter((id) => id !== definitionId) : [...current, definitionId],
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const created = await createComposition.mutateAsync({ name: name.trim(), definitionIds });
    onCreated(created);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input className="editor-input" placeholder="Composition name" value={name} onChange={(event) => setName(event.target.value)} />
      <div className="max-h-40 space-y-1 overflow-auto">
        {definitions.map((definition) => (
          <label key={definition.id} className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-1.5 text-xs text-white">
            <input type="checkbox" checked={definitionIds.includes(definition.id)} onChange={() => toggleDefinition(definition.id)} />
            {definition.label}
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button type="button" className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs" onClick={onCancel}>Cancel</button>
        <button type="submit" className="flex-1 rounded-lg bg-sky-500 px-3 py-2 text-xs font-bold text-white" disabled={!name.trim() || definitionIds.length === 0}>
          Save
        </button>
      </div>
    </form>
  );
}
