import React from 'react';
import type { BuilderNode } from '@/types/builder-node.types';
import type { ImportDecision, ImportDiffGroup } from '@/builder/import/import.helpers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  importedNodes: BuilderNode[] | null;
  diff: ImportDiffGroup | null;
  onApply: () => void;
  onFileLoad: (file: File) => Promise<void>;
  confirmDeletes: boolean;
  setConfirmDeletes: (v: boolean) => void;
  decisions?: Record<string, ImportDecision>;
  setDecision?: (id: string, decision: ImportDecision) => void;
  labelForId?: (id: string) => string;
}

export const ImportPreviewModal: React.FC<Props> = ({ isOpen, onClose, importedNodes, diff, onApply, onFileLoad, confirmDeletes, setConfirmDeletes, decisions = {}, setDecision, labelForId }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-shell">
      <div className="modal-card">
        <h3>Import Preview</h3>

        <div className="mb-2">
          <label className="sr-only" htmlFor="import-file-input">Import JSON file</label>
          <input
            id="import-file-input"
            aria-label="Import export JSON file"
            type="file"
            accept="application/json"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) onFileLoad(file);
            }}
          />
        </div>

        {!importedNodes && <div>No file loaded. Choose a JSON export to preview.</div>}
        {importedNodes && (
          <div>
            <p className="mb-2">Imported nodes: {importedNodes.length}</p>
            <div>
              <strong>Added:</strong> {diff?.added?.length ?? 0}
            </div>
            <div>
              <strong>Updated:</strong> {diff?.updated?.length ?? 0}
            </div>
            <div>
              <strong>Missing (would be removed):</strong> {diff?.missing?.length ?? 0}
            </div>
            <div>
              <strong>Conflicts:</strong> {diff?.conflicts?.length ?? 0}
            </div>

            {/* Per-item lists */}
            <div className="mt-3 grid grid-cols-1 gap-3">
              {diff && diff.updated && diff.updated.length > 0 && (
                <section>
                  <h4 className="text-sm font-bold">Updated items</h4>
                  <ul className="mt-2 space-y-2">
                    {diff.updated.map((u) => (
                      <li key={u.existingId} className="flex items-start justify-between gap-3">
                        <div className="flex-1 text-xs break-words">{labelForId ? labelForId(u.existingId) : u.existingId}</div>
                        <div className="flex items-center gap-2">
                          <select
                            aria-label={`Decision for updated item ${u.existingId}`}
                            value={decisions[u.existingId] ?? 'update'}
                            onChange={(e) => setDecision && setDecision(u.existingId, e.target.value as ImportDecision)}
                            className="text-xs"
                          >
                            <option value="update">Update</option>
                            <option value="keep">Keep existing</option>
                          </select>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {diff && diff.added && diff.added.length > 0 && (
                <section>
                  <h4 className="text-sm font-bold">New items in import</h4>
                  <ul className="mt-2 space-y-2">
                    {diff.added.map((n) => (
                      <li key={n.id} className="flex items-start justify-between gap-3">
                        <div className="flex-1 text-xs break-words">{labelForId ? labelForId(n.id) : n.id}</div>
                        <div className="flex items-center gap-2">
                          <select
                            aria-label={`Decision for new item ${n.id}`}
                            value={decisions[n.id] ?? 'add'}
                            onChange={(e) => setDecision && setDecision(n.id, e.target.value as ImportDecision)}
                            className="text-xs"
                          >
                            <option value="add">Add</option>
                            <option value="skip">Skip</option>
                          </select>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {diff && diff.missing && diff.missing.length > 0 && (
                <section>
                  <h4 className="text-sm font-bold">Existing items not found in import (deletion candidates)</h4>
                  <ul className="mt-2 space-y-2">
                    {diff.missing.map((m) => (
                      <li key={m.existingId} className="flex items-start justify-between gap-3">
                        <div className="flex-1 text-xs break-words">{labelForId ? labelForId(m.existingId) : m.existingId}</div>
                        <div className="flex items-center gap-2">
                          <select
                            aria-label={`Decision for existing item ${m.existingId}`}
                            value={decisions[m.existingId] ?? 'keep'}
                            onChange={(e) => setDecision && setDecision(m.existingId, e.target.value as ImportDecision)}
                            className="text-xs"
                          >
                            <option value="keep">Keep</option>
                            <option value="delete">Delete</option>
                          </select>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {diff && diff.missing && diff.missing.length > 0 && (
              <div className="mt-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={confirmDeletes} onChange={(e) => setConfirmDeletes(e.target.checked)} />
                  Confirm that you want to delete {diff.missing.length} existing items not present in the import
                </label>
              </div>
            )}

            <div className="modal-actions mt-4">
              <button onClick={onApply} className="btn-primary" disabled={!!(diff && diff.missing && diff.missing.length > 0 && !confirmDeletes)}>
                Apply Import
              </button>
              <button onClick={onClose} className="btn-secondary">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportPreviewModal;
