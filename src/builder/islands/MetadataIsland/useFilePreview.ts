import { useState } from 'react';

export type FileSession = {
  id: string;
  title: string;
  url: string;
  isMinimized: boolean;
  contentType: string | null;
  embedAllowed: boolean | null;
};

export function useFilePreview() {
  const [sessions, setSessions] = useState<FileSession[]>([]);

  const openFile = (title: string, url: string, meta?: { contentType?: string | null; embedAllowed?: boolean | null }) => {
    const id = `preview-${Date.now()}`;
    setSessions(prev => [...prev, { id, title, url, isMinimized: false, contentType: meta?.contentType ?? null, embedAllowed: meta?.embedAllowed ?? null }]);
    return id;
  };

  const closeFile = (id: string) => setSessions(prev => prev.filter(s => s.id !== id));
  const minimizeFile = (id: string) => setSessions(prev => prev.map(s => s.id === id ? { ...s, isMinimized: true } : s));
  const restoreFile = (id: string) => setSessions(prev => prev.map(s => s.id === id ? { ...s, isMinimized: false } : s));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    openFile(f.name, URL.createObjectURL(f), { contentType: f.type || null, embedAllowed: f.type?.startsWith('image/') || f.type?.includes('pdf') || false });
    e.target.value = '';
  };

  const handleRemotePreview = async (url: string, title: string) => {
    let contentType: string | null = null;
    let embedAllowed: boolean | null = null;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const resp = await fetch(url, { method: 'HEAD', mode: 'cors', signal: controller.signal });
      clearTimeout(timeout);
      contentType = resp.headers.get('Content-Type');
      if (contentType) {
        const lc = contentType.toLowerCase();
        embedAllowed = lc.startsWith('image/') || lc.includes('pdf');
      }
    } catch {
      embedAllowed = false;
    }
    openFile(title, url, { contentType, embedAllowed });
  };

  return { sessions, openFile, closeFile, minimizeFile, restoreFile, handleFileChange, handleRemotePreview };
}
