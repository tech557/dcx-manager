import React, { useState } from 'react';
import StickyPopupShell from '@/ui/StickyPopupShell';
import ReviewModal from '@/builder/islands/PreviewReviewModal/ReviewModal';
import { builderActions } from '@/actions/builder.actions';
import type { BuilderNode, PhaseNodeData } from '@/types/builder-node.types';
import { readTelemetryOptIn, writeTelemetryOptIn } from '@/telemetry/optin';
import type { PreferenceScope } from '@/utils/preference.helpers';
import { getFallbackPreferenceScope } from '@/utils/preference.helpers';
import { useToggle } from '@/hooks/useToggle';

export default function AIChatPopup({ isOpen, onClose, preferenceScope }: { isOpen: boolean; onClose: () => void; preferenceScope?: PreferenceScope; }) {
  const [previewNodes, setPreviewNodes] = useState<BuilderNode[]>([]);
  const [isReviewOpen, , openReview, closeReview] = useToggle();
  const scope = preferenceScope ?? getFallbackPreferenceScope();
  const [optIn, setOptIn] = useState(() => readTelemetryOptIn(scope));

  function generatePreview() {
    // stub: create a harmless suggestion — duplicate existing minimal phase skeleton
    const suggestion: BuilderNode[] = [
      {
        id: `ai-suggest-${Date.now()}`,
        kind: 'phase',
        parentId: null,
        orderIndex: 0,
        data: {
          id: `ai-suggest-${Date.now()}`,
          label: 'AI Suggested Phase',
          versionId: '',
          icon: 'launch',
          orderIndex: 0,
          description: 'Generated suggestion (preview-only)',
          actionCards: [],
          createdAt: new Date().toISOString(),
          createdBy: 'ai.system',
          updatedAt: null,
          updatedBy: null,
        } as PhaseNodeData,
      },
    ];
    setPreviewNodes(suggestion);
    openReview();
    // telemetry stub: write opt-in flag event locally (no network)
    writeTelemetryOptIn(scope, optIn);
  }

  function handleApply() {
    // Apply via action boundary so all invariants are kept.
    builderActions.applyImport({ nodes: previewNodes });
    closeReview();
    onClose();
  }

  return (
    <>
      <StickyPopupShell isOpen={isOpen} onClose={onClose} title="AI Chat (inert)">
        <div className="p-2">
          <p className="text-dcx-md-plus">AI Chat is inert in this build. Generated suggestions are shown here in preview-only mode.</p>
          <div className="mt-3 border rounded p-2 bg-black/10 text-dcx-xs">No AI output (MVP inert)</div>

          <div className="mt-3 flex items-center gap-2">
            <button className="btn btn-primary" onClick={generatePreview}>Preview Suggestion</button>
            <label className="ml-3 text-dcx-xs flex items-center gap-2">
              <input type="checkbox" checked={optIn} onChange={(e) => { setOptIn(e.target.checked); writeTelemetryOptIn(scope, e.target.checked); }} />
              <span>Opt in to telemetry (local only)</span>
            </label>
          </div>
        </div>
      </StickyPopupShell>

      <ReviewModal isOpen={isReviewOpen} onClose={closeReview} nodes={previewNodes} onApply={handleApply} />
    </>
  );
}
