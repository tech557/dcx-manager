import React, { useState } from 'react';
import { X, Paperclip, Link2, FileText, Upload } from 'lucide-react';
import type { ApiFileAttachment } from '@/types/api';
import StickyPopupShell from '@/ui/StickyPopupShell';
import { useTheme } from '@/hooks/useTheme';
import type { FileSession } from './useFilePreview';

interface MetadataFilesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: ApiFileAttachment[];
  sessions: FileSession[];
  closeFile: (id: string) => void;
  minimizeFile: (id: string) => void;
  restoreFile: (id: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemotePreview: (url: string, title: string) => Promise<void>;
}

export function MetadataFilesPopup({
  isOpen, onClose, attachments,
  sessions, closeFile, minimizeFile, restoreFile,
  handleFileChange, handleRemotePreview,
}: MetadataFilesPopupProps) {
  const [remoteUrl, setRemoteUrl] = useState('');
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const minimizedSessions = sessions.filter(s => s.isMinimized);
  const openSessions = sessions.filter(s => !s.isMinimized);

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" id="metadata-files-popup-overlay">
        <div className={`w-[450px] max-w-full rounded-[1.5rem] border p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 text-left ${isDark ? 'bg-[var(--theme-glass-bg)] text-white border-white/10' : 'bg-white/95 text-neutral-900 border-neutral-200/80'}`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div className="flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-[var(--theme-accent)]" />
              <h3 className={`font-bold text-dcx-base ${isDark ? 'text-white' : 'text-neutral-800'}`}>Project Attachments</h3>
            </div>
            <button onClick={onClose} className={`p-1 rounded-full transition cursor-pointer ${isDark ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800'}`} aria-label="Close dialog">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-1">
            {attachments.length === 0 ? (
              <p className={`text-xs italic py-4 text-center ${isDark ? 'text-white/40' : 'text-neutral-400'}`}>No project files attached to this version.</p>
            ) : (
              attachments.map((file) => (
                <div key={file.id} className={`flex items-center justify-between p-2.5 rounded-lg border transition ${isDark ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-neutral-50 border-neutral-100/60 hover:border-neutral-200'}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    {file.source === 'google-drive' ? <FileText className="w-4 h-4 text-emerald-400 shrink-0" /> : <Link2 className="w-4 h-4 text-blue-400 shrink-0" />}
                    <div className="flex flex-col min-w-0">
                      <span className={`text-dcx-sm font-semibold truncate ${isDark ? 'text-white/95' : 'text-neutral-800'}`}>{file.title}</span>
                      <span className={`text-dcx-2xs font-mono uppercase ${isDark ? 'text-white/45' : 'text-neutral-500'}`}>{file.source}</span>
                    </div>
                  </div>
                  <button id={`open-attachment-${file.id}`} onClick={() => handleRemotePreview(file.url, file.title)} className="px-2.5 py-1 text-dcx-xs font-bold uppercase bg-[var(--theme-accent)]/10 hover:bg-[var(--theme-accent)]/20 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 rounded-md transition cursor-pointer shrink-0">Open</button>
                </div>
              ))
            )}
          </div>
          <div className={`border-t pt-4 flex flex-col gap-3 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div className="flex flex-col gap-1.5">
              <span className={`text-dcx-xs font-bold tracking-wider opacity-50 uppercase ${isDark ? 'text-white/50' : 'text-neutral-500'}`}>Open Local File</span>
              <label htmlFor="local-file-preview-input" className={`flex items-center gap-2 p-2 rounded-lg border border-dashed transition cursor-pointer justify-center text-xs text-[var(--theme-accent)] ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'}`}>
                <Upload className="w-4 h-4" /><span>Choose Image or PDF</span>
                <input id="local-file-preview-input" type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className={`text-dcx-xs font-bold tracking-wider opacity-50 uppercase ${isDark ? 'text-white/50' : 'text-neutral-500'}`}>Preview Remote URL</span>
              <div className="flex gap-2">
                <input type="url" placeholder="https://example.com/document.pdf" value={remoteUrl} onChange={(e) => setRemoteUrl(e.target.value)} className={`flex-1 p-2 rounded-lg text-xs focus:border-[var(--theme-accent)] focus:outline-none border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-800'}`} />
                <button onClick={() => { const u = remoteUrl.trim(); if (u) { handleRemotePreview(u, u); setRemoteUrl(''); } }} className="px-4 py-2 text-xs font-bold bg-[var(--theme-accent)]/15 hover:bg-[var(--theme-accent)]/25 text-[var(--theme-accent)] border border-[var(--theme-accent)]/30 rounded-lg transition cursor-pointer">Preview</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openSessions.map(s => (
        <StickyPopupShell key={s.id} isOpen={true} title={s.title} onClose={() => closeFile(s.id)} onMinimize={() => minimizeFile(s.id)} isMinimized={false}>
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
          {minimizedSessions.map(s => (
            <button key={s.id} onClick={() => restoreFile(s.id)} className="px-3 py-1.5 rounded-full bg-[var(--theme-surface-deep)]/90 border border-white/10 text-[var(--theme-accent)] text-dcx-sm font-semibold truncate max-w-[160px] hover:bg-white/10 transition cursor-pointer shadow-lg" title={s.title}>
              {s.title}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
