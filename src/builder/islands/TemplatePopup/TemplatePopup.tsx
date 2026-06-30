import React, { useState } from 'react';
import StickyPopupShell from '@/ui/StickyPopupShell';
import ReviewModal from '@/builder/islands/PreviewReviewModal/ReviewModal';
import { builderActions } from '@/actions/builder.actions';
import type { BuilderNode, PhaseNodeData } from '@/types/builder-node.types';
import { readTelemetryOptIn, writeTelemetryOptIn } from '@/telemetry/optin';
import type { PreferenceScope } from '@/utils/preference.helpers';
import { getFallbackPreferenceScope } from '@/utils/preference.helpers';
import { useToggle } from '@/hooks/useToggle';

export default function TemplatePopup({ isOpen, onClose, preferenceScope }: { isOpen: boolean; onClose: () => void; preferenceScope?: PreferenceScope; }) {
  const [previewNodes, setPreviewNodes] = useState<BuilderNode[]>([]);
  const [isReviewOpen, , openReview, closeReview] = useToggle();
  const scope = preferenceScope ?? getFallbackPreferenceScope();
  const [optIn, setOptIn] = useState(() => readTelemetryOptIn(scope));

  function generateTemplatePreview() {
    const id = `template-suggest-${Date.now()}`;
    const suggestion: BuilderNode[] = [
      {
        id,
        kind: 'phase',
        parentId: null,
        orderIndex: 0,
        data: {
          id: `template-suggest-${Date.now()}`,
          label: 'Template: New Phase',
          versionId: '',
          icon: 'launch',
          orderIndex: 0,
          description: 'Template preview (inert)',
          actionCards: [],
          createdAt: new Date().toISOString(),
          createdBy: 'template.system',
          updatedAt: null,
          updatedBy: null,
        } as PhaseNodeData,
      },
    ];
    setPreviewNodes(suggestion);
    openReview();
    writeTelemetryOptIn(scope, optIn);
  }

  function handleApply() {
    builderActions.applyImport({ nodes: previewNodes });
    closeReview();
    onClose();
  }

  return (
    <>
      <StickyPopupShell isOpen={isOpen} onClose={onClose} title="Template Gallery (inert)">
        <div className="p-2">
          <p className="text-sm">Template gallery is seeded but inert in this build. Use import/review to apply templates.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="border rounded p-2 text-xs opacity-60">No categories yet</div>
            <div className="border rounded p-2 text-xs opacity-60">Search (inert)</div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button className="btn btn-primary" onClick={generateTemplatePreview}>Preview Template</button>
            <label className="ml-3 text-xs flex items-center gap-2">
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
