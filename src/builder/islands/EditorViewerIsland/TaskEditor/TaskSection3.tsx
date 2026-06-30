import React from 'react';
import type { TaskCardData } from '@/types/builder-node.types';
import { ListInputLines, SpecsInput } from '@/ui/forms/inputs';

interface TaskSection3Props {
  draftData: TaskCardData;
  updateDraftField: (field: string, value: unknown) => void;
}

export function TaskSection3({ draftData, updateDraftField }: TaskSection3Props) {
  const specsState = draftData.specsState || { status: 'empty' };
  const missingState = draftData.missingDataState || { status: 'empty' };

  const isSpecsEnabled = specsState.status === 'filled';
  const isMissingEnabled = missingState.status === 'filled';

  // Parse Spec details
  const rawSpec = isSpecsEnabled ? specsState.value || '' : '';
  const colonIdx = rawSpec.indexOf(':');
  const metricLabel = colonIdx !== -1 ? rawSpec.substring(0, colonIdx).trim() : 'Asset Specification';
  const metricValue = colonIdx !== -1 ? rawSpec.substring(colonIdx + 1).trim() : rawSpec.trim();

  // Parse Missing Data
  const rawMissing = isMissingEnabled ? missingState.value || '' : '';
  const missingItems = rawMissing ? rawMissing.split('\n').map((i) => i.trim()).filter(Boolean) : [];

  const handleSpecsToggle = (enabled: boolean) => {
    if (enabled) {
      updateDraftField('specsState', { status: 'filled', value: `${metricLabel}: ${metricValue || 'Required'}` });
    } else {
      updateDraftField('specsState', { status: 'not-needed' });
    }
  };

  const handleSpecDetailsChange = (label: string, value: string) => {
    updateDraftField('specsState', { status: 'filled', value: `${label}: ${value}` });
  };

  const handleMissingToggle = (enabled: boolean) => {
    if (enabled) {
      updateDraftField('missingDataState', { status: 'filled', value: missingItems.length > 0 ? missingItems.join('\n') : 'Outstanding queries pending' });
    } else {
      updateDraftField('missingDataState', { status: 'not-needed' });
    }
  };

  const handleMissingItemsChange = (items: string[]) => {
    updateDraftField('missingDataState', { status: 'filled', value: items.join('\n') });
  };

  return (
    <div className="space-y-4" id="task-editor-section-3">
      {/* 1. Specifications Panel */}
      <div className="border border-white/5 p-3 rounded-lg bg-white/[0.01] space-y-3">
        <div className="flex justify-between items-center select-none">
          <div>
            <p className="text-dcx-xs font-mono text-neutral-200 font-light uppercase tracking-wide">
              Asset Specifications
            </p>
            <p className="text-dcx-3xs-plus text-neutral-500 font-mono mt-0.5">
              Require explicit dimension constraints or media types.
            </p>
          </div>
          
          {/* Custom Toggle Switch */}
          <button
            type="button"
            onClick={() => handleSpecsToggle(!isSpecsEnabled)}
            className={`relative inline-flex h-4 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:ring-0 ${
              isSpecsEnabled ? 'bg-[var(--theme-accent)]' : 'bg-neutral-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-neutral-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                isSpecsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {isSpecsEnabled && (
          <div className="pt-2.5 border-t border-white/5 animate-fade-in">
            <SpecsInput
              id="task-specs-custom-input"
              title="Specification Settings"
              metricLabel={metricLabel}
              metricValue={metricValue}
              onLabelChange={(lbl) => handleSpecDetailsChange(lbl, metricValue)}
              onValueChange={(val) => handleSpecDetailsChange(metricLabel, val)}
              placeholderLabel="Asset Type (e.g. Dimensions)"
              placeholderValue="Value (e.g. 1080x1350)"
            />
          </div>
        )}
      </div>

      {/* 2. Missing Data Panel */}
      <div className="border border-white/5 p-3 rounded-lg bg-white/[0.01] space-y-3">
        <div className="flex justify-between items-center select-none">
          <div>
            <p className="text-dcx-xs font-mono text-neutral-200 font-light uppercase tracking-wide">
              Outstanding Elements
            </p>
            <p className="text-dcx-3xs-plus text-neutral-500 font-mono mt-0.5">
              Track unresolved questions or missing resources.
            </p>
          </div>

          {/* Custom Toggle Switch */}
          <button
            type="button"
            onClick={() => handleMissingToggle(!isMissingEnabled)}
            className={`relative inline-flex h-4 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:ring-0 ${
              isMissingEnabled ? 'bg-[var(--theme-accent)]' : 'bg-neutral-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-neutral-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                isMissingEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {isMissingEnabled && (
          <div className="pt-2.5 border-t border-white/5 animate-fade-in">
            <ListInputLines
              id="task-missing-lines"
              label="Outstanding Queries Checklist"
              items={missingItems}
              onChange={handleMissingItemsChange}
              placeholder="Type missing detail or query..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
