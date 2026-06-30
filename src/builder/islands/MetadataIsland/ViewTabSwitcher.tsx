import { Clock, Kanban } from 'lucide-react';
import { ToggleGroup, type ToggleGroupItem } from '@/ui/atoms/ToggleGroup';
import type { ViewKind } from '@/types/stage.types';

interface ViewTabSwitcherProps {
  currentView: ViewKind;
  onViewChange: (view: ViewKind) => void;
}

const VIEW_TABS: Array<ToggleGroupItem<ViewKind>> = [
  { value: 'kanban', label: 'Switch to Kanban view', icon: <Kanban className="h-3.5 w-3.5" /> },
  { value: 'timeline', label: 'Switch to Timeline view', icon: <Clock className="h-3.5 w-3.5" /> },
];

export function ViewTabSwitcher({ currentView, onViewChange }: ViewTabSwitcherProps) {
  return (
    <nav className="flex items-center" id="metadata-view-tabs" aria-label="Switch stage views">
      <ToggleGroup
        items={VIEW_TABS}
        value={currentView}
        onChange={onViewChange}
        ariaLabel="Switch stage views"
      />
    </nav>
  );
}
