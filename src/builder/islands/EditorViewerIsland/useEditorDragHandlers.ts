import { useState, type DragEvent } from 'react';

export function useEditorDragHandlers(setFocusedNodeId: (id: string | null) => void) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (event: DragEvent) => {
    const types = Array.from(event.dataTransfer.types);
    if (types.includes('application/x-dcx-task')) {
      event.preventDefault();
      setIsDragActive(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);

    const types = Array.from(event.dataTransfer.types);
    if (!types.includes('application/x-dcx-task')) return;

    let taskId = event.dataTransfer.getData('application/x-dcx-task');
    if (!taskId) {
      const raw = event.dataTransfer.getData('application/x-dcx-card');
      if (raw) {
        try {
          const payload = JSON.parse(raw) as { id?: string; kind?: string };
          if (payload.id && payload.kind === 'task') {
            taskId = payload.id;
          }
        } catch {
          taskId = '';
        }
      }
    }

    if (taskId && !taskId.startsWith('new:')) {
      setFocusedNodeId(taskId);
    }
  };

  return { isDragActive, setIsDragActive, handleDragOver, handleDragLeave, handleDrop };
}
