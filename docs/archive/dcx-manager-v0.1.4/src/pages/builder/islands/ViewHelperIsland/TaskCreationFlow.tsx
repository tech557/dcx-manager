import React from "react";
import { Plus, ChevronRight } from "lucide-react";
import { TASK_CHANNELS } from "../../../../mock/taskDropdowns";
import { ChannelIcon } from "../../../../components/ChannelIcon";
import { useTheme } from "../../../../hooks/useTheme";


interface TaskCreationFlowProps {
  creationStep: "phase" | "action" | "task_name";
  phases: any[];
  isCreatingNewPhase: boolean;
  setIsCreatingNewPhase: (val: boolean) => void;
  newPhaseName: string;
  setNewPhaseName: (val: string) => void;
  selectedPhaseId: string;
  setSelectedPhaseId: (val: string) => void;
  isCreatingNewAction: boolean;
  setIsCreatingNewAction: (val: boolean) => void;
  newActionName: string;
  setNewActionName: (val: string) => void;
  selectedActionId: string;
  setSelectedActionId: (val: string) => void;
  newTaskName: string;
  setNewTaskName: (val: string) => void;
  selectedChannelId: string;
  setSelectedChannelId: (val: string) => void;
  setCreationStep: (val: "phase" | "action" | "task_name") => void;
  onSaveCreatedTask: () => void;
}

export function TaskCreationFlow({
creationStep,
  phases,
  isCreatingNewPhase,
  setIsCreatingNewPhase,
  newPhaseName,
  setNewPhaseName,
  selectedPhaseId,
  setSelectedPhaseId,
  isCreatingNewAction,
  setIsCreatingNewAction,
  newActionName,
  setNewActionName,
  selectedActionId,
  setSelectedActionId,
  newTaskName,
  setNewTaskName,
  selectedChannelId,
  setSelectedChannelId,
  setCreationStep,
  onSaveCreatedTask,
}: TaskCreationFlowProps) {
  const { isDark } = useTheme();
  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 custom-scrollbar text-left bg-current/[0.01]">
      {creationStep === "phase" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black tracking-tight uppercase text-current">
              Campaign Phase Selection
            </span>
            <span className="text-[10px] opacity-45 font-medium leading-normal block">
              Assign this deliverable to an active column or launch a brand new phase stream.
            </span>
          </div>

          {isCreatingNewPhase ? (
            <div className="flex flex-col gap-3">
              <label className="text-[9px] font-black tracking-widest uppercase opacity-40">
                New Phase Stream Label
              </label>
              <input
                type="text"
                value={newPhaseName}
                onChange={(e) => setNewPhaseName(e.target.value)}
                placeholder={`e.g. Phase ${phases.length + 1}`}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#75E2FF] transition-all ${
                  isDark 
                    ? "bg-white/5 border border-white/10 text-white" 
                    : "bg-black/5 border border-black/10 text-black"
                }`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!newPhaseName.trim()) {
                      setNewPhaseName(`Phase ${phases.length + 1}`);
                    }
                    setIsCreatingNewAction(true);
                    setNewActionName("Action Stream 1");
                    setCreationStep("action");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setIsCreatingNewPhase(false)}
                className="text-[9.5px] font-bold text-[#75E2FF] hover:underline text-left mt-1 self-start"
              >
                &larr; Choose Existing Column
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1">
              {phases.map((p: any) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPhaseId(p.id);
                    const actionCardsCount = (p.data.actionCards || []).length;
                    setNewActionName(`Action Stream ${actionCardsCount + 1}`);
                    setIsCreatingNewPhase(false);
                    setCreationStep("action");
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all duration-300 flex items-center justify-between group/phase-btn ${
                    isDark 
                      ? "bg-white/5 border-white/[0.04] hover:bg-white/10 hover:border-[#75E2FF]/35" 
                      : "bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04] hover:border-[#75E2FF]/35"
                  }`}
                >
                  <span>{p.data.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/phase-btn:opacity-100 group-hover/phase-btn:translate-x-0.5 transition-all text-[#75E2FF]" />
                </button>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNewPhase(true);
                  setNewPhaseName(`Phase ${phases.length + 1}`);
                }}
                className={`w-full p-2.5 mt-2 rounded-xl border border-dashed text-center text-[10px] font-black tracking-wider transition-all uppercase flex items-center justify-center gap-1.5 ${
                  isDark 
                    ? "border-white/[0.15] bg-white/[0.01] text-[#75E2FF] hover:border-[#75E2FF] hover:bg-[#75E2FF]/5" 
                    : "border-black/[0.1] bg-black/[0.005] text-[#75E2FF] hover:border-[#75E2FF] hover:bg-[#75E2FF]/5"
                }`}
              >
                <Plus className="w-3 h-3" />
                <span>Custom Phase</span>
              </button>
            </div>
          )}
        </div>
      )}

      {creationStep === "action" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black tracking-tight uppercase text-current">
              Action Stream Selection
            </span>
            <span className="text-[10px] opacity-45 font-medium leading-normal block">
              Assign this task to a key performance channel (Action stream) or format a custom one.
            </span>
          </div>

          {isCreatingNewAction ? (
            <div className="flex flex-col gap-3">
              <label className="text-[9px] font-black tracking-widest uppercase opacity-40">
                Action Stream Label
              </label>
              <input
                type="text"
                value={newActionName}
                onChange={(e) => setNewActionName(e.target.value)}
                placeholder="e.g. Paid Media Outreach"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#75E2FF] transition-all ${
                  isDark 
                    ? "bg-white/5 border border-white/10 text-white" 
                    : "bg-black/5 border border-black/10 text-black"
                }`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!newActionName.trim()) {
                      setNewActionName("Action Stream 1");
                    }
                    setNewTaskName("Delivery Task");
                    setCreationStep("task_name");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setIsCreatingNewAction(false)}
                className="text-[9.5px] font-bold text-[#75E2FF] hover:underline text-left mt-1 self-start"
              >
                &larr; Choose Existing Stream
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1">
              {(() => {
                const selectedPhase = phases.find((p: any) => p.id === selectedPhaseId);
                const actions = selectedPhase?.data?.actionCards || [];
                
                return (
                  <>
                    {actions.map((act: any) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => {
                          setSelectedActionId(act.id);
                          setIsCreatingNewAction(false);
                          setNewTaskName(`Task ${act.tasks ? act.tasks.length + 1 : 1}`);
                          setCreationStep("task_name");
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all duration-300 flex items-center justify-between group/act-btn ${
                          isDark 
                            ? "bg-white/5 border-white/[0.04] hover:bg-white/10 hover:border-[#75E2FF]/35" 
                            : "bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04] hover:border-[#75E2FF]/35"
                        }`}
                      >
                        <span>{act.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/act-btn:opacity-100 group-hover/act-btn:translate-x-0.5 transition-all text-[#75E2FF]" />
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNewAction(true);
                        setNewActionName(`Action Stream ${actions.length + 1}`);
                      }}
                      className={`w-full p-2.5 mt-2 rounded-xl border border-dashed text-center text-[10px] font-black tracking-wider transition-all uppercase flex items-center justify-center gap-1.5 ${
                        isDark 
                          ? "border-white/[0.15] bg-white/[0.01] text-[#75E2FF] hover:border-[#75E2FF] hover:bg-[#75E2FF]/5" 
                          : "border-black/[0.1] bg-black/[0.005] text-[#75E2FF] hover:border-[#75E2FF] hover:bg-[#75E2FF]/5"
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Custom Action</span>
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {creationStep === "task_name" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black tracking-widest uppercase opacity-40">
              Deliverable Title
            </label>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="e.g. Design Landing Asset"
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#75E2FF] transition-all ${
                isDark 
                  ? "bg-white/5 border border-white/10 text-white" 
                  : "bg-black/5 border border-black/10 text-black"
              }`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSaveCreatedTask();
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[9px] font-black tracking-widest uppercase opacity-40">
              Communication Channel
            </label>
            
            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {TASK_CHANNELS.map((item) => {
                const isSelected = selectedChannelId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedChannelId(item.id)}
                    className={`p-3 rounded-xl border text-left text-[11px] font-semibold transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#75E2FF]/10 border-[#75E2FF] text-[#75E2FF]"
                        : isDark
                          ? "bg-white/5 border-white/[0.04] text-white/80 hover:bg-white/10 hover:border-white/10"
                          : "bg-black/[0.02] border-black/[0.06] text-black/80 hover:bg-[#75E2FF]/5 hover:border-[#75E2FF]"
                    }`}
                  >
                    <ChannelIcon name={item.iconName} className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#75E2FF]" : "opacity-60"}`} />
                    <span className="truncate">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
