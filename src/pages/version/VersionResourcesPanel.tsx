import { motion } from 'motion/react';
import { ExternalLink, FileText, Link2 } from 'lucide-react';
import type { ApiFileAttachment } from '@/types/api';

function FileIcon({ source }: { source: ApiFileAttachment['source'] }) {
  return source === 'google-drive'
    ? <FileText size={14} className="text-[var(--theme-accent)]/70 shrink-0" />
    : <Link2 size={14} className="text-[var(--theme-text-secondary)]/50 shrink-0" />;
}

interface VersionResourcesPanelProps {
  attachments: ApiFileAttachment[];
}

export function VersionResourcesPanel({ attachments }: VersionResourcesPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/40">
        Version Documents
      </h3>
      {attachments.length === 0 ? (
        <p className="text-[11px] text-[var(--theme-text-secondary)]/40">No documents attached.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {attachments.map((f, i) => (
            <motion.a
              key={f.id}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
              whileHover={{ x: 2 }}
              className="glass-card flex items-center gap-2.5 px-3 py-2 rounded-lg group"
            >
              <FileIcon source={f.source} />
              <span className="flex-1 min-w-0 text-[11px] font-medium text-[var(--theme-text-primary)] truncate group-hover:text-[var(--theme-accent)] transition-colors">
                {f.title}
              </span>
              <ExternalLink size={11} className="shrink-0 text-[var(--theme-text-secondary)]/30 group-hover:text-[var(--theme-accent)]/60 transition-colors" />
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
