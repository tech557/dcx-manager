import { motion } from 'motion/react';
import { Upload, Download, FileType, Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface HeaderUserActionsMenuProps {
  onExport?: () => void;
  onImport?: () => void;
  onClose: () => void;
}

export function HeaderUserActionsMenu({
  onExport,
  onImport,
  onClose,
}: HeaderUserActionsMenuProps) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`absolute right-0 top-12 w-64 rounded-2xl border ${
        isDark
          ? 'border-white/10 bg-[var(--theme-surface-alternate)]/95 text-white'
          : 'border-black/10 bg-white/95 text-black'
      } backdrop-blur-xl shadow-2xl p-3 z-50 text-left`}
      id="header-user-actions-dropdown"
    >
      <div className={`px-2 pb-2 mb-2 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <p className="text-dcx-xs uppercase tracking-wider font-extrabold text-[var(--theme-accent)] font-mono flex items-center gap-1">
          <Sparkles size={10} /> project utilities
        </p>
      </div>

      <div className="space-y-1">
        {onImport && (
          <button
            type="button"
            onClick={() => {
              onImport();
              onClose();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left text-dcx-xs font-semibold cursor-pointer ${
              isDark
                ? 'text-white/80 hover:text-white hover:bg-white/5'
                : 'text-black/80 hover:text-black hover:bg-black/5'
            }`}
            id="menu-import-button"
          >
            <Upload size={14} className="text-[var(--theme-accent)]" />
            Import Plan Grid
          </button>
        )}

        {onExport && (
          <button
            type="button"
            onClick={() => {
              onExport();
              onClose();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left text-dcx-xs font-semibold cursor-pointer ${
              isDark
                ? 'text-white/80 hover:text-white hover:bg-white/5'
                : 'text-black/80 hover:text-black hover:bg-black/5'
            }`}
            id="menu-export-button"
          >
            <Download size={14} className="text-[var(--theme-accent)]" />
            Export Plan JSON
          </button>
        )}
      </div>

      <div className={`mt-3 pt-3 border-t px-2 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <p className={`text-dcx-2xs uppercase tracking-wider font-bold font-mono mb-2 ${
          isDark ? 'text-white/40' : 'text-black/40'
        }`}>
          download comm calendar
        </p>

        <div className="space-y-1">
          <button
            disabled
            type="button"
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left text-dcx-sm cursor-not-allowed border ${
              isDark
                ? 'text-white/30 bg-white/[0.01] border-white/5'
                : 'text-black/30 bg-black/[0.01] border-black/5'
            }`}
            title="PPT format download is coming soon"
          >
            <span className="flex items-center gap-2">
              <FileType size={12} className={isDark ? 'text-white/20' : 'text-black/20'} />
              PowerPoint (.PPT)
            </span>
            <span className={`text-dcx-3xs px-1.5 py-0.5 rounded font-mono uppercase ${
              isDark ? 'bg-white/5 text-white/40' : 'bg-black/5 text-black/40'
            }`}>soon</span>
          </button>

          <button
            disabled
            type="button"
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left text-dcx-sm cursor-not-allowed border ${
              isDark
                ? 'text-white/30 bg-white/[0.01] border-white/5'
                : 'text-black/30 bg-black/[0.01] border-black/5'
            }`}
            title="PDF format download is coming soon"
          >
            <span className="flex items-center gap-2">
              <FileType size={12} className={isDark ? 'text-white/20' : 'text-black/20'} />
              Document (.PDF)
            </span>
            <span className={`text-dcx-3xs px-1.5 py-0.5 rounded font-mono uppercase ${
              isDark ? 'bg-white/5 text-white/40' : 'bg-black/5 text-black/40'
            }`}>soon</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
