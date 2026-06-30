import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, CheckSquare } from "lucide-react";
import { TaskCardData, EnrichedVersion } from "../../../../../types";
import { BLUR } from "../../../../../styles/tokens";
import { TaskDate } from "../../../../../types/domain";
import { useBuilderStore } from "../../../../../store/builderStore";

// Base styling input components
import { TaskTitleField } from "./components/TaskTitleField";
import { DeliveryMessageField } from "./components/DeliveryMessageField";
import { SpecItem } from "./components/SpecsIdentifierField";

// Modularized sections
import { IntakeSection } from "./sections/IntakeSection";
import { DateSection } from "./sections/DateSection";
import { SpecsSection } from "./sections/SpecsSection";
import { MissingFieldsSection } from "./sections/MissingFieldsSection";
import { SubtaskSection } from "./sections/SubtaskSection";
import { useTheme } from "../../../../../hooks/useTheme";


interface TaskEditorProps {
  task: TaskCardData;
  onSave: (updatedTask: TaskCardData) => void;
  onCancel: () => void;
  currentVersion?: EnrichedVersion;
}

export function TaskEditor({
task,
  onSave,
  onCancel,
  currentVersion,
}: TaskEditorProps) {
  const { isDark } = useTheme();
  // Form States
  const [name, setName] = useState("");
  const [channelId, setChannelId] = useState("");
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [specsList, setSpecsList] = useState<SpecItem[]>([]);
  const [targetDayStr, setTargetDayStr] = useState("");
  const [missingDataList, setMissingDataList] = useState<string[]>([]);
  const [isSyncedRel, setIsSyncedRel] = useState(false);
  const [syncedWeekOffset, setSyncedWeekOffset] = useState<number | undefined>(undefined);
  const [syncedDayOffset, setSyncedDayOffset] = useState<number | undefined>(undefined);
  const [subtasks, setSubtasks] = useState<{ id: string; label: string; done: boolean; duration?: string }[]>([]);

  // Sliding warning notifications
  const [lastLoadedTaskId, setLastLoadedTaskId] = useState<string>("");
  const [pendingTaskToSwitch, setPendingTaskToSwitch] = useState<{ task: TaskCardData; phaseId: string; actionCardId: string } | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState<"close" | "switch" | null>(null);

  // Parse Helper to load spec list
  const loadSpecs = (rawSpecs: string): SpecItem[] => {
    if (!rawSpecs) return [];
    try {
      const parsed = JSON.parse(rawSpecs);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          label: item.label || item.key || "Spec Name",
          value: item.value || ""
        }));
      }
    } catch (e) {}

    const colonIdx = rawSpecs.indexOf(":");
    if (colonIdx !== -1) {
      return [{
        label: rawSpecs.substring(0, colonIdx).trim() || "Spec Code",
        value: rawSpecs.substring(colonIdx + 1).trim()
      }];
    }
    return [{
      label: "Spec Code",
      value: rawSpecs.trim()
    }];
  };

  // Convert states to cleanly typed TaskDate model
  const getTaskDate = (): TaskDate => {
    if (isSyncedRel) {
      return {
        mode: "linked",
        weekOffset: syncedWeekOffset ?? 1,
        dayOffset: syncedDayOffset ?? 1
      };
    }
    if (targetDayStr) {
      return {
        mode: "fixed",
        date: targetDayStr
      };
    }
    return { mode: "unset" };
  };

  const handleTaskDateChange = (d: TaskDate) => {
    if (d.mode === "unset") {
      setIsSyncedRel(false);
      setTargetDayStr("");
      setSyncedWeekOffset(undefined);
      setSyncedDayOffset(undefined);
    } else if (d.mode === "fixed") {
      setIsSyncedRel(false);
      setTargetDayStr(d.date);
      setSyncedWeekOffset(undefined);
      setSyncedDayOffset(undefined);
    } else if (d.mode === "linked") {
      setIsSyncedRel(true);
      setTargetDayStr(`Week ${d.weekOffset} - Day ${d.dayOffset}`);
      setSyncedWeekOffset(d.weekOffset);
      setSyncedDayOffset(d.dayOffset);
    }
  };

  // Checks for raw field updates from original state definition values
  const getHasChanges = () => {
    const initialName = task.name;
    const initialChannelId = task.channelId;
    const initialMessage = task.message || "";
    const initialSenderId = task.senderId;
    const initialReceiverId = task.receiverId;
    const initialSpecs = JSON.stringify(loadSpecs(task.specsIdentifier || ""));
    const initialCommDate = (task.date?.mode === "fixed" ? task.date.date : (task.date?.mode === "linked" ? `Week ${task.date.weekOffset} - Day ${task.date.dayOffset}` : "")) || new Date().toISOString().split('T')[0];
    const initialIsLinked = task.date?.mode === "linked" || false;
    const initialLinkedWeek = task.date?.mode === "linked" ? task.date.weekOffset : undefined;
    const initialLinkedDay = task.date?.mode === "linked" ? task.date.dayOffset : undefined;
    const initialSubtasks = JSON.stringify(task.subtasks || []);
    const initialMissingData = JSON.stringify(task.missingData || []);

    const hasNameChanged = name !== initialName;
    const hasChannelChanged = channelId !== initialChannelId;
    const hasMessageChanged = message !== initialMessage;
    const hasSenderChanged = senderId !== initialSenderId;
    const hasReceiverChanged = receiverId !== initialReceiverId;
    const hasSpecsChanged = JSON.stringify(specsList) !== initialSpecs;
    const hasCommDateChanged = targetDayStr !== initialCommDate;
    const hasIsLinkedChanged = isSyncedRel !== initialIsLinked;
    const hasLinkedWeekChanged = isSyncedRel && (syncedWeekOffset !== initialLinkedWeek);
    const hasLinkedDayChanged = isSyncedRel && (syncedDayOffset !== initialLinkedDay);
    const hasSubtasksChanged = JSON.stringify(subtasks) !== initialSubtasks;
    const hasMissingDataChanged = JSON.stringify(missingDataList) !== initialMissingData;

    return (
      hasNameChanged ||
      hasChannelChanged ||
      hasMessageChanged ||
      hasSenderChanged ||
      hasReceiverChanged ||
      hasSpecsChanged ||
      hasCommDateChanged ||
      hasIsLinkedChanged ||
      hasLinkedWeekChanged ||
      hasLinkedDayChanged ||
      hasSubtasksChanged ||
      hasMissingDataChanged
    );
  };

  const syncFormWithTask = (t: TaskCardData) => {
    setName(t.name);
    setChannelId(t.channelId);
    setMessage(t.message || "");
    setSenderId(t.senderId);
    setReceiverId(t.receiverId);
    setSpecsList(loadSpecs(t.specsIdentifier || ""));
    const initialDateVal = (t.date?.mode === "fixed" ? t.date.date : (t.date?.mode === "linked" ? `Week ${t.date.weekOffset} - Day ${t.date.dayOffset}` : "")) || new Date().toISOString().split('T')[0];
    setTargetDayStr(initialDateVal);
    setMissingDataList(t.missingData || []);
    setIsSyncedRel(t.date?.mode === "linked" || false);
    setSyncedWeekOffset(t.date?.mode === "linked" ? t.date.weekOffset : undefined);
    setSyncedDayOffset(t.date?.mode === "linked" ? t.date.dayOffset : undefined);
    setSubtasks(t.subtasks || []);
  };

  useEffect(() => {
    if (!task) return;

    if (!lastLoadedTaskId) {
      syncFormWithTask(task);
      setLastLoadedTaskId(task.id);
    } else if (lastLoadedTaskId === task.id) {
      if (!getHasChanges()) {
        syncFormWithTask(task);
      }
    } else {
      if (getHasChanges()) {
        setPendingTaskToSwitch({ task, phaseId: "", actionCardId: "" });
        setShowUnsavedWarning("switch");
      } else {
        syncFormWithTask(task);
        setLastLoadedTaskId(task.id);
      }
    }
  }, [task]);

  // Keep Zustand store dirty indicator in sync with form state changes
  useEffect(() => {
    const hasChanges = getHasChanges();
    useBuilderStore.getState().setIsDirty(hasChanges);
    return () => {
      useBuilderStore.getState().setIsDirty(false);
    };
  }, [name, channelId, message, senderId, receiverId, specsList, targetDayStr, isSyncedRel, syncedWeekOffset, syncedDayOffset, subtasks, missingDataList, task]);

  // Handle external task-switch-blocked broadcast
  useEffect(() => {
    const handleSwitchBlocked = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { task, phaseId, actionCardId } = customEvent.detail;
      setPendingTaskToSwitch({ task, phaseId, actionCardId });
      setShowUnsavedWarning("switch");
    };

    window.addEventListener("task-switch-blocked", handleSwitchBlocked);
    return () => {
      window.removeEventListener("task-switch-blocked", handleSwitchBlocked);
    };
  }, []);

  const handleConfirmSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const updated: TaskCardData = {
      ...task,
      name: name.trim() ? name : task.name,
      channelId,
      message,
      senderId,
      receiverId,
      specsIdentifier: JSON.stringify(specsList.filter(s => s.label.trim() !== "" || s.value.trim() !== "")),
      missingData: missingDataList.filter(pt => pt.trim() !== ""),
      date: isSyncedRel && typeof syncedWeekOffset === "number" && typeof syncedDayOffset === "number"
        ? { mode: "linked", weekOffset: syncedWeekOffset, dayOffset: syncedDayOffset }
        : { mode: "fixed", date: targetDayStr || new Date().toISOString().split('T')[0] },
      subtasks,
    };

    useBuilderStore.getState().setIsDirty(false);
    onSave(updated);
  };

  const handleCancelClick = () => {
    if (getHasChanges()) {
      setShowUnsavedWarning("close");
    } else {
      onCancel();
    }
  };

  const handleWarningSave = () => {
    const updated: TaskCardData = {
      ...task,
      name: name.trim() ? name : task.name,
      channelId,
      message,
      senderId,
      receiverId,
      specsIdentifier: JSON.stringify(specsList.filter(s => s.label.trim() !== "" || s.value.trim() !== "")),
      missingData: missingDataList.filter(pt => pt.trim() !== ""),
      date: isSyncedRel && typeof syncedWeekOffset === "number" && typeof syncedDayOffset === "number"
        ? { mode: "linked", weekOffset: syncedWeekOffset, dayOffset: syncedDayOffset }
        : { mode: "fixed", date: targetDayStr || new Date().toISOString().split('T')[0] },
      subtasks,
    };

    useBuilderStore.getState().setIsDirty(false);
    onSave(updated);

    if (showUnsavedWarning === "switch" && pendingTaskToSwitch) {
      const toSwitch = pendingTaskToSwitch;
      setTimeout(() => {
        const handler = (t: any, pId: any, aId: any) => {
          useBuilderStore.getState().selectIds([t.id]);
          useBuilderStore.getState().setEditingTask({ task: t, phaseId: pId, actionCardId: aId });
        };
        handler(toSwitch.task, toSwitch.phaseId, toSwitch.actionCardId);
      }, 80);
    }

    setShowUnsavedWarning(null);
    setPendingTaskToSwitch(null);
  };

  const handleWarningDiscard = () => {
    useBuilderStore.getState().setIsDirty(false);

    if (showUnsavedWarning === "switch" && pendingTaskToSwitch) {
      setShowUnsavedWarning(null);
      const toSwitch = pendingTaskToSwitch;
      setPendingTaskToSwitch(null);

      syncFormWithTask(toSwitch.task);
      setLastLoadedTaskId(toSwitch.task.id);

      const handler = (t: any, pId: any, aId: any) => {
        useBuilderStore.getState().selectIds([t.id]);
        useBuilderStore.getState().setEditingTask({ task: t, phaseId: pId, actionCardId: aId });
      };
      handler(toSwitch.task, toSwitch.phaseId, toSwitch.actionCardId);
    } else {
      setShowUnsavedWarning(null);
      onCancel();
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden font-sans">
      
      {/* Main Form Panel */}
      <div className="w-full h-full flex flex-col p-5 relative">
        {/* Header section with brand titles and SAVE/DISCARD next to Close button */}
        <div className="flex items-center justify-between pb-3 border-b border-current/[0.05] shrink-0">
          <div className="text-left">
            <p className="text-[10px] font-black tracking-[0.3em] text-[#75E2FF] uppercase font-mono leading-none">
              Task Workspace
            </p>
            <h3 className="font-extrabold text-[13px] tracking-tight text-current uppercase mt-1.5 leading-none">
              Configure Specs
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="header-btn-save"
              type="button"
              onClick={() => handleConfirmSave()}
              className="p-1.5 rounded-full bg-[#75E2FF]/10 hover:bg-[#75E2FF]/20 text-[#75E2FF] border border-[#75E2FF]/25 hover:border-[#75E2FF]/40 cursor-pointer transition-all duration-300 flex items-center justify-center shadow-[0_2px_8px_rgba(117,226,255,0.1)] hover:scale-105 active:scale-95"
              title="Save Changes"
            >
              <Check className="w-4 h-4 stroke-[2.5px]" />
            </button>
            
            <div className={`w-[1px] h-4 mx-0.5 ${isDark ? "bg-white/10" : "bg-black/10"}`} />
            
            <button
              id="header-btn-close"
              type="button"
              onClick={handleCancelClick}
              className={`p-1.5 rounded-full transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                isDark ? "hover:bg-white/10 text-neutral-400 hover:text-white" : "hover:bg-black/5 text-neutral-500 hover:text-black"
              }`}
              title="Cancel & lock editor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Workspace */}
        <form 
          onSubmit={handleConfirmSave} 
          className="flex-1 overflow-y-auto mt-4 space-y-6 pr-1 pb-16 scrollbar-thin custom-scrollbar min-h-0"
        >
          {/* Field 1 & 5: Task Title AND Integrated Communication Date */}
          <div className="grid grid-cols-[1fr_135px] gap-3">
            <TaskTitleField  
              value={name} 
              onChange={setName} 
            />
            <DateSection
              date={getTaskDate()}
              onChange={handleTaskDateChange}
              currentVersion={currentVersion}
            />
          </div>

          {/* Field 2: Delivery Message Area */}
          <DeliveryMessageField  
            value={message} 
            onChange={setMessage} 
          />

          {/* Field 3: Intake Configuration */}
          <IntakeSection
            channelId={channelId}
            senderId={senderId}
            receiverId={receiverId}
            onChannelChange={setChannelId}
            onSenderChange={setSenderId}
            onReceiverChange={setReceiverId}
          />

          {/* Field 4: Spec details */}
          <SpecsSection
            specsList={specsList}
            onChange={setSpecsList}
          />

          {/* Field 6: Missing Setup Items validations */}
          <MissingFieldsSection
            missingFields={missingDataList}
            onChange={setMissingDataList}
          />

          {/* Field 7: Subtask Requirements Checklist */}
          <SubtaskSection
            subtasks={subtasks}
            onChange={setSubtasks}
          />
        </form>
      </div>

      {/* Unsaved Changes Confirmation Overlays */}
      <AnimatePresence>
        {showUnsavedWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-50 ${BLUR.light} bg-black/40 flex items-center justify-center p-6`}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className={`w-full max-w-sm rounded-[2rem] p-6 border shadow-[0_24px_64px_rgba(0,0,0,0.3)] flex flex-col items-center text-center ${
                isDark
                  ? "bg-[#0d0d0e]/95 border-white/[0.08]"
                  : "bg-white/95 border-black/[0.08]"
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-amber-500/10 text-amber-500 animate-pulse">
                <CheckSquare className="w-5 h-5 stroke-[2px]" />
              </div>

              <span className="text-[10px] font-black tracking-[0.25em] text-amber-500 uppercase font-mono">
                Unsaved Changes
              </span>
              
              <h4 className="text-[15px] font-black tracking-tight mt-1.5 uppercase text-current">
                {showUnsavedWarning === "switch"
                  ? "Switch Configuration?"
                  : "Discard Workspace?"}
              </h4>

              <p className="text-xs opacity-60 font-medium px-2 mt-3 leading-relaxed">
                You have pending adjustments that are currently uncommitted. Saving updates the current task, or you can discard and proceed.
              </p>

              <div className="w-full space-y-2 mt-6 animate-fade-in">
                <button
                  type="button"
                  onClick={handleWarningSave}
                  className={`w-full py-3 rounded-2xl text-[11.5px] font-black uppercase tracking-wider cursor-pointer duration-300 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
                    isDark
                      ? "bg-[#75E2FF]/20 border border-[#75E2FF]/30 text-[#75E2FF] hover:bg-[#75E2FF]/30"
                      : "bg-[#75E2FF] text-black hover:bg-[#75E2FF]/90 font-black shadow-md shadow-[#75E2FF]/20"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5px]" />
                  Save alterations
                </button>

                <button
                  type="button"
                  onClick={handleWarningDiscard}
                  className="w-full py-3 rounded-2xl text-[11.5px] font-black uppercase tracking-wider cursor-pointer duration-300 transition-all flex items-center justify-center gap-2 border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <X className="w-3.5 h-3.5 stroke-[2px]" />
                  Discard changes
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUnsavedWarning(null);
                    setPendingTaskToSwitch(null);
                  }}
                  className={`w-full py-2.5 rounded-2xl text-[10px] font-semibold tracking-wider cursor-pointer duration-300 transition-colors uppercase leading-none mt-1 ${
                    isDark
                      ? "text-neutral-400 hover:text-white"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Go Back to edit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
