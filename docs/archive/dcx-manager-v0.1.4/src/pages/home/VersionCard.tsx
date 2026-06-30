import React, { useState, useEffect, useMemo } from 'react';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "motion/react";
import { Download, ChevronRight, Users } from "lucide-react";
import { EnrichedVersion, VersionStatus } from "../../types";
import { MOCK_USERS } from "../../mock/users";
import { StatusBadge } from "../../components/ui";
import { GlassCard } from "../../components/ui/GlassCard";

interface VersionCardProps {
  version: EnrichedVersion;
  index: number;
  isDark: boolean;
  onSelect?: (versionId: string) => void;
}

const getStatusConfig = (status: VersionStatus) => {
  switch (status) {
    case 'Approved': return { 
      base: 'bg-emerald-500/10 text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      dot: 'bg-emerald-400'
    };
    case 'Rejected': return { 
      base: 'bg-rose-500/10 text-rose-400',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]',
      dot: 'bg-rose-400'
    };
    case 'Placed': return { 
      base: 'bg-blue-500/10 text-blue-400',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
      dot: 'bg-blue-400'
    };
    default: return { 
      base: 'bg-neutral-500/10 text-neutral-400',
      glow: 'shadow-[0_0_20px_rgba(163,163,163,0.15)]',
      dot: 'bg-neutral-400'
    };
  }
};

export const VersionCard = React.memo(({ version, index, isDark, onSelect }: VersionCardProps) => {
  const statusConfig = getStatusConfig(version.status);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const [isHovering, setIsHovering] = useState(false);
  const [showCycle, setShowCycle] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);

  const cycleItems = useMemo(() => {
    const creator = MOCK_USERS.find(u => u.id === version.createdBy)?.name || 'Unknown';
    const updater = MOCK_USERS.find(u => u.id === version.lastUpdatedBy)?.name || 'Unknown';

    return [
      { type: 'team', label: 'Team', value: version.assignedTeam },
      { type: 'createdAt', label: 'Created At', value: version.createdAt.replace(/-/g, '.') },
      { type: 'createdBy', label: 'Created By', value: creator },
      { type: 'updatedAt', label: 'Updated At', value: version.lastUpdatedAt.replace(/-/g, '.') },
      { type: 'updatedBy', label: 'Updated By', value: updater },
      { type: 'communicatedDate', label: 'Comm. Date', value: version.communicatedDate ? version.communicatedDate.replace(/-/g, '.') : 'TBH' },
    ].filter(item => item.value && (Array.isArray(item.value) ? item.value.length > 0 : true));
  }, [version]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovering) {
      timer = setTimeout(() => setShowCycle(true), 2000);
    } else {
      setShowCycle(false);
      setCycleIndex(0);
    }
    return () => clearTimeout(timer);
  }, [isHovering]);

  useEffect(() => {
    if (showCycle && cycleItems.length > 0) {
      const interval = setInterval(() => {
        setCycleIndex(prev => (prev + 1) % cycleItems.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showCycle, cycleItems.length]);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const currentCycleItem = cycleItems[cycleIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.25,
        delay: Math.min(index * 0.03, 0.3),
        ease: [0.23, 1, 0.32, 1] 
      }}
       whileHover={{ scale: 1.002, transition: { duration: 0.2 } }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onSelect?.(version.id)}
      className="group relative cursor-pointer snap-start"
    >
      <GlassCard
        isDark={isDark}
        padding="none"
        radius="lg"
        className="w-full relative py-4 sm:py-5 px-4 sm:px-6 flex items-center gap-4 sm:gap-6 overflow-hidden text-left"
      >
        {/* Dynamic Mouse-Follow Glow */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl transition duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                ${isDark ? 'rgba(117, 226, 255, 0.05)' : 'rgba(117, 226, 255, 0.08)'},
                transparent 80%
              )
            `,
          }}
        />

        {/* Minimal Pattern Overlay */}
        <div className={`absolute inset-0 opacity-[0.04] pointer-events-none ${isDark ? 'invert' : ''}`} 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='2' cy='2' r='0.5'/%3E%3C/g%3E%3C/svg%3E")` }} 
        />

      {/* 1. STATIC LEFT: Version Badge & Project Info */}
      <div className="flex items-center gap-4 sm:gap-6 min-w-0 sm:min-w-[320px] flex-1 sm:flex-shrink-0">
        {/* Version Badge */}
        <div className="relative flex-shrink-0">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 ${statusConfig.base} ${statusConfig.glow}`}>
            <span className="text-xs sm:text-sm font-black tracking-tighter leading-none">
              <span className="text-[9px] sm:text-[10px] opacity-40 mr-0.5">V</span>
              {version.versionNumber.replace('V', '')}
            </span>
          </div>
          <div className={`absolute -top-0.5 -right-0.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border-2 ${isDark ? 'border-neutral-950' : 'border-white'} ${statusConfig.dot} shadow-lg`} />
        </div>

        {/* Project Profile */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <h4 className={`text-sm sm:text-base font-bold font-sans tracking-tight leading-tight transition-colors truncate ${isDark ? 'text-white' : 'text-black'}`}>
              <span className="opacity-40">{version.dcx.client}</span>
              <span className="mx-1 sm:mx-2 opacity-20">|</span>
              <span className="group-hover:text-primary transition-colors duration-300">
                {version.dcx.projectName}
              </span>
            </h4>
            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.1em] h-max w-fit flex-shrink-0 transition-all duration-300 ${
              isDark 
                ? 'bg-white/[0.03] text-white/20 border border-white/5 group-hover:bg-white/[0.06] group-hover:text-white/40' 
                : 'bg-black/[0.03] text-black/20 border border-black/5 group-hover:bg-black/[0.06] group-hover:text-black/40'
            }`}>
              {version.dcx.product}
            </span>
            <StatusBadge status={version.status} size="sm" />
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC RIGHT: Metadata Cycle (hidden on extra small displays) */}
      <div className="hidden xs:flex flex-1 min-w-0 relative h-10 items-center">
        <AnimatePresence mode="wait">
          {!showCycle ? (
            <motion.div 
              key="static-right"
              className="flex items-center justify-end gap-10 w-full pr-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            >
              {/* Team */}
              <div className="hidden xl:flex items-center -space-x-1.5 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                {version.assignedTeam.slice(0, 3).map((assigned, i) => {
                  const user = MOCK_USERS.find(u => u.id === assigned.userId);
                  const initials = user?.name.split(' ').map(n => n[0]).join('');
                  return (
                    <div key={i} className={`w-5 h-5 rounded-full border ${isDark ? 'border-neutral-900 bg-neutral-800 text-white/50' : 'border-white bg-neutral-100 text-black/50'} flex items-center justify-center text-[9px] font-black`}>
                      {initials}
                    </div>
                  );
                })}
              </div>

              {/* Date */}
              <div className="flex flex-col items-end flex-shrink-0">
                <span className={`text-[11px] font-sans font-bold tracking-tight ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                  {version.lastUpdatedAt.replace(/-/g, '.')}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="cycle-right" 
              className="flex items-center justify-end w-full pr-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={cycleIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-end text-right"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                      {currentCycleItem.label}
                    </span>
                    {currentCycleItem.type === 'team' ? (
                      <div className="flex items-center gap-2">
                        {(currentCycleItem.value as any[]).map((member, i) => {
                          const user = MOCK_USERS.find(u => u.id === member.userId);
                          return (
                            <motion.div 
                              key={member.userId}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                              className="px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10"
                            >
                              <span className="text-xs font-bold text-primary/80">{user?.name}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                        {currentCycleItem.value as string}
                      </span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. ARROW: Always visible */}
      <div className="flex items-center justify-center flex-shrink-0">
        <ChevronRight 
          className={`w-5 h-5 transition-all duration-300 group-hover:translate-x-1 ${
            isDark ? 'text-white/10 group-hover:text-primary' : 'text-black/10 group-hover:text-black'
          }`} 
        />
      </div>
      </GlassCard>
    </motion.div>
  );
});

