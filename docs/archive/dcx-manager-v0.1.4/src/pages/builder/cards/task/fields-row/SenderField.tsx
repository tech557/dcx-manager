import React from "react";
import { User } from "lucide-react";
import { InteractiveTooltip } from "../InteractiveTooltip";
import { TaskHoverTooltip } from "../TaskHoverTooltip";
import { TaskCardData } from "../../../../../types";
import { useTheme } from "../../../../../hooks/useTheme";


interface SenderFieldProps {
  task: TaskCardData;
  onSaveField: (field: "sender" | "receiver" | "message" | "missing" | "specs", value: any) => void;
}

export function SenderField({ task, onSaveField }: SenderFieldProps) {
  const { isDark } = useTheme();
  const hasSender = !!task.senderId;

  const activeClasses = isDark
    ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25"
    : "bg-emerald-500/10 border border-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20";

  const inactiveClasses = isDark
    ? "text-neutral-450 hover:text-[#75E2FF]"
    : "text-neutral-400 hover:text-[#75E2FF]";

  return (
    <InteractiveTooltip
      disableHover={!hasSender}
      defaultSize={{ width: 320, height: 180 }}
      content={({ isEditing, setIsEditing, close, size, setHasUnsavedChanges, onSaveTriggerRef, onDiscardTriggerRef }) => (
        <TaskHoverTooltip 
          type="sender"  
          value={task.senderId} 
          hasValue={hasSender}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          close={close}
          size={size}
          onSave={(val) => onSaveField("sender", val)}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onSaveTriggerRef={onSaveTriggerRef}
          onDiscardTriggerRef={onDiscardTriggerRef}
        />
      )}
    >
      <div 
        className={`w-5 h-5 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 ${
          hasSender ? `rounded-full ${activeClasses}` : inactiveClasses
        }`}
        title="Task Sender"
      >
        <User className="w-2.5 h-2.5" />
      </div>
    </InteractiveTooltip>
  );
}
