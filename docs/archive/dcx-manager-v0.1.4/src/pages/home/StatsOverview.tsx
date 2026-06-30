import { motion } from "motion/react";
import { MOCK_DCX_TABLE } from "../../mock/dcx";
import { MOCK_VERSIONS_TABLE } from "../../mock/versions";
import { GlassCard } from "../../components/ui/GlassCard";

interface StatsOverviewProps {
  isDark: boolean;
}

export function StatsOverview({ isDark }: StatsOverviewProps) {
  const totalCampaigns = MOCK_DCX_TABLE.length;
  const activeDCX = MOCK_DCX_TABLE.filter(dcx => dcx.status !== 'Completed');
  const activeCampaigns = activeDCX.length;
  const avgVersions = totalCampaigns > 0 ? Math.round(MOCK_VERSIONS_TABLE.length / totalCampaigns) : 0;

  return (
    <div className="flex flex-col gap-6 py-1">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group relative"
      >
        <div className="relative">
          <div className="flex items-center gap-4 mb-0.5">
            <div className="group/number cursor-help relative">
              <h2 className={`text-5xl font-black tracking-tighter leading-none transition-all duration-500 group-hover:text-primary ${isDark ? 'text-white' : 'text-black'}`}>
                {activeCampaigns}
              </h2>
              
              {/* Tooltip Overlay */}
              <div className={`absolute left-0 top-full mt-2 z-50 pointer-events-none opacity-0 group-hover/number:opacity-100 transition-all duration-500 translate-y-4 group-hover/number:translate-y-0 w-max min-w-[240px]`}>
                <GlassCard
                  isDark={isDark}
                  className={isDark ? "bg-neutral-900/90" : "bg-white/90"}
                  padding="sm"
                  radius="lg"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className={`text-[10px] font-black tracking-[0.2em] uppercase opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>Active Pipeline</span>
                  </div>
                  <div className="space-y-4">
                    {activeDCX.map(dcx => (
                      <div key={dcx.id} className="space-y-0.5">
                        <p className={`text-[9px] font-black tracking-[0.15em] opacity-40 uppercase ${isDark ? 'text-primary' : 'text-primary'}`}>{dcx.client}</p>
                        <p className={`text-[11px] font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-black'}`}>{dcx.projectName}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className={`text-[8px] font-black tracking-[0.2em] uppercase opacity-20 ${isDark ? 'text-white' : 'text-black'}`}>Status</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(0,242,255,0.5)] animate-pulse" />
                <span className={`text-[8px] font-black tracking-[0.15em] uppercase ${isDark ? 'text-white' : 'text-black'}`}>Live</span>
              </div>
            </div>
          </div>
          
          <p className={`text-[9px] font-black tracking-[0.25em] uppercase ${isDark ? 'text-white/40' : 'text-black/40'}`}>Active Campaigns</p>
        </div>
      </motion.div>

      <div className={`w-full h-px border-t border-dashed transition-all duration-700 ${isDark ? 'border-white/10' : 'border-black/5'}`} />

      <div className="grid grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-0.5"
        >
          <div className="flex items-baseline gap-1.5">
            <h3 className={`text-xl font-black tracking-tightest ${isDark ? 'text-white' : 'text-black'}`}>{totalCampaigns}</h3>
            <span className="text-primary text-xs font-black">↑</span>
          </div>
          <p className={`text-[10px] font-black tracking-[0.2em] uppercase opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>Total Campaigns</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-0.5"
        >
          <div className="flex items-baseline gap-1.5">
            <h3 className={`text-xl font-black tracking-tightest ${isDark ? 'text-white' : 'text-black'}`}>{avgVersions}</h3>
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-1 h-3 rounded-full ${i < avgVersions ? 'bg-primary/40' : 'bg-white/5'}`} />
              ))}
            </div>
          </div>
          <p className={`text-[10px] font-black tracking-[0.2em] uppercase opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>Avg Versions</p>
        </motion.div>
      </div>
    </div>
  );
}
