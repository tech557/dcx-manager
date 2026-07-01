import StickyPopupShell from '@/ui/StickyPopupShell';
import type { FileSession } from './useFilePreview';

interface MetadataFilePreviewsProps {
  sessions: FileSession[];
  closeFile: (id: string) => void;
  minimizeFile: (id: string) => void;
  restoreFile: (id: string) => void;
}

/**
 * Floating file-preview windows + minimized pills. Rendered independently of the files
 * trigger because each preview is a free-floating sticky window, not part of the dropdown.
 */
export function MetadataFilePreviews({ sessions, closeFile, minimizeFile, restoreFile }: MetadataFilePreviewsProps) {
  const openSessions = sessions.filter((s) => !s.isMinimized);
  const minimizedSessions = sessions.filter((s) => s.isMinimized);

  return (
    <>
      {openSessions.map((s) => (
        <StickyPopupShell key={s.id} isOpen title={s.title} onClose={() => closeFile(s.id)} onMinimize={() => minimizeFile(s.id)} isMinimized={false}>
          {s.embedAllowed === true ? (
            s.contentType?.toLowerCase().includes('pdf') ? (
              <iframe src={s.url} className="w-full h-[320px]" title={s.title} />
            ) : (
              <img src={s.url} alt={s.title || 'Preview'} className="max-w-full max-h-[320px] object-contain mx-auto" referrerPolicy="no-referrer" />
            )
          ) : s.embedAllowed === false ? (
            <div className="flex flex-col gap-2 p-4 text-center">
              <div className="text-sm opacity-80">This URL cannot be embedded due to browser security policies.</div>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-[var(--theme-accent)] underline inline-flex items-center justify-center gap-1">Open link in new window</a>
            </div>
          ) : s.url.toLowerCase().endsWith('.pdf') ? (
            <iframe src={s.url} className="w-full h-[320px]" title={s.title} />
          ) : (
            <img src={s.url} alt={s.title || 'Preview'} className="max-w-full max-h-[320px] object-contain mx-auto" referrerPolicy="no-referrer" />
          )}
        </StickyPopupShell>
      ))}

      {minimizedSessions.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[130] flex gap-2" id="file-session-pills">
          {minimizedSessions.map((s) => (
            <button key={s.id} onClick={() => restoreFile(s.id)} className="px-3 py-1.5 rounded-full bg-[var(--theme-surface-deep)]/90 border border-white/10 text-[var(--theme-accent)] text-dcx-sm font-semibold truncate max-w-[160px] hover:bg-white/10 transition cursor-pointer shadow-lg" title={s.title}>
              {s.title}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
