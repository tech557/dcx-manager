import { SkeletonBlock } from '@/ui/skeleton/SkeletonBlock';

/** Skeleton shell for the Home page — matches final Home layout geometry (HV-1). */
export function HomeLoadingSkeleton() {
  return (
    <main className="px-4 sm:px-10 pt-4 pb-10 w-full max-w-[1800px] mx-auto h-[calc(100vh-4rem)] overflow-hidden" aria-busy="true" aria-label="Loading home">
      <div className="w-full h-full rounded-2xl border border-black/[0.06] bg-[var(--theme-surface-void)] overflow-hidden flex flex-col lg:grid lg:grid-cols-[2.1fr_0.9fr] divide-y lg:divide-y-0 lg:divide-x divide-black/[0.05]">

        {/* LEFT — Campaign list area */}
        <div className="flex flex-col h-full overflow-hidden p-6 sm:p-8 gap-5">

          {/* Hero bar: title + create button */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex flex-col gap-2">
              <SkeletonBlock surface="light" className="h-3 w-24" />
              <SkeletonBlock surface="light" className="h-8 w-48" />
            </div>
            <SkeletonBlock surface="light" className="h-9 w-36 rounded-full" />
          </div>

          <SkeletonBlock surface="light" className="h-px w-full rounded-none" style={{ borderRadius: 0 }} />

          {/* Search + filter bar */}
          <div className="flex items-center gap-3 shrink-0">
            <SkeletonBlock surface="light" className="h-9 flex-1 rounded-xl" />
            <SkeletonBlock surface="light" className="h-9 w-24 rounded-xl" />
            <SkeletonBlock surface="light" className="h-9 w-20 rounded-xl" />
          </div>

          {/* Saved view pills */}
          <div className="flex items-center gap-2 shrink-0">
            {[80, 64, 72, 56].map((w, i) => (
              <SkeletonBlock key={i} surface="light" className="h-7 rounded-full" style={{ width: w }} />
            ))}
          </div>

          {/* Version cards list */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-black/[0.05] bg-black/[0.01]">
                <SkeletonBlock surface="light" className="h-10 w-10 rounded-xl shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <SkeletonBlock surface="light" className="h-3.5 w-2/3 rounded" />
                  <SkeletonBlock surface="light" className="h-2.5 w-1/3 rounded" />
                </div>
                <SkeletonBlock surface="light" className="h-6 w-20 rounded-full shrink-0" />
                <SkeletonBlock surface="light" className="h-6 w-16 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Analytics + activity */}
        <div className="flex flex-col h-full divide-y divide-black/[0.05] bg-black/[0.01] overflow-hidden">

          {/* Workspace analytics */}
          <div className="p-6 sm:p-8 shrink-0">
            <SkeletonBlock surface="light" className="h-2.5 w-32 mb-5" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-xl border border-black/[0.06]">
                  <SkeletonBlock surface="light" className="h-6 w-10" />
                  <SkeletonBlock surface="light" className="h-2.5 w-full rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity / recently opened */}
          <div className="flex-1 p-6 sm:p-8 overflow-hidden flex flex-col gap-4">
            <SkeletonBlock surface="light" className="h-2.5 w-28 mb-1" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBlock surface="light" className="h-7 w-7 rounded-lg shrink-0" />
                <div className="flex-1 flex flex-col gap-1">
                  <SkeletonBlock surface="light" className="h-2.5 w-3/4 rounded" />
                  <SkeletonBlock surface="light" className="h-2 w-1/2 rounded" />
                </div>
                <SkeletonBlock surface="light" className="h-2 w-12 rounded shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
