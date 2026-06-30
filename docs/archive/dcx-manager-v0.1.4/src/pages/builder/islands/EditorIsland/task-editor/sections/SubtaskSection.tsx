import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Copy, 
  Clipboard
} from "lucide-react";
import { generateId } from "../../../../../../utils/id.helpers";
import { Subtask, SubtaskTemplateSelector } from "../components/SubtaskTemplateSelector";
import { SubtaskList } from "../components/SubtaskList";
import { useTheme } from "../../../../../../hooks/useTheme";


interface SubtaskSectionProps {
  subtasks: Subtask[];
  onChange: (updatedSubtasks: Subtask[]) => void;
}

export function SubtaskSection({
subtasks,
  onChange,
}: SubtaskSectionProps) {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePane, setActivePane] = useState<"subtask" | null>(null);
  const [newSubtaskLabel, setNewSubtaskLabel] = useState("");
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [showPastedTooltip, setShowPastedTooltip] = useState(false);

  const handleAddCustomSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskLabel.trim()) return;

    const newItem: Subtask = {
      id: generateId(),
      label: newSubtaskLabel.trim(),
      done: false,
      duration: "Same day"
    };
    onChange([...subtasks, newItem]);
    setNewSubtaskLabel("");
  };

  const handleUpdateSubtask = (id: string, updates: Partial<Subtask>) => {
    onChange(subtasks.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleToggleSubtask = (id: string) => {
    onChange(subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const handleRemoveSubtask = (id: string) => {
    onChange(subtasks.filter(s => s.id !== id));
  };

  const handleCopyChecklist = () => {
    if (subtasks.length === 0) return;
    const dataStr = JSON.stringify(subtasks);
    localStorage.setItem("dcx_subtasks_clipboard", dataStr);
    try {
      navigator.clipboard.writeText(dataStr);
    } catch (e) {
      console.warn("Unable to copy to system clipboard, fallback to localStorage", e);
    }
    setShowCopiedTooltip(true);
    setTimeout(() => {
      setShowCopiedTooltip(false);
    }, 1500);
  };

  const handlePasteChecklist = () => {
    let raw = localStorage.getItem("dcx_subtasks_clipboard");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const withNewIds = parsed.map((item: any) => ({
          ...item,
          id: generateId(),
          done: false // reset status on pasting
        }));
        onChange([...subtasks, ...withNewIds]);
        setShowPastedTooltip(true);
        setTimeout(() => {
          setShowPastedTooltip(false);
        }, 1500);
      }
    } catch (e) {
      console.error("Unable to parse pasted subtasks data", e);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Accordion and Quick Action Bar */}
      <div className="flex items-center justify-between border-b border-current/[0.05] pb-2 select-none">
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer group/header font-sans"
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#75E2FF]" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[#75E2FF]/50 group-hover/header:text-[#75E2FF] transition-all" />
          )}
          <div className="text-left leading-none">
            <span className="text-[10px] font-black tracking-[0.25em] text-[#75E2FF] uppercase font-mono leading-none">
              Checklist
            </span>
            <h4 className="font-extrabold text-[12.5px] tracking-tight text-current uppercase mt-1 leading-none">
              SLA Subtask Requirements
            </h4>
          </div>
        </div>

        {isExpanded && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Open templates */}
            <button
              type="button"
              onClick={() => setActivePane("subtask")}
              className={`p-1.5 w-7 h-7 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center border ${
                isDark
                  ? "bg-[#75E2FF]/10 border-[#75E2FF]/20 hover:bg-[#75E2FF]/20 text-[#75E2FF]"
                  : "bg-[#75E2FF]/5 border-[#75E2FF]/20 hover:bg-[#75E2FF]/10 text-[#4ea0b5]"
              }`}
              title="Add Subtask Preset"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
            </button>

            {/* Copy checklist */}
            <div className="relative">
              <button
                type="button"
                onClick={handleCopyChecklist}
                disabled={subtasks.length === 0}
                className={`p-1.5 w-7 h-7 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center border ${
                  subtasks.length === 0
                    ? "opacity-20 cursor-not-allowed border-transparent text-current"
                    : isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white"
                      : "bg-black/5 border-[#151516]/10 hover:bg-black/8 text-neutral-600 hover:text-black"
                }`}
                title="Copy Subtasks"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {showCopiedTooltip && (
                <div 
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 rounded text-[7.5px] font-mono font-black uppercase tracking-widest whitespace-nowrap z-50 shadow-md pointer-events-none ${
                    isDark 
                      ? "bg-cyan-950/90 border border-[#75E2FF]/40 text-[#75E2FF]" 
                      : "bg-neutral-900 border border-neutral-800 text-[#75E2FF]"
                  }`}
                >
                  Copied!
                </div>
              )}
            </div>

            {/* Paste checklist */}
            <div className="relative">
              <button
                type="button"
                onClick={handlePasteChecklist}
                className={`p-1.5 w-7 h-7 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center border ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white"
                    : "bg-black/5 border-[#151516]/10 hover:bg-black/8 text-[#151516]"
                }`}
                title="Paste Subtasks"
              >
                <Clipboard className="w-3.5 h-3.5" />
              </button>
              {showPastedTooltip && (
                <div 
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 rounded text-[7.5px] font-mono font-black uppercase tracking-widest whitespace-nowrap z-50 shadow-md pointer-events-none ${
                    isDark 
                      ? "bg-cyan-950/90 border border-[#75E2FF]/40 text-[#75E2FF]" 
                      : "bg-neutral-900 border border-neutral-800 text-[#75E2FF]"
                  }`}
                >
                  Pasted!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accordion Content */}
      {!isExpanded ? (
        <div className="pl-5 select-none font-sans flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500 font-mono">
            <span className={`px-1.5 py-0.5 rounded font-black text-[8px] tracking-wide ${
              subtasks.filter(s => s.done).length === subtasks.length && subtasks.length > 0
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            }`}>
              {subtasks.filter(s => s.done).length}/{subtasks.length} DONE
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {subtasks.length > 0 ? (
              subtasks.map((st) => (
                <span 
                  key={st.id} 
                  className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-semibold tracking-tight ${
                    st.done 
                      ? isDark ? "bg-emerald-500/5 text-emerald-500/60 line-through" : "bg-emerald-500/5 text-emerald-500/50 line-through"
                      : isDark ? "bg-[#75E2FF]/10 text-[#75E2FF]/80" : "bg-black/[0.03] text-[#4ea0b5]"
                  }`}
                >
                  {st.label} <span className="opacity-50 font-mono font-black text-[7.5px]">({st.duration || "2 hrs"})</span>
                </span>
              ))
            ) : (
              <span className="text-[9px] opacity-35 italic font-bold">No subtasks assigned</span>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Append custom subtask input */}
          <form onSubmit={handleAddCustomSubtask} className="flex gap-2">
            <input
              type="text"
              placeholder="Append custom subtask label..."
              value={newSubtaskLabel}
              onChange={(e) => setNewSubtaskLabel(e.target.value)}
              className={`flex-1 px-3.5 py-2 rounded-xl text-xs font-semibold border outline-none transition-all duration-300 ${
                isDark 
                  ? "bg-black/40 border-white/10 text-white placeholder-white/30 focus:border-[#75E2FF] focus:shadow-[0_0_10px_rgba(117,226,255,0.1)]" 
                  : "bg-[#F7F8F9] border-[#151516]/15 text-neutral-800 placeholder-neutral-400 focus:border-[#75E2FF] focus:shadow-[0_0_12px_rgba(117,226,255,0.06)]"
              }`}
            />
            <button
              type="submit"
              disabled={!newSubtaskLabel.trim()}
              className={`px-3 py-2 rounded-xl text-xs font-bold font-sans uppercase tracking-wider shrink-0 transition-all duration-300 cursor-pointer ${
                newSubtaskLabel.trim()
                  ? isDark
                    ? "bg-[#75E2FF] hover:bg-[#aef0ff] text-[#0c242b]"
                    : "bg-[#75E2FF] hover:bg-[#349ab5] text-[#0c242b]"
                  : "opacity-40 cursor-not-allowed bg-current/[0.06] text-current"
              }`}
            >
              Add
            </button>
          </form>

          {/* Subtask Cards list */}
          <SubtaskList
            subtasks={subtasks}
            onToggle={handleToggleSubtask}
            onUpdate={handleUpdateSubtask}
            onRemove={handleRemoveSubtask}
            onOpenTemplates={() => setActivePane("subtask")}
          />
        </div>
      )}

      {/* Preset Pick Drawer Sub-pane Slideover */}
      <AnimatePresence>
        {activePane && (
          <SubtaskTemplateSelector
            subtasks={subtasks}
            onChange={onChange}
            onClose={() => setActivePane(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
