import type React from "react";
import { AlertCircle, Plus, X } from "lucide-react";
import { useTooltipDraft } from "./useTooltipDraft";
import { useTheme } from "../../../hooks/useTheme";


interface MissingDataTooltipEditorProps {
  value: any;
  hasValue: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  close: (force?: boolean) => void;
  onSave: (newValue: any) => void;
  setHasUnsavedChanges?: (val: boolean) => void;
  onSaveTriggerRef?: React.MutableRefObject<(() => void) | null>;
  onDiscardTriggerRef?: React.MutableRefObject<(() => void) | null>;
}

export function MissingDataTooltipEditor({
value,
  hasValue,
  isEditing,
  setIsEditing,
  close,
  onSave,
  setHasUnsavedChanges,
  onSaveTriggerRef,
  onDiscardTriggerRef,
}: MissingDataTooltipEditorProps) {
  const { isDark } = useTheme();
  const initial = Array.isArray(value) ? value : [];
  const { draft, setDraft, handleSave } = useTooltipDraft<string[]>(
    initial,
    isEditing,
    setHasUnsavedChanges,
    onSave,
    close,
    onSaveTriggerRef,
    onDiscardTriggerRef
  );

  const addItem = () => setDraft([...draft, ""]);
  const updateItem = (idx: number, next: string) => setDraft(draft.map((item, itemIdx) => (itemIdx === idx ? next : item)));
  const removeItem = (idx: number) => setDraft(draft.filter((_, itemIdx) => itemIdx !== idx));

  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0">
      <div className="flex items-center gap-2 border-b border-current/[0.06] pb-2">
        <AlertCircle className="w-4 h-4 text-[#75E2FF]" />
        <span className="text-[10px] font-black tracking-[0.15em] uppercase opacity-45">Missing Items</span>
      </div>
      {isEditing ? (
        <>
          <div className="flex-1 overflow-y-auto space-y-2">
            {draft.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => updateItem(idx, e.target.value)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold outline-none ${
                    isDark ? "bg-black/35 border-white/10 text-white" : "bg-white border-black/10 text-black"
                  }`}
                />
                <button type="button" onClick={() => removeItem(idx)} className="p-2 rounded-full text-rose-400 hover:bg-rose-500/10">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={addItem} className="p-2 rounded-xl bg-current/5 text-current/70">
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleSave} className="flex-1 py-2 rounded-xl bg-[#75E2FF] text-black text-[10px] font-black uppercase">
              Save Missing Items
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1">
            {hasValue && initial.length > 0 ? initial.map((item, idx) => (
              <div key={idx} className="text-xs font-semibold opacity-75">{item}</div>
            )) : <p className="text-xs font-semibold opacity-45">No missing data assigned</p>}
          </div>
          <button onClick={() => setIsEditing(true)} className="text-left text-[10px] font-black uppercase tracking-widest text-[#75E2FF]">
            Click to edit missing items
          </button>
        </>
      )}
    </div>
  );
}
