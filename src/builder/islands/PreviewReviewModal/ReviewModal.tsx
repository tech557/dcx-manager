import React from 'react';
import type { BuilderNode } from '@/types/builder-node.types';
import StickyPopupShell from '@/ui/StickyPopupShell';

export default function ReviewModal({
  isOpen,
  onClose,
  nodes,
  onApply,
}: {
  isOpen: boolean;
  onClose: () => void;
  nodes: BuilderNode[];
  onApply: () => void;
}) {
  return (
    <StickyPopupShell isOpen={isOpen} onClose={onClose} title="Preview & Review">
      <div className="p-3 max-h-[60vh] overflow-auto">
        <p className="text-sm mb-2">Review the suggested nodes below. Applying will go through the action boundary.</p>
        <div className="space-y-2">
          {nodes.length === 0 && <div className="text-xs opacity-60">No suggested changes</div>}
          {nodes.map((n) => (
            <div key={n.id} className="border rounded p-2 bg-white/80 text-xs">
              <div className="font-semibold">{n.kind.toUpperCase()}: {n.data && 'label' in n.data ? String((n.data as unknown as Record<string, unknown>).label) : n.id}</div>
              <div className="text-xxs opacity-70">id: {n.id} • parent: {n.parentId ?? 'root'}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onApply} disabled={nodes.length === 0}>Apply</button>
        </div>
      </div>
    </StickyPopupShell>
  );
}
