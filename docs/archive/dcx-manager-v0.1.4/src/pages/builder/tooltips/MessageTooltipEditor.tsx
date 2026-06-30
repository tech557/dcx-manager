import type React from "react";
import { MessageSquare } from "lucide-react";
import { useTooltipDraft } from "./useTooltipDraft";
import { useTheme } from "../../../hooks/useTheme";


interface MessageTooltipEditorProps {
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

export function MessageTooltipEditor({
value,
  hasValue,
  isEditing,
  setIsEditing,
  close,
  onSave,
  setHasUnsavedChanges,
  onSaveTriggerRef,
  onDiscardTriggerRef,
}: MessageTooltipEditorProps) {
  const { isDark } = useTheme();
  const { draft, setDraft, handleSave } = useTooltipDraft<string>(
    value || "",
    isEditing,
    setHasUnsavedChanges,
    onSave,
    close,
    onSaveTriggerRef,
    onDiscardTriggerRef
  );

  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0">
      <div className="flex items-center gap-2 border-b border-current/[0.06] pb-2">
        <MessageSquare className="w-4 h-4 text-[#75E2FF]" />
        <span className="text-[10px] font-black tracking-[0.15em] uppercase opacity-45">Message Copy</span>
      </div>
      {isEditing ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={`flex-1 min-h-24 rounded-xl border p-3 text-xs font-semibold resize-none outline-none ${
              isDark ? "bg-black/35 border-white/10 text-white" : "bg-white border-black/10 text-black"
            }`}
            autoFocus
          />
          <button onClick={handleSave} className="py-2 rounded-xl bg-[#75E2FF] text-black text-[10px] font-black uppercase">
            Save Message
          </button>
        </>
      ) : (
        <>
          <p className="text-xs font-semibold leading-relaxed opacity-75 whitespace-pre-wrap">
            {hasValue ? value : "No delivery message assigned"}
          </p>
          <button onClick={() => setIsEditing(true)} className="text-left text-[10px] font-black uppercase tracking-widest text-[#75E2FF]">
            Click to edit message
          </button>
        </>
      )}
    </div>
  );
}
