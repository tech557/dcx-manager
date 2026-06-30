import React from "react";
import { 
  Eye,
  Trash2, 
  Copy, 
  MessageSquare, 
  Mail, 
  Send, 
  Phone, 
  Bell, 
  Share2, 
  Calendar,
  Link2
} from "lucide-react";
import { motion } from "motion/react";
import { TASK_CHANNELS } from "../../../../mock/taskDropdowns";
import { TaskCardData, TaskDate } from "../../../../types";
import { BLUR } from "../../../../styles/tokens";
import { FieldsRow } from "./fields-row/FieldsRow";
import { NewTaskLoader } from "./NewTaskLoader";
import { InteractiveTooltip } from "./InteractiveTooltip";
import { TaskHoverTooltip } from "./TaskHoverTooltip";
import { ChannelIcon } from "../../../../components/ChannelIcon";
import { useBuilderStore } from "../../../../store/builderStore";
import { BuilderCardShell } from "../BuilderCardShell";
import { useTheme } from "../../../../hooks/useTheme";


interface FullTaskCardProps {
  task: TaskCardData;
  onEdit: (updatedTask: TaskCardData) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onStartEdit?: () => void;
  parentActionCardId?: string;
  parentPhaseId?: string;
  onToggleSmall: () => void;
}

export function FullTaskCard({
  task,
onEdit,
  onDelete,
  onDuplicate,
  onStartEdit,
  parentActionCardId,
  parentPhaseId,
  onToggleSmall
}: FullTaskCardProps) {
  const { isDark } = useTheme();
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editNameText, setEditNameText] = React.useState(task.name);

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const activeChannel = TASK_CHANNELS.find(ch => ch.id === task.channelId) || TASK_CHANNELS[0];
  
  const { communicationDateVal, isLinkedVal } = React.useMemo(() => {
    let dateVal = "2026-06-12";
    let isLinked = false;
    if (task.date) {
      if (task.date.mode === "linked") {
        dateVal = `Week ${task.date.weekOffset} - Day ${task.date.dayOffset}`;
        isLinked = true;
      } else if (task.date.mode === "fixed") {
        dateVal = task.date.date;
      }
    }
    return { communicationDateVal: dateVal, isLinkedVal: isLinked };
  }, [task.date]);

  const hasSender = !!task.senderId;
  const hasReceiver = !!task.receiverId;
  const hasMessage = !!task.message && task.message.trim().length > 0;
  const missingItemsCount = task.missingData ? task.missingData.length : 0;

  return (
    <BuilderCardShell
      id={task.id}
      isDraggable={true}
      dragType="task"
      dragData={{ task, sourceActionCardId: parentActionCardId }}
      parentActionCardId={parentActionCardId}
      parentPhaseId={parentPhaseId}
      variant="task-full"
      onDoubleClick={(e) => {
        e.stopPropagation();
        onToggleSmall();
      }}
      className="p-3 gap-2.5 overflow-visible font-sans animate-none"
    >
      {({ isNewlyCreated, showData }) => (
        <>
          {isNewlyCreated && !showData ? (
            <NewTaskLoader />
          ) : (
            <motion.div
              initial={isNewlyCreated ? { opacity: 0, y: 3 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2 w-full font-sans"
            >
          <div className="flex items-start justify-between gap-2.5 min-h-[40px] font-sans">
            {/* Left side: Compact Channel Icon and Name with Communication Date */}
            <div className="flex-1 min-w-0 flex items-start gap-2.5 font-sans">
              <InteractiveTooltip
                disableHover={true}
                content={
                  <div 
                    style={{ fontFamily: "'Gilroy', sans-serif" }}
                    className={`px-2.5 py-1 rounded-xl text-[8px] tracking-[0.08em] uppercase font-black font-sans shadow-md ${BLUR.light} whitespace-nowrap border ${
                      isDark ? "bg-neutral-900 border-white/5 text-[#75E2FF]" : "bg-white border-black/5 text-[#42afcb]"
                    }`}
                  >
                    {activeChannel.name}
                  </div>
                }
              >
                <div 
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 cursor-pointer ${
                    isDark 
                      ? "bg-white/5 border-white/10 text-[#75E2FF] hover:bg-[#75E2FF]/10 hover:border-[#75E2FF]/30" 
                      : "bg-black/[0.03] border-black/[0.08] text-[#55b3cc] hover:bg-[#75E2FF]/10 hover:border-[#75E2FF]/30"
                  }`}
                >
                  <ChannelIcon name={activeChannel.iconName} className="w-3.5 h-3.5 shrink-0" />
                </div>
              </InteractiveTooltip>

              {/* Task Title, Communication Date below & Indicators row directly below */}
              <div className="flex-1 min-w-0 font-sans">
                {isEditingName ? (
                  <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editNameText}
                      autoFocus
                      onChange={(e) => setEditNameText(e.target.value)}
                      onBlur={() => {
                        onEdit({ ...task, name: editNameText });
                        setIsEditingName(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onEdit({ ...task, name: editNameText });
                          setIsEditingName(false);
                        }
                        if (e.key === "Escape") {
                          setEditNameText(task.name);
                          setIsEditingName(false);
                        }
                      }}
                      className={`w-full bg-transparent text-[11.5px] font-extrabold leading-snug tracking-tight border-b outline-none pb-0.5 transition-colors ${
                        isDark ? "border-[#75E2FF] text-white" : "border-[#75E2FF]/60 text-black"
                      }`}
                    />
                  </div>
                ) : (
                  <InteractiveTooltip
                    disableHover={true}
                    defaultSize={{ width: 280, height: 140 }}
                    content={({ isEditing, setIsEditing, close, size, setHasUnsavedChanges, onSaveTriggerRef, onDiscardTriggerRef }) => (
                      <TaskHoverTooltip 
                        type="name"  
                        value={task.name} 
                        hasValue={true}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        close={close}
                        size={size}
                        onSave={(val) => onEdit({ ...task, name: val })}
                        setHasUnsavedChanges={setHasUnsavedChanges}
                        onSaveTriggerRef={onSaveTriggerRef}
                        onDiscardTriggerRef={onDiscardTriggerRef}
                      />
                    )}
                  >
                    <span 
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditNameText(task.name);
                        setIsEditingName(true);
                      }}
                      className="font-sans font-extrabold text-[11.5px] text-current leading-snug tracking-tight break-words block cursor-pointer hover:text-[#75E2FF] transition-all duration-300"
                    >
                      {capitalizeFirstLetter(task.name)}
                    </span>
                  </InteractiveTooltip>
                )}
                <InteractiveTooltip
                  disableHover={true}
                  defaultSize={{ width: 335, height: 350 }}
                  content={({ isEditing, setIsEditing, close, size, setHasUnsavedChanges, onSaveTriggerRef, onDiscardTriggerRef }) => (
                    <TaskHoverTooltip 
                      type="date"  
                      value={communicationDateVal} 
                      hasValue={true}
                      isEditing={isEditing}
                      setIsEditing={setIsEditing}
                      close={close}
                      size={size}
                      onSave={(val) => {
                        let newDate: TaskDate;
                        if (val.toLowerCase().includes("week")) {
                          const regex = /week\s*(\d+)\s*-\s*day\s*(\d+)/i;
                          const match = val.match(regex);
                          if (match) {
                            newDate = {
                              mode: "linked",
                              weekOffset: parseInt(match[1], 10),
                              dayOffset: parseInt(match[2], 10)
                            };
                          } else {
                            newDate = { mode: "unset" };
                          }
                        } else {
                          newDate = {
                            mode: "fixed",
                            date: val
                          };
                        }
                        onEdit({ ...task, date: newDate });
                      }}
                      setHasUnsavedChanges={setHasUnsavedChanges}
                      onSaveTriggerRef={onSaveTriggerRef}
                      onDiscardTriggerRef={onDiscardTriggerRef}
                    />
                  )}
                >
                  <div className="flex items-center gap-1.5 text-[9px] font-sans font-bold opacity-50 mt-0.5 cursor-pointer hover:text-[#75E2FF] transition-all duration-300" title="Communication date">
                    {isLinkedVal ? (
                      <Link2 className="w-2.5 h-2.5 shrink-0 text-[#75E2FF]" />
                    ) : (
                      <Calendar className="w-2.5 h-2.5 shrink-0 opacity-70" />
                    )}
                    <span className="font-sans">
                      {(() => {
                        const dateVal = communicationDateVal;
                        const isLinked = isLinkedVal;
                        if (!isLinked) return dateVal;
                        
                        const activeVer = useBuilderStore.getState().activeVersion;
                        const baseDate = activeVer?.communicatedDate || "2026-06-13";
                        
                        const parseLinkedValue = (str: string) => {
                          const regex = /week\s*(\d+)\s*-\s*day\s*(\d+)/i;
                          const match = str.match(regex);
                          if (match) return { week: parseInt(match[1], 10), day: parseInt(match[2], 10) };
                          return null;
                        };
                        
                        const parsed = parseLinkedValue(dateVal);
                        if (!parsed) return dateVal;
                        
                        const baseD = new Date(baseDate);
                        if (isNaN(baseD.getTime())) return dateVal;
                        
                        const baseDayOfWeek = baseD.getDay();
                        let dayIdx = 0;
                        if (parsed.week === 1) {
                          dayIdx = parsed.day - 1 + baseDayOfWeek;
                        } else {
                          dayIdx = parsed.day - 1;
                        }
                        
                        const d = new Date(baseDate);
                        const startSunday = new Date(d);
                        startSunday.setDate(d.getDate() - baseDayOfWeek);
                        const targetDate = new Date(startSunday);
                        targetDate.setDate(startSunday.getDate() + (parsed.week - 1) * 7 + dayIdx);
                        
                        if (isNaN(targetDate.getTime())) return dateVal;
                        
                        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        const dName = days[targetDate.getDay()];
                        const dNum = targetDate.getDate();
                        const mName = months[targetDate.getMonth()];
                        
                        return `${dateVal} (${dName} ${dNum} ${mName})`;
                      })()}
                    </span>
                  </div>
                </InteractiveTooltip>

                {/* Move the icons directly below the date */}
                <FieldsRow
                  task={task}
                  onEdit={onEdit}
                />
              </div>
            </div>

            {/* Action buttons on the right side, realigned so View/Specs is at top */}
            <div className="flex flex-col items-center gap-1 shrink-0 opacity-0 group-hover/task:opacity-100 transition-opacity duration-300 font-sans">
              {/* VIEW SPECS AND WORKSPACE is at the very top */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartEdit?.();
                }}
                className={`p-1 rounded-lg cursor-pointer transition-colors border ${
                  isDark 
                    ? "bg-[#75E2FF]/10 border-[#75E2FF]/20 text-[#75E2FF] hover:bg-[#75E2FF]/25" 
                    : "bg-[#75E2FF]/5 border-[#75E2FF]/15 text-[#55b3cc] hover:bg-[#75E2FF]/15"
                }`}
                title="View Specs & Workspace"
              >
                <Eye className="w-3 h-3 stroke-[2.5]" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className={`p-1 rounded-lg cursor-pointer transition-colors ${
                  isDark ? "hover:bg-white/10 text-neutral-400 hover:text-white" : "hover:bg-black/5 text-neutral-500 hover:text-black"
                }`}
                title="Duplicate task"
              >
                <Copy className="w-3 h-3" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className={`p-1 rounded-lg cursor-pointer transition-colors ${
                  isDark ? "hover:bg-rose-500/15 text-rose-450 hover:text-rose-400" : "hover:bg-rose-500/10 text-neutral-500 hover:text-rose-600"
                }`}
                title="Delete task"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )}
</BuilderCardShell>
  );
}
