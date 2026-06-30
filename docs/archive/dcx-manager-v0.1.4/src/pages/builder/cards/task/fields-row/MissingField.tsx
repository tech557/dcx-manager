import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { InteractiveTooltip } from "../InteractiveTooltip";
import { TaskHoverTooltip } from "../TaskHoverTooltip";
import { TaskCardData } from "../../../../../types";
import { useTheme } from "../../../../../hooks/useTheme";


interface MissingFieldProps {
  task: TaskCardData;
  onSaveField: (field: "sender" | "receiver" | "message" | "missing" | "specs", value: any) => void;
}

export function MissingField({ task, onSaveField }: MissingFieldProps) {
  const { isDark } = useTheme();
  const missingItemsCount = task.missingData ? task.missingData.length : 0;
  const hasMissing = missingItemsCount > 0;

  const handleAddMissingItem = (newItem: string) => {
    const updated = [...(task.missingData || []), newItem];
    onSaveField("missing", updated);
  };

  const handleRemoveMissingItem = (idxToRemove: number) => {
    const updated = (task.missingData || []).filter((_, idx) => idx !== idxToRemove);
    onSaveField("missing", updated);
  };

  const activeClasses = isDark
    ? "bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold hover:bg-rose-500/20 relative"
    : "bg-rose-500/10 border border-rose-500/15 text-rose-600 font-bold hover:bg-rose-500/20 relative";

  const inactiveClasses = isDark
    ? "text-neutral-450 hover:text-[#75E2FF]"
    : "text-neutral-400 hover:text-[#75E2FF]";

  return (
    <InteractiveTooltip
      disableHover={!hasMissing}
      defaultSize={{ width: 350, height: 250 }}
      content={({ isEditing, setIsEditing, close, size, setHasUnsavedChanges, onSaveTriggerRef, onDiscardTriggerRef }) => (
        <TaskHoverTooltip 
          type="missing"  
          value={task.missingData} 
          hasValue={hasMissing}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          close={close}
          size={size}
          onSave={(val) => onSaveField("missing", val)}
          onAddMissingItem={handleAddMissingItem}
          onRemoveMissingItem={handleRemoveMissingItem}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onSaveTriggerRef={onSaveTriggerRef}
          onDiscardTriggerRef={onDiscardTriggerRef}
        />
      )}
    >
      <div 
        className={`w-5 h-5 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 ${
          hasMissing ? `rounded-full ${activeClasses}` : inactiveClasses
        }`}
        title="Missing Setup Items"
      >
        {hasMissing ? (
          <>
            <AlertCircle className="w-2.5 h-2.5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 text-[7px] text-white font-extrabold font-sans rounded-full flex items-center justify-center border border-white/10 shadow-sm leading-none">
              {missingItemsCount}
            </span>
          </>
        ) : (
          <CheckCircle2 className="w-2.5 h-2.5" />
        )}
      </div>
    </InteractiveTooltip>
  );
}
