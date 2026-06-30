import React from "react";
import { FileText } from "lucide-react";
import { InteractiveTooltip } from "../InteractiveTooltip";
import { TaskHoverTooltip } from "../TaskHoverTooltip";
import { TaskCardData } from "../../../../../types";
import { useTheme } from "../../../../../hooks/useTheme";


interface MessageFieldProps {
  task: TaskCardData;
  onSaveField: (field: "sender" | "receiver" | "message" | "missing" | "specs", value: any) => void;
}

export function MessageField({ task, onSaveField }: MessageFieldProps) {
  const { isDark } = useTheme();
  const hasMessage = !!task.message && task.message.trim().length > 0;

  const activeClasses = isDark
    ? "bg-[#75E2FF]/15 border border-[#75E2FF]/25 text-[#75E2FF] hover:bg-[#75E2FF]/25"
    : "bg-[#75E2FF]/10 border border-[#75E2FF]/15 text-[#55b3cc] hover:bg-[#75E2FF]/20";

  const inactiveClasses = isDark
    ? "text-neutral-450 hover:text-[#75E2FF]"
    : "text-neutral-400 hover:text-[#75E2FF]";

  return (
    <InteractiveTooltip
      disableHover={!hasMessage}
      alwaysResizable={true}
      defaultSize={{ width: 440, height: 280 }}
      content={({ isEditing, setIsEditing, close, size, setHasUnsavedChanges, onSaveTriggerRef, onDiscardTriggerRef }) => (
        <TaskHoverTooltip 
          type="message"  
          value={task.message} 
          hasValue={hasMessage}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          close={close}
          size={size}
          onSave={(val) => onSaveField("message", val)}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onSaveTriggerRef={onSaveTriggerRef}
          onDiscardTriggerRef={onDiscardTriggerRef}
        />
      )}
    >
      <div 
        className={`w-5 h-5 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 ${
          hasMessage ? `rounded-full ${activeClasses}` : inactiveClasses
        }`}
        title="Delivery Message Copy"
      >
        <FileText className="w-2.5 h-2.5" />
      </div>
    </InteractiveTooltip>
  );
}
