import { builderNodesToPhases } from './node.helpers';
import type { BuilderNode } from '@/types/builder-node.types';

export function exportBuilderNodes(nodes: BuilderNode[], filename = 'dcx-builder-export.json') {
  const phases = builderNodesToPhases(nodes);
  const blob = new Blob([JSON.stringify({ phases }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
