import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { 
  ChevronDown, 
  ChevronRight, 
  User, 
  Users,
  Share2
} from "lucide-react";
import { 
  TASK_CHANNELS, 
  TASK_SENDERS, 
  TASK_RECEIVERS 
} from "../../../../../../mock/taskDropdowns";
import { ChannelIcon } from "../../../../../../components/ChannelIcon";
import { useSlaQuery } from "../../../../../../queries/useSlaQuery";
import { IntakePaneSelector } from "../components/IntakePaneSelector";
import { useTheme } from "../../../../../../hooks/useTheme";


interface IntakeSectionProps {
  channelId: string;
  senderId: string;
  receiverId: string;
  onChannelChange: (id: string) => void;
  onSenderChange: (id: string) => void;
  onReceiverChange: (id: string) => void;
}

export function IntakeSection({
channelId,
  senderId,
  receiverId,
  onChannelChange,
  onSenderChange,
  onReceiverChange,
}: IntakeSectionProps) {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePane, setActivePane] = useState<"channel" | "sender" | "receiver" | null>(null);

  const { data: recommendations } = useSlaQuery(channelId);

  const selectedChannel = TASK_CHANNELS.find(c => c.id === channelId);
  const selectedSender = TASK_SENDERS.find(s => s.id === senderId);
  const selectedReceiver = TASK_RECEIVERS.find(r => r.id === receiverId);

  const handleSelect = (type: "channel" | "sender" | "receiver", id: string) => {
    if (type === "channel") {
      onChannelChange(id);
    } else if (type === "sender") {
      onSenderChange(id);
    } else if (type === "receiver") {
      onReceiverChange(id);
    }
    setActivePane(null);
  };

  return (
    <div className="space-y-3">
      {/* Accordion Trigger */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 border-b border-current/[0.05] pb-2 cursor-pointer select-none group/header"
      >
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-[#75E2FF]" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-[#75E2FF]/50 group-hover/header:text-[#75E2FF] transition-all" />
        )}
        <div className="text-left">
          <span className="text-[10px] font-black tracking-[0.25em] text-[#75E2FF] uppercase font-mono leading-none">
            Configuration
          </span>
          <h4 className="font-extrabold text-[12.5px] tracking-tight text-current uppercase mt-1 leading-none">
            Intake Information
          </h4>
        </div>
      </div>

      {isExpanded && (
        <div id="editor-field-intake-config" className="space-y-3">
          <div className="grid grid-cols-1 gap-2.5">
            {/* 1. Routing Channel Select Card */}
            <button
              id="btn-select-channel"
              type="button"
              onClick={() => setActivePane("channel")}
              className={`w-full text-left p-3 rounded-[1.2rem] border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                isDark 
                  ? "bg-black/40 border-white/[0.06] hover:bg-black/60 hover:border-[#75E2FF]/40 hover:-translate-y-0.5" 
                  : "bg-white/60 border-black/[0.06] hover:bg-white hover:border-[#75E2FF]/40 hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isDark ? "bg-white/5 text-[#75E2FF]" : "bg-black/5 text-[#75E2FF]"
                }`}>
                  {selectedChannel ? (
                    <ChannelIcon name={selectedChannel.iconName} className="w-4 h-4" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-black tracking-wider uppercase opacity-40 font-sans leading-none">
                    Routing Channel
                  </p>
                  <p className="text-xs font-bold text-current mt-0.5 truncate">
                    {selectedChannel ? selectedChannel.name : "Select Transmission Route"}
                  </p>
                </div>
              </div>
              <div className="px-2 py-1 rounded-md text-[8px] font-mono font-black uppercase tracking-wider bg-[#75E2FF]/10 text-[#75E2FF]">
                Configure
              </div>
            </button>

            {/* 2. Direct Sender Source Card */}
            <button
              id="btn-select-sender"
              type="button"
              onClick={() => setActivePane("sender")}
              className={`w-full text-left p-3 rounded-[1.2rem] border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                isDark 
                  ? "bg-black/40 border-white/[0.06] hover:bg-black/60 hover:border-[#75E2FF]/40 hover:-translate-y-0.5" 
                  : "bg-white/60 border-black/[0.06] hover:bg-white hover:border-[#75E2FF]/40 hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isDark ? "bg-white/5 text-emerald-400" : "bg-black/5 text-emerald-600"
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-black tracking-wider uppercase opacity-40 font-sans leading-none">
                    Direct Sender Source
                  </p>
                  <p className="text-xs font-bold text-current mt-0.5 truncate">
                    {selectedSender ? selectedSender.name : "Select Dispatch Source"}
                  </p>
                  {selectedSender && (
                    <p className="text-[9px] font-mono opacity-50 mt-0.5 leading-none truncate">
                      {selectedSender.role}
                    </p>
                  )}
                </div>
              </div>
              <div id="badge-sender" className={`px-2 py-1 rounded-md text-[8px] font-mono font-black uppercase tracking-wider ${
                isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-500"
              }`}>
                Change
              </div>
            </button>

            {/* 3. Direct Recipient Target Card */}
            <button
              id="btn-select-receiver"
              type="button"
              onClick={() => setActivePane("receiver")}
              className={`w-full text-left p-3 rounded-[1.2rem] border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                isDark 
                  ? "bg-black/40 border-white/[0.06] hover:bg-black/60 hover:border-[#75E2FF]/40 hover:-translate-y-0.5" 
                  : "bg-white/60 border-black/[0.06] hover:bg-white hover:border-[#75E2FF]/40 hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isDark ? "bg-white/5 text-amber-400" : "bg-black/5 text-amber-600"
                }`}>
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-black tracking-wider uppercase opacity-40 font-sans leading-none">
                    Direct Recipient Target
                  </p>
                  <p className="text-xs font-bold text-current mt-0.5 truncate">
                    {selectedReceiver ? selectedReceiver.name : "Select Ingress Target"}
                  </p>
                  {selectedReceiver && (
                    <p className="text-[9px] font-mono opacity-50 mt-0.5 leading-none truncate">
                      {selectedReceiver.role}
                    </p>
                  )}
                </div>
              </div>
              <div id="badge-receiver" className={`px-2 py-1 rounded-md text-[8px] font-mono font-black uppercase tracking-wider ${
                isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-500"
              }`}>
                Change
              </div>
            </button>
          </div>

          {/* SLA Recommendations Panel */}
          {channelId && recommendations && recommendations.length > 0 && (
            <div className={`p-3.5 rounded-[1.2rem] border transition-all duration-300 ${
              isDark 
                ? "bg-[#75E2FF]/5 border-[#75E2FF]/15 text-[#75E2FF]" 
                : "bg-[#75E2FF]/5 border-[#75E2FF]/15 text-[#309bb5]"
            }`}>
              <div className="flex items-center gap-1.5 mb-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span className="text-[9px] font-black tracking-wider uppercase opacity-85">
                  SLA Recommends (Auto-Sourced)
                </span>
              </div>
              <div className="space-y-2 pl-1">
                {recommendations.map((rec, idx) => (
                  <div key={`sla-rec-${idx}`} className="flex items-start justify-between text-xs font-semibold gap-2 opacity-90">
                    <p className="leading-snug truncate before:content-['•'] before:mr-1.5">
                      {rec.label}
                    </p>
                    <span className="shrink-0 text-[10px] font-mono font-bold uppercase bg-current/10 px-1.5 py-0.5 rounded leading-none">
                      {rec.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pane Slide-in overlay for this section */}
      <AnimatePresence>
        {activePane && (
          <IntakePaneSelector
            activePane={activePane}
            channelId={channelId}
            senderId={senderId}
            receiverId={receiverId}
            onSelect={handleSelect}
            onClose={() => setActivePane(null)}
            channels={TASK_CHANNELS}
            senders={TASK_SENDERS}
            receivers={TASK_RECEIVERS}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
