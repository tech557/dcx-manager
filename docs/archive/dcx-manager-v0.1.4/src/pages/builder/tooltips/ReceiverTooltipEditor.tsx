import React from "react";
import { User } from "lucide-react";
import { TASK_RECEIVERS } from "../../../mock/taskDropdowns";
import { useTooltipDraft } from "./useTooltipDraft";
import { useTheme } from "../../../hooks/useTheme";


interface ReceiverTooltipEditorProps {
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

export function ReceiverTooltipEditor({
value,
  hasValue,
  isEditing,
  setIsEditing,
  close,
  onSave,
  setHasUnsavedChanges,
  onSaveTriggerRef,
  onDiscardTriggerRef
}: ReceiverTooltipEditorProps) {
  const { isDark } = useTheme();
  const activeReceiver = TASK_RECEIVERS.find((r) => r.id === value) || TASK_RECEIVERS[0];

  const { draft, setDraft, handleSave } = useTooltipDraft<string>(
    value || "",
    isEditing,
    setHasUnsavedChanges,
    onSave,
    close,
    onSaveTriggerRef,
    onDiscardTriggerRef
  );

  const gilroyStyle = { fontFamily: "Gilroy, -apple-system, BlinkMacSystemFont, sans-serif" };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0 w-full" style={gilroyStyle}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
          <User className="w-4 h-4 text-[#75E2FF] shrink-0" />
          <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase opacity-45">
            Recipient Target
          </span>
        </div>

        {isEditing ? (
          <div className="pt-2 no-close-on-click" style={gilroyStyle}>
            <label className="block text-[8px] font-extrabold tracking-widest uppercase opacity-40 mb-1">
              Choose Recipient
            </label>
            <select
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-semibold cursor-pointer outline-none transition-all ${
                isDark 
                  ? "bg-[#0D0D0E]/80 border-white/10 text-white focus:border-[#75E2FF]/60" 
                  : "bg-slate-50 border-black/10 text-black focus:border-[#75E2FF]/30"
              }`}
              style={gilroyStyle}
            >
              <option value="">-- Choose Recipient Analyst --</option>
              {TASK_RECEIVERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.role})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-1 py-1" style={gilroyStyle}>
            {hasValue ? (
              <>
                <p className="font-extrabold text-sm tracking-tight text-current">{activeReceiver.name}</p>
                <p className="opacity-50 text-[11px] font-semibold">{activeReceiver.role}</p>
              </>
            ) : (
              <p className="font-bold text-xs opacity-40 italic">Recipient Target Analyst Not Assigned</p>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <button
          onClick={handleSave}
          className="mt-3 w-full py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider bg-[#75E2FF] hover:bg-[#5fc0db] text-neutral-900 transition-colors shrink-0 cursor-pointer shadow-md"
          style={gilroyStyle}
        >
          Save Recipient Selection
        </button>
      ) : (
        <div 
          className="pt-3 text-left text-[#75E2FF] hover:text-[#5fc0db] font-extrabold text-[10px] tracking-widest uppercase cursor-pointer border-t border-white/[0.04] transition-colors"
          onClick={() => setIsEditing(true)}
          style={gilroyStyle}
        >
          ● Click to edit target
        </div>
      )}
    </div>
  );
}
