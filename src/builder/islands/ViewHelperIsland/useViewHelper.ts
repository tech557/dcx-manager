import { useToggle } from '@/hooks/useToggle';

export function useViewHelper() {
  const [isExpanded, toggleExpanded, openExpanded, closeExpanded] = useToggle();

  return {
    isExpanded,
    setIsExpanded: (expanded: boolean) => (expanded ? openExpanded() : closeExpanded()),
    toggleExpanded,
  };
}
