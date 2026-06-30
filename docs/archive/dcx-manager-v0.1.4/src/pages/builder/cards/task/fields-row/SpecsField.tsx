import React from "react";
import { Sliders } from "lucide-react";
import { InteractiveTooltip } from "../InteractiveTooltip";
import { TaskHoverTooltip } from "../TaskHoverTooltip";
import { TaskCardData } from "../../../../../types";
import { useTheme } from "../../../../../hooks/useTheme";


interface SpecsFieldProps {
  task: TaskCardData;
  onSaveField: (field: "sender" | "receiver" | "message" | "missing" | "specs", value: any) => void;
}

export function SpecsField({ task, onSaveField }: SpecsFieldProps) {
  const { isDark } = useTheme();
  const hasSpecs = !!task.specsIdentifier && task.specsIdentifier.trim().length > 0;

  const activeClasses = isDark
    ? "bg-[#75E2FF]/15 border border-[#75E2FF]/25 text-[#75E2FF] hover:bg-[#75E2FF]/25"
    : "bg-[#75E2FF]/10 border border-[#75E2FF]/15 text-[#55b3cc] hover:bg-[#75E2FF]/20";

  const inactiveClasses = isDark
    ? "text-neutral-450 hover:text-[#75E2FF]"
    : "text-neutral-400 hover:text-[#75E2FF]";

  return (
    <InteractiveTooltip
      disableHover={!hasSpecs}
      defaultSize={{ width: 320, height: 180 }}
      content={({ isEditing, setIsEditing, close, size, setHasUnsavedChanges, onSaveTriggerRef, onDiscardTriggerRef }) => (
        <TaskHoverTooltip 
          type="specs"  
          value={task.specsIdentifier} 
          hasValue={hasSpecs}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          close={close}
          size={size}
          onSave={(val) => onSaveField("specs", val)}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onSaveTriggerRef={onSaveTriggerRef}
          onDiscardTriggerRef={onDiscardTriggerRef}
        />
      )}
    >
      <div 
        className={`w-5 h-5 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 ${
          hasSpecs ? `rounded-full ${activeClasses}` : inactiveClasses
        }`}
        title="Specification details"
      >
        <Sliders className="w-2.5 h-2.5" />
      </div>
    </InteractiveTooltip>
  );
}
