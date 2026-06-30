import React from "react";
import { SenderTooltipEditor } from "../../tooltips/SenderTooltipEditor";
import { ReceiverTooltipEditor } from "../../tooltips/ReceiverTooltipEditor";
import { MessageTooltipEditor } from "../../tooltips/MessageTooltipEditor";
import { SpecsTooltipEditor } from "../../tooltips/SpecsTooltipEditor";
import { MissingDataTooltipEditor } from "../../tooltips/MissingDataTooltipEditor";
import { DateTooltipEditor } from "../../tooltips/DateTooltipEditor";
import { useTheme } from "../../../../hooks/useTheme";


interface TaskHoverTooltipProps {
  type: "sender" | "receiver" | "specs" | "message" | "missing" | "name" | "date";
  value: any;
  hasValue: boolean;
  
  // Interactive Editing State Props:
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  close: (force?: boolean) => void;
  size: { width: number; height: number };
  onSave: (newValue: any) => void;
  onAddMissingItem?: (item: string) => void;
  onRemoveMissingItem?: (idx: number) => void;

  setHasUnsavedChanges?: (val: boolean) => void;
  onSaveTriggerRef?: React.MutableRefObject<(() => void) | null>;
  onDiscardTriggerRef?: React.MutableRefObject<(() => void) | null>;
}

export function TaskHoverTooltip(props: TaskHoverTooltipProps) {
  const { isDark } = useTheme();
  const { 
    type, 
value, 
    hasValue, 
    isEditing, 
    setIsEditing, 
    close, 
    onSave,
    setHasUnsavedChanges,
    onSaveTriggerRef,
    onDiscardTriggerRef,
    onAddMissingItem,
    onRemoveMissingItem
  } = props;

  const renderLabel = () => {
    switch (type) {
      case "sender": return "Sender";
      case "receiver": return "Receiver";
      case "name": return "Task Name";
      case "date": return "Due Date";
      case "message": return "Message Copy";
      case "missing": return "Missing Items";
      case "specs": return "Specifications";
      default: return "Details";
    }
  };

  const formattedValue = () => {
    if (!hasValue || value === undefined || value === null) {
      return "Not set";
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (type === "specs") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => `${item.label || item.key || "Spec"}: ${item.value}`).join(", ");
        }
      } catch (e) {}
    }
    return String(value);
  };

  // Dispatch to corresponding editor if present
  switch (type) {
    case "message":
      return (
        <MessageTooltipEditor
          value={value}
          hasValue={hasValue}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          close={close}
          onSave={onSave}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onSaveTriggerRef={onSaveTriggerRef}
          onDiscardTriggerRef={onDiscardTriggerRef}
        />
      );
    case "sender":
      return (
        <SenderTooltipEditor
          value={value}
          hasValue={hasValue}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          close={close}
          onSave={onSave}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onSaveTriggerRef={onSaveTriggerRef}
          onDiscardTriggerRef={onDiscardTriggerRef}
        />
      );
    case "receiver":
      return (
        <ReceiverTooltipEditor
          value={value}
          hasValue={hasValue}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          close={close}
          onSave={onSave}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onSaveTriggerRef={onSaveTriggerRef}
          onDiscardTriggerRef={onDiscardTriggerRef}
        />
      );
    case "specs":
      return (
        <SpecsTooltipEditor
          value={value}
          hasValue={hasValue}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          close={close}
          onSave={onSave}
        />
      );
    case "missing":
      return (
        <MissingDataTooltipEditor
          value={value}
          hasValue={hasValue}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          close={close}
          onSave={onSave}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onSaveTriggerRef={onSaveTriggerRef}
          onDiscardTriggerRef={onDiscardTriggerRef}
        />
      );
    case "date":
      return (
        <DateTooltipEditor
          value={value}
          hasValue={hasValue}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          close={close}
          onSave={onSave}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onSaveTriggerRef={onSaveTriggerRef}
          onDiscardTriggerRef={onDiscardTriggerRef}
        />
      );
    default:
      return (
        <div className={`p-3 font-sans transition-all duration-300 ${isDark ? "text-[#75E2FF]" : "text-slate-800"}`}>
          <span className="block text-[8px] tracking-[0.2em] opacity-40 uppercase font-black mb-1">
            {renderLabel()}
          </span>
          <span className="block text-[11px] font-bold leading-relaxed break-words">
            {formattedValue()}
          </span>
        </div>
      );
  }
}
