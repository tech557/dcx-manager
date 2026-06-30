import { SkeletonBlock } from '@/ui/skeleton/SkeletonBlock';

/** Skeleton shell for the Version page — matches final Version layout geometry (HV-2). */
export function VersionLoadingSkeleton() {
  return (
    <main className="px-4 sm:px-10 pt-4 pb-10 w-full max-w-[1800px] mx-auto h-[calc(100vh-4rem)] overflow-hidden" aria-busy="true" aria-label="Loading version">
      <div className="w-full h-full rounded-2xl border border-black/[0.06] bg-[var(--theme-surface-void)] overflow-hidden flex flex-col gap-0">

        {/* Header row: back + version title + status badge */}
        <div className="flex items-center gap-4 px-8 py-5 border-b border-black/[0.05] shrink-0">
          <SkeletonBlock surface="light" className="h-8 w-8 rounded-lg shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <SkeletonBlock surface="light" className="h-3 w-20 rounded" />
            <SkeletonBlock surface="light" className="h-6 w-56 rounded" />
          </div>
          <SkeletonBlock surface="light" className="h-7 w-28 rounded-full shrink-0" />
          <SkeletonBlock surface="light" className="h-8 w-32 rounded-xl shrink-0" />
        </div>

        {/* Version switch bar */}
        <div className="flex items-center gap-2 px-8 py-3 border-b border-black/[0.05] shrink-0">
          {[96, 80, 80, 80].map((w, i) => (
            <SkeletonBlock key={i} surface="light" className="h-8 rounded-lg" style={{ width: w }} />
          ))}
        </div>

        {/* Body — two columns */}
        <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-black/[0.05]">

          {/* LEFT — Version summary */}
          <div className="p-8 flex flex-col gap-6 overflow-hidden">
            {/* Summary block */}
            <div className="flex flex-col gap-3">
              <SkeletonBlock surface="light" className="h-2.5 w-24 rounded" />
              <SkeletonBlock surface="light" className="h-5 w-3/4 rounded" />
              <SkeletonBlock surface="light" className="h-3.5 w-full rounded" />
              <SkeletonBlock surface="light" className="h-3.5 w-5/6 rounded" />
              <SkeletonBlock surface="light" className="h-3.5 w-2/3 rounded" />
            </div>

            {/* Dates row */}
            <div className="flex gap-6 shrink-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <SkeletonBlock surface="light" className="h-2 w-16 rounded" />
                  <SkeletonBlock surface="light" className="h-4 w-24 rounded" />
                </div>
              ))}
            </div>

            {/* Resources section */}
            <div className="flex flex-col gap-3">
              <SkeletonBlock surface="light" className="h-2.5 w-20 rounded" />
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-black/[0.06]">
                  <SkeletonBlock surface="light" className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="flex-1 flex flex-col gap-1">
                    <SkeletonBlock surface="light" className="h-3 w-1/2 rounded" />
                    <SkeletonBlock surface="light" className="h-2.5 w-1/3 rounded" />
                  </div>
                  <SkeletonBlock surface="light" className="h-6 w-16 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Crew / collaborators */}
          <div className="p-8 flex flex-col gap-5 overflow-hidden bg-black/[0.01]">
            <SkeletonBlock surface="light" className="h-2.5 w-28 rounded mb-1" />

            {/* Collaborator rows */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBlock surface="light" className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <SkeletonBlock surface="light" className="h-3 w-32 rounded" />
                  <SkeletonBlock surface="light" className="h-2 w-24 rounded" />
                </div>
                <SkeletonBlock surface="light" className="h-5 w-16 rounded-full shrink-0" />
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-black/[0.05]">
              <SkeletonBlock surface="light" className="h-2.5 w-20 rounded mb-4" />
              <div className="flex gap-2 flex-wrap">
                {[72, 88, 64, 96, 80].map((w, i) => (
                  <SkeletonBlock key={i} surface="light" className="h-7 rounded-full" style={{ width: w }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
