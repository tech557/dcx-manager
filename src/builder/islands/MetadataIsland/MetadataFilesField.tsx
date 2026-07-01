import React, { useEffect, useRef, useState } from 'react';
import { Paperclip, Link2, FileText, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ApiFileAttachment } from '@/types/api';
import { useTheme } from '@/hooks/useTheme';
import { useToggle } from '@/hooks/useToggle';
import { ISLAND_LABEL_CLASS } from '@/ui/atoms/labels';
import { MetadataFilePreviews } from './MetadataFilePreviews';
import type { FileSession } from './useFilePreview';

interface MetadataFilesFieldProps {
  attachments: ApiFileAttachment[];
  sessions: FileSession[];
  closeFile: (id: string) => void;
  minimizeFile: (id: string) => void;
  restoreFile: (id: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemotePreview: (url: string, title: string) => Promise<void>;
}

/**
 * Files field — a trigger + an anchored dropdown that mirrors StatusDropdownBadge's
 * behavior (opens beside its own field, closes on outside-click) and its font/glass tokens,
 * so status / dates / files all read as one group. Preview windows float independently.
 */
export function MetadataFilesField({
  attachments, sessions, closeFile, minimizeFile, restoreFile, handleFileChange, handleRemotePreview,
}: MetadataFilesFieldProps) {
  const { isDark } = useTheme();
  const [isOpen, toggleOpen, , closeOpen] = useToggle();
  const [remoteUrl, setRemoteUrl] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) closeOpen();
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOpen]);

  return (
    <div className="relative" ref={containerRef} id="metadata-files-container">
      <button
        id="metadata-files-trigger-button"
        type="button"
        onClick={toggleOpen}
        className={`flex items-center gap-1.5 opacity-80 hover:opacity-100 text-white hover:text-[var(--theme-accent)] transition cursor-pointer ${isOpen ? 'text-[var(--theme-accent)] opacity-100' : ''}`}
        title={`${attachments.length} attachments — Click to view files`}
      >
        <Paperclip size={12} className="text-[var(--theme-muted)] shrink-0" />
        <span className="text-dcx-xs font-bold font-mono text-white/60">{attachments.length}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute right-0 mt-3 w-80 rounded-2xl border p-2 z-50 shadow-2xl ${
              isDark
                ? 'bg-[var(--theme-surface-alternate)]/95 border-white/10 backdrop-blur-xl text-white'
                : 'bg-white border-neutral-200 text-neutral-800 shadow-neutral-200/50'
            }`}
            id="metadata-files-menu"
          >
            <div className={`flex items-center gap-2 px-2.5 py-1.5 mb-1.5 border-b ${isDark ? 'border-white/5' : 'border-neutral-100'}`}>
              <Paperclip className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span className={`text-dcx-xs uppercase font-sans font-extrabold tracking-wider ${isDark ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-accent-deep)]'}`}>
                Project Attachments
              </span>
            </div>

            <div className="max-h-[180px] overflow-y-auto flex flex-col gap-1 pr-0.5">
              {attachments.length === 0 ? (
                <p className={`text-dcx-xs italic py-4 text-center ${isDark ? 'text-white/40' : 'text-neutral-400'}`}>No project files attached to this version.</p>
              ) : (
                attachments.map((file) => (
                  <div key={file.id} className={`flex items-center justify-between gap-2 p-2.5 rounded-xl transition ${isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      {file.source === 'google-drive' ? <FileText className="w-4 h-4 text-emerald-400 shrink-0" /> : <Link2 className="w-4 h-4 text-blue-400 shrink-0" />}
                      <div className="flex flex-col min-w-0">
                        <span className={`text-dcx-sm font-semibold truncate ${isDark ? 'text-white/95' : 'text-neutral-800'}`}>{file.title}</span>
                        <span className={`${ISLAND_LABEL_CLASS} normal-case tracking-[0.1em] ${isDark ? 'text-white/40' : 'text-neutral-500'}`}>{file.source}</span>
                      </div>
                    </div>
                    <button id={`open-attachment-${file.id}`} onClick={() => handleRemotePreview(file.url, file.title)} className="px-2.5 py-1 text-dcx-xs font-bold uppercase bg-[var(--theme-accent)]/10 hover:bg-[var(--theme-accent)]/20 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 rounded-md transition cursor-pointer shrink-0">Open</button>
                  </div>
                ))
              )}
            </div>

            <div className={`border-t mt-1.5 pt-2.5 px-1 flex flex-col gap-3 ${isDark ? 'border-white/5' : 'border-neutral-100'}`}>
              <div className="flex flex-col gap-1.5">
                <span className={ISLAND_LABEL_CLASS}>Open Local File</span>
                <label htmlFor="local-file-preview-input" className={`flex items-center gap-2 p-2 rounded-lg border border-dashed transition cursor-pointer justify-center text-dcx-xs text-[var(--theme-accent)] ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'}`}>
                  <Upload className="w-4 h-4" /><span>Choose Image or PDF</span>
                  <input id="local-file-preview-input" type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className={ISLAND_LABEL_CLASS}>Preview Remote URL</span>
                <div className="flex gap-2">
                  <input type="url" placeholder="https://example.com/document.pdf" value={remoteUrl} onChange={(e) => setRemoteUrl(e.target.value)} className={`flex-1 p-2 rounded-lg text-dcx-xs focus:border-[var(--theme-accent)] focus:outline-none border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-800'}`} />
                  <button onClick={() => { const u = remoteUrl.trim(); if (u) { handleRemotePreview(u, u); setRemoteUrl(''); } }} className="px-4 py-2 text-dcx-xs font-bold bg-[var(--theme-accent)]/15 hover:bg-[var(--theme-accent)]/25 text-[var(--theme-accent)] border border-[var(--theme-accent)]/30 rounded-lg transition cursor-pointer">Preview</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MetadataFilePreviews sessions={sessions} closeFile={closeFile} minimizeFile={minimizeFile} restoreFile={restoreFile} />
    </div>
  );
}
