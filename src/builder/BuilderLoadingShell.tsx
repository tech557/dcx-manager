import { BuilderBg } from '@/ui/BuilderBg/BuilderBg';
import { SkeletonBlock } from '@/ui/skeleton/SkeletonBlock';

interface BuilderLoadingShellProps {
  error?: string | null;
  onRetry?: () => void;
}

export function BuilderLoadingShell({ error, onRetry }: BuilderLoadingShellProps) {
  return (
    <div className="builder-canvas flex flex-col h-full w-full max-h-screen max-w-screen p-6 gap-6 relative overflow-hidden bg-bg-deep select-none" id="builder-loading-shell">
      <BuilderBg />

      {error ? (
        <div className="flex-1 flex items-center justify-center z-50">
          <div className="max-w-md w-full bg-[var(--theme-glass-bg)] border border-white/10 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl flex flex-col items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-lg">!</div>
            <h2 className="text-xl font-bold text-white leading-tight">Unable to load workspace</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">{error}</p>
            <button
              onClick={onRetry}
              className="mt-2 px-5 py-2.5 rounded-lg bg-white/10 border border-white/10 hover:border-white/25 text-sm font-semibold text-white transition-all cursor-pointer active:scale-95"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ROW 1: Header Skeleton */}
          <SkeletonBlock className="shrink-0 z-50 w-full border border-white/5" style={{ height: 'var(--dim-builder-header)' }} />

          {/* ROW 2: Stage Skeleton */}
          <div className="flex-1 min-h-0 w-full flex items-center gap-4 relative">
            <SkeletonBlock className="h-full shrink-0 border border-white/5" style={{ width: 'var(--dim-phase-collapsed)' }} />
            <div className="flex-1 h-full flex gap-6 items-center justify-center overflow-hidden bg-white/[0.01] border border-white/5 rounded-2xl p-4">
              {[1, 2, 3].map((i) => (
                <SkeletonBlock key={i} className="shrink-0 h-full border border-white/5" style={{ width: 'var(--dim-phase-expanded)' }} />
              ))}
            </div>
            <SkeletonBlock className="h-full shrink-0 border border-white/5" style={{ width: 'var(--dim-phase-collapsed)' }} />
          </div>

          {/* ROW 3: Footer Skeleton */}
          <div className="shrink-0 z-50 w-full grid grid-cols-3 items-center px-1 relative" style={{ height: 'var(--dim-builder-footer)' }}>
            <div className="flex justify-start"><SkeletonBlock className="w-[200px] h-12 rounded-full border border-white/5" /></div>
            <div className="flex justify-center"><SkeletonBlock className="w-[320px] h-12 rounded-full border border-white/5" /></div>
            <div className="flex justify-end"><SkeletonBlock className="w-[200px] h-12 rounded-full border border-white/5" /></div>
          </div>
        </>
      )}
    </div>
  );
}
