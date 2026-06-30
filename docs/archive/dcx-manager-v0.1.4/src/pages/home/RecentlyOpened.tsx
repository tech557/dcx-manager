import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { MOCK_ACTIVITY } from "../../mock/activity";
import { MOCK_USERS } from "../../mock/users";
import { ActivityType } from "../../types";
import { 
  PlusCircle, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  UserPlus,
  Loader2
} from "lucide-react";

interface RecentlyOpenedProps {
  isDark: boolean;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'create': return <PlusCircle className="w-3.5 h-3.5 text-blue-400" />;
    case 'update': return <RefreshCcw className="w-3.5 h-3.5 text-amber-400" />;
    case 'approve': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    case 'reject': return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
    case 'comment': return <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
    case 'assign': return <UserPlus className="w-3.5 h-3.5 text-indigo-400" />;
    case 'status_change': return <CheckCircle2 className="w-3.5 h-3.5 text-primary" />;
    default: return null;
  }
};

export function RecentlyOpened({ isDark }: RecentlyOpenedProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDoubleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div 
      className="flex flex-col h-full select-none cursor-default group/island"
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-baseline gap-3">
          <h2 className={`text-[10px] font-black tracking-[0.3em] uppercase opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>Activity Log</h2>
          <span className={`text-[10px] font-mono font-bold opacity-20 ${isDark ? 'text-white' : 'text-black'}`}>
            ({MOCK_ACTIVITY.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 className={`w-3 h-3 ${isDark ? 'text-primary' : 'text-black/40'}`} />
            </motion.div>
          )}
          <span className={`text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover/island:opacity-20 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}>
            Double click to sync
          </span>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            >
              <div className="relative">
                {/* Outer pulsing ring */}
                <motion.div 
                  className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-primary/20' : 'border-primary/10'}`}
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
                {/* Inner spinning gradient ring */}
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full animate-spin" viewBox="0 0 50 50">
                    <circle
                      className={isDark ? "stroke-white/5" : "stroke-black/5"}
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      strokeWidth="4"
                    />
                    <circle
                      className="stroke-primary"
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="31.4 31.4"
                    />
                  </svg>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                isDark ? 'text-white/20' : 'text-black/20'
              }`}>
                Syncing with DCX...
              </span>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 h-full pr-2 overflow-y-auto custom-scrollbar-mini"
            >
              {MOCK_ACTIVITY.map((item, i) => {
                const user = MOCK_USERS.find(u => u.id === item.userId);
                const initials = user?.name.split(' ').map(n => n[0]).join('');
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 group cursor-pointer"
                  >
                    <div className="relative flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                        isDark ? 'border-white/5 bg-white/5 text-white/40 group-hover:border-primary/30 group-hover:text-primary' : 'border-black/5 bg-black/5 text-black/30 group-hover:border-black/20 group-hover:text-black'
                      }`}>
                        {initials}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-full border shadow-sm ${
                        isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-100'
                      }`}>
                        {getActivityIcon(item.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`text-[11px] font-bold truncate transition-colors duration-300 ${isDark ? 'text-white/80 group-hover:text-primary' : 'text-black/80 group-hover:text-black'}`}>
                          {user?.name}
                        </span>
                        <span className={`text-[8px] font-mono tracking-tighter opacity-20 whitespace-nowrap ${isDark ? 'text-white' : 'text-black'}`}>
                          {new Date(item.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className={`text-[10px] leading-tight transition-opacity duration-300 ${isDark ? 'text-white/40 group-hover:opacity-100' : 'text-black/50 group-hover:opacity-100'}`}>
                        {item.details} <span className="opacity-40 select-none mx-1 text-[8px]">on</span> <span className="font-bold opacity-60">{item.clientName} | {item.projectName}</span>
                      </p>
                    </div>

                    <div className="ml-2 flex-shrink-0">
                      <span className={`text-[9px] font-mono font-black border px-1.5 py-0.5 rounded transition-all duration-300 ${
                        isDark ? 'border-white/5 text-white/10 group-hover:border-white/20 group-hover:text-white/40' : 'border-black/5 text-black/10 group-hover:border-black/10 group-hover:text-black/30'
                      }`}>
                        {item.versionNumber}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
