import React from "react";
import { MessageSquare, Mail, Send, Phone, Bell, Share2, User, Users } from "lucide-react";
import { ChannelOption, ParticipantOption } from "../../../../../../mock/taskDropdowns";

interface IntakeConfigurationProps {
  selectedChannel?: ChannelOption;
  selectedSender?: ParticipantOption;
  selectedReceiver?: ParticipantOption;
  onOpenPane: (pane: "channel" | "sender" | "receiver") => void;
  hideHeader?: boolean;
}

import { ChannelIcon } from "../../../../../../components/ChannelIcon";
import { useTheme } from "../../../../../../hooks/useTheme";


export function IntakeConfiguration({
selectedChannel,
  selectedSender,
  selectedReceiver,
  onOpenPane,
  hideHeader,
}: IntakeConfigurationProps) {
  const { isDark } = useTheme();
  return (
    <div id="editor-field-intake-config" className="space-y-3">
      <div>
        {!hideHeader && (
          <span className="text-[9px] font-black tracking-[0.2em] font-sans uppercase opacity-40 block ml-1 mb-1.5">
            Intake Configuration
          </span>
        )}
        <div className="grid grid-cols-1 gap-2.5">
          
          {/* 1. Routing Channel Select Card */}
          <button
            id="btn-select-channel"
            type="button"
            onClick={() => onOpenPane("channel")}
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
            onClick={() => onOpenPane("sender")}
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
            onClick={() => onOpenPane("receiver")}
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
      </div>
    </div>
  );
}
