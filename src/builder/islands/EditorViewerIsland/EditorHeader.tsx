import React, { useEffect, useRef, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { BuilderNode } from '@/types/builder-node.types';
import type { ReadinessResult } from '@/rules/readiness.rules';
import { ReadyMark } from '@/builder/ui/feedback/ReadyMark';
import { AlertMark } from '@/builder/ui/feedback/AlertMark';
import { MenuSectionButton } from '@/builder/ui/buttons';
import { Input } from '@/ui/atoms/Input';
import { useToggle } from '@/hooks/useToggle';
import { InlineChannelCompositionSelector } from '@/builder/ui/forms/channel';
import type { EditorDraftData } from '@/types/editor.types';
import type { TaskCardData } from '@/types/builder-node.types';

interface EditorHeaderProps {
  activeNode: BuilderNode | { id: string; kind: 'day'; parentId: null; data: { id: string; label: string; dateString: string; kind: 'day' } };
  displayName: string;
  isLocked: boolean;
  readinessFeedback: ReadinessResult | null;
  onClose: () => void;
  onOpenReadinessModal?: () => void;
  activeTab?: 'info' | 'channel' | 'specs' | 'subtasks';
  setActiveTab?: (tab: 'info' | 'channel' | 'specs' | 'subtasks') => void;
  sectionTabs?: Array<{ id: 'info' | 'channel' | 'specs' | 'subtasks'; label: string; title: string; isPassed: boolean }>;
  onDisplayNameChange?: (newVal: string) => void;
  draftData?: EditorDraftData;
  updateDraftField?: (field: string, value: unknown) => void;
}

export function EditorHeader({
  activeNode,
  displayName,
  isLocked,
  readinessFeedback,
  onClose,
  onOpenReadinessModal,
  activeTab,
  setActiveTab,
  sectionTabs,
  onDisplayNameChange,
  draftData,
  updateDraftField,
}: EditorHeaderProps) {
  // Determine readiness text style and icon color
  const isReady = readinessFeedback?.state === 'ready';
  const isNone = !readinessFeedback;
  const [isEditingName, , startEditingName, stopEditingName] = useToggle();
  const [draftDisplayName, setDraftDisplayName] = useState(displayName);
  const displayNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && displayNameInputRef.current) {
      displayNameInputRef.current.focus();
      displayNameInputRef.current.select();
    }
  }, [isEditingName]);

  const beginEditingName = () => {
    setDraftDisplayName(displayName);
    startEditingName();
  };

  const saveDisplayName = () => {
    stopEditingName();
    const nextName = draftDisplayName.trim();
    if (nextName !== displayName) {
      onDisplayNameChange?.(nextName);
    }
  };

  const cancelDisplayName = () => {
    stopEditingName();
    setDraftDisplayName(displayName);
  };

  return (
    <>
      <header className="flex items-start justify-between border-b border-white/10 pb-2.5 shrink-0 px-4 pt-4 whitespace-nowrap">
        <div className="min-w-0 flex-1 relative">
          <p className="text-dcx-2xs uppercase tracking-[0.1em] font-extrabold text-[var(--theme-accent)] font-mono leading-none animate-fade-in mt-1">
            {activeNode.kind} editor
          </p>
          <div className="flex items-center gap-1.5 mt-1 relative">
            {onDisplayNameChange && !isLocked ? (
              isEditingName ? (
                <Input
                  ref={displayNameInputRef}
                  id="header-display-name-edit"
                  value={draftDisplayName}
                  onChange={(event) => setDraftDisplayName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') saveDisplayName();
                    if (event.key === 'Escape') cancelDisplayName();
                  }}
                  onBlur={saveDisplayName}
                  placeholder={activeNode.kind === 'task' ? 'Enter task name...' : 'Enter label...'}
                  size="inline"
                  variant="ghost"
                  className="select-text text-sky-300 drop-shadow-[0_0_8px_var(--theme-info)] text-dcx-base font-extrabold text-neutral-100 tracking-tight max-w-[230px] leading-tight"
                />
              ) : (
                <div
                  onClick={beginEditingName}
                  className="group cursor-pointer border-0 border-none bg-transparent hover:bg-white/[0.04] px-1 py-0.5 rounded transition-all truncate hover:text-sky-300 text-dcx-base font-extrabold text-neutral-100 tracking-tight max-w-[230px] leading-tight"
                  id="header-display-name-static"
                  title="Click to edit"
                >
                  {displayName || (
                    <span className="text-neutral-500 italic">
                      {activeNode.kind === 'task' ? 'Enter task name...' : 'Enter label...'}
                    </span>
                  )}
                </div>
              )
            ) : (
              <h3 className="text-dcx-base font-extrabold text-neutral-100 tracking-tight truncate max-w-[200px] leading-tight" title={displayName}>
                {displayName}
              </h3>
            )}

            {/* Micro-readiness indicator next to the name */}
            {!isNone && (
              <button
                type="button"
                onClick={onOpenReadinessModal}
                className={`flex items-center justify-center p-0.5 rounded cursor-pointer transition-all ${
                  isReady 
                    ? 'text-emerald-400 hover:text-emerald-300' 
                     : readinessFeedback.state === 'blocked'
                      ? 'text-rose-400 hover:bg-rose-500/10'
                      : 'text-amber-400 hover:bg-amber-500/10'
                }`}
                aria-label="Readiness feedback indicator"
                id="header-readiness-indicator"
              >
                {isReady ? (
                  <ReadyMark className="w-3.5 h-3.5" id="header-ready-mark" />
                ) : (
                  <AlertMark className="w-3.5 h-3.5 animate-none" id="header-alert-mark" />
                )}
              </button>
            )}
          </div>

          {/* New Channel & Composition Row nested directly under display title for Tasks */}
          {activeNode.kind === 'task' && draftData && updateDraftField && (
            <div className="mt-1" id="header-channel-composition-container">
              <InlineChannelCompositionSelector
                id={`header-ch-compo-${activeNode.id}`}
                channelId={(draftData as TaskCardData).channelId || null}
                compositionId={(draftData as TaskCardData).compositionId || null}
                onChannelChange={(newCh) => {
                  updateDraftField('channelId', newCh);
                  updateDraftField('compositionId', null);
                }}
                onCompositionChange={(newComp) => {
                  updateDraftField('compositionId', newComp);
                }}
                disabled={isLocked}
              />
            </div>
          )}

          {/* Sleek, super compact glassy circular dots of sections precisely under the title */}
          {activeNode.kind === 'task' && sectionTabs && activeTab && setActiveTab && (
            <div className="flex items-center gap-2.5 mt-2" id="header-menu-dots-container">
              {sectionTabs.map((tab) => (
                <MenuSectionButton
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  title={tab.title}
                  isActive={activeTab === tab.id}
                  isPassed={tab.isPassed}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className="p-1 px-1.5 hover:bg-white/5 rounded-lg text-white/45 hover:text-white transition-colors cursor-pointer shrink-0 mt-0.5"
          onClick={onClose}
          aria-label="Close editor"
        >
          <X className="w-4 h-4" />
        </button>
      </header>


      {isLocked && (
        <div className="mb-2 p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-lg text-amber-300 text-dcx-xs flex gap-2 items-start mx-4 mt-2" id="editor-lock-warning">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
          <div className="min-w-0">
            <p className="font-bold uppercase tracking-tight text-dcx-2xs font-mono">Locked Version</p>
            <p className="text-white/40 leading-normal mt-0.5">
              This version is read-only. Status rules prevent direct edits.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
