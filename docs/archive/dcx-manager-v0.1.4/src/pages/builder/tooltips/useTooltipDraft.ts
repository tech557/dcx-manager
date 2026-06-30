import { useEffect, useState } from "react";
import type React from "react";

export function useTooltipDraft<T>(
  value: T,
  isEditing: boolean,
  setHasUnsavedChanges: ((val: boolean) => void) | undefined,
  onSave: (newValue: T) => void,
  close: (force?: boolean) => void,
  onSaveTriggerRef?: React.MutableRefObject<(() => void) | null>,
  onDiscardTriggerRef?: React.MutableRefObject<(() => void) | null>
) {
  const [draft, setDraftState] = useState<T>(value);

  useEffect(() => {
    if (!isEditing) setDraftState(value);
  }, [value, isEditing]);

  const setDraft = (next: T) => {
    setDraftState(next);
    setHasUnsavedChanges?.(true);
  };

  const handleSave = () => {
    onSave(draft);
    setHasUnsavedChanges?.(false);
    close(true);
  };

  const handleDiscard = () => {
    setDraftState(value);
    setHasUnsavedChanges?.(false);
    close(true);
  };

  useEffect(() => {
    if (onSaveTriggerRef) onSaveTriggerRef.current = handleSave;
    if (onDiscardTriggerRef) onDiscardTriggerRef.current = handleDiscard;
    return () => {
      if (onSaveTriggerRef) onSaveTriggerRef.current = null;
      if (onDiscardTriggerRef) onDiscardTriggerRef.current = null;
    };
  }, [draft, value]);

  return { draft, setDraft, handleSave, handleDiscard };
}
