import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { MouseGlowBackground } from '@/ui/MouseGlowBackground/MouseGlowBackground';

export function VersionMissingState() {
  const navigate = useNavigate();
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-[var(--theme-surface-void)]">
      <MouseGlowBackground />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 glass-panel rounded-2xl flex flex-col items-center gap-5 text-center max-w-xs p-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center">
          <AlertCircle size={24} className="text-[var(--theme-accent)]/60" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[var(--theme-text-primary)] tracking-tight">Version not found</h1>
          <p className="text-[11px] text-[var(--theme-text-secondary)]/60 mt-1.5 leading-snug">
            This version may have been removed or the link is incorrect.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-brand flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]"
        >
          <Home size={14} />
          Back to Campaign Hub
        </button>
      </motion.div>
    </div>
  );
}
