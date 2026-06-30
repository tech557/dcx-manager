import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Search, Check } from "lucide-react";
import { ChannelIcon } from "../../../../../../components/ChannelIcon";
import { ChannelOption, ParticipantOption } from "../../../../../../mock/taskDropdowns";
import { useTheme } from "../../../../../../hooks/useTheme";


interface IntakePaneSelectorProps {
  activePane: "channel" | "sender" | "receiver";
  channelId: string;
  senderId: string;
  receiverId: string;
  onSelect: (type: "channel" | "sender" | "receiver", id: string) => void;
  onClose: () => void;
  channels: ChannelOption[];
  senders: ParticipantOption[];
  receivers: ParticipantOption[];
}

export function IntakePaneSelector({
activePane,
  channelId,
  senderId,
  receiverId,
  onSelect,
  onClose,
  channels,
  senders,
  receivers,
}: IntakePaneSelectorProps) {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    return () => {
      setSearchQuery("");
    };
  }, [activePane]);

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
      {/* Header sub-bar */}
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
            Select Option
          </p>
          <h4 className="font-extrabold text-[12px] tracking-tight mt-1 leading-none uppercase">
            {activePane === "channel"
              ? "Routing Channel"
              : activePane === "sender"
              ? "Sender Source"
              : "Recipient Target"}
          </h4>
        </div>
      </div>

      {/* Interactive Search Field */}
      <div className="relative mt-4 shrink-0">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search options..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold border outline-none transition-all duration-200 ${
            isDark
              ? "bg-black/40 border-white/10 text-white placeholder-white/30 focus:border-[#75E2FF] focus:shadow-[0_0_10px_rgba(117,226,255,0.1)]"
              : "bg-black/[0.02] border-black/10 text-black placeholder-black/40 focus:border-[#75E2FF] focus:shadow-[0_0_10px_rgba(117,226,255,0.05)]"
          }`}
        />
        <Search className="w-3.5 h-3.5 opacity-40 absolute left-3 top-1/2 -translate-y-1/2 text-current" />
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1 scrollbar-none custom-scrollbar">
        {activePane === "channel" && (
          <div className="grid grid-cols-2 gap-2">
            {channels
              .filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => {
                const isSelected = item.id === channelId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect("channel", item.id);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between h-24 select-none cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? "bg-[#75E2FF]/10 border-[#75E2FF] text-[#75E2FF] shadow-[0_4px_16px_rgba(117,226,255,0.15)]"
                        : isDark
                        ? "bg-black/30 border-white/[0.04] text-neutral-300 hover:bg-black/50 hover:border-white/15"
                        : "bg-white border-black/[0.04] text-neutral-700 hover:bg-white hover:border-black/15 hover:-translate-y-0.5"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#75E2FF]/20"
                          : isDark
                          ? "bg-white/5"
                          : "bg-black/5"
                      }`}
                    >
                      <ChannelIcon name={item.iconName} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 pr-4 mt-2">
                      <p className="text-[10px] font-extrabold leading-tight tracking-tight break-words">
                        {item.name}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-[#75E2FF] text-black rounded-full p-0.5 shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        )}

        {(activePane === "sender" || activePane === "receiver") && (
          <div className="space-y-2">
            {(activePane === "sender" ? senders : receivers)
              .filter(
                (item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.role.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => {
                const isSelected =
                  activePane === "sender"
                    ? item.id === senderId
                    : item.id === receiverId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(activePane, item.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-[1.2rem] border transition-all flex items-center justify-between gap-3 relative cursor-pointer ${
                      isSelected
                        ? "bg-[#75E2FF]/10 border-[#75E2FF] text-[#75E2FF] shadow-[0_4px_16px_rgba(117,226,255,0.15)]"
                        : isDark
                        ? "bg-black/30 border-white/[0.04] text-neutral-300 hover:bg-black/50 hover:border-white/12 hover:-translate-y-0.5"
                        : "bg-white border-black/[0.04] text-neutral-700 hover:bg-white hover:border-black/12 hover:-translate-y-0.5"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? "bg-[#75E2FF]/20 text-[#75E2FF]"
                          : isDark
                          ? "bg-white/5 text-neutral-400"
                          : "bg-black/5 text-neutral-600"
                      }`}
                    >
                      {item.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-extrabold text-xs truncate leading-none mb-1">
                        {item.name}
                      </h5>
                      <p className="text-[10px] font-mono opacity-50 truncate leading-none">
                        {item.role}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="bg-[#75E2FF] text-black rounded-full p-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        )}

        {/* No match indications */}
        {activePane === "channel" &&
          channels.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 && (
            <div className="py-12 text-center text-xs opacity-40 font-bold uppercase tracking-wider">
              No transmission options matching search
            </div>
          )}
        {(activePane === "sender" || activePane === "receiver") &&
          (activePane === "sender" ? senders : receivers).filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.role.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 && (
            <div className="py-12 text-center text-xs opacity-40 font-bold uppercase tracking-wider">
              No partners found matching query
            </div>
          )}
      </div>

      {/* Bottom cancel drawer footer */}
      <button
        type="button"
        onClick={onClose}
        className="mt-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider bg-current/5 hover:bg-current/10 text-center cursor-pointer transition-colors shrink-0"
      >
        Cancel selection
      </button>
    </motion.div>
  );
}
