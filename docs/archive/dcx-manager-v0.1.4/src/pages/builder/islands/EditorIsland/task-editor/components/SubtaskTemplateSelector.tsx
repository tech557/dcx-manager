import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Search, Check } from "lucide-react";
import { SUBTASK_TEMPLATES } from "../../../../../../mock/subtaskTemplates";
import { generateId } from "../../../../../../utils/id.helpers";
import { useTheme } from "../../../../../../hooks/useTheme";


export interface Subtask {
  id: string;
  label: string;
  done: boolean;
  duration?: string;
}

interface SubtaskTemplateSelectorProps {
  subtasks: Subtask[];
  onChange: (updatedSubtasks: Subtask[]) => void;
  onClose: () => void;
}

export function SubtaskTemplateSelector({
subtasks,
  onChange,
  onClose,
}: SubtaskTemplateSelectorProps) {
  const { isDark } = useTheme();
  const [paneSearchQuery, setPaneSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      setTimeout(() => {
        searchInputRef?.current?.focus();
      }, 100);
    }
  }, []);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 26, stiffness: 220 }}
      className={`absolute inset-0 z-50 flex flex-col p-5 select-none ${
        isDark ? "bg-[#0F1011] text-white" : "bg-[#F7F8F9] text-neutral-800"
      }`}
    >
      {/* Sub-bar */}
      <div className="flex items-center gap-2 pb-3 border-b border-current/[0.05] shrink-0">
        <button
          type="button"
          onClick={onClose}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            isDark
              ? "hover:bg-white/10 text-neutral-400 hover:text-white"
              : "hover:bg-black/5 text-neutral-500 hover:text-black"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-[8px] font-black tracking-[0.25em] text-[#75E2FF] uppercase font-mono leading-none">
            Select SLA Presets
          </p>
          <h4 className="font-extrabold text-[12px] tracking-tight mt-1 leading-none uppercase">
            Subtask Templates
          </h4>
        </div>
      </div>

      {/* Pane Search Field */}
      <div className="relative mt-4 shrink-0">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search subtasks..."
          value={paneSearchQuery}
          onChange={(e) => setPaneSearchQuery(e.target.value)}
          className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold border outline-none transition-all duration-200 ${
            isDark
              ? "bg-black/40 border-white/10 text-white placeholder-white/30 focus:border-[#75E2FF] focus:shadow-[0_0_10px_rgba(117,226,255,0.1)]"
              : "bg-black/[0.02] border-black/10 text-black placeholder-black/40 focus:border-[#75E2FF] focus:shadow-[0_0_10px_rgba(117,226,255,0.05)]"
          }`}
        />
        <Search className="w-3.5 h-3.5 opacity-40 absolute left-3 top-1/2 -translate-y-1/2 text-current" />
      </div>

      {/* Scrollable Templates Grid */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1 scrollbar-none custom-scrollbar">
        <div className="grid grid-cols-2 gap-2">
          {SUBTASK_TEMPLATES.filter((item) =>
            item.name.toLowerCase().includes(paneSearchQuery.toLowerCase())
          ).map((item) => {
            const isAdded = subtasks.some((st) => st.label === item.name);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (isAdded) {
                    // Toggle off: remove subtask matched by name
                    onChange(subtasks.filter((st) => st.label !== item.name));
                  } else {
                    // Toggle on: add subtask matched by name
                    const newItem: Subtask = {
                      id: generateId(),
                      label: item.name,
                      done: false,
                      duration: item.defaultDuration,
                    };
                    onChange([...subtasks, newItem]);
                  }
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between h-24 select-none cursor-pointer relative overflow-hidden group ${
                  isAdded
                    ? "bg-[#75E2FF]/10 border-[#75E2FF] text-[#75E2FF] shadow-[0_4px_16px_rgba(117,226,255,0.15)]"
                    : isDark
                    ? "bg-black/30 border-white/[0.04] text-neutral-300 hover:bg-black/50 hover:border-white/12"
                    : "bg-white border-black/[0.04] text-neutral-700 hover:bg-white hover:border-black/12 hover:-translate-y-0.5"
                }`}
              >
                {/* Check indicator */}
                <span
                  className={`px-1.5 py-0.5 rounded-[5px] text-[7.5px] font-black uppercase font-mono tracking-wider w-fit shrink-0 ${
                    isAdded
                      ? "bg-[#75E2FF]/20 text-[#75E2FF]"
                      : isDark
                      ? "bg-white/5 text-neutral-400"
                      : "bg-black/5 text-neutral-500"
                  }`}
                >
                  {item.defaultDuration || "2 hrs"}
                </span>

                <div className="min-w-0 pr-4 mt-2">
                  <p className="text-[10px] font-extrabold leading-tight tracking-tight break-words">
                    {item.name}
                  </p>
                </div>

                {isAdded && (
                  <div className="absolute top-3.5 right-3.5 bg-[#75E2FF] text-black rounded-full p-0.5 shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {SUBTASK_TEMPLATES.filter((item) =>
          item.name.toLowerCase().includes(paneSearchQuery.toLowerCase())
        ).length === 0 && (
          <div className="py-12 text-center text-xs opacity-40 font-bold uppercase tracking-wider">
            No subtask requirements match query
          </div>
        )}
      </div>

      {/* Bottom cancel drawer footer */}
      <button
        type="button"
        onClick={onClose}
        className="mt-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider bg-current/5 hover:bg-current/10 text-center cursor-pointer transition-colors shrink-0"
      >
        Finish Selection
      </button>
    </motion.div>
  );
}
