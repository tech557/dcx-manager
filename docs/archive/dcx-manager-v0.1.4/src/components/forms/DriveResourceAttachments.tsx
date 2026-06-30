import React, { useState } from "react";
import { Plus, FileText, Trash2 } from "lucide-react";

interface DriveResourceAttachmentsProps {
  isDark: boolean;
  tempAttachments: Array<{ title: string; url: string }>;
  onChangeAttachments: (attachments: Array<{ title: string; url: string }>) => void;
  onAddLog: (logMessage: string) => void;
}

export function DriveResourceAttachments({
  isDark,
  tempAttachments,
  onChangeAttachments,
  onAddLog,
}: DriveResourceAttachmentsProps) {
  const [attachmentTitle, setAttachmentTitle] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const handleAddAttachment = () => {
    if (!attachmentTitle.trim() || !attachmentUrl.trim()) {
      onAddLog("[WARNING] Please provide both title and link.");
      return;
    }
    const title = attachmentTitle.trim();
    const url = attachmentUrl.trim();
    onChangeAttachments([...tempAttachments, { title, url }]);
    onAddLog(`[ATTACH] Added Drive link: "${title}"`);
    setAttachmentTitle("");
    setAttachmentUrl("");
  };

  const handleRemoveAttachment = (idxToRemove: number) => {
    const title = tempAttachments[idxToRemove]?.title || "";
    onChangeAttachments(tempAttachments.filter((_, idx) => idx !== idxToRemove));
    onAddLog(`[DETACH] Removed Drive link: "${title}"`);
  };

  return (
    <div className="space-y-3.5 pt-4 border-t border-current/[0.05]">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-30 text-current select-none">
          4. Attach Google Drive Resources
        </h4>
        <span className="text-[9px] font-mono tracking-wider opacity-40 text-current">
          {tempAttachments.length} Added
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Asset Document Title"
            value={attachmentTitle}
            onChange={(e) => setAttachmentTitle(e.target.value)}
            className={`px-3 py-2.5 rounded-lg border text-xs outline-hidden transition-all duration-300 font-medium ${
              isDark
                ? "bg-black/20 border-white/5 text-white placeholder-white/20 focus:border-primary/40 focus:bg-black/40"
                : "bg-black/[0.02] border-black/5 text-black placeholder-black/30 focus:border-black/20 focus:bg-white"
            }`}
          />

          <div className="flex gap-2">
            <input
              type="url"
              placeholder="URL (e.g., https://drive.google.com/...)"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              className={`flex-1 px-3 py-2.5 rounded-lg border text-xs outline-hidden transition-all duration-300 font-mono font-bold ${
                isDark
                  ? "bg-black/20 border-white/5 text-white placeholder-white/20 focus:border-primary/40 focus:bg-black/40"
                  : "bg-black/[0.02] border-black/5 text-black placeholder-black/30 focus:border-black/20 focus:bg-white"
              }`}
            />
            <button
              type="button"
              onClick={handleAddAttachment}
              className="px-3 bg-primary text-black rounded-lg hover:shadow-[0_0_15px_rgba(117,226,255,0.25)] transition-all flex items-center justify-center cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Developer shortcuts */}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => {
              setAttachmentTitle("V1 Design Assets Moodboard");
              setAttachmentUrl("https://drive.google.com/open?id=moodboard_75e2ff");
              onAddLog("[SHORTCUT] Autopulated Design Assets template details.");
            }}
            className={`text-[9px] font-bold px-2.5 py-1 rounded-md border transition-all select-none cursor-pointer ${
              isDark
                ? "bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                : "bg-black/5 border-black/5 text-black/50 hover:bg-black/10 hover:text-black"
            }`}
          >
            📄 Moodboard
          </button>
          <button
            type="button"
            onClick={() => {
              setAttachmentTitle("ICS Campaign Messaging Deck");
              setAttachmentUrl("https://drive.google.com/open?id=keynote_deck_snb_hsa");
              onAddLog("[SHORTCUT] Autopulated Slide Presentation template details.");
            }}
            className={`text-[9px] font-bold px-2.5 py-1 rounded-md border transition-all select-none cursor-pointer ${
              isDark
                ? "bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                : "bg-black/5 border-black/5 text-black/50 hover:bg-black/10 hover:text-black"
            }`}
          >
            📊 Slide Deck
          </button>
        </div>

        {/* Attachments List Container (Fixed Height to prevent layout shift!) */}
        <div
          className={`h-[110px] rounded-xl border flex flex-col justify-start transition-all duration-300 overflow-hidden ${
            isDark ? "bg-black/20 border-white/5" : "bg-black/[0.01] border-black/5"
          }`}
        >
          {tempAttachments.length > 0 ? (
            <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 space-y-1">
              {tempAttachments.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-current/[0.02]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="font-bold truncate">{f.title}</span>
                    <span className="font-mono text-[9px] opacity-40 truncate">({f.url})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(i)}
                    className="p-1 hover:text-rose-500 transition-colors text-current opacity-60 hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-wider opacity-20">
                No resources attached
              </p>
              <p className="text-[9px] opacity-40 max-w-[220px] mt-1 text-current">
                Use the form above to link design briefs or asset sheets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
