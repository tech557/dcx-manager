import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/ui/atoms/Input';

interface ListInputLinesProps {
  id: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function ListInputLines({
  id,
  items,
  onChange,
  placeholder = 'Add new item...',
  label,
}: ListInputLinesProps) {
  const [newItemValue, setNewItemValue] = useState('');

  const handleAddItem = () => {
    if (newItemValue.trim()) {
      onChange([...items, newItemValue.trim()]);
      setNewItemValue('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full" id={`list-lines-container-${id}`}>
      {label && (
        <label className="text-dcx-2xs font-light uppercase tracking-[0.08em] text-neutral-400 font-mono select-none">
          {label}
        </label>
      )}

      {/* Input row to append */}
      <div className="flex items-center gap-1">
        <Input
          type="text"
          value={newItemValue}
          onChange={(e) => setNewItemValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-neutral-900"
          id={`list-lines-input-${id}`}
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="p-1 px-2 h-7 bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 active:bg-sky-500/30 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          id={`list-lines-add-btn-${id}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Render list of lines */}
      {items.length === 0 ? (
        <div className="text-dcx-2xs text-neutral-500 italic px-1 select-none py-1">
          No items logged.
        </div>
      ) : (
        <div className="flex flex-col gap-1 max-h-[140px] overflow-y-auto custom-scrollbar pt-1 pr-0.5">
          {items.map((item, index) => (
            <div
              key={`${index}-${item}`}
              className="flex items-center justify-between gap-1.5 px-2 py-0.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-md min-w-0"
              id={`list-lines-row-${id}-${index}`}
            >
              <span className="text-neutral-300 text-dcx-sm truncate select-text flex-1">
                {item}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-neutral-500 hover:text-rose-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                title="Remove item"
                id={`list-lines-delete-${id}-${index}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
