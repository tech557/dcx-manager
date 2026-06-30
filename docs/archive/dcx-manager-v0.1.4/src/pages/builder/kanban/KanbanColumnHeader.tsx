import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Layers, Copy, Trash2, Plus } from "lucide-react";
import { PHASE_ICONS_MAP } from "../cards/phase/PhaseIcons";
import { PopoverShell } from "../../../components/ui/PopoverShell";
import { useTheme } from "../../../hooks/useTheme";


interface KanbanColumnHeaderProps {
  phaseNode: any;
  index: number;
  onUpdatePhaseField: (phaseId: string, updates: any) => void;
  onDuplicatePhase: (phaseId: string) => void;
  onDeletePhase: (phaseId: string) => void;
  onAddDragAction: (targetPhaseId: string) => void;
}

export function KanbanColumnHeader({
  phaseNode,
  index,
onUpdatePhaseField,
  onDuplicatePhase,
  onDeletePhase,
  onAddDragAction,
}: KanbanColumnHeaderProps) {
  const { isDark } = useTheme();
  const data = phaseNode.data;
  
  // Local state for Icon Dropdown Popover
  const [isIconSelectOpen, setIsIconSelectOpen] = useState(false);

  // Local states for inline editing Phase name
  const [isEditingName, setIsEditingName] = useState(false);
  const [phaseNameInput, setPhaseNameInput] = useState(data.label || "");

  // Sync state if label changes from outside
  useEffect(() => {
    setPhaseNameInput(data.label || "");
  }, [data.label]);

  const startEditPhaseName = () => {
    setPhaseNameInput(data.label || `Phase ${index + 1}`);
    setIsEditingName(true);
  };

  const savePhaseName = () => {
    if (!phaseNameInput.trim()) {
      setIsEditingName(false);
      return;
    }
    onUpdatePhaseField(phaseNode.id, { label: phaseNameInput.trim() });
    setIsEditingName(false);
  };

  const iconConfig = PHASE_ICONS_MAP[data.icon] || PHASE_ICONS_MAP.awareness;
  const IconComponent = iconConfig?.icon || Layers;

  return (
    <div className="flex items-start justify-between gap-2.5 pb-3 border-b border-current/[0.05] relative z-20">
      {/* Icon + Title box */}
      <div className="flex items-center gap-3 max-w-[75%] min-w-0">
        {/* Active Icon button selector */}
        <div className="relative">
          <button
            type="button"
            id={`btn-col-icon-${phaseNode.id}`}
            onClick={() => setIsIconSelectOpen(!isIconSelectOpen)}
            className={`p-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
              isDark 
                ? "bg-white/5 hover:bg-white/10 text-[#75E2FF]" 
                : "bg-black/5 hover:bg-black/10 text-neutral-800"
            }`}
            title="Choose Stage Icon Accents"
          >
            <IconComponent className="w-4.5 h-4.5" />
          </button>

          {/* Floating custom absolute grid overlay for Icons selection */}
          <AnimatePresence>
            {isIconSelectOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                className="absolute left-0 top-11 z-[60]"
              >
                <PopoverShell
                  width="w-56"
                  className="relative p-2.5 grid grid-cols-5 gap-1.5"
                >
                {Object.entries(PHASE_ICONS_MAP).map(([key, config]) => {
                  const ItemIcon = config.icon;
                  const isIconActive = data.icon === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      id={`btn-icon-item-${key}`}
                      onClick={() => {
                        onUpdatePhaseField(phaseNode.id, { icon: key });
                        setIsIconSelectOpen(false);
                      }}
                      className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        isIconActive
                          ? (isDark ? "bg-white/10 border-primary text-[#75E2FF]" : "bg-black/10 border-black text-black")
                          : (isDark ? "bg-white/[0.02] border-white/5 hover:bg-white/5" : "bg-black/[0.02] border-black/5 hover:bg-black/5")
                      }`}
                      title={key}
                    >
                      <ItemIcon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
                </PopoverShell>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Single click Phase Title label Inline edit input */}
        <div className="text-left min-w-0 flex-1">
          <span className="text-[8px] font-black tracking-widest font-mono uppercase opacity-35 leading-none block">
            PHASE {index + 1}
          </span>
          {isEditingName ? (
            <input
              autoFocus
              type="text"
              id={`input-edit-phase-${phaseNode.id}`}
              value={phaseNameInput}
              onChange={(e) => setPhaseNameInput(e.target.value)}
              onBlur={savePhaseName}
              onKeyDown={(e) => {
                if (e.key === "Enter") savePhaseName();
                if (e.key === "Escape") setIsEditingName(false);
              }}
              className={`w-full p-1 rounded font-bold text-sm tracking-tight border outline-none font-sans uppercase ${
                isDark 
                  ? "bg-black border-white/20 text-white" 
                  : "bg-white border-black/20 text-black"
              }`}
            />
          ) : (
            <h3 
              id={`title-phase-label-${phaseNode.id}`}
              onClick={startEditPhaseName}
              className="font-black text-base sm:text-lg tracking-tight text-current leading-tight truncate uppercase cursor-pointer hover:opacity-75 transition-opacity mt-0.5"
              title="Click to rename"
            >
              {data.label || `Phase ${index + 1}`}
            </h3>
          )}
        </div>
      </div>

      {/* Column Header Control Icons */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        {/* ADD Action Button */}
        <button
          type="button"
          onClick={() => onAddDragAction(phaseNode.id)}
          className={`p-1.5 rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 opacity-50 hover:opacity-100 ${
            isDark ? "hover:bg-[#75E2FF]/20 text-[#75E2FF]" : "hover:bg-blue-50 text-[#00A3FF]"
          }`}
          title="Add new action task to this phase"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* DUPLICATE Stage Button */}
        <button
          type="button"
          onClick={() => onDuplicatePhase(phaseNode.id)}
          className={`p-1.5 rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 opacity-50 hover:opacity-100 ${
            isDark ? "hover:bg-white/10 text-neutral-300" : "hover:bg-black/5 text-neutral-600"
          }`}
          title="Duplicate Phase segment next to it"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* DELETE Stage Button */}
        <button
          type="button"
          onClick={() => onDeletePhase(phaseNode.id)}
          className={`p-1.5 rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 opacity-50 hover:opacity-100 ${
            isDark ? "hover:bg-rose-500/15 text-rose-450 hover:text-rose-300" : "hover:bg-rose-50 text-rose-600"
          }`}
          title="Delete this entire Phase segment"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
